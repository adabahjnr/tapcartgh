import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-2 text-muted-foreground">Platform metrics across all TapCart stores.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total users", "1,284", "+24 this week"],
          ["Total stores", "1,162", "+19 this week"],
          ["Total orders", "8,491", "+312 this week"],
          ["Page views", "184k", "+8.2% MoM"],
        ].map(([l, v, d]) => (
          <div key={l} className="rounded-xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-3 text-2xl font-semibold">{v}</div>
            <div className="mt-1 text-xs text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-sm font-medium">Recent signups</div>
          <ul className="mt-4 divide-y divide-border text-sm">
            {["Field Notes", "Sand Studio", "Kiosk Coffee", "Linen Home"].map((n) => (
              <li key={n} className="flex justify-between py-3">
                <span>{n}</span>
                <span className="text-xs text-muted-foreground">today</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-sm font-medium">Top stores by orders</div>
          <ul className="mt-4 divide-y divide-border text-sm">
            {[["Bloom & Co.", 482], ["Kiosk Coffee", 391], ["Linen Home", 244]].map(([n, c]) => (
              <li key={n as string} className="flex justify-between py-3">
                <span>{n}</span>
                <span className="text-xs text-muted-foreground">{c} orders</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
