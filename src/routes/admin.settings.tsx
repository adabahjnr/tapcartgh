import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Admin settings</h1>
      <p className="mt-2 text-muted-foreground">Platform-wide preferences.</p>
      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium">Moderation</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Toggle label="Auto-flag stores with reported keywords" defaultChecked />
            <Toggle label="Require review for new stores" />
            <Toggle label="Pause new signups" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium">Staff</h2>
          <p className="mt-2 text-sm text-muted-foreground">Anyone with the super admin role can access this panel.</p>
          <ul className="mt-4 divide-y divide-border text-sm">
            {[["You", "Super admin"], ["taylor@tapcart.shop", "Super admin"]].map(([n, r]) => (
              <li key={n} className="flex justify-between py-3">
                <span>{n}</span>
                <span className="text-xs text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-foreground" />
    </label>
  );
}
