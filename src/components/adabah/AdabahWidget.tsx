import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageCircle, X, Send, Plus, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RingLoader } from "@/components/ui/loader";

type Bot = "matchmaker" | "assistant";
type Thread = { id: string; title: string; updated_at: string };
type Msg = { id: string; role: "user" | "assistant" | "system"; content: string };
type Hostel = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  distance_km: number | null;
  price_min: number | null;
  price_max: number | null;
  room_types: string[] | null;
  amenities: string[] | null;
  gender_policy: string | null;
  availability: string | null;
  is_verified: boolean | null;
};

const BOT_META: Record<Bot, { title: string; tagline: string; color: string; emoji: string; greet: string }> = {
  matchmaker: {
    title: "Adabah · Matchmaker",
    tagline: "Find your perfect hostel in a few questions",
    color: "from-pink-500 to-rose-500",
    emoji: "💖",
    greet:
      "Hi! I'm **Adabah**, your hostel matchmaker. 💫\n\nTell me a bit about what you want — for example:\n*\"Budget GHS 6000, walking distance, wifi, quiet, single room, girls\"*\n\nOr answer one at a time and I'll guide you. Let's start: **what's your budget per year (GHS)?**",
  },
  assistant: {
    title: "Adabah · Assistant",
    tagline: "Ask anything about hostels",
    color: "from-sky-500 to-indigo-500",
    emoji: "🤖",
    greet:
      "Hey! I'm **Adabah**. Ask me things like:\n\n• *\"Hostels under GHS 5000\"*\n• *\"Which hostels have wifi and water?\"*\n• *\"Girls hostels close to campus\"*\n• *\"Quiet hostels for studying\"*\n\nWhat are you looking for?",
  },
};

// ───────────────────────── tiny markdown renderer ─────────────────────────
function renderMarkdown(text: string, navigate: (to: string) => void) {
  return text.split("\n").map((line, li) => {
    const parts: ReactNode[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let key = 0;
    while ((m = regex.exec(line))) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      if (m[1] && m[2]) {
        const href = m[2];
        const label = m[1];
        if (href.startsWith("/")) {
          parts.push(
            <button
              key={`l-${li}-${key++}`}
              onClick={() => navigate(href)}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              {label}
            </button>,
          );
        } else {
          parts.push(
            <a key={`a-${li}-${key++}`} href={href} target="_blank" rel="noreferrer" className="text-primary underline">
              {label}
            </a>,
          );
        }
      } else if (m[3]) {
        parts.push(<strong key={`b-${li}-${key++}`} className="font-semibold">{m[3]}</strong>);
      } else if (m[4]) {
        parts.push(<em key={`i-${li}-${key++}`}>{m[4]}</em>);
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return (
      <span key={li} className="block">
        {parts.length ? parts : "\u00A0"}
      </span>
    );
  });
}

// ───────────────────────── query understanding ─────────────────────────
type Intent = {
  budget?: number;
  budgetCmp?: "under" | "over" | "around";
  maxDistance?: number;
  wantsClose?: boolean;
  amenities: string[];
  gender?: "male" | "female" | "mixed";
  roomType?: "single" | "shared" | "double";
  vibe?: "quiet" | "social";
  verifiedOnly?: boolean;
};

const AMENITY_SYNONYMS: Record<string, string[]> = {
  wifi: ["wifi", "wi-fi", "internet", "net"],
  water: ["water", "running water", "water supply"],
  security: ["security", "safe", "guard", "cctv"],
  kitchen: ["kitchen", "cook", "cooking"],
  ac: ["ac", "air condition", "aircon", "air-con"],
  generator: ["generator", "light", "electricity", "power", "no dumsor"],
  parking: ["parking", "car park"],
  laundry: ["laundry", "washing"],
  study: ["study room", "reading room", "library"],
  gym: ["gym", "fitness"],
};

function parseIntent(text: string): Intent {
  const t = text.toLowerCase();
  const intent: Intent = { amenities: [] };

  // Budget — look for numbers near currency or "under/below/less than"
  const numMatch = t.match(/(?:ghs|ghc|gh₵|₵|cedis?)?\s*([\d,]{3,6})\s*(?:ghs|ghc|cedis?)?/);
  if (numMatch) {
    const n = parseInt(numMatch[1].replace(/,/g, ""), 10);
    if (!isNaN(n) && n >= 500 && n <= 100000) intent.budget = n;
  }
  if (/under|below|less than|max(?:imum)?|cheap|affordable|within/.test(t)) intent.budgetCmp = "under";
  else if (/over|above|more than|at least/.test(t)) intent.budgetCmp = "over";
  else if (intent.budget) intent.budgetCmp = "around";

  // Distance / closeness
  const distMatch = t.match(/(\d+(?:\.\d+)?)\s*km/);
  if (distMatch) intent.maxDistance = parseFloat(distMatch[1]);
  if (/walking distance|near campus|close to campus|near to campus|on campus|close by|nearby/.test(t)) {
    intent.wantsClose = true;
  }

  // Amenities
  for (const [key, syns] of Object.entries(AMENITY_SYNONYMS)) {
    if (syns.some((s) => t.includes(s))) intent.amenities.push(key);
  }
  if (/reliable water|good water|constant water/.test(t)) {
    if (!intent.amenities.includes("water")) intent.amenities.push("water");
  }

  // Gender
  if (/\b(girls?|female|ladies|women)\b/.test(t)) intent.gender = "female";
  else if (/\b(boys?|male|men|guys)\b/.test(t)) intent.gender = "male";
  else if (/mixed|co-?ed|both/.test(t)) intent.gender = "mixed";

  // Room type
  if (/\bsingle\b/.test(t)) intent.roomType = "single";
  else if (/\bshared\b|sharing|roommate/.test(t)) intent.roomType = "shared";
  else if (/\bdouble\b/.test(t)) intent.roomType = "double";

  // Vibe
  if (/quiet|study|studying|peaceful|calm/.test(t)) intent.vibe = "quiet";
  else if (/social|lively|fun|party|friends/.test(t)) intent.vibe = "social";

  if (/verified/.test(t)) intent.verifiedOnly = true;

  return intent;
}

// ───────────────────────── matching/scoring ─────────────────────────
function hostelHasAmenity(h: Hostel, key: string): boolean {
  const list = (h.amenities ?? []).map((a) => a.toLowerCase());
  const syns = AMENITY_SYNONYMS[key] ?? [key];
  return list.some((a) => syns.some((s) => a.includes(s)));
}

function scoreHostel(h: Hostel, intent: Intent): { score: number; reasons: string[]; hardFail: boolean } {
  const reasons: string[] = [];
  let score = 0;
  let hardFail = false;

  // Budget
  if (intent.budget) {
    const price = h.price_min ?? h.price_max ?? null;
    if (price != null) {
      if (intent.budgetCmp === "under" && price <= intent.budget) {
        score += 30;
        reasons.push(`within your GHS ${intent.budget.toLocaleString()} budget`);
      } else if (intent.budgetCmp === "under" && price > intent.budget) {
        hardFail = true;
      } else if (intent.budgetCmp === "around") {
        const diff = Math.abs(price - intent.budget);
        if (diff <= intent.budget * 0.2) {
          score += 25;
          reasons.push(`priced around your budget`);
        } else if (diff <= intent.budget * 0.5) {
          score += 10;
        }
      } else if (intent.budgetCmp === "over" && price >= intent.budget) {
        score += 15;
      }
    }
  }

  // Distance
  if (intent.maxDistance && h.distance_km != null) {
    if (h.distance_km <= intent.maxDistance) {
      score += 20;
      reasons.push(`only ${h.distance_km} km from campus`);
    } else {
      hardFail = true;
    }
  } else if (intent.wantsClose && h.distance_km != null) {
    if (h.distance_km <= 1) {
      score += 25;
      reasons.push(`walking distance (${h.distance_km} km)`);
    } else if (h.distance_km <= 2) {
      score += 12;
      reasons.push(`close to campus (${h.distance_km} km)`);
    }
  }

  // Amenities
  for (const a of intent.amenities) {
    if (hostelHasAmenity(h, a)) {
      score += 10;
      reasons.push(a);
    } else {
      score -= 5;
    }
  }

  // Gender
  if (intent.gender && h.gender_policy) {
    const gp = h.gender_policy.toLowerCase();
    const want = intent.gender;
    const match =
      (want === "female" && /female|girl|women|ladies/.test(gp)) ||
      (want === "male" && /male|boy|men/.test(gp)) ||
      (want === "mixed" && /mixed|co/.test(gp));
    if (match) {
      score += 15;
      reasons.push(`${want === "mixed" ? "mixed" : want === "female" ? "girls" : "boys"} hostel`);
    } else if (!/mixed|co/.test(gp)) {
      hardFail = true;
    }
  }

  // Room type
  if (intent.roomType && h.room_types?.length) {
    const types = h.room_types.map((r) => r.toLowerCase());
    if (types.some((r) => r.includes(intent.roomType!))) {
      score += 12;
      reasons.push(`${intent.roomType} rooms available`);
    }
  }

  // Vibe — heuristic from description
  if (intent.vibe && h.description) {
    const d = h.description.toLowerCase();
    if (intent.vibe === "quiet" && /(quiet|peaceful|study|calm|serene)/.test(d)) {
      score += 8;
      reasons.push("quiet vibe");
    }
    if (intent.vibe === "social" && /(social|lively|community|friendly|fun)/.test(d)) {
      score += 8;
      reasons.push("social vibe");
    }
  }

  if (intent.verifiedOnly && !h.is_verified) hardFail = true;
  if (h.is_verified) score += 3;

  return { score, reasons, hardFail };
}

function formatPrice(h: Hostel): string {
  if (h.price_min && h.price_max && h.price_min !== h.price_max) {
    return `GHS ${h.price_min.toLocaleString()}–${h.price_max.toLocaleString()}`;
  }
  const p = h.price_min ?? h.price_max;
  return p ? `GHS ${p.toLocaleString()}` : "Price on request";
}

function summarizeIntent(intent: Intent): string[] {
  const out: string[] = [];
  if (intent.budget) out.push(`budget ${intent.budgetCmp === "under" ? "under " : ""}GHS ${intent.budget.toLocaleString()}`);
  if (intent.maxDistance) out.push(`within ${intent.maxDistance} km`);
  else if (intent.wantsClose) out.push("close to campus");
  if (intent.gender) out.push(intent.gender === "female" ? "girls" : intent.gender === "male" ? "boys" : "mixed");
  if (intent.roomType) out.push(`${intent.roomType} room`);
  if (intent.amenities.length) out.push(intent.amenities.join(", "));
  if (intent.vibe) out.push(intent.vibe);
  return out;
}

function buildReply(bot: Bot, userText: string, hostels: Hostel[], history: Msg[]): string {
  const intent = parseIntent(userText);

  // Merge intent with previous user messages so matchmaker remembers context
  if (bot === "matchmaker") {
    const prior = history.filter((m) => m.role === "user").map((m) => parseIntent(m.content));
    for (const p of prior) {
      if (intent.budget == null && p.budget) { intent.budget = p.budget; intent.budgetCmp = p.budgetCmp; }
      if (intent.maxDistance == null && p.maxDistance) intent.maxDistance = p.maxDistance;
      if (!intent.wantsClose && p.wantsClose) intent.wantsClose = true;
      if (!intent.gender && p.gender) intent.gender = p.gender;
      if (!intent.roomType && p.roomType) intent.roomType = p.roomType;
      if (!intent.vibe && p.vibe) intent.vibe = p.vibe;
      for (const a of p.amenities) if (!intent.amenities.includes(a)) intent.amenities.push(a);
    }
  }

  const hasAnySignal =
    intent.budget != null ||
    intent.maxDistance != null ||
    intent.wantsClose ||
    intent.gender ||
    intent.roomType ||
    intent.vibe ||
    intent.amenities.length > 0;

  // Matchmaker: ask the next missing question if we don't have enough
  if (bot === "matchmaker") {
    const missing: string[] = [];
    if (intent.budget == null) missing.push("**What's your budget per year (GHS)?**");
    if (!intent.wantsClose && intent.maxDistance == null) missing.push("**How close to campus do you want to be?** (walking distance / within 2 km / doesn't matter)");
    if (!intent.gender) missing.push("**Boys, girls, or mixed?**");
    if (!intent.roomType) missing.push("**Single room or shared?**");
    if (!intent.vibe) missing.push("**Quiet for studying, or social vibe?**");

    if (missing.length >= 3 && hasAnySignal) {
      return `Got it 👌\n\nJust a couple more quick ones:\n\n${missing.slice(0, 2).join("\n\n")}`;
    }
    if (missing.length >= 4 && !hasAnySignal) {
      return missing[0];
    }
  }

  // Score & rank
  const scored = hostels
    .map((h) => ({ h, ...scoreHostel(h, intent) }))
    .filter((x) => !x.hardFail)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).filter((x) => x.score > 0);

  if (top.length === 0) {
    const fallback = hostels
      .map((h) => ({ h, ...scoreHostel(h, { ...intent, verifiedOnly: false }) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const wanted = summarizeIntent(intent);
    const wantedLine = wanted.length ? ` matching *${wanted.join(", ")}*` : "";
    if (fallback.length === 0) {
      return `I couldn't find any hostels${wantedLine} right now. Try loosening one of your filters (budget, distance, or gender).`;
    }
    return `I couldn't find an exact match${wantedLine}, but here are the closest options:\n\n${fallback
      .map(({ h, reasons }) => bulletFor(h, reasons))
      .join("\n\n")}`;
  }

  const intro =
    bot === "matchmaker"
      ? `Based on what you told me, here are your **top ${top.length} matches** 💫`
      : `Here ${top.length === 1 ? "is" : "are"} **${top.length}** that fit:`;

  return `${intro}\n\n${top.map(({ h, reasons }) => bulletFor(h, reasons)).join("\n\n")}\n\nTap any name to see the full details.`;
}

function bulletFor(h: Hostel, reasons: string[]): string {
  const dist = h.distance_km != null ? ` · ${h.distance_km} km from campus` : "";
  const reasonLine = reasons.length ? `\n   _Why it fits:_ ${reasons.slice(0, 4).join(", ")}` : "";
  return `🏠 [${h.name}](/hostels/${h.id}) — ${formatPrice(h)}${dist}${reasonLine}\n   → [View details](/hostels/${h.id})`;
}

// ───────────────────────── component ─────────────────────────
function ChatPanel({ bot, onClose }: { bot: Bot; onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const meta = BOT_META[bot];

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<"list" | "chat">("chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadThreads = useCallback(async () => {
    if (!supabase || !user) return;
    const { data } = await supabase
      .from("adabah_threads")
      .select("id,title,updated_at")
      .eq("bot", bot)
      .order("updated_at", { ascending: false });
    setThreads((data as Thread[]) ?? []);
  }, [bot, user]);

  const loadMessages = useCallback(async (tid: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("adabah_messages")
      .select("id,role,content")
      .eq("thread_id", tid)
      .order("created_at", { ascending: true });
    setMessages((data as Msg[]) ?? []);
  }, []);

  const loadHostels = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("hostels")
      .select("id,name,description,location,distance_km,price_min,price_max,room_types,amenities,gender_policy,availability,is_verified")
      .eq("is_published", true)
      .limit(200);
    setHostels((data as Hostel[]) ?? []);
  }, []);

  useEffect(() => { loadThreads(); loadHostels(); }, [loadThreads, loadHostels]);
  useEffect(() => { if (activeId) loadMessages(activeId); else setMessages([]); }, [activeId, loadMessages]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);
  useEffect(() => { if (view === "chat") inputRef.current?.focus(); }, [view, activeId]);

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const deleteThread = async (id: string) => {
    if (!supabase) return;
    await supabase.from("adabah_threads").delete().eq("id", id);
    if (activeId === id) { setActiveId(null); setMessages([]); }
    loadThreads();
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !user || !supabase) return;
    setSending(true);
    setInput("");

    const optimistic: Msg = { id: `tmp-${Date.now()}`, role: "user", content: text };
    setMessages((m) => [...m, optimistic]);

    try {
      // Ensure thread
      let tid = activeId;
      if (!tid) {
        const { data: t, error: tErr } = await supabase
          .from("adabah_threads")
          .insert({ user_id: user.id, bot, title: text.slice(0, 60) })
          .select("id")
          .single();
        if (tErr) throw tErr;
        tid = (t as { id: string }).id;
        setActiveId(tid);
      }

      // Persist user message
      await supabase.from("adabah_messages").insert({
        thread_id: tid, user_id: user.id, role: "user", content: text,
      });

      // Generate reply (smart local engine)
      const history = messages;
      // small thinking delay so it feels natural
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
      const reply = buildReply(bot, text, hostels, history);

      await supabase.from("adabah_messages").insert({
        thread_id: tid, user_id: user.id, role: "assistant", content: reply,
      });

      await supabase
        .from("adabah_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", tid);

      await loadMessages(tid);
      loadThreads();
    } catch (e) {
      toast.error((e as Error).message || "Couldn't send message");
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-x-3 bottom-3 z-[90] sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] overflow-hidden rounded-3xl border bg-background shadow-2xl">
        <div className={cn("flex items-center justify-between p-4 text-white bg-gradient-to-r", meta.color)}>
          <div>
            <div className="text-sm font-bold">{meta.title}</div>
            <div className="text-xs opacity-90">{meta.tagline}</div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 text-center space-y-3">
          <div className="text-4xl">{meta.emoji}</div>
          <p className="text-sm text-muted-foreground">Sign in to chat with Adabah and save your conversations.</p>
          <Button onClick={() => { navigate("/auth"); onClose(); }} className="w-full">Sign in</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] flex max-h-[85vh] flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[400px]">
      <div className={cn("flex items-center justify-between p-4 text-white bg-gradient-to-r", meta.color)}>
        <div className="flex items-center gap-2 min-w-0">
          {view === "list" && (
            <button onClick={() => setView("chat")} className="rounded-full p-1 hover:bg-white/20">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="min-w-0">
            <div className="text-sm font-bold truncate">{meta.title}</div>
            <div className="text-xs opacity-90 truncate">{meta.tagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView(view === "list" ? "chat" : "list")}
            className="rounded-full px-2 py-1 text-xs hover:bg-white/20"
            title="Chats"
          >
            Chats ({threads.length})
          </button>
          <button onClick={newChat} className="rounded-full p-1 hover:bg-white/20" title="New chat">
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20"><X className="h-4 w-4" /></button>
        </div>
      </div>

      {view === "list" ? (
        <div className="flex-1 overflow-y-auto p-2">
          {threads.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No chats yet — start a new one!</div>
          ) : (
            threads.map((t) => (
              <div key={t.id} className={cn("group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted", activeId === t.id && "bg-muted")}>
                <button onClick={() => { setActiveId(t.id); setView("chat"); }} className="flex-1 truncate text-left text-sm">
                  {t.title}
                </button>
                <button
                  onClick={() => deleteThread(t.id)}
                  className="rounded p-1 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="rounded-2xl bg-muted/60 p-3 text-sm leading-relaxed">
                {renderMarkdown(meta.greet, navigate)}
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "user" ? (
                  <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm text-white bg-gradient-to-r", meta.color)}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                ) : (
                  <div className="max-w-[90%] text-sm leading-relaxed text-foreground">
                    {renderMarkdown(m.content, navigate)}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RingLoader className="h-4 w-4" /> Adabah is thinking…
              </div>
            )}
          </div>
          <div className="border-t p-2">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={bot === "matchmaker" ? "Tell me your budget, vibe…" : "Ask about hostels…"}
                rows={1}
                className="min-h-[40px] max-h-32 resize-none rounded-2xl"
              />
              <Button
                size="icon"
                onClick={send}
                disabled={sending || !input.trim()}
                className={cn("rounded-full bg-gradient-to-r text-white", meta.color)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function AdabahWidget() {
  const [open, setOpen] = useState<Bot | null>(null);

  return (
    <>
      {open && <ChatPanel bot={open} onClose={() => setOpen(null)} />}
      <div className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3 print:hidden">
        <button
          onClick={() => setOpen(open === "matchmaker" ? null : "matchmaker")}
          className={cn(
            "group flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-white shadow-lg ring-2 ring-pink-300/50 transition hover:scale-105",
            open === "matchmaker" && "scale-105",
          )}
          aria-label="Open Adabah Matchmaker"
        >
          <Sparkles className="h-5 w-5" />
          <span className="hidden text-sm font-semibold sm:inline">Matchmaker</span>
        </button>
        <button
          onClick={() => setOpen(open === "assistant" ? null : "assistant")}
          className={cn(
            "group flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-white shadow-lg ring-2 ring-sky-300/50 transition hover:scale-105",
            open === "assistant" && "scale-105",
          )}
          aria-label="Open Adabah Assistant"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden text-sm font-semibold sm:inline">Ask Adabah</span>
        </button>
      </div>
    </>
  );
}
