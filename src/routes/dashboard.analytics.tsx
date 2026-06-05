import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TapCart" }] }),
  component: AnalyticsPage,
});

const bars = [12, 18, 14, 22, 28, 24, 35, 31, 40, 38, 46, 52];

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-2 text-muted-foreground">Last 12 weeks.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Store views", "2,418"],
          ["Add to cart", "184"],
          ["WhatsApp orders", "37"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-3 text-2xl font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <div className="text-sm font-medium">Store views</div>
        <div className="mt-8 flex h-48 items-end gap-3">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-foreground/85" style={{ height: `${b * 2}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
