import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Publishable values — safe to ship in client code.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://wmrhrkygmvjuyswfrfcr.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtcmhya3lnbXZqdXlzd2ZyZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDY0MjQsImV4cCI6MjA5NjE4MjQyNH0.NjsrEAIvQo1TXqK38neBTVOB-8F0sJFg5g7sQ43wInY";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
