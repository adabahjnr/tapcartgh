import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TapCart — Your mini store. One link. Orders on WhatsApp." },
      { name: "description", content: "TapCart helps small businesses and creators turn one link into a beautiful mini store. Customers tap, add to cart, and send the order on WhatsApp." },
      { property: "og:title", content: "TapCart — Orders on WhatsApp" },
      { property: "og:description", content: "Your mini store. One link. Orders on WhatsApp." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:pb-28 md:pt-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--whatsapp)]" />
          Free for everyone, forever
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          Your mini store. One link. <br className="hidden md:block" />
          Orders on WhatsApp.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground">
          TapCart gives small businesses and creators a beautiful storefront in minutes.
          Customers browse, add to cart, and tap one button to send the order straight to your WhatsApp.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Create your store <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/examples" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-secondary">
            See live examples
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">No credit card. No fees. No paid tiers.</p>
      </section>

      {/* Preview card */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="ml-3 text-xs text-muted-foreground">tap-cart.shop/s/bloom</span>
          </div>
          <div className="grid gap-0 md:grid-cols-3">
            {[
              { name: "Garden Rose Bouquet", price: "$48", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=600&fit=crop" },
              { name: "Wildflower Mix", price: "$36", img: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=600&fit=crop" },
              { name: "White Peony Bundle", price: "$62", img: "https://images.unsplash.com/photo-1469259943454-aa100abba749?w=600&h=600&fit=crop" },
            ].map((p) => (
              <div key={p.name} className="border-border p-6 md:border-l first:md:border-l-0">
                <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { t: "Set up in minutes", d: "Add your products, logo, and WhatsApp number. Share your link. Done." },
            { t: "Designed to feel premium", d: "Calm typography, generous spacing, and a storefront customers trust." },
            { t: "Orders where you already are", d: "Every order arrives as a clean, pre-filled WhatsApp message." },
          ].map((b) => (
            <div key={b.t}>
              <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-base font-medium">{b.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-32 pt-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Start selling today.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">It's free. It always will be.</p>
        <Link to="/auth" search={{ mode: "signup" }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          Create your store <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </MarketingLayout>
  );
}
