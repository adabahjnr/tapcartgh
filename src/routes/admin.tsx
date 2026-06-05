import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Store, BarChart3, Bell, Settings, Shield } from "lucide-react";

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/stores", label: "Stores", icon: Store },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — TapCart" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="px-6 py-6">
          <Link to="/" className="text-base font-semibold tracking-tight">TapCart</Link>
          <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" /> Admin
          </div>
        </div>
        <nav className="flex-1 px-3">
          {adminNav.map((i) => {
            const active = i.exact ? pathname === i.to : pathname === i.to || pathname.startsWith(i.to + "/");
            const Icon = i.icon;
            return (
              <Link
                key={i.to}
                to={i.to}
                className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {i.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border px-6 py-4 md:px-10">
          <div className="text-xs text-muted-foreground">Admin</div>
        </header>
        <main className="flex-1 px-6 py-10 md:px-10 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
