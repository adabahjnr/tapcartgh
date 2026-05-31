import React from "react";
import { Link, Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, BarChart3, Bell, Check, LayoutDashboard, Package, ShoppingBag, Store, Users, Settings } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { AppShell, dashboardNav } from "@/components/app/AppShell";

export function HomePage() {
  return (
    <MarketingLayout>
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
          <Link to="/auth?mode=signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Create your store <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/examples" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-secondary">
            See live examples
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">No credit card. No fees. No paid tiers.</p>
      </section>

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
            ].map((product) => (
              <div key={product.name} className="border-border p-6 md:border-l first:md:border-l-0">
                <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { title: "Set up in minutes", description: "Add your products, logo, and WhatsApp number. Share your link. Done." },
            { title: "Designed to feel premium", description: "Calm typography, generous spacing, and a storefront customers trust." },
            { title: "Orders where you already are", description: "Every order arrives as a clean, pre-filled WhatsApp message." },
          ].map((feature) => (
            <div key={feature.title}>
              <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-base font-medium">{feature.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32 pt-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Start selling today.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">It's free. It always will be.</p>
        <Link to="/auth?mode=signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          Create your store <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </MarketingLayout>
  );
}

function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function FeaturesPage() {
  return (
    <MarketingLayout>
      <PageSection title="Powerful features for every storefront">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Beautiful storefronts", description: "Publish a clean, modern shop page that looks great on mobile and desktop." },
            { title: "Ready-made checkout", description: "Customers add items and send orders directly through WhatsApp without friction." },
            { title: "Fast setup", description: "Launch a full store from scratch in under ten minutes." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </MarketingLayout>
  );
}

export function HowItWorksPage() {
  return (
    <MarketingLayout>
      <PageSection title="How TapCart works">
        <div className="space-y-6">
          {[
            { step: "1", title: "Create your storefront", description: "Add your logo, product catalog, and WhatsApp number." },
            { step: "2", title: "Share a single link", description: "Your customers open a polished store from one URL." },
            { step: "3", title: "Receive orders in WhatsApp", description: "Every order lands as a ready-to-send WhatsApp message." },
          ].map((item) => (
            <div key={item.step} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-foreground">{item.step}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </MarketingLayout>
  );
}

export function ExamplesPage() {
  return (
    <MarketingLayout>
      <PageSection title="Live store examples">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { name: "Bloom & Co.", description: "A flower shop built for WhatsApp orders." },
            { name: "Chai House", description: "A local cafe showcasing daily specials." },
            { name: "Local Market", description: "A small grocery store with easy ordering." },
          ].map((example) => (
            <div key={example.name} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-semibold">{example.name}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{example.description}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </MarketingLayout>
  );
}

export function FaqPage() {
  return (
    <MarketingLayout>
      <PageSection title="Frequently asked questions">
        <div className="space-y-5">
          {[
            { question: "Can I use TapCart for free?", answer: "Yes. TapCart is built to stay simple and accessible for every seller." },
            { question: "Do customers pay through WhatsApp?", answer: "No. Orders are sent as WhatsApp messages so you can confirm payment directly." },
            { question: "Can I customize my store?", answer: "You can add your logo, product details, and custom description to make it feel like your brand." },
          ].map((item) => (
            <div key={item.question} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-semibold">{item.question}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </MarketingLayout>
  );
}

export function ContactPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Contact TapCart</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Have questions or need help launching your store? Reach out and we’ll get back to you quickly.</p>
        <div className="mt-10 space-y-6 rounded-3xl border border-border bg-card p-10 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">support@tap-cart.shop</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">WhatsApp</h2>
            <p className="mt-2 text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = React.useState(searchParams.get("mode") === "signup");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <Link to="/" className="text-base font-semibold tracking-tight">TapCart</Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-10 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">{isSignup ? "Create your store" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "It’s free, forever." : "Sign in to your dashboard."}
          </p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/dashboard");
            }}
          >
            {isSignup && (
              <Input label="Username" placeholder="yourname" prefix="tap-cart.shop/s/" />
            )}
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <button className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to TapCart? "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-foreground underline-offset-4 hover:underline">
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
      <div className="flex items-stretch overflow-hidden rounded-lg border border-border focus-within:border-foreground">
        {prefix && <span className="flex items-center bg-secondary px-3 text-xs text-muted-foreground">{prefix}</span>}
        <input {...rest} required className="w-full bg-background px-4 py-3 text-sm outline-none" />
      </div>
    </label>
  );
}

export function DashboardLayout() {
  return (
    <AppShell items={dashboardNav} brand="Bloom & Co." storeLink="bloom">
      <Outlet />
    </AppShell>
  );
}

export function DashboardIndexPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Overview</p>
            <h1 className="mt-3 text-3xl font-semibold">Your dashboard</h1>
          </div>
          <span className="rounded-full bg-secondary px-4 py-2 text-xs text-muted-foreground">Live</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Orders", value: "28" },
            { label: "Sales", value: "$1.4k" },
            { label: "Visitors", value: "1.9k" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-border bg-background p-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Quick actions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Manage products", to: "/dashboard/products" },
            { label: "View orders", to: "/dashboard/orders" },
            { label: "Open store page", to: "/dashboard/store" },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="rounded-3xl border border-border bg-background px-5 py-6 text-sm font-medium text-foreground transition hover:bg-secondary">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardStorePage() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Store preview</h2>
        <p className="mt-4 text-sm text-muted-foreground">Your public store is available at tap-cart.shop/s/bloom.</p>
      </div>
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Share your link</h2>
        <p className="mt-4 text-sm text-muted-foreground">Copy the link and share it in socials, WhatsApp, or email.</p>
      </div>
    </div>
  );
}

export function DashboardProductsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Products</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add and manage the items you sell in your store.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "Garden Rose Bouquet", price: "$48" },
          { name: "Wildflower Mix", price: "$36" },
          { name: "White Peony Bundle", price: "$62" },
        ].map((product) => (
          <div key={product.name} className="rounded-3xl border border-border bg-background p-6">
            <div className="text-sm text-muted-foreground">{product.name}</div>
            <div className="mt-3 text-2xl font-semibold">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Recent orders</h2>
        <p className="mt-2 text-sm text-muted-foreground">Orders arrive as WhatsApp-ready messages, so you can confirm details instantly.</p>
      </div>
      <div className="rounded-3xl border border-border bg-background p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { id: "#221", buyer: "Naomi", total: "$48" },
            { id: "#220", buyer: "Amir", total: "$62" },
            { id: "#219", buyer: "Leila", total: "$36" },
          ].map((order) => (
            <div key={order.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="text-sm text-muted-foreground">{order.id}</div>
              <div className="mt-2 font-semibold">{order.buyer}</div>
              <div className="mt-1 text-sm text-muted-foreground">{order.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardAnalyticsPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold">Performance</h1>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { label: "Revenue", value: "$1.4k" },
          { label: "Conversion", value: "12.7%" },
          { label: "Messages", value: "84" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-border bg-background p-6">
            <div className="text-sm text-muted-foreground">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSettingsPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Store settings</h1>
      <p className="mt-3 text-sm text-muted-foreground">Update your store name, WhatsApp number, and branding here.</p>
    </div>
  );
}

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
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Admin overview</h1>
        <p className="mt-3 text-sm text-muted-foreground">Manage users, stores, and notifications for your team.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Stores", value: "12" },
          { label: "Active users", value: "298" },
          { label: "Alerts", value: "3" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-border bg-background p-6">
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="mt-3 text-3xl font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-3 text-sm text-muted-foreground">Review and manage admin access for your team.</p>
      </div>
      <div className="rounded-3xl border border-border bg-background p-6">
        <ul className="space-y-4">
          {[
            { name: "Amina", role: "Owner" },
            { name: "Jordan", role: "Editor" },
            { name: "Kelsey", role: "Support" },
          ].map((user) => (
            <li key={user.name} className="rounded-3xl border border-border bg-card p-4">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.role}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AdminStoresPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Stores</h1>
        <p className="mt-3 text-sm text-muted-foreground">View store activity across your organization.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Bloom & Co.", sales: "$1.2k" },
          { name: "Chai House", sales: "$860" },
        ].map((store) => (
          <div key={store.name} className="rounded-3xl border border-border bg-background p-6">
            <div className="font-medium">{store.name}</div>
            <div className="mt-2 text-sm text-muted-foreground">{store.sales} this week</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-3 text-sm text-muted-foreground">System alerts and messages for your admin team.</p>
      </div>
      <div className="space-y-4 rounded-3xl border border-border bg-background p-6">
        {[
          "Inventory alert for Bloom & Co.",
          "New user signup pending review.",
          "Monthly report is ready to download.",
        ].map((message) => (
          <div key={message} className="rounded-3xl border border-border bg-card p-4">{message}</div>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalyticsPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Admin analytics</h1>
      <p className="mt-3 text-sm text-muted-foreground">High-level metrics for stores and team performance.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Total sales", value: "$14.8k" },
          { label: "Stores active", value: "18" },
          { label: "Team members", value: "9" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-border bg-background p-6">
            <div className="text-sm text-muted-foreground">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Admin settings</h1>
      <p className="mt-3 text-sm text-muted-foreground">Manage team permissions, account preferences, and security settings.</p>
    </div>
  );
}

export function PublicStorePage() {
  const { username } = useParams();
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Public store</p>
            <h1 className="mt-4 text-4xl font-semibold">{username ?? "Store"} on TapCart</h1>
          </div>
          <div className="rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">tap-cart.shop/s/{username ?? "username"}</div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "Bouquet", price: "$48" },
            { title: "Snack box", price: "$22" },
            { title: "Gift set", price: "$76" },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-border bg-background p-6">
              <div className="text-sm text-muted-foreground">{item.title}</div>
              <div className="mt-3 text-2xl font-semibold">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you’re looking for doesn’t exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
