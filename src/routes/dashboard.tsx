import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, dashboardNav } from "@/components/app/AppShell";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppShell items={dashboardNav} brand="Bloom & Co." storeLink="bloom">
      <Outlet />
    </AppShell>
  ),
});
