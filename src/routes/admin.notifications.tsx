import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

function AdminNotifications() {
  const [target, setTarget] = useState<"all" | "specific">("all");
  const [channel, setChannel] = useState<"in-app" | "email">("in-app");
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
      <p className="mt-2 text-muted-foreground">Broadcast or message individual users.</p>
      <form className="mt-10 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid gap-5">
            <div>
              <div className="text-sm font-medium">Send to</div>
              <div className="mt-3 flex gap-2 text-xs">
                {(["all", "specific"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setTarget(t)} className={`rounded-full border px-3 py-1.5 capitalize ${target === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}>
                    {t === "all" ? "All users" : "Specific user"}
                  </button>
                ))}
              </div>
            </div>
            {target === "specific" && <input className="input" placeholder="Username or email" />}
            <div>
              <div className="text-sm font-medium">Channel</div>
              <div className="mt-3 flex gap-2 text-xs">
                {(["in-app", "email"] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setChannel(c)} className={`rounded-full border px-3 py-1.5 capitalize ${channel === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}>{c}</button>
                ))}
              </div>
            </div>
            <input className="input" placeholder="Subject" />
            <textarea rows={5} className="input resize-none" placeholder="Your message..." />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Send notification</button>
        </div>
      </form>
      <div className="mt-12">
        <div className="text-sm font-medium">Recent broadcasts</div>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card text-sm">
          {[
            ["New product gallery layout", "All users · in-app", "2 days ago"],
            ["Maintenance window Sunday", "All users · email", "1 week ago"],
          ].map(([t, m, d]) => (
            <li key={t} className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">{m}</div>
              </div>
              <div className="text-xs text-muted-foreground">{d}</div>
            </li>
          ))}
        </ul>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .9rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--foreground)}`}</style>
    </div>
  );
}
