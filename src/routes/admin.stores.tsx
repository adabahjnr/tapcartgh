import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import { sampleStores } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/stores")({
  component: AdminStores,
});

function AdminStores() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold tracking-tight">Stores</h1>
      <p className="mt-2 text-muted-foreground">All stores on the platform.</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Store</th>
              <th className="px-6 py-3 text-left font-medium">Link</th>
              <th className="px-6 py-3 text-left font-medium">Views</th>
              <th className="px-6 py-3 text-left font-medium">Last active</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {sampleStores.map((s, i) => (
              <tr key={s.username} className="border-b border-border last:border-b-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-md bg-secondary">
                      <img src={s.logo} alt={s.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="font-medium">{s.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link to="/s/$username" params={{ username: s.username }} className="text-muted-foreground hover:text-foreground">
                    tap-cart.shop/s/{s.username}
                  </Link>
                </td>
                <td className="px-6 py-4">{(2000 + i * 412).toLocaleString()}</td>
                <td className="px-6 py-4 text-muted-foreground">{i === 0 ? "Just now" : i === 1 ? "2 hours ago" : "Yesterday"}</td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
