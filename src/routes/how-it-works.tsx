import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — TapCart" },
      { name: "description", content: "Create your TapCart store in four simple steps and start receiving orders on WhatsApp today." },
      { property: "og:title", content: "How TapCart works" },
      { property: "og:description", content: "Four simple steps from signup to your first WhatsApp order." },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorksPage,
});

const steps = [
  { n: "01", t: "Create your account", d: "Sign up free and claim your username. Your store lives at tap-cart.shop/s/yourname." },
  { n: "02", t: "Add your products", d: "Upload photos, set prices, and write short descriptions. Edit anytime." },
  { n: "03", t: "Share your link", d: "Put your TapCart link in your Instagram bio, TikTok, or wherever your customers find you." },
  { n: "04", t: "Get orders on WhatsApp", d: "Customers tap one button — the order arrives in your WhatsApp, ready to fulfill." },
];

function HowItWorksPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="How it works"
        title="From signup to your first order in minutes."
      />
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <ol className="space-y-12">
          {steps.map((s) => (
            <li key={s.n} className="grid grid-cols-[auto_1fr] gap-8">
              <div className="text-sm font-medium text-muted-foreground">{s.n}</div>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-20 text-center">
          <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Create your free store
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
