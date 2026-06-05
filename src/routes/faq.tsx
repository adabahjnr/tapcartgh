import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — TapCart" },
      { name: "description", content: "Answers to common questions about TapCart — pricing, WhatsApp orders, and how stores work." },
      { property: "og:title", content: "TapCart FAQ" },
      { property: "og:description", content: "Common questions about TapCart." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQPage,
});

const faqs = [
  { q: "Is TapCart really free?", a: "Yes. The entire platform is free with no paid tiers, billing, or hidden fees." },
  { q: "How are orders received?", a: "When a customer taps 'Order on WhatsApp', a pre-filled WhatsApp message opens with their cart items, quantities, and total. The order goes straight to your WhatsApp." },
  { q: "Do I need a website?", a: "No. Your TapCart store at tap-cart.shop/s/yourname is your website. Share it anywhere." },
  { q: "Can customers pay through TapCart?", a: "No — payment is handled between you and your customer over WhatsApp, however you prefer." },
  { q: "Can I edit my products anytime?", a: "Yes, from your dashboard. Changes go live instantly." },
  { q: "Is there an app?", a: "TapCart works in any modern browser, on phone and desktop." },
];

function FAQPage() {
  return (
    <MarketingLayout>
      <PageHero eyebrow="FAQ" title="Questions, answered." />
      <section className="mx-auto max-w-2xl px-6 pb-32">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </MarketingLayout>
  );
}
