import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const BOT_META: Record<Bot, { title: string; tagline: string; color: string; ring: string; emoji: string; greet: string }> = {
  matchmaker: {
    title: "Adabah · Matchmaker",
    tagline: "Find your perfect hostel in 5 questions",
    color: "from-pink-500 to-rose-500",
    ring: "ring-pink-300",
    emoji: "💖",
    greet:
      "Hi! I'm **Adabah**, your hostel matchmaker. Tell me your budget, how far you want to walk to campus, and whether you prefer quiet or social vibes — I'll find your 3 best matches. 💫",
  },
  assistant: {
    title: "Adabah · Assistant",
    tagline: "Ask anything about hostels",
    color: "from-sky-500 to-indigo-500",
    ring: "ring-sky-300",
    emoji: "🤖",
    greet:
      "Hey! I'm **Adabah**. Ask me anything like *'hostels under GHS 5000 near campus'* or *'which hostels have reliable water?'* I'll search the database for you.",
  },
};

// Tiny markdown: **bold**, *italic*, [text](url) -> internal Link if starts with /, line breaks
function renderMarkdown(text: string, navigate: (to: string) => void) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
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
        parts.push(
          <strong key={`b-${li}-${key++}`} className="font-semibold">
            {m[3]}
          </strong>,
        );
      } else if (m[4]) {
        parts.push(
          <em key={`i-${li}-${key++}`}>{m[4]}</em>,
        );
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

function ChatPanel({ bot, onClose }: { bot: Bot; onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const meta = BOT_META[bot];

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
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

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
    else setMessages([]);
  }, [activeId, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus();
  }, [view, activeId]);

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const deleteThread = async (id: string) => {
    if (!supabase) return;
    await supabase.from("adabah_threads").delete().eq("id", id);
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const url = `${(import.meta.env.VITE_SUPABASE_URL ?? "https://wmrhrkygmvjuyswfrfcr.supabase.co")}/functions/v1/adabah-chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bot, thread_id: activeId, message: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Adabah couldn't reply");
        setMessages((m) => m.filter((x) => x.id !== optimistic.id));
        return;
      }
      if (!activeId) setActiveId(data.thread_id);
      await loadMessages(data.thread_id);
      loadThreads();
    } catch (e) {
      toast.error((e as Error).message);
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
              <div
                key={t.id}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted",
                  activeId === t.id && "bg-muted",
                )}
              >
                <button
                  onClick={() => { setActiveId(t.id); setView("chat"); }}
                  className="flex-1 truncate text-left text-sm"
                >
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
