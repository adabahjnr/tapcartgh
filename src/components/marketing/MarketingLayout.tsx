import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-12 pt-24 text-center md:pb-20 md:pt-32">
      {eyebrow && (
        <div className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</div>
      )}
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
      {sub && <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
    </section>
  );
}
