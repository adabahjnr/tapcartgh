// Adabah AI chat edge function.
// Deploy: `supabase functions deploy adabah-chat --no-verify-jwt`
// Required secret on your Supabase project: LOVABLE_API_KEY
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

type Bot = "matchmaker" | "assistant";

const MATCHMAKER_SYSTEM = `You are Adabah, a warm, witty hostel matchmaker for students in Ghana (HostelHub).
Your job: ask the user (one or two friendly questions at a time) about:
 - Budget (GHS per year/semester)
 - Walking distance to campus
 - WiFi need
 - Quiet vs social vibe
 - Single vs shared room
 - Gender preference (boys/girls/mixed)
Once you have enough info, recommend the 3 best matches from the HOSTELS list ONLY.
For each recommendation give: hostel name, why it matches, price, distance, and 2-3 standout amenities.
Always link suggestions like: [Name](/hostels/{id}).
Be concise, use markdown, and keep it youthful and helpful. Never invent hostels not in the list.`;

const ASSISTANT_SYSTEM = `You are Adabah, a helpful AI accommodation assistant for HostelHub (Ghana student hostels).
Answer any questions about hostels using ONLY the HOSTELS list below.
You can filter by price, distance, amenities (wifi, water, security, kitchen, etc), gender, room type, availability.
When listing hostels, link them as [Name](/hostels/{id}) and include price range, distance, and a one-line reason.
If nothing matches, say so honestly and suggest the closest alternative. Use markdown. Be concise and friendly.`;

function hostelsContext(hostels: Record<string, unknown>[]) {
  const compact = hostels.map((h) => ({
    id: h.id,
    name: h.name,
    location: h.location,
    distance_km: h.distance_km,
    price_min: h.price_min,
    price_max: h.price_max,
    gender: h.gender_policy,
    room_types: h.room_types,
    amenities: h.amenities,
    availability: h.availability,
    verified: h.is_verified,
    desc: typeof h.description === "string" ? (h.description as string).slice(0, 240) : null,
  }));
  return `HOSTELS (JSON):\n${JSON.stringify(compact)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "Not signed in" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData.user) return json({ error: "Invalid session" }, 401);
    const user = userData.user;

    const body = await req.json();
    const bot: Bot = body.bot === "matchmaker" ? "matchmaker" : "assistant";
    const userMessage: string = String(body.message ?? "").trim();
    let threadId: string | null = body.thread_id ?? null;
    if (!userMessage) return json({ error: "Empty message" }, 400);

    // ensure thread
    if (!threadId) {
      const { data: t, error: tErr } = await admin
        .from("adabah_threads")
        .insert({ user_id: user.id, bot, title: userMessage.slice(0, 60) })
        .select("id")
        .single();
      if (tErr) return json({ error: tErr.message }, 500);
      threadId = t!.id as string;
    } else {
      const { data: t } = await admin
        .from("adabah_threads")
        .select("id,user_id,bot")
        .eq("id", threadId)
        .maybeSingle();
      if (!t || t.user_id !== user.id) return json({ error: "Thread not found" }, 404);
    }

    // save user message
    await admin.from("adabah_messages").insert({
      thread_id: threadId,
      user_id: user.id,
      role: "user",
      content: userMessage,
    });

    // load history
    const { data: history } = await admin
      .from("adabah_messages")
      .select("role,content")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(40);

    // load hostels
    const { data: hostels } = await admin
      .from("hostels")
      .select(
        "id,name,description,location,distance_km,price_min,price_max,room_types,amenities,gender_policy,availability,is_verified",
      )
      .eq("is_published", true)
      .limit(80);

    const system = (bot === "matchmaker" ? MATCHMAKER_SYSTEM : ASSISTANT_SYSTEM) +
      "\n\n" + hostelsContext(hostels ?? []);

    const messages = [
      { role: "system", content: system },
      ...((history ?? []) as { role: string; content: string }[]).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      if (aiRes.status === 429) return json({ error: "Adabah is busy — try again in a moment." }, 429);
      if (aiRes.status === 402) return json({ error: "AI credits exhausted. Please add credits in Lovable workspace." }, 402);
      return json({ error: "AI error: " + text.slice(0, 200) }, 500);
    }

    const data = await aiRes.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? "";

    await admin.from("adabah_messages").insert({
      thread_id: threadId,
      user_id: user.id,
      role: "assistant",
      content: reply,
    });
    await admin
      .from("adabah_threads")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", threadId);

    return json({ thread_id: threadId, reply });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
