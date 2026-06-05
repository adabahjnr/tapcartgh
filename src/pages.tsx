import React from "react";
import { Link, Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight, BarChart3, Bell, Check, LayoutDashboard, Package, Plus, Trash2,
  ShoppingBag, Store, Users, Settings, Sparkles, MessageCircle, Link2,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { AppShell, dashboardNav } from "@/components/app/AppShell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useProducts, useOrders, useStoreViews } from "@/lib/dashboard-data";
import { Reveal } from "@/components/ui/reveal";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { DotLoader, RingLoader, SkeletonShimmer } from "@/components/ui/loader";
import {
  PhoneChatIllustration, RouteIllustration, EmptyBoxIllustration,
  LogoTicker, Sparkle,
} from "@/components/illustrations";

/* ------------------------- HOME ------------------------- */

export function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="tc-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-secondary/70 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-24 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-32">
          <div>
            <div className="tc-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-[color:var(--whatsapp)]" />
                <span className="absolute -inset-1 rounded-full tc-pulse-ring" />
              </span>
              Free for everyone, forever
            </div>
            <h1 className="tc-fade-up text-5xl font-semibold tracking-tight md:text-7xl" style={{ animationDelay: "60ms" }}>
              Your mini store. <br />
              One link.{" "}
              <span className="relative inline-block">
                Orders on
                <Sparkle className="absolute -right-7 -top-3 h-5 w-5 text-foreground/40 tc-float" />
              </span>{" "}
              <span className="relative whitespace-nowrap">
                WhatsApp.
                <svg viewBox="0 0 220 12" className="absolute -bottom-2 left-0 h-3 w-full text-foreground/30" aria-hidden>
                  <path d="M2 8 Q 60 -2 110 6 T 218 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="tc-fade-up mt-7 max-w-xl text-lg text-muted-foreground" style={{ animationDelay: "140ms" }}>
              TapCart gives small businesses and creators a beautiful storefront in minutes.
              Customers browse, add to cart, and tap one button to send the order straight to your WhatsApp.
            </p>
            <div className="tc-fade-up mt-10 flex flex-col items-start gap-3 sm:flex-row" style={{ animationDelay: "220ms" }}>
              <Link to="/auth?mode=signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]">
                Create your store
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/examples" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary">
                See live examples
              </Link>
            </div>
            <p className="tc-fade-up mt-6 text-xs text-muted-foreground" style={{ animationDelay: "300ms" }}>
              No credit card. No fees. No paid tiers.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-secondary via-background to-secondary tc-blob-morph" aria-hidden />
            <PhoneChatIllustration className="mx-auto w-full max-w-[280px]" />
          </div>
        </div>
      </section>

      <LogoTicker />

      {/* Showcase */}
      <Reveal className="mx-auto max-w-5xl px-6 py-20">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="ml-3 text-xs text-muted-foreground">tap-cart.shop/s/bloom</span>
          </div>
          <div className="tc-stagger grid gap-0 md:grid-cols-3">
            {[
              { name: "Garden Rose Bouquet", price: "$48", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=600&fit=crop" },
              { name: "Wildflower Mix", price: "$36", img: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=600&fit=crop" },
              { name: "White Peony Bundle", price: "$62", img: "https://images.unsplash.com/photo-1469259943454-aa100abba749?w=600&h=600&fit=crop" },
            ].map((product) => (
              <div key={product.name} className="group border-border p-6 md:border-l first:md:border-l-0">
                <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                  <img
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="tc-stagger grid gap-10 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Set up in minutes", description: "Add your products, logo, and WhatsApp number. Share your link. Done." },
            { icon: Store, title: "Designed to feel premium", description: "Calm typography, generous spacing, and a storefront customers trust." },
            { icon: MessageCircle, title: "Orders where you already are", description: "Every order arrives as a clean, pre-filled WhatsApp message." },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-transform group-hover:-rotate-6">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-base font-medium">{feature.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <Reveal className="mx-auto max-w-4xl px-6 pb-32 pt-12 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12">
          <div className="tc-dot-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Start selling today.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">It's free. It always will be.</p>
            <Link to="/auth?mode=signup" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
              Create your store
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </MarketingLayout>
  );
}

/* ------------------- Marketing helpers ------------------- */

function PageHero({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="tc-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-24 text-center md:pb-20 md:pt-32">
        {eyebrow && (
          <div className="tc-fade-up mb-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</div>
        )}
        <h1 className="tc-fade-up text-4xl font-semibold tracking-tight md:text-6xl" style={{ animationDelay: "60ms" }}>{title}</h1>
        {sub && <p className="tc-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: "140ms" }}>{sub}</p>}
      </div>
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`tc-lift rounded-3xl border border-border bg-card p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* --------------------- FEATURES --------------------- */

export function FeaturesPage() {
  const items = [
    { icon: Store, title: "Beautiful storefronts", description: "Publish a clean, modern shop page that looks great on mobile and desktop." },
    { icon: MessageCircle, title: "Ready-made checkout", description: "Customers add items and send orders directly through WhatsApp without friction." },
    { icon: Sparkles, title: "Fast setup", description: "Launch a full store from scratch in under ten minutes." },
    { icon: Package, title: "Simple catalog", description: "Add products, photos, and prices in a calm, distraction-free editor." },
    { icon: BarChart3, title: "Quiet analytics", description: "See what's selling without dashboards that scream at you." },
    { icon: Link2, title: "One shareable link", description: "Drop it in bio, posts, and stories. Same link, every channel." },
  ];
  return (
    <MarketingLayout>
      <PageHero eyebrow="Features" title="Powerful features for every storefront" sub="Everything you need to start, sell, and grow — nothing you don't." />
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="tc-stagger grid gap-6 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </MarketingLayout>
  );
}

/* --------------------- HOW IT WORKS --------------------- */

export function HowItWorksPage() {
  const steps = [
    { step: "01", title: "Create your storefront", description: "Add your logo, product catalog, and WhatsApp number." },
    { step: "02", title: "Share a single link", description: "Your customers open a polished store from one URL." },
    { step: "03", title: "Receive orders in WhatsApp", description: "Every order lands as a ready-to-send WhatsApp message." },
  ];
  return (
    <MarketingLayout>
      <PageHero eyebrow="How it works" title="Three quiet steps" sub="No theme picking. No setup wizards. Just your store, online." />
      <section className="mx-auto max-w-4xl px-6 pb-12">
        <RouteIllustration className="mx-auto h-12 w-full max-w-2xl text-foreground/40" />
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="tc-stagger grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.step}>
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{item.step}</div>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

/* --------------------- EXAMPLES --------------------- */

export function ExamplesPage() {
  const examples = [
    { name: "Bloom & Co.", description: "A flower shop built for WhatsApp orders.", tag: "Florist" },
    { name: "Chai House", description: "A local cafe showcasing daily specials.", tag: "Cafe" },
    { name: "Local Market", description: "A small grocery store with easy ordering.", tag: "Grocery" },
    { name: "Olive & Oak", description: "A neighborhood deli built around regulars.", tag: "Deli" },
    { name: "Rosewater", description: "A skincare studio with a tiny, careful catalog.", tag: "Beauty" },
    { name: "North & Co.", description: "Hand-thrown ceramics, sold one piece at a time.", tag: "Goods" },
  ];
  return (
    <MarketingLayout>
      <PageHero eyebrow="Examples" title="Live store examples" sub="A small look at what sellers are building on TapCart." />
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="tc-stagger grid gap-6 md:grid-cols-3">
          {examples.map((example) => (
            <Card key={example.name} className="group">
              <div className="flex items-center gap-3">
                <GradientAvatar name={example.name} size={36} />
                <div>
                  <h3 className="text-lg font-semibold">{example.name}</h3>
                  <div className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">{example.tag}</div>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{example.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm tc-link-underline text-foreground/80">
                Visit store
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

/* --------------------- FAQ --------------------- */

export function FaqPage() {
  const items = [
    { q: "Can I use TapCart for free?", a: "Yes. TapCart is built to stay simple and accessible for every seller." },
    { q: "Do customers pay through WhatsApp?", a: "No. Orders are sent as WhatsApp messages so you can confirm payment directly." },
    { q: "Can I customize my store?", a: "You can add your logo, product details, and custom description to make it feel like your brand." },
    { q: "Will my store work on mobile?", a: "Every TapCart store is mobile-first by default and looks great on any device." },
  ];
  return (
    <MarketingLayout>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="tc-stagger space-y-4">
          {items.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left transition-colors hover:bg-secondary/40"
      >
        <span className="text-base font-medium">{q}</span>
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-sm transition-transform ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-7 pb-6 text-sm text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* --------------------- CONTACT --------------------- */

export function ContactPage() {
  const [sent, setSent] = React.useState(false);
  return (
    <MarketingLayout>
      <PageHero eyebrow="Contact" title="Say hello" sub="Have questions or need help launching your store? We'll get back to you quickly." />
      <section className="mx-auto grid max-w-5xl gap-8 px-6 pb-24 md:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <Card className="h-full">
            <h2 className="text-lg font-semibold">Reach us directly</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-4 w-4 text-muted-foreground" /><span>support@tap-cart.shop</span></li>
              <li className="flex items-start gap-3"><span className="relative mt-0.5 inline-flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-[color:var(--whatsapp)]" /><span className="absolute -inset-1 rounded-full tc-pulse-ring" /></span><span>+1 (555) 123-4567 — WhatsApp</span></li>
            </ul>
          </Card>
        </Reveal>
        <Reveal delay={120}>
          <Card>
            <h2 className="text-lg font-semibold">Send a note</h2>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <Input label="Your name" placeholder="Amina" />
              <Input label="Email" type="email" placeholder="you@example.com" />
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</span>
                <textarea required rows={4} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Tell us a bit about your store..." />
              </label>
              <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
                {sent ? <><Check className="h-4 w-4" /> Sent</> : <>Send message <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </Card>
        </Reveal>
      </section>
    </MarketingLayout>
  );
}

/* --------------------- AUTH --------------------- */

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = React.useState(searchParams.get("mode") === "signup");
  const [formState, setFormState] = React.useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && session) navigate("/dashboard", { replace: true });
  }, [authLoading, session, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const email = formState.email.trim();
    const password = formState.password;
    const username = formState.username.trim().toLowerCase();
    const fullName = formState.fullName.trim();
    const phone = formState.phone.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError("Authentication is not configured.");
      setLoading(false);
      return;
    }

    if (isSignup) {
      if (!fullName || !username || !phone) {
        setError("Please fill in your name, username, and phone number.");
        setLoading(false);
        return;
      }
      if (!/^[a-z0-9_-]{3,30}$/.test(username)) {
        setError("Username must be 3–30 lowercase letters, numbers, _ or -.");
        setLoading(false);
        return;
      }
      if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
        setError("Please enter a valid phone number.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, full_name: fullName, phone },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        navigate("/dashboard");
      } else {
        setInfo("Check your email to confirm your account.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <Link to="/" className="text-base font-semibold tracking-tight">
          TapCart
        </Link>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-6 pb-20">
        <div className="tc-fade-up w-full max-w-sm rounded-3xl border border-border bg-card p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
          <h1 className="text-3xl font-semibold tracking-tight">{isSignup ? "Create your store" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "It's free, forever." : "Sign in to your dashboard."}
          </p>

          {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
          {info ? <div className="mt-4 rounded-2xl border border-border bg-secondary p-3 text-sm text-muted-foreground">{info}</div> : null}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <Input
                  label="Full name"
                  placeholder="Jane Doe"
                  value={formState.fullName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
                />
                <Input
                  label="Store username"
                  placeholder="yourname"
                  prefix="tap-cart.shop/s/"
                  value={formState.username}
                  onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={formState.phone}
                  onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <DotLoader /> : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to TapCart? "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
              }}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, prefix, ...rest }: { label: string; prefix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-border transition-colors focus-within:border-foreground">
        {prefix && <span className="flex items-center bg-secondary px-3 text-xs text-muted-foreground">{prefix}</span>}
        <input {...rest} required className="w-full bg-background px-4 py-3 text-sm outline-none" />
      </div>
    </label>
  );
}

/* --------------------- DASHBOARD --------------------- */

export function DashboardLayout() {
  return (
    <AppShell items={dashboardNav} brand="Bloom & Co." storeLink="bloom">
      <Outlet />
    </AppShell>
  );
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Stat({ label, value, prefix = "", suffix = "" }: { label: string; value: number; prefix?: string; suffix?: string }) {
  const v = useCountUp(value);
  return (
    <div className="tc-lift rounded-3xl border border-border bg-background p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{prefix}{v.toLocaleString()}{suffix}</p>
    </div>
  );
}

export function DashboardIndexPage() {
  return (
    <div className="space-y-8">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Overview</p>
            <h1 className="mt-3 text-3xl font-semibold">Your dashboard</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[color:var(--whatsapp)]" />
              <span className="absolute -inset-1 rounded-full tc-pulse-ring" />
            </span>
            Live
          </span>
        </div>
        <div className="tc-stagger mt-8 grid gap-4 md:grid-cols-3">
          <Stat label="Orders" value={28} />
          <Stat label="Sales" value={1400} prefix="$" />
          <Stat label="Visitors" value={1924} />
        </div>
      </div>
      <Reveal className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Quick actions</h2>
        <div className="tc-stagger mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Manage products", to: "/dashboard/products", icon: Package },
            { label: "View orders", to: "/dashboard/orders", icon: ShoppingBag },
            { label: "Open store page", to: "/dashboard/store", icon: Store },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="tc-lift group flex items-center justify-between rounded-3xl border border-border bg-background px-5 py-6 text-sm font-medium">
                <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-muted-foreground" />{item.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

export function DashboardStorePage() {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Reveal>
        <div className="tc-lift rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <GradientAvatar name="Bloom & Co." size={44} />
            <div>
              <h2 className="text-xl font-semibold">Bloom & Co.</h2>
              <p className="text-xs text-muted-foreground">tap-cart.shop/s/bloom</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Your public store is live and ready to receive WhatsApp orders.</p>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="tc-lift rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Share your link</h2>
          <p className="mt-3 text-sm text-muted-foreground">Copy the link and share it in socials, WhatsApp, or email.</p>
          <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 truncate text-muted-foreground">tap-cart.shop/s/bloom</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText("https://tap-cart.shop/s/bloom");
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function DashboardProductsPage() {
  const products = [
    { name: "Garden Rose Bouquet", price: "$48" },
    { name: "Wildflower Mix", price: "$36" },
    { name: "White Peony Bundle", price: "$62" },
  ];
  return (
    <div className="space-y-6">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Products</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add and manage the items you sell in your store.</p>
      </div>
      <div className="tc-stagger grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <div key={product.name} className="tc-lift rounded-3xl border border-border bg-background p-6">
            <div className="flex items-center gap-3">
              <GradientAvatar name={product.name} size={32} />
              <div className="text-sm text-muted-foreground">{product.name}</div>
            </div>
            <div className="mt-4 text-2xl font-semibold tabular-nums">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOrdersPage() {
  const orders = [
    { id: "#221", buyer: "Naomi", total: "$48" },
    { id: "#220", buyer: "Amir", total: "$62" },
    { id: "#219", buyer: "Leila", total: "$36" },
  ];
  return (
    <div className="space-y-6">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Recent orders</h2>
        <p className="mt-2 text-sm text-muted-foreground">Orders arrive as WhatsApp-ready messages, so you can confirm details instantly.</p>
      </div>
      <div className="tc-stagger grid gap-4 md:grid-cols-3">
        {orders.map((order) => (
          <div key={order.id} className="tc-lift rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{order.id}</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--whatsapp)]" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <GradientAvatar name={order.buyer} size={32} />
              <div>
                <div className="font-medium">{order.buyer}</div>
                <div className="text-xs text-muted-foreground tabular-nums">{order.total}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniBars({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-md bg-foreground/80 transition-all"
          style={{ height: `${(v / max) * 100}%`, animation: `tc-fade-up 0.6s ease ${i * 60}ms both` }}
        />
      ))}
    </div>
  );
}

export function DashboardAnalyticsPage() {
  return (
    <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold">Performance</h1>
        </div>
      </div>
      <div className="tc-stagger mt-8 grid gap-6 md:grid-cols-3">
        <Stat label="Revenue" value={1400} prefix="$" />
        <Stat label="Conversion" value={13} suffix="%" />
        <Stat label="Messages" value={84} />
      </div>
      <Reveal className="mt-8 rounded-3xl border border-border bg-background p-6">
        <div className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Last 14 days</div>
        <MiniBars data={[6, 8, 5, 9, 12, 10, 14, 11, 13, 16, 12, 18, 15, 20]} />
      </Reveal>
    </div>
  );
}

export function DashboardSettingsPage() {
  return (
    <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Store settings</h1>
      <p className="mt-3 text-sm text-muted-foreground">Update your store name, WhatsApp number, and branding here.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Input label="Store name" defaultValue="Bloom & Co." />
        <Input label="WhatsApp number" defaultValue="+1 (555) 123-4567" />
      </div>
    </div>
  );
}

/* --------------------- ADMIN --------------------- */

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/stores", label: "Stores", icon: Store },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  return (
    <AppShell items={adminNav} brand="TapCart Admin">
      <Outlet />
    </AppShell>
  );
}

export function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Admin overview</h1>
        <p className="mt-3 text-sm text-muted-foreground">Manage users, stores, and notifications for your team.</p>
      </div>
      <div className="tc-stagger grid gap-4 md:grid-cols-3">
        <Stat label="Stores" value={12} />
        <Stat label="Active users" value={298} />
        <Stat label="Alerts" value={3} />
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const users = [
    { name: "Amina", role: "Owner" },
    { name: "Jordan", role: "Editor" },
    { name: "Kelsey", role: "Support" },
  ];
  return (
    <div className="space-y-6">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-3 text-sm text-muted-foreground">Review and manage admin access for your team.</p>
      </div>
      <ul className="tc-stagger space-y-3">
        {users.map((user) => (
          <li key={user.name} className="tc-lift flex items-center justify-between rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <GradientAvatar name={user.name} />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.role}</div>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">Active</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminStoresPage() {
  const stores = [
    { name: "Bloom & Co.", sales: "$1.2k" },
    { name: "Chai House", sales: "$860" },
    { name: "Local Market", sales: "$540" },
    { name: "Olive & Oak", sales: "$420" },
  ];
  return (
    <div className="space-y-6">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Stores</h1>
        <p className="mt-3 text-sm text-muted-foreground">View store activity across your organization.</p>
      </div>
      <div className="tc-stagger grid gap-4 md:grid-cols-2">
        {stores.map((store) => (
          <div key={store.name} className="tc-lift flex items-center justify-between rounded-3xl border border-border bg-background p-6">
            <div className="flex items-center gap-3">
              <GradientAvatar name={store.name} />
              <div className="font-medium">{store.name}</div>
            </div>
            <div className="text-sm text-muted-foreground tabular-nums">{store.sales}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminNotificationsPage() {
  const messages = [
    "Inventory alert for Bloom & Co.",
    "New user signup pending review.",
    "Monthly report is ready to download.",
  ];
  return (
    <div className="space-y-6">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-3 text-sm text-muted-foreground">System alerts and messages for your admin team.</p>
      </div>
      <div className="tc-stagger space-y-3">
        {messages.map((message) => (
          <div key={message} className="tc-lift flex items-start gap-4 rounded-3xl border border-border bg-card p-5">
            <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm">{message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalyticsPage() {
  return (
    <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Admin analytics</h1>
      <p className="mt-3 text-sm text-muted-foreground">High-level metrics for stores and team performance.</p>
      <div className="tc-stagger mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Total sales" value={14800} prefix="$" />
        <Stat label="Stores active" value={18} />
        <Stat label="Team members" value={9} />
      </div>
      <Reveal className="mt-8 rounded-3xl border border-border bg-background p-6">
        <div className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Sales by week</div>
        <MiniBars data={[8, 10, 9, 12, 15, 14, 18, 17, 21, 19, 24, 22]} />
      </Reveal>
    </div>
  );
}

export function AdminSettingsPage() {
  return (
    <div className="tc-fade-up rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Admin settings</h1>
      <p className="mt-3 text-sm text-muted-foreground">Manage team permissions, account preferences, and security settings.</p>
    </div>
  );
}

/* --------------------- PUBLIC STORE --------------------- */

export function PublicStorePage() {
  const { username } = useParams();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const items = [
    { title: "Bouquet", price: "$48" },
    { title: "Snack box", price: "$22" },
    { title: "Gift set", price: "$76" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="tc-fade-up rounded-3xl border border-border bg-card p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <GradientAvatar name={username ?? "Store"} size={56} />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Public store</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{username ?? "Store"} on TapCart</h1>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <Link2 className="h-3.5 w-3.5" />
            tap-cart.shop/s/{username ?? "username"}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-3xl border border-border p-6">
                  <SkeletonShimmer className="h-24 w-full" />
                  <SkeletonShimmer className="mt-4 h-3 w-2/3" />
                  <SkeletonShimmer className="mt-2 h-3 w-1/3" />
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-6"><DotLoader label="Loading store" /></div>
          </div>
        ) : (
          <div className="tc-stagger mt-10 grid gap-6 md:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="tc-lift rounded-3xl border border-border bg-background p-6">
                <div className="aspect-square rounded-2xl bg-secondary" />
                <div className="mt-4 text-sm text-muted-foreground">{item.title}</div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">{item.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------- 404 --------------------- */

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="tc-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative max-w-md text-center">
        <div className="mx-auto mb-6 w-36"><EmptyBoxIllustration className="w-full text-foreground" /></div>
        <h1 className="text-6xl font-semibold tracking-tight">404</h1>
        <h2 className="mt-3 text-lg font-medium">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-7">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
            Go home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Re-export loader for any future use */
export { RingLoader };
