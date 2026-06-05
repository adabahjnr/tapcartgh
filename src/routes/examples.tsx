import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { sampleStores } from "@/lib/mock-data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "Examples — TapCart" },
      { name: "description", content: "Real stores built with TapCart. See how florists, roasters, and makers sell on WhatsApp." },
      { property: "og:title", content: "TapCart store examples" },
      { property: "og:description", content: "Real stores from real makers." },
      { property: "og:url", content: "/examples" },
    ],
    links: [{ rel: "canonical", href: "/examples" }],
  }),
  component: ExamplesPage,
});

function ExamplesPage() {
  return (
    <MarketingLayout>
      <PageHero eyebrow="Examples" title="Real stores. Real orders." sub="A few TapCart stores you can browse and buy from." />
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-6 md:grid-cols-3">
          {sampleStores.map((s) => (
            <Link
              key={s.username}
              to="/s/$username"
              params={{ username: s.username }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={s.banner} alt={s.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-base font-medium">{s.name}</div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-4 text-xs text-muted-foreground">tap-cart.shop/s/{s.username}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
