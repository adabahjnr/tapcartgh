import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — TapCart" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted-foreground">Account preferences.</p>
      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium">Account</h2>
          <div className="mt-5 space-y-4">
            <Row label="Email"><input className="input" defaultValue="hello@bloom.co" /></Row>
            <Row label="Password"><input className="input" type="password" defaultValue="••••••••" /></Row>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium">Notifications</h2>
          <div className="mt-5 space-y-3 text-sm">
            <Toggle label="Email me when a new order arrives" defaultChecked />
            <Toggle label="Weekly summary" defaultChecked />
          </div>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-card p-6">
          <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
          <p className="mt-2 text-sm text-muted-foreground">Permanently delete your account and store.</p>
          <button className="mt-4 rounded-full border border-destructive/30 px-4 py-2 text-sm text-destructive">Delete account</button>
        </div>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .9rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--foreground)}`}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 md:grid-cols-[180px_1fr] md:gap-6 md:items-center">
      <div className="text-sm">{label}</div>
      <div>{children}</div>
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
