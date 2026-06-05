import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — TapCart" },
      { name: "description", content: "Everything you need to run a mini store on WhatsApp: storefront, products, cart, orders, and analytics. All free." },
      { property: "og:title", content: "Features — TapCart" },
      { property: "og:description", content: "Storefront, products, cart, WhatsApp orders, analytics. All free." },
      { property: "og:url", content: "/features" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

const groups = [
  {
    title: "Storefront",
    items: [
      "A unique link at tap-cart.shop/s/yourname",
      "Custom logo, banner, and store description",
      "Mobile-first, beautifully responsive",
    ],
  },
  {
    title: "Products & cart",
    items: [
      "Add products with images, prices, and descriptions",
      "Track stock levels",
      "Built-in cart with a floating cart icon",
    ],
  },
  {
    title: "Orders on WhatsApp",
    items: [
      "One-tap checkout sends a pre-filled WhatsApp message",
      "Itemized list with quantities and total",
      "Orders go directly to your phone",
    ],
  },
  {
    title: "Insights",
    items: [
      "Store views and click tracking",
      "Order history and totals",
      "Simple, calm analytics",
    ],
  },
];

function FeaturesPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Features"
        title="Everything you need. Nothing you don't."
        sub="TapCart focuses on the essentials of running a mini store — and gets out of your way."
      />
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-x-16 gap-y-16 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-lg font-medium">{g.title}</h3>
              <ul className="mt-5 space-y-3">
                {g.items.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}
