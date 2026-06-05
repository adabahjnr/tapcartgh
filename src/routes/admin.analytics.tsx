import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

const bars = [22, 28, 35, 31, 40, 38, 46, 52, 49, 58, 62, 71];

function AdminAnalytics() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">Platform analytics</h1>
      <p className="mt-2 text-muted-foreground">Traffic, growth, and top performers.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[["Site traffic", "184k / mo"], ["New users (30d)", "412"], ["Order volume (30d)", "2,184"]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-3 text-2xl font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <div className="text-sm font-medium">User growth</div>
        <div className="mt-8 flex h-48 items-end gap-3">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-foreground/85" style={{ height: `${b}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="text-sm font-medium">Top performing stores</div>
        <ul className="mt-4 divide-y divide-border text-sm">
          {[["Bloom & Co.", "482 orders"], ["Kiosk Coffee", "391 orders"], ["Linen Home", "244 orders"], ["Field Notes", "180 orders"]].map(([n, v]) => (
            <li key={n} className="flex justify-between py-3">
              <span>{n}</span>
              <span className="text-muted-foreground">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
