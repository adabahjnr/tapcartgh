import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — TapCart" }] }),
  component: DashboardHome,
});

const stats = [
  { label: "Store views", value: "2,418", delta: "+12.4%" },
  { label: "Orders this month", value: "37", delta: "+8.1%" },
  { label: "Revenue", value: "$1,842", delta: "+18.2%" },
  { label: "Conversion", value: "1.5%", delta: "+0.3%" },
];

function DashboardHome() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Here's what's happening with your store.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.delta} vs. last month</div>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card title="Latest orders">
          <ul className="divide-y divide-border">
            {[
              ["Sara M.", "3 items", "$132"],
              ["Liam K.", "1 item", "$48"],
              ["Noor A.", "5 items", "$210"],
            ].map(([n, i, t], k) => (
              <li key={k} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium">{n}</div>
                  <div className="text-xs text-muted-foreground">{i}</div>
                </div>
                <div className="text-muted-foreground">{t}</div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Your store link" action={<ArrowUpRight className="h-4 w-4" />}>
          <div className="rounded-lg bg-secondary px-4 py-3 text-sm">tap-cart.shop/s/bloom</div>
          <p className="mt-4 text-sm text-muted-foreground">Share this link anywhere your customers find you.</p>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}
