import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/store")({
  head: () => ({ meta: [{ title: "My Store — TapCart" }] }),
  component: StoreSettings,
});

function StoreSettings() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">My Store</h1>
      <p className="mt-2 text-muted-foreground">How your storefront looks and feels.</p>
      <form className="mt-10 space-y-8">
        <Section title="Branding">
          <Row label="Store name"><input className="input" defaultValue="Bloom & Co." /></Row>
          <Row label="Username" hint="tap-cart.shop/s/bloom"><input className="input" defaultValue="bloom" /></Row>
          <Row label="Description"><textarea rows={3} className="input resize-none" defaultValue="Hand-tied bouquets and seasonal arrangements." /></Row>
        </Section>
        <Section title="Images">
          <Row label="Logo">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-secondary" />
              <button type="button" className="rounded-full border border-border px-4 py-2 text-xs">Upload</button>
            </div>
          </Row>
          <Row label="Banner">
            <div className="flex items-center gap-4">
              <div className="h-16 w-32 rounded-lg bg-secondary" />
              <button type="button" className="rounded-full border border-border px-4 py-2 text-xs">Upload</button>
            </div>
          </Row>
        </Section>
        <Section title="WhatsApp">
          <Row label="WhatsApp number" hint="Include country code, no symbols"><input className="input" defaultValue="15551234567" /></Row>
        </Section>
        <div className="flex justify-end">
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Save changes</button>
        </div>
      </form>
      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .9rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--foreground)}`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 md:grid-cols-[180px_1fr] md:gap-6">
      <div>
        <div className="text-sm">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
