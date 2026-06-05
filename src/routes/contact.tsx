import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TapCart" },
      { name: "description", content: "Get in touch with the TapCart team." },
      { property: "og:title", content: "Contact TapCart" },
      { property: "og:description", content: "Reach the TapCart team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <MarketingLayout>
      <PageHero eyebrow="Contact" title="We'd love to hear from you." sub="Questions, feedback, or a partnership idea — send a note." />
      <section className="mx-auto max-w-xl px-6 pb-32">
        {sent ? (
          <div className="rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <div className="text-base font-medium">Thanks — message received.</div>
            <p className="mt-2 text-sm text-muted-foreground">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <Field label="Your name"><input required className="input" placeholder="Sara M." /></Field>
            <Field label="Email"><input required type="email" className="input" placeholder="you@example.com" /></Field>
            <Field label="Message">
              <textarea required rows={6} className="input resize-none" placeholder="How can we help?" />
            </Field>
            <button className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
              Send message
            </button>
          </form>
        )}
      </section>
      <style>{`
        .input { width: 100%; border: 1px solid var(--border); background: var(--background); border-radius: 0.625rem; padding: 0.75rem 1rem; font-size: 0.875rem; outline: none; transition: border-color .15s; }
        .input:focus { border-color: var(--foreground); }
      `}</style>
    </MarketingLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
