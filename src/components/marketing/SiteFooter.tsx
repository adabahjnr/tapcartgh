import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="text-base font-semibold tracking-tight">TapCart</div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Your mini store. One link. Orders on WhatsApp.
            </p>
          </div>
          <FooterCol title="Product" items={[
            { to: "/features", label: "Features" },
            { to: "/how-it-works", label: "How it works" },
            { to: "/examples", label: "Examples" },
          ]} />
          <FooterCol title="Company" items={[
            { to: "/faq", label: "FAQ" },
            { to: "/contact", label: "Contact" },
          ]} />
          <FooterCol title="Account" items={[
            { to: "/auth", label: "Sign in" },
            { to: "/auth", label: "Get started" },
          ]} />
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} TapCart. All rights reserved.</span>
          <span>tap-cart.shop</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-foreground/80 hover:text-foreground">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
