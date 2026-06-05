import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Store, Package, ShoppingBag, BarChart3, Settings, ExternalLink, LogOut } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }> };

export function AppShell({
  items,
  brand,
  storeLink,
  children,
}: {
  items: NavItem[];
  brand: string;
  storeLink?: string;
  children?: React.ReactNode;
}) {
  const pathname = useLocation().pathname;
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="px-6 py-6">
          <Link to="/" className="text-base font-semibold tracking-tight">TapCart</Link>
          <div className="mt-1 text-xs text-muted-foreground">{brand}</div>
        </div>
        <nav className="flex-1 px-3">
          {items.map((i) => {
            const active = pathname === i.to || (i.to !== "/dashboard" && i.to !== "/admin" && pathname.startsWith(i.to));
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
        {storeLink && (
          <div className="border-t border-sidebar-border p-3">
            <Link to={`/s/${storeLink}`} className="flex items-center justify-between rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
              <span>View public store</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border px-6 py-4 md:px-10">
          <div className="text-xs text-muted-foreground">{brand}</div>
        </header>
        <main className="flex-1 px-6 py-10 md:px-10 md:py-14">{children}</main>
      </div>
    </div>
  );
}

export const dashboardNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/store", label: "My Store", icon: Store },
  { to: "/dashboard/products", label: "Products", icon: Package },
  { to: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];
