import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Heart,
  ShieldCheck,
  Home as HomeIcon,
  Building2,
  Users,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Send,
  LogOut,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Menu,
  User as UserIcon,
  ClipboardCheck,
  Upload,
  X,
  Trash2,
  Users2,
  Image as ImageIcon,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import logoAsset from "@/assets/hostelhub-logo.png.asset.json";
import { useLogoUrl, notifyLogoChanged } from "@/lib/data";

function BrandLogo({ className = "h-8 w-8" }: { className?: string }) {
  const url = useLogoUrl("/favicon.png");
  return (
    <img
      src={url || logoAsset.url}
      alt="HostelHub logo"
      className={`${className} rounded-lg object-contain`}
      loading="eager"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.indexOf("/favicon.png") === -1) img.src = "/favicon.png";
      }}
    />
  );
}
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  useRoles,
  useHostels,
  useHostel,
  useReviews,
  useFavorites,
  useMyHostels,
  useProfile,
  useMyOwnerApplication,
  useOwnerApplications,
  submitOwnerApplication,
  useSiteSetting,
  setSiteSetting,
  avgRating,
  type Hostel,
  type RoomOption,
  type HeroSetting,
  type FounderSetting,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { RingLoader, DotLoader } from "@/components/ui/loader";
import { Slider } from "@/components/ui/slider";
import { DoodleHouse, DoodleStar, DoodleSquiggle, DoodleKey, DoodleArrow, DoodleCircle } from "@/components/hh/Doodles";
import { ThemeToggle } from "@/components/hh/ThemeToggle";

/* ================== LAYOUT ================== */

const CREATOR_NAME = "Adabah Michael Junior";
const CREATOR_URL = "#";

export function PublicLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { isAdmin, isOwner } = useRoles();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const nav = [
    { to: "/", label: "Home" },
    { to: "/hostels", label: "Hostels" },
    { to: "/community", label: "Community" },
    { to: "/about", label: "About" },
  ];

  const userLinks: { to: string; label: string }[] = user
    ? [
        { to: "/profile", label: "Profile" },
        { to: "/favorites", label: "Favorites" },
        { to: "/requests", label: "My requests" },
        ...(isOwner ? [{ to: "/owner", label: "Owner dashboard" }] : [{ to: "/owner", label: "Become an owner" }]),
        ...(isAdmin ? [{ to: "/admin", label: "Admin dashboard" }] : []),
      ]
    : [];

  const handleSignOut = async () => {
    await signOut();
    setOpenMenu(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <BrandLogo className="h-9 w-9" />
            <span>HostelHub</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                {i.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:inline-flex" />
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 md:inline-flex"
                  >
                    Admin
                  </Link>
                )}
                {isOwner && (
                  <Link
                    to="/owner"
                    className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
                  >
                    Owner
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="hidden h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 md:inline-flex"
                  aria-label="Profile"
                >
                  <UserIcon className="h-4 w-4" />
                </Link>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={handleSignOut}>
                  <LogOut className="mr-1 h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <Button size="sm" className="hidden md:inline-flex" onClick={() => navigate("/auth", { state: { from: location.pathname } })}>
                Sign in
              </Button>
            )}

            {/* Mobile hamburger */}
            <Sheet open={openMenu} onOpenChange={setOpenMenu}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden h-11 w-11 rounded-full border-primary/40 bg-primary/10 text-primary shadow-sm hh-burger-attn" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <BrandLogo className="h-7 w-7" />
                    HostelHub
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1">
                  {nav.map((i) => (
                    <NavLink
                      key={i.to}
                      to={i.to}
                      end={i.to === "/"}
                      onClick={() => setOpenMenu(false)}
                      className={({ isActive }) =>
                        `rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`
                      }
                    >
                      {i.label}
                    </NavLink>
                  ))}
                </div>

                {user && (
                  <>
                    <div className="my-4 border-t border-border" />
                    <div className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Account
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {userLinks.map((i) => (
                        <NavLink
                          key={i.to}
                          to={i.to}
                          onClick={() => setOpenMenu(false)}
                          className={({ isActive }) =>
                            `rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`
                          }
                        >
                          {i.label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-6 border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  {user ? (
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                      <LogOut className="mr-1 h-4 w-4" /> Sign out
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/auth", { state: { from: location.pathname } });
                      }}
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WelcomePopup />
    </div>
  );
}

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [installEvt, setInstallEvt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("hh_welcome_seen");
    if (!seen) {
      const t = setTimeout(() => {
        setOpen(true);
        requestAnimationFrame(() => setMounted(true));
      }, 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvt(null);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = () => {
    setMounted(false);
    setTimeout(() => {
      setOpen(false);
      localStorage.setItem("hh_welcome_seen", "1");
    }, 200);
  };

  const handleInstall = async () => {
    if (!installEvt) {
      toast.message("Add to Home Screen", {
        description:
          "On iPhone: tap Share, then 'Add to Home Screen'. On Android: open the browser menu and tap 'Install app' or 'Add to Home Screen'.",
      });
      return;
    }
    try {
      setInstalling(true);
      await installEvt.prompt();
      const choice = await installEvt.userChoice;
      if (choice.outcome === "accepted") {
        toast.success("HostelHub added to your home screen 🎉");
        close();
      }
    } finally {
      setInstalling(false);
      setInstallEvt(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-200 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hh-welcome-title"
    >
      <button
        aria-label="Close welcome"
        onClick={close}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
      />
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl transition-all duration-300 ${
          mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="hh-grain absolute inset-0 -z-10 opacity-70" aria-hidden />
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur transition hover:bg-background hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-3 px-6 pb-2 pt-8 text-center">
          <div className="relative">
            <span className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-primary/20" aria-hidden />
            <div className="rounded-2xl bg-primary/10 p-3">
              <BrandLogo className="h-12 w-12" />
            </div>
          </div>
          <h2 id="hh-welcome-title" className="text-2xl font-semibold tracking-tight">
            Welcome to HostelHub 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Your hostel? Sorted. Discover verified student hostels around UMaT, save favorites, and message owners
            directly on WhatsApp.
          </p>
          <DotLoader className="mt-1" label="Getting things ready" />
        </div>

        <div className="grid gap-2 px-6 py-5 text-sm">
          <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
            <span>Browse verified hostels with real photos & prices.</span>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3">
            <Heart className="mt-0.5 h-4 w-4 text-primary" />
            <span>Save favorites and pick up where you left off.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-background/60 px-6 py-4">
          <Button onClick={handleInstall} disabled={installing || installed} className="w-full">
            {installing ? (
              <DotLoader />
            ) : installed ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Installed
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" /> Add HostelHub to Home Screen
              </>
            )}
          </Button>
          <Button variant="ghost" className="w-full" onClick={close}>
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}


function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <BrandLogo className="h-7 w-7" />
            HostelHub
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Find verified student hostels around UMaT.</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explore</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-foreground text-muted-foreground" to="/hostels">All hostels</Link></li>
            <li><Link className="hover:text-foreground text-muted-foreground" to="/community">Student community</Link></li>
            <li><Link className="hover:text-foreground text-muted-foreground" to="/feedback">Send feedback</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For owners</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-foreground text-muted-foreground" to="/owner">Owner dashboard</Link></li>
            <li><Link className="hover:text-foreground text-muted-foreground" to="/owner/new">Submit a hostel</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</div>
          <p className="mt-3 text-sm text-muted-foreground">
            Built by{" "}
            <a href={CREATOR_URL} className="font-medium text-foreground underline-offset-2 hover:underline">
              {CREATOR_NAME}
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HostelHub. Made for UMaT students.
      </div>
    </footer>
  );
}

/* ================== HOME ================== */

export function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { hostels } = useHostels();
  const { value: hero } = useSiteSetting<HeroSetting>("hero", { image_url: null, dim: 0.4 });
  const { value: founder } = useSiteSetting<FounderSetting>("founder", {
    image_url: null,
    scale: 1,
    offset_x: 0,
    offset_y: 0,
  });
  const available = hostels.filter((h) => h.availability !== "full").slice(0, 6);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/hostels${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden">
        {hero.image_url && (
          <>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.image_url})` }}
              aria-hidden
            />
            <div
              className="absolute inset-0 z-0 bg-black"
              style={{ opacity: Math.max(0, Math.min(1, hero.dim ?? 0.4)) }}
              aria-hidden
            />
          </>
        )}
        {!hero.image_url && (
          <>
            <div className="absolute inset-0 z-0 hh-grain opacity-80" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
          </>
        )}

        {/* Floating doodles */}
        <DoodleStar className="absolute left-6 top-10 h-10 w-10 text-[var(--pop-sun)] hh-wiggle" />
        <DoodleHouse className="absolute right-8 top-16 h-16 w-16 text-primary hh-bob" />
        <DoodleSquiggle className="absolute left-10 bottom-6 h-6 w-32 text-[var(--pop-coral)]" />
        <DoodleKey className="absolute right-12 bottom-10 h-12 w-12 text-[var(--pop-mint)] hh-wiggle" />
        <DoodleCircle className="absolute left-1/2 top-24 hidden h-40 w-40 -translate-x-1/2 text-primary/15 md:block hh-spin-slow" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center hh-pop">
            <span className="hh-chip mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              UMaT student housing
            </span>
            <h1 className={`text-4xl font-bold tracking-tight md:text-6xl ${hero.image_url ? "text-white drop-shadow-lg" : ""}`}>
              Your hostel,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">sorted.</span>
                <DoodleSquiggle className="absolute -bottom-3 left-0 z-0 h-4 w-full text-primary" />
              </span>
            </h1>
            <p className={`mx-auto mt-5 max-w-lg text-base ${hero.image_url ? "text-white/85" : "text-muted-foreground"}`}>
              Browse verified hostels around campus. Compare. Connect.
            </p>
            <form onSubmit={onSearch} className="mt-8 flex w-full items-center gap-2 rounded-full border border-border bg-card p-2 shadow-lg shadow-primary/5">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, area, or amenity…"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button type="submit" className="rounded-full px-5">Search</Button>
            </form>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              {["Tarkwa", "Brahabebome", "T-Polo", "Cyanide", "Akoon"].map((p, i) => (
                <Link
                  key={p}
                  to={`/hostels?q=${encodeURIComponent(p)}`}
                  className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-muted-foreground backdrop-blur transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                  style={{ animation: `hh-pop-in .5s ${i * 80}ms both` }}
                >
                  #{p}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Available hostels"
        subtitle="Rooms open right now around campus."
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/hostels">See more</Link>
          </Button>
        }
      >
        <HostelGrid hostels={available} empty="No hostels listed yet — be the first." />
      </Section>

      <FounderSection founder={founder} />


      <section className="relative overflow-hidden border-t border-border bg-secondary/40">
        <DoodleArrow className="absolute right-10 top-6 hidden h-16 w-28 text-primary/60 md:block" />
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 md:px-6">
          <div className="rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Join the community</h2>
            <p className="mt-2 text-sm text-muted-foreground">New listings & campus updates in your inbox.</p>
            <Button asChild className="mt-5 rounded-full"><Link to="/community">Join now</Link></Button>
          </div>
          <div className="rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--pop-coral)]/20 text-[var(--pop-coral)]">
              <Send className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Need help?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tell us your budget — we'll match you.</p>
            <Button asChild variant="outline" className="mt-5 rounded-full"><Link to="/requests/new">Submit a request</Link></Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}


function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

function FounderSection({ founder }: { founder: FounderSetting }) {
  const scale = founder.scale ?? 1;
  const ox = founder.offset_x ?? 0;
  const oy = founder.offset_y ?? 0;
  return (
    <section className="relative border-t border-border bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-[var(--pop-coral)]/25 to-[var(--pop-mint)]/25 blur-3xl animate-pulse" />
          <div className="hh-founder-ring rounded-[2rem] p-[3px] shadow-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] bg-secondary">
              {founder.image_url ? (
                <img
                  src={founder.image_url}
                  alt="Adabah Michael Junior — founder of HostelHub"
                  className="h-full w-full object-cover select-none transition-transform duration-700 hover:scale-[1.04]"
                  style={{ transform: `translate(${ox}%, ${oy}%) scale(${scale})`, transformOrigin: "center" }}
                  draggable={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                  Founder photo coming soon.
                </div>
              )}
            </div>
          </div>
          <span className="pointer-events-none absolute -top-3 -right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg animate-bounce">
            <DoodleStar className="h-5 w-5" />
          </span>
          <span className="pointer-events-none absolute -bottom-4 -left-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pop-coral)] text-white shadow-lg animate-[tc-float_4s_ease-in-out_infinite]">
            <DoodleKey className="h-4 w-4" />
          </span>
        </div>
        <div>
          <span className="hh-chip mb-4"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Meet the founder</span>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Adabah Michael Junior</h2>
          <p className="mt-2 text-sm font-medium text-primary">Student · UMaT · Builder of HostelHub</p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            As a student of the University of Mines and Technology (UMaT), Michael felt firsthand how
            stressful and confusing hostel hunting can be — endless walks under the sun, unclear
            prices, and no easy way to compare what's actually available. So he built HostelHub: a
            simple, student-first platform to find, compare and connect with verified hostels around
            campus in minutes.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Made by a student, for students — so no one else has to figure it out the hard way.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full"><Link to="/about">Our story</Link></Button>
            <Button asChild variant="outline" className="rounded-full"><Link to="/community">Join the community</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================== HOSTEL CARD / GRID ================== */

function HostelGrid({ hostels, empty }: { hostels: Hostel[]; empty?: string }) {
  if (!hostels.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-sm text-muted-foreground">
        {empty ?? "Nothing here yet."}
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {hostels.map((h) => (
        <HostelCard key={h.id} hostel={h} />
      ))}
    </div>
  );
}

function HostelCard({ hostel }: { hostel: Hostel }) {
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const isFav = ids.includes(hostel.id);
  return (
    <Link to={`/hostels/${hostel.id}`} className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {hostel.cover_image ? (
          <img src={hostel.cover_image} alt={hostel.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {hostel.is_verified && (
            <Badge className="gap-1 bg-primary/90"><ShieldCheck className="h-3 w-3" /> Verified</Badge>
          )}
          <AvailabilityBadge value={hostel.availability} />
        </div>
        {user && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(hostel.id);
            }}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
            aria-label="Save"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-base font-semibold leading-tight tracking-tight md:text-lg ${!user ? "select-none blur-[5px]" : ""}`}>
            {user ? hostel.name : "Hostel name hidden"}
          </h3>
          <div className={`shrink-0 text-sm font-medium ${!user ? "select-none blur-[5px]" : ""}`}>
            {user
              ? (hostel.price_min ? `GH₵${hostel.price_min}${hostel.price_max ? `–${hostel.price_max}` : ""}` : "—")
              : "GH₵••••"}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {hostel.location ?? "Location not set"}
          {hostel.distance_km != null && <span> · {hostel.distance_km} km from campus</span>}
        </div>
        {!user && (
          <div className="mt-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs text-primary">
            🔒 <span className="font-semibold underline underline-offset-2">Sign in</span> to view name & price
          </div>
        )}
      </div>
    </Link>
  );
}

function AvailabilityBadge({ value }: { value: Hostel["availability"] }) {
  const map = {
    available: { label: "Available", className: "bg-green-600" },
    limited: { label: "Limited", className: "bg-amber-500" },
    full: { label: "Full", className: "bg-muted-foreground" },
  } as const;
  const v = map[value] ?? map.available;
  return <Badge className={v.className}>{v.label}</Badge>;
}

/* ================== HOSTELS LIST ================== */

export function HostelsPage() {
  const params = new URLSearchParams(useLocation().search);
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [maxDistance, setMaxDistance] = useState<number | "">("");
  const [availability, setAvailability] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [amenity, setAmenity] = useState<string>("");
  const [open, setOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      maxPrice: maxPrice === "" ? undefined : Number(maxPrice),
      maxDistance: maxDistance === "" ? undefined : Number(maxDistance),
      availability: availability || undefined,
      verifiedOnly: verifiedOnly || undefined,
      amenity: amenity || undefined,
    }),
    [search, maxPrice, maxDistance, availability, verifiedOnly, amenity],
  );
  const { hostels, loading } = useHostels(filters);

  const activeCount = [maxPrice !== "", maxDistance !== "", availability !== "", amenity !== "", verifiedOnly].filter(Boolean).length;

  const reset = () => {
    setMaxPrice(""); setMaxDistance(""); setAvailability(""); setAmenity(""); setVerifiedOnly(false);
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Hostels near UMaT</h1>
        <p className="mt-1 text-sm text-muted-foreground">{hostels.length} result{hostels.length === 1 ? "" : "s"}</p>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or area" className="w-full bg-transparent py-2 text-sm outline-none" />
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="relative group gap-2 transition-transform hover:scale-[1.03] active:scale-95"
          >
            <SlidersHorizontal className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 text-xs font-semibold text-primary animate-scale-in">
                {activeCount}
              </span>
            )}
          </Button>

          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset}>Clear all</Button>
          )}
        </div>

        <FiltersModal
          open={open}
          onClose={() => setOpen(false)}
          state={{ maxPrice, maxDistance, availability, amenity, verifiedOnly }}
          onSave={(s) => {
            setMaxPrice(s.maxPrice);
            setMaxDistance(s.maxDistance);
            setAvailability(s.availability);
            setAmenity(s.amenity);
            setVerifiedOnly(s.verifiedOnly);
            setOpen(false);
          }}
          onReset={reset}
        />

        <div className="mt-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><RingLoader /></div>
          ) : (
            <HostelGrid hostels={hostels} empty="No hostels match these filters yet." />
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

type FilterState = {
  maxPrice: number | "";
  maxDistance: number | "";
  availability: string;
  amenity: string;
  verifiedOnly: boolean;
};

function FiltersModal({
  open,
  onClose,
  state,
  onSave,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  state: FilterState;
  onSave: (s: FilterState) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState<FilterState>(state);
  useEffect(() => {
    if (open) setDraft(state);
  }, [open, state]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const priceVal = draft.maxPrice === "" ? 20000 : Number(draft.maxPrice);
  const distVal = draft.maxDistance === "" ? 10 : Number(draft.maxDistance);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-border bg-card p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filter hostels</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Price slider */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Max price (per year)</Label>
              <span className="text-sm font-semibold text-primary">
                {draft.maxPrice === "" ? "Any" : `≤ GH₵${priceVal.toLocaleString()}`}
              </span>
            </div>
            <Slider
              value={[priceVal]}
              min={200}
              max={20000}
              step={100}
              onValueChange={(v) => setDraft({ ...draft, maxPrice: v[0] >= 20000 ? "" : v[0] })}
              className="mt-3"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>GH₵200</span>
              <span>GH₵20,000+</span>
            </div>
          </div>

          {/* Distance slider */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Max distance from UMaT</Label>
              <span className="text-sm font-semibold text-primary">
                {draft.maxDistance === "" ? "Any" : `≤ ${distVal} km`}
              </span>
            </div>
            <Slider
              value={[distVal]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={(v) => setDraft({ ...draft, maxDistance: v[0] >= 10 ? "" : v[0] })}
              className="mt-3"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0.5 km</span>
              <span>10 km+</span>
            </div>
          </div>

          {/* Availability chips */}
          <div>
            <Label className="text-sm font-medium">Availability</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { v: "", l: "Any" },
                { v: "available", l: "Available" },
                { v: "limited", l: "Limited" },
                { v: "full", l: "Full" },
              ].map((o) => (
                <button
                  key={o.l}
                  type="button"
                  onClick={() => setDraft({ ...draft, availability: o.v })}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    draft.availability === o.v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {/* Amenity chips */}
          <div>
            <Label className="text-sm font-medium">Amenity</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["", "WiFi", "Water", "Generator", "Security", "Kitchen", "Furnished", "Parking"].map((a) => (
                <button
                  key={a || "any"}
                  type="button"
                  onClick={() => setDraft({ ...draft, amenity: a })}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    draft.amenity === a
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  {a || "Any"}
                </button>
              ))}
            </div>
          </div>

          {/* Verified */}
          <label className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
            <div>
              <div className="text-sm font-medium">Verified only</div>
              <div className="text-xs text-muted-foreground">Show hostels confirmed by HostelHub</div>
            </div>
            <Switch
              checked={draft.verifiedOnly}
              onCheckedChange={(c) => setDraft({ ...draft, verifiedOnly: c })}
            />
          </label>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setDraft({ maxPrice: "", maxDistance: "", availability: "", amenity: "", verifiedOnly: false });
              onReset();
            }}
          >
            Reset
          </Button>
          <Button className="flex-1" onClick={() => onSave(draft)}>
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================== HOSTEL DETAIL ================== */

type RoomChoice = { name: string; price?: number };

function RoomPicker({ hostel, children }: { hostel: any; children: (room: RoomChoice | null) => React.ReactNode }) {
  const options: RoomChoice[] = hostel.room_options?.length
    ? hostel.room_options.map((r: any) => ({ name: r.name, price: r.price }))
    : (hostel.room_types ?? []).map((n: string) => ({ name: n }));
  const [idx, setIdx] = useState<string>("none");
  const selected = idx === "none" ? null : options[Number(idx)] ?? null;

  return (
    <div className="space-y-3">
      {options.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground">Room you're interested in</Label>
          <Select value={idx} onValueChange={setIdx}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a room" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not sure yet</SelectItem>
              {options.map((o, i) => (
                <SelectItem key={i} value={String(i)}>
                  {o.name}{o.price ? ` — GH₵${o.price.toLocaleString()}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {children(selected)}
    </div>
  );
}


export function HostelDetailPage() {
  const { id } = useParams();
  const { hostel, loading } = useHostel(id);
  const { reviews, refetch: refetchReviews } = useReviews(id);
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const avg = avgRating(reviews);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (loading) {
    return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><RingLoader /></div></PublicLayout>;
  }
  if (!hostel) {
    return <PublicLayout><div className="mx-auto max-w-3xl px-6 py-24 text-center text-muted-foreground">Hostel not found.</div></PublicLayout>;
  }

  const gallery = hostel.gallery ?? [];
  const isFav = ids.includes(hostel.id);
  const allImages = [hostel.cover_image, ...gallery].filter(Boolean) as string[];
  const openLightbox = (src: string) => {
    const i = allImages.indexOf(src);
    setLightboxIdx(i >= 0 ? i : 0);
  };


  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => hostel.cover_image && openLightbox(hostel.cover_image)}
            className="group md:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-secondary text-left"
            aria-label="View full image"
          >
            {hostel.cover_image ? (
              <img src={hostel.cover_image} alt={hostel.name} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No cover image</div>
            )}
          </button>
          <div className="grid grid-cols-2 gap-3">
            {gallery.slice(0, 4).map((src, i) => (
              <button
                type="button"
                key={i}
                onClick={() => openLightbox(src)}
                className="aspect-square overflow-hidden rounded-xl bg-secondary"
                aria-label="View full image"
              >
                <img src={src} alt="" className="h-full w-full object-cover transition hover:scale-[1.03]" />
              </button>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-2 flex aspect-[2/1] items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                No gallery photos
              </div>
            )}
          </div>
        </div>

        {lightboxIdx !== null && allImages[lightboxIdx] && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length)); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                  aria-label="Previous"
                >‹</button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i === null ? 0 : (i + 1) % allImages.length)); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                  aria-label="Next"
                >›</button>
              </>
            )}
            <img
              src={allImages[lightboxIdx]}
              alt={hostel.name}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr,320px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {hostel.is_verified && <Badge className="gap-1"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
              <AvailabilityBadge value={hostel.availability} />
              <Badge variant="outline" className="gap-1"><Users2 className="h-3 w-3" /> {GENDER_LABEL[hostel.gender_policy ?? "mixed"]}</Badge>
              {avg > 0 && (
                <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}</Badge>
              )}
            </div>
            <h1 className={`mt-3 text-3xl font-semibold tracking-tight ${!user ? "select-none blur-[6px]" : ""}`}>{user ? hostel.name : "Hostel name hidden — sign in to view"}</h1>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {hostel.location ?? "Location not set"}
              {hostel.distance_km != null && <span> · {hostel.distance_km} km from campus</span>}
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-foreground/90">{hostel.description ?? "No description provided."}</p>

            {hostel.room_options?.length ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold">Rooms & prices</h3>
                <div className="mt-2 divide-y divide-border rounded-lg border border-border">
                  {hostel.room_options.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-muted-foreground">GH₵{r.price.toLocaleString()} <span className="text-xs">{PERIOD_LABEL[r.period]}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ) : hostel.room_types?.length ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold">Room types</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hostel.room_types.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
                </div>
              </div>
            ) : null}

            {hostel.amenities?.length ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold">Amenities</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hostel.amenities.map((a) => <Badge key={a} variant="outline">{a}</Badge>)}
                </div>
              </div>
            ) : null}

            
          </div>

          <aside className="space-y-4 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-5 h-fit shadow-sm">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Starting from</div>
              <div className={`mt-1 text-3xl font-semibold tracking-tight ${!user ? "select-none blur-[6px]" : ""}`}>
                {user ? (
                  hostel.price_min ? (
                    <>GH₵{hostel.price_min.toLocaleString()}{hostel.price_max ? <span className="text-muted-foreground text-xl"> – {hostel.price_max.toLocaleString()}</span> : null}</>
                  ) : (
                    <span className="text-xl">Contact for price</span>
                  )
                ) : (
                  <span>GH₵••••</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">per academic year</div>
            </div>

            {!user ? (
              <div className="space-y-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
                <div className="text-sm font-semibold">🔒 Full details are for members</div>
                <p className="text-xs text-muted-foreground">Sign in to view the hostel name, prices and owner contact details.</p>
                <Link to="/auth" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                  Sign in to view
                </Link>
                <Link to="/auth" className="block text-xs text-muted-foreground underline-offset-2 hover:underline">
                  New here? Create a free account
                </Link>
              </div>
            ) : (
              <RoomPicker hostel={hostel}>
                {(selectedRoom) => {
                  const baseMsg = `Hi! I'm interested in *${hostel.name}*${hostel.location ? ` (${hostel.location})` : ""}.${selectedRoom ? ` I'd like to book the *${selectedRoom.name}* room${selectedRoom.price ? ` at GH₵${selectedRoom.price.toLocaleString()}` : ""}.` : ""} Could you share availability and next steps?\n\n— Sent via HostelHub by Adabah`;
                  const waUrl = hostel.whatsapp ? `https://wa.me/${hostel.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(baseMsg)}` : null;
                  return (
                    <div className="space-y-2">
                      {waUrl && (
                        <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[color:var(--whatsapp)] px-4 py-3 text-sm font-medium text-[color:var(--whatsapp-foreground)] shadow-sm transition hover:opacity-90">
                          <MessageSquare className="h-4 w-4" /> Message on WhatsApp
                        </a>
                      )}
                      {hostel.contact_phone && (
                        <a href={`tel:${hostel.contact_phone}`} className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-secondary">
                          <Phone className="h-4 w-4" /> Call {hostel.contact_phone}
                        </a>
                      )}
                      {hostel.contact_email && (
                        <a href={`mailto:${hostel.contact_email}?subject=${encodeURIComponent(`Enquiry about ${hostel.name}`)}&body=${encodeURIComponent(baseMsg)}`} className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-secondary">
                          <Mail className="h-4 w-4" /> Send email
                        </a>
                      )}
                    </div>
                  );
                }}
              </RoomPicker>
            )}

            {user && (
              <Button variant="outline" className="w-full" onClick={() => toggle(hostel.id)}>
                <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                {isFav ? "Saved to favorites" : "Save to favorites"}
              </Button>
            )}

            <div className="rounded-lg border border-dashed border-border bg-background/50 p-3 text-xs text-muted-foreground">
              Tip: mention you found this hostel on <span className="font-medium text-foreground">HostelHub by Adabah</span> for faster help.
            </div>

            <Link to="/feedback" className="block text-center text-xs text-muted-foreground underline-offset-2 hover:underline">
              Report inaccurate information
            </Link>
          </aside>
        </div>

        <div className="mt-10">
          <ReviewsSection hostelId={hostel.id} reviews={reviews} onPosted={refetchReviews} />
        </div>
      </div>
    </PublicLayout>
  );
}

function ReviewsSection({ hostelId, reviews, onPosted }: { hostelId: string; reviews: ReturnType<typeof useReviews>["reviews"]; onPosted: () => void }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [cleanliness, setCleanliness] = useState(5);
  const [security, setSecurity] = useState(5);
  const [water, setWater] = useState(5);
  const [noise, setNoise] = useState(5);
  const [internet, setInternet] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      hostel_id: hostelId, user_id: user.id, rating, comment: comment.trim() || null,
      cleanliness, security, water, noise, internet,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Review posted");
      setComment("");
      onPosted();
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold">Reviews</h3>
      <div className="mt-4 space-y-4">
        {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {r.cleanliness != null && <span>Cleanliness {r.cleanliness}/5</span>}
              {r.security != null && <span>Security {r.security}/5</span>}
              {r.water != null && <span>Water {r.water}/5</span>}
              {r.noise != null && <span>Noise {r.noise}/5</span>}
              {r.internet != null && <span>Internet {r.internet}/5</span>}
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={submit} className="mt-6 rounded-xl border border-border bg-card p-5">
          <h4 className="font-semibold">Write a review</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <RatingPicker label="Overall" value={rating} onChange={setRating} />
            <RatingPicker label="Cleanliness" value={cleanliness} onChange={setCleanliness} />
            <RatingPicker label="Security" value={security} onChange={setSecurity} />
            <RatingPicker label="Water" value={water} onChange={setWater} />
            <RatingPicker label="Noise" value={noise} onChange={setNoise} />
            <RatingPicker label="Internet" value={internet} onChange={setInternet} />
          </div>
          <div className="mt-4">
            <Label className="text-xs">Comment</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." maxLength={1000} />
          </div>
          <Button type="submit" disabled={submitting} className="mt-4"><Send className="mr-2 h-4 w-4" /> Post review</Button>
        </form>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          <Link to="/auth" className="underline">Sign in</Link> to leave a review.
        </div>
      )}
    </div>
  );
}

function RatingPicker({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button" onClick={() => onChange(i + 1)}>
            <Star className={`h-6 w-6 ${i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================== AUTH ================== */

export function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (session) navigate(from, { replace: true });
  }, [session, from, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error("Authentication is not configured.");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      if (!phone.trim()) {
        setLoading(false);
        toast.error("Phone number is required.");
        return;
      }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name, phone } },
      });
      setLoading(false);
      if (error) toast.error(error.message);
      else toast.success("Account created — welcome to HostelHub!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) toast.error(error.message);
    }
  };

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">
        {/* Playful background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl tc-float-slow" />
          <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-[color:var(--pop-sun)]/30 blur-3xl tc-float" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[color:var(--pop-mint)]/40 blur-3xl" />
          <div className="absolute inset-0 hh-grain opacity-60" />
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:gap-16 md:px-6 md:py-16">
          {/* Left: hype side */}
          <div className="hidden md:block">
            <span className="hh-chip">
              <DoodleStar className="h-3.5 w-3.5" /> For UMaT students
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              {mode === "signin" ? (
                <>Welcome <span className="text-primary">back</span>.<br/>Find your spot.</>
              ) : (
                <>Join the <span className="text-primary">HostelHub</span> crew.</>
              )}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              {mode === "signin"
                ? "Pick up where you left off — your saved hostels, requests and reviews are waiting."
                : "Create a free account to save favorites, message owners on WhatsApp and post real reviews."}
            </p>

            <ul className="mt-8 space-y-3 text-base">
              <li className="flex items-start gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary"><ShieldCheck className="h-4 w-4" /></span> Verified hostels with real prices</li>
              <li className="flex items-start gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--pop-coral)]/20 text-[color:var(--pop-coral)]"><Heart className="h-4 w-4" /></span> Save favorites in one tap</li>
              <li className="flex items-start gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--pop-sun)]/30 text-foreground"><MessageSquare className="h-4 w-4" /></span> Chat owners directly on WhatsApp</li>
            </ul>

            <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
              <DoodleSquiggle className="h-5 w-16 text-primary hh-wiggle" />
              <span>Free forever for students.</span>
            </div>
          </div>

          {/* Right: form card */}
          <div className="relative">
            <DoodleStar className="absolute -left-3 -top-3 h-8 w-8 text-[color:var(--pop-sun)] hh-spin-slow" />
            <DoodleKey className="absolute -right-2 top-10 h-9 w-9 text-primary hh-bob hidden md:block" />

            <div className="rounded-[2rem] border border-border bg-card/90 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] backdrop-blur md:p-9">
              <div className="flex items-center gap-3">
                <BrandLogo className="h-10 w-10" />
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">HostelHub</div>
                  <div className="text-sm font-medium">By Adabah</div>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="mt-6 grid grid-cols-2 rounded-full bg-secondary p-1 text-sm font-medium">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`rounded-full px-4 py-2 transition-all ${
                      mode === m
                        ? "bg-background text-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              <h2 className="mt-7 text-3xl font-bold tracking-tight md:text-4xl">
                {mode === "signin" ? "Hey, welcome 👋" : "Let's get you in 🎉"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in with your email & password."
                  : "It takes less than a minute."}
              </p>

              <form onSubmit={submit} className="mt-7 space-y-5">
                {mode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={80}
                        placeholder="e.g. Ama Boateng"
                        className="h-12 rounded-xl border-border bg-background text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        type="tel"
                        maxLength={20}
                        placeholder="+233..."
                        className="h-12 rounded-xl border-border bg-background text-base"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@umat.edu.gh"
                    className="h-12 rounded-xl border-border bg-background text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="h-12 rounded-xl border-border bg-background text-base"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl text-base font-semibold shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)]"
                >
                  {loading ? (
                    <DotLoader />
                  ) : mode === "signin" ? (
                    <>Sign in <DoodleArrow className="ml-1 h-4 w-6" /></>
                  ) : (
                    <>Create my account <DoodleArrow className="ml-1 h-4 w-6" /></>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signin" ? (
                  <>New here?{" "}
                    <button onClick={() => setMode("signup")} className="font-semibold text-primary underline-offset-4 hover:underline">
                      Create an account
                    </button>
                  </>
                ) : (
                  <>Already on HostelHub?{" "}
                    <button onClick={() => setMode("signin")} className="font-semibold text-primary underline-offset-4 hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground md:text-left">
              By continuing you agree to our friendly terms — be kind, be honest.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================== FAVORITES ================== */

export function FavoritesPage() {
  const { ids, loading } = useFavorites();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!supabase || ids.length === 0) {
      setHostels([]);
      return;
    }
    setFetching(true);
    supabase.from("hostels").select("*").in("id", ids).then(({ data }) => {
      setHostels((data as Hostel[]) ?? []);
      setFetching(false);
    });
  }, [ids]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Your favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">Hostels you've saved.</p>
        <div className="mt-8">
          {loading || fetching ? <RingLoader /> : <HostelGrid hostels={hostels} empty="You haven't saved any hostels yet." />}
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================== ACCOMMODATION REQUESTS ================== */

export function NewRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<number | "">("");
  const [area, setArea] = useState("");
  const [roomType, setRoomType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/auth" state={{ from: "/requests/new" }} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("accommodation_requests").insert({
      user_id: user.id,
      budget_max: budget === "" ? null : Number(budget),
      preferred_area: area || null,
      room_type: roomType || null,
      notes: notes || null,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Request submitted");
      navigate("/requests");
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Submit an accommodation request</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tell us what you're looking for and we'll try to match you.</p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
          <div><Label>Max budget (GH₵)</Label><Input type="number" value={budget} onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))} /></div>
          <div><Label>Preferred area</Label><Input value={area} onChange={(e) => setArea(e.target.value)} maxLength={120} placeholder="e.g. Brahabebome" /></div>
          <div>
            <Label>Room type</Label>
            <Select value={roomType || "any"} onValueChange={(v) => setRoomType(v === "any" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Shared">Shared</SelectItem>
                <SelectItem value="Self-contained">Self-contained</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} /></div>
          <Button type="submit" disabled={loading}>Submit request</Button>
        </form>
      </div>
    </PublicLayout>
  );
}

export function MyRequestsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase.from("accommodation_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, [user]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Your requests</h1>
          <Button asChild><Link to="/requests/new"><PlusCircle className="mr-1 h-4 w-4" /> New request</Link></Button>
        </div>
        <div className="mt-8 space-y-3">
          {loading && <RingLoader />}
          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No requests yet.</div>
          )}
          {items.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">{r.preferred_area ?? "Any area"} · {r.room_type ?? "Any room"}</div>
                <Badge variant="secondary">{r.status}</Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Budget: {r.budget_max ? `GH₵${r.budget_max}` : "—"}</div>
              {r.notes && <p className="mt-2 text-sm">{r.notes}</p>}
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================== COMMUNITY / FEEDBACK / ABOUT ================== */

export function CommunityPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("community_signups").insert({ name, email, phone: phone || null });
    setLoading(false);
    if (error) toast.error(error.message);
    else setDone(true);
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Join the student community</h1>
        <p className="mt-2 text-muted-foreground">
          Receive updates about new hostel listings, accommodation opportunities, student opportunities, campus announcements, and events. Participation is completely optional.
        </p>
        {done ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
            <p className="mt-3 font-semibold">You're in!</p>
            <p className="text-sm text-muted-foreground">We'll be in touch with the latest updates.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
            <div><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></div>
            <div><Label>Email</Label><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} /></div>
            <div><Label>Phone (optional)</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} /></div>
            <Button type="submit" disabled={loading}>Sign me up</Button>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}

export function FeedbackPage() {
  const { user } = useAuth();
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({ user_id: user?.id ?? null, type, message });
    setLoading(false);
    if (error) toast.error(error.message);
    else setDone(true);
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Send feedback</h1>
        <p className="mt-2 text-muted-foreground">
          Suggest improvements, report incorrect information, or recommend a hostel for addition.
        </p>
        {done ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
            <p className="mt-3 font-semibold">Thanks for the feedback!</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="report">Report a problem</SelectItem>
                  <SelectItem value="recommendation">Recommend a hostel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Message</Label><Textarea required value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} /></div>
            <Button type="submit" disabled={loading}>Submit</Button>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">About HostelHub</h1>
        <p className="mt-4 text-muted-foreground leading-7">
          This platform was created by{" "}
          <a href={CREATOR_URL} className="font-medium text-foreground underline-offset-2 hover:underline">{CREATOR_NAME}</a>{" "}
          to help students easily find accommodation around UMaT. It centralizes verified hostel listings so students can compare, save, and contact managers directly — and it gives owners a simple way to advertise available spaces.
        </p>
        <h2 className="mt-10 text-xl font-semibold">For students</h2>
        <p className="mt-2 text-muted-foreground">Browse without signing up. Create a free account to save favorites, write reviews, and submit accommodation requests.</p>
        <h2 className="mt-6 text-xl font-semibold">For hostel owners</h2>
        <p className="mt-2 text-muted-foreground">Register, submit your hostel, upload photos, and manage availability. Listings are verified for trust before being promoted.</p>
      </div>
    </PublicLayout>
  );
}

/* ================== OWNER ================== */

const ownerNav = [
  { to: "/owner", label: "My hostels", icon: Building2 },
  { to: "/owner/new", label: "New hostel", icon: PlusCircle },
];

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/owners", label: "Owner applications", icon: ClipboardCheck },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/hostels", label: "Hostels", icon: Building2 },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/requests", label: "Requests", icon: ListChecks },
  { to: "/admin/community", label: "Community", icon: Users },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/admin/appearance", label: "Appearance", icon: ImageIcon },
  { to: "/admin/waitlist", label: "Waitlist", icon: ClipboardCheck },
];


function DashboardShell({ items, title, children }: { items: typeof ownerNav; title: string; children: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 space-y-2 px-3">
      {items.map((i) => {
        const Icon = i.icon;
        return (
          <NavLink
            key={i.to}
            to={i.to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" /> {i.label}
          </NavLink>
        );
      })}
    </nav>
  );

  const SidebarBody = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="px-6 py-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold" onClick={onNavigate}>
          <BrandLogo className="h-9 w-9" />
          HostelHub
        </Link>
        <div className="mt-1 text-sm text-muted-foreground">{title}</div>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <span className="truncate">{user?.email ?? "Sign out"}</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <SidebarBody />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="h-11 w-11 rounded-full border-primary/40 bg-primary/10 text-primary shadow-sm hh-burger-attn" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col bg-sidebar p-0">
              <SheetHeader className="sr-only"><SheetTitle>{title}</SheetTitle></SheetHeader>
              <SidebarBody onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2 font-semibold"><BrandLogo className="h-7 w-7" /> HostelHub</Link>
          <Button size="icon" variant="ghost" onClick={async () => { await signOut(); navigate("/"); }} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}


export function OwnerLayout() {
  const { user, loading } = useAuth();
  const { isOwner, loading: loadingRoles, refetch } = useRoles();

  if (loading || loadingRoles) return <div className="flex min-h-screen items-center justify-center"><RingLoader /></div>;
  if (!user) return <Navigate to="/auth" state={{ from: "/owner" }} replace />;
  if (!isOwner) return <BecomeOwnerGate onDone={refetch} />;

  return <DashboardShell items={ownerNav} title="Owner dashboard"><Outlet /></DashboardShell>;
}

function BecomeOwnerGate({ onDone: _onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { application, loading, refetch } = useMyOwnerApplication();
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && !fullName) setFullName(profile.full_name ?? "");
    if (profile && !whatsapp) setWhatsapp(profile.whatsapp ?? profile.phone ?? "");
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const cleaned = whatsapp.trim();
    if (!/^\+?\d[\d\s-]{6,18}$/.test(cleaned)) {
      toast.error("Enter a valid WhatsApp number (with country code).");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    setSaving(true);
    const { error } = await submitOwnerApplication(user.id, {
      full_name: fullName.trim(),
      whatsapp: cleaned,
      business_name: business.trim(),
      message: message.trim(),
    });
    setSaving(false);
    if (error) toast.error(error);
    else {
      toast.success("Application submitted — pending admin approval.");
      refetch();
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg px-4 py-12 md:px-6">
        {loading ? (
          <div className="flex justify-center py-16"><RingLoader /></div>
        ) : application ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <ClipboardCheck className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-3 text-2xl font-semibold">
              {application.status === "pending" && "Application under review"}
              {application.status === "approved" && "You're approved!"}
              {application.status === "rejected" && "Application not approved"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {application.status === "pending" &&
                "An admin will review your owner application shortly. You'll get access to the owner dashboard once approved."}
              {application.status === "approved" &&
                "Refresh the page to access your owner dashboard."}
              {application.status === "rejected" &&
                "Your application was not approved. Please contact support for more information."}
            </p>
            <div className="mt-4 rounded-md border border-border bg-secondary/40 p-3 text-left text-xs text-muted-foreground">
              <div><span className="font-medium text-foreground">Status:</span> {application.status}</div>
              <div><span className="font-medium text-foreground">WhatsApp:</span> {application.whatsapp}</div>
              {application.business_name && (
                <div><span className="font-medium text-foreground">Business:</span> {application.business_name}</div>
              )}
            </div>
            {application.status === "approved" && (
              <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
                Open owner dashboard
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-semibold">Become a hostel owner</h1>
                <p className="text-xs text-muted-foreground">Apply to list and manage hostels on HostelHub.</p>
              </div>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label>Full name</Label>
                <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} />
              </div>
              <div>
                <Label>WhatsApp number<span className="text-destructive"> *</span></Label>
                <Input
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={20}
                  placeholder="+233 24 000 0000"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Students will use this to contact you about your hostel.
                </p>
              </div>
              <div>
                <Label>Business / hostel name (optional)</Label>
                <Input value={business} onChange={(e) => setBusiness(e.target.value)} maxLength={120} />
              </div>
              <div>
                <Label>Message to admin (optional)</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} placeholder="Anything we should know?" />
              </div>
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
                Owner accounts require admin approval. You'll get access to the owner dashboard once approved.
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}


export function OwnerHostelsPage() {
  const { hostels, loading, refetch } = useMyHostels();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My hostels</h1>
          <p className="text-sm text-muted-foreground">Manage your listings, photos, and availability.</p>
        </div>
        <Button asChild><Link to="/owner/new"><PlusCircle className="mr-1 h-4 w-4" /> New</Link></Button>
      </div>
      <div className="mt-6 space-y-3">
        {loading && <RingLoader />}
        {!loading && hostels.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            You haven't submitted any hostels yet.
          </div>
        )}
        {hostels.map((h) => (
          <Card key={h.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-md bg-secondary">
                  {h.cover_image && <img src={h.cover_image} className="h-full w-full object-cover" alt="" />}
                </div>
                <div>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{h.location ?? "—"} · {h.is_published ? "Published" : "Draft"} {h.is_verified && "· Verified"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={h.availability}
                  onValueChange={async (v) => {
                    if (!supabase) return;
                    await supabase.from("hostels").update({ availability: v }).eq("id", h.id);
                    refetch();
                  }}
                >
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
                <Button asChild size="sm" variant="outline"><Link to={`/owner/${h.id}/edit`}>Edit</Link></Button>
                <Button asChild size="sm" variant="ghost"><Link to={`/hostels/${h.id}`}>View</Link></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const GENDER_LABEL: Record<"boys" | "girls" | "mixed", string> = {
  boys: "Boys only",
  girls: "Girls only",
  mixed: "Mixed",
};

const PERIOD_LABEL: Record<RoomOption["period"], string> = {
  year: "/ year",
  semester: "/ semester",
  month: "/ month",
};

function PhotoUploader({
  userId,
  value,
  onChange,
  multiple = false,
  label,
}: {
  userId: string;
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length || !supabase) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("hostel-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) {
        toast.error(error.message);
        continue;
      }
      const { data } = supabase.storage.from("hostel-photos").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setUploading(false);
    onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1));
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-secondary">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 text-foreground shadow-sm hover:bg-background"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Add photo"}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">JPG/PNG, up to 5MB each.</p>
    </div>
  );
}

function RoomOptionsEditor({
  value,
  onChange,
}: {
  value: RoomOption[];
  onChange: (next: RoomOption[]) => void;
}) {
  const update = (i: number, patch: Partial<RoomOption>) =>
    onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { name: "", price: 0, period: "year" }]);

  return (
    <div>
      <Label>Room options & prices</Label>
      <div className="mt-2 space-y-2">
        {value.length === 0 && (
          <p className="text-xs text-muted-foreground">Add at least one room type, e.g. “1-in-a-room” for GH₵1000 / year.</p>
        )}
        {value.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr,110px,130px,auto] gap-2">
            <Input
              placeholder="e.g. 1-in-a-room"
              value={r.name}
              onChange={(e) => update(i, { name: e.target.value })}
              maxLength={60}
            />
            <Input
              type="number"
              min={0}
              placeholder="Price"
              value={r.price === 0 ? "" : r.price}
              onChange={(e) => update(i, { price: Number(e.target.value) || 0 })}
            />
            <Select value={r.period} onValueChange={(v) => update(i, { period: v as RoomOption["period"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="year">per year</SelectItem>
                <SelectItem value="semester">per semester</SelectItem>
                <SelectItem value="month">per month</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add room option
        </Button>
      </div>
    </div>
  );
}

export function OwnerHostelFormPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", location: "", distance_km: "" as number | "",
    amenities: "",
    cover_image: "",
    gallery: [] as string[],
    contact_phone: "", contact_email: "", whatsapp: "",
    availability: "available",
    gender_policy: "mixed" as "boys" | "girls" | "mixed",
    room_options: [] as RoomOption[],
  });

  useEffect(() => {
    if (!editing || !supabase) return;
    supabase.from("hostels").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          location: data.location ?? "",
          distance_km: data.distance_km ?? "",
          amenities: (data.amenities ?? []).join(", "),
          cover_image: data.cover_image ?? "",
          gallery: data.gallery ?? [],
          contact_phone: data.contact_phone ?? "",
          contact_email: data.contact_email ?? "",
          whatsapp: data.whatsapp ?? "",
          availability: data.availability ?? "available",
          gender_policy: (data.gender_policy ?? "mixed") as "boys" | "girls" | "mixed",
          room_options: (data.room_options ?? []) as RoomOption[],
        });
      }
      setLoading(false);
    });
  }, [id, editing]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    if (form.room_options.length === 0) {
      toast.error("Add at least one room option with a price.");
      return;
    }
    if (form.room_options.some((r) => !r.name.trim() || r.price <= 0)) {
      toast.error("Every room option needs a name and a price greater than 0.");
      return;
    }
    setSaving(true);
    const prices = form.room_options.map((r) => r.price);
    const payload = {
      owner_id: user.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      distance_km: form.distance_km === "" ? null : Number(form.distance_km),
      price_min: Math.min(...prices),
      price_max: Math.max(...prices),
      room_types: form.room_options.map((r) => r.name.trim()),
      room_options: form.room_options,
      gender_policy: form.gender_policy,
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      cover_image: form.cover_image.trim() || null,
      gallery: form.gallery,
      contact_phone: form.contact_phone.trim() || null,
      contact_email: form.contact_email.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      availability: form.availability,
      is_published: true,
    };
    const { error } = editing
      ? await supabase.from("hostels").update(payload).eq("id", id!)
      : await supabase.from("hostels").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Hostel updated" : "Hostel published");
      navigate("/owner");
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><RingLoader /></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">{editing ? "Edit hostel" : "Add a new hostel"}</h1>
      <p className="text-sm text-muted-foreground">Your listing goes live immediately — your owner account is already verified.</p>
      <form onSubmit={submit} className="mt-6 grid max-w-3xl gap-5">
        <div><Label>Hostel name</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={120} /></div>
        <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={2000} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Location / area</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} maxLength={120} /></div>
          <div><Label>Distance from campus (km)</Label><Input type="number" step="0.1" value={form.distance_km} onChange={(e) => set("distance_km", e.target.value === "" ? "" : Number(e.target.value))} /></div>
        </div>

        <div>
          <Label>Hostel type</Label>
          <Select value={form.gender_policy} onValueChange={(v) => set("gender_policy", v as "boys" | "girls" | "mixed")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="boys">Boys only</SelectItem>
              <SelectItem value="girls">Girls only</SelectItem>
              <SelectItem value="mixed">Mixed (boys & girls)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <RoomOptionsEditor value={form.room_options} onChange={(v) => set("room_options", v)} />

        <div><Label>Amenities (comma separated)</Label><Input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="WiFi, Water, Generator, Security" /></div>

        {user && (
          <>
            <PhotoUploader
              userId={user.id}
              label="Cover photo"
              value={form.cover_image ? [form.cover_image] : []}
              onChange={(next) => set("cover_image", next[0] ?? "")}
            />
            <PhotoUploader
              userId={user.id}
              label="Gallery photos"
              value={form.gallery}
              onChange={(next) => set("gallery", next)}
              multiple
            />
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} maxLength={20} /></div>
          <div><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} maxLength={20} /></div>
          <div><Label>Email</Label><Input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} maxLength={255} /></div>
        </div>

        <div>
          <Label>Availability</Label>
          <Select value={form.availability} onValueChange={(v) => set("availability", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="limited">Limited</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Publish hostel"}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/owner")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}


/* ================== ADMIN ================== */

export function AdminLayout() {
  const { user, loading } = useAuth();
  const { isAdmin, loading: loadingRoles } = useRoles();
  if (loading || loadingRoles) return <div className="flex min-h-screen items-center justify-center"><RingLoader /></div>;
  if (!user) return <Navigate to="/auth" state={{ from: "/admin" }} replace />;
  if (!isAdmin) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-3 text-2xl font-semibold">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">You don't have admin access.</p>
        </div>
      </PublicLayout>
    );
  }
  return <DashboardShell items={adminNav} title="Admin"><Outlet /></DashboardShell>;
}

export function AdminIndexPage() {
  const [stats, setStats] = useState({ hostels: 0, users: 0, reviews: 0, signups: 0, requests: 0 });
  useEffect(() => {
    if (!supabase) return;
    const head = { count: "exact" as const, head: true };
    Promise.all([
      supabase.from("hostels").select("*", head),
      supabase.from("user_roles").select("*", head),
      supabase.from("reviews").select("*", head),
      supabase.from("community_signups").select("*", head),
      supabase.from("accommodation_requests").select("*", head),
    ]).then(([h, u, r, c, q]) => {
      setStats({ hostels: h.count ?? 0, users: u.count ?? 0, reviews: r.count ?? 0, signups: c.count ?? 0, requests: q.count ?? 0 });
    });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total hostels" value={stats.hostels} />
        <Stat label="Roles assigned" value={stats.users} />
        <Stat label="Reviews" value={stats.reviews} />
        <Stat label="Community signups" value={stats.signups} />
        <Stat label="Accommodation requests" value={stats.requests} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
    </Card>
  );
}

export function AdminHostelsPage() {
  const [items, setItems] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    if (!supabase) return;
    setLoading(true);
    supabase.from("hostels").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems((data as Hostel[]) ?? []);
      setLoading(false);
    });
  };
  useEffect(refetch, []);

  const update = async (id: string, patch: Partial<Hostel>) => {
    if (!supabase) return;
    await supabase.from("hostels").update(patch).eq("id", id);
    refetch();
  };
  const remove = async (id: string) => {
    if (!supabase) return;
    if (!confirm("Delete this hostel?")) return;
    await supabase.from("hostels").delete().eq("id", id);
    refetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">All hostels</h1>
      <div className="mt-6 space-y-3">
        {loading && <RingLoader />}
        {items.map((h) => (
          <Card key={h.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-md bg-secondary">
                  {h.cover_image && <img src={h.cover_image} className="h-full w-full object-cover" alt="" />}
                </div>
                <div>
                  <div className="font-medium">{h.name} {h.is_verified && <Badge className="ml-2">Verified</Badge>}</div>
                  <div className="text-xs text-muted-foreground">{h.location ?? "—"} · {h.is_published ? "Published" : "Draft"}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant={h.is_verified ? "secondary" : "default"} onClick={() => update(h.id, { is_verified: !h.is_verified })}>
                  {h.is_verified ? "Unverify" : "Verify"}
                </Button>
                <Button size="sm" variant={h.is_published ? "secondary" : "outline"} onClick={() => update(h.id, { is_published: !h.is_published })}>
                  {h.is_published ? "Unpublish" : "Publish"}
                </Button>
                <Button asChild size="sm" variant="ghost"><Link to={`/hostels/${h.id}`}>View</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(h.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminReviewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const refetch = () => {
    if (!supabase) return;
    supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  };
  useEffect(refetch, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 && <div className="text-sm text-muted-foreground">No reviews yet.</div>}
        {items.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm">Rating {r.rating}/5 · {new Date(r.created_at).toLocaleDateString()}</div>
              <div className="flex gap-2">
                <Button size="sm" variant={r.approved ? "secondary" : "default"} onClick={async () => { if (!supabase) return; await supabase.from("reviews").update({ approved: !r.approved }).eq("id", r.id); refetch(); }}>
                  {r.approved ? "Hide" : "Approve"}
                </Button>
                <Button size="sm" variant="ghost" onClick={async () => { if (!supabase) return; await supabase.from("reviews").delete().eq("id", r.id); refetch(); }}>Delete</Button>
              </div>
            </div>
            {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminRequestsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("accommodation_requests").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Accommodation requests</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 && <div className="text-sm text-muted-foreground">No requests yet.</div>}
        {items.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="font-medium">{r.preferred_area ?? "Any area"} · {r.room_type ?? "Any room"}</div>
            <div className="text-xs text-muted-foreground">Budget: {r.budget_max ? `GH₵${r.budget_max}` : "—"} · {new Date(r.created_at).toLocaleDateString()}</div>
            {r.notes && <p className="mt-2 text-sm">{r.notes}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminCommunityPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("community_signups").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Community signups</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Phone</th><th className="px-4 py-2 text-left">Joined</th></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone ?? "—"}</td>
                <td className="px-4 py-2">{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No signups yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminFeedbackPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("feedback").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Feedback</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 && <div className="text-sm text-muted-foreground">No feedback yet.</div>}
        {items.map((f) => (
          <Card key={f.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">{f.type ?? "feedback"}</Badge>
              <div className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</div>
            </div>
            <p className="mt-2 text-sm">{f.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminAppearancePage() {
  const { user } = useAuth();
  const { value: hero, refetch } = useSiteSetting<HeroSetting>("hero", { image_url: null, dim: 0.4 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dim, setDim] = useState(0.4);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setImageUrl(hero.image_url);
    setDim(hero.dim ?? 0.4);
  }, [hero.image_url, hero.dim]);

  const upload = async (file: File) => {
    if (!supabase || !user) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be smaller than 8MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `hero/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await setSiteSetting("hero", { image_url: imageUrl, dim });
    setSaving(false);
    if (error) toast.error(error);
    else {
      toast.success("Hero updated");
      refetch();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Appearance</h1>
      <p className="text-sm text-muted-foreground">Set a background image for the home page hero and tune the dim overlay.</p>

      <div className="mt-6 grid max-w-3xl gap-6">
        <div>
          <Label>Hero background image</Label>
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-secondary">
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="Hero preview" className="h-56 w-full object-cover" />
                <div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white drop-shadow">
                  Preview
                </div>
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">No hero image set — using default gradient.</div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : imageUrl ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = ""; }}
              />
            </label>
            {imageUrl && (
              <Button variant="ghost" size="sm" onClick={() => setImageUrl(null)}>
                <Trash2 className="mr-2 h-4 w-4" /> Remove image
              </Button>
            )}
          </div>
        </div>

        <div>
          <Label>Dim overlay ({Math.round(dim * 100)}%)</Label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={dim}
            onChange={(e) => setDim(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">Higher values darken the image for better text contrast.</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
        </div>
      </div>

      <FounderEditor />
      <LogoEditor />
    </div>
  );
}

function LogoEditor() {
  const { user } = useAuth();
  const { value: logo, refetch } = useSiteSetting<{ image_url: string | null }>("logo", { image_url: null });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setImageUrl(logo.image_url); }, [logo.image_url]);

  const upload = async (file: File) => {
    if (!supabase || !user) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Logo must be smaller than 4MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `logo/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await setSiteSetting("logo", { image_url: imageUrl });
    setSaving(false);
    if (error) toast.error(error);
    else {
      notifyLogoChanged(imageUrl);
      toast.success("Logo updated");
      refetch();
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-10">
      <h2 className="text-xl font-semibold">Site logo</h2>
      <p className="text-sm text-muted-foreground">
        Upload the HostelHub logo. Square PNG with transparent background works best. Appears in the header, footer, dashboards and welcome popup.
      </p>

      <div className="mt-6 grid max-w-2xl gap-6">
        <div className="flex items-center gap-6">
          <div className="grid h-28 w-28 place-items-center rounded-2xl border border-border bg-secondary">
            {imageUrl ? (
              <img src={imageUrl} alt="Logo preview" className="h-24 w-24 rounded-xl object-contain" />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">No custom logo — falling back to favicon.</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : imageUrl ? "Replace logo" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                disabled={uploading}
                onChange={(e) => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = ""; }}
              />
            </label>
            {imageUrl && (
              <Button variant="ghost" size="sm" onClick={() => setImageUrl(null)} className="justify-start">
                <Trash2 className="mr-2 h-4 w-4" /> Remove logo
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save logo"}</Button>
        </div>
      </div>
    </div>
  );
}

function FounderEditor() {
  const { user } = useAuth();
  const { value: founder, refetch } = useSiteSetting<FounderSetting>("founder", {
    image_url: null,
    scale: 1,
    offset_x: 0,
    offset_y: 0,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [ox, setOx] = useState(0);
  const [oy, setOy] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setImageUrl(founder.image_url);
    setScale(founder.scale ?? 1);
    setOx(founder.offset_x ?? 0);
    setOy(founder.offset_y ?? 0);
  }, [founder.image_url, founder.scale, founder.offset_x, founder.offset_y]);

  const upload = async (file: File) => {
    if (!supabase || !user) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be smaller than 8MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `founder/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setScale(1);
    setOx(0);
    setOy(0);
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await setSiteSetting("founder", {
      image_url: imageUrl,
      scale,
      offset_x: ox,
      offset_y: oy,
    });
    setSaving(false);
    if (error) toast.error(error);
    else {
      toast.success("Founder section updated");
      refetch();
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-10">
      <h2 className="text-xl font-semibold">Founder photo</h2>
      <p className="text-sm text-muted-foreground">
        Upload the founder's photo for the homepage. Zoom and pan to frame it nicely before saving.
      </p>

      <div className="mt-6 grid max-w-3xl gap-6">
        <div>
          <Label>Preview (4:5 frame, same as homepage)</Label>
          <div className="mt-2 mx-auto w-full max-w-xs">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-secondary shadow">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Founder preview"
                  className="h-full w-full object-cover select-none"
                  style={{ transform: `translate(${ox}%, ${oy}%) scale(${scale})`, transformOrigin: "center" }}
                  draggable={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No founder image yet.
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : imageUrl ? "Replace photo" : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = ""; }}
              />
            </label>
            {imageUrl && (
              <Button variant="ghost" size="sm" onClick={() => setImageUrl(null)}>
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Zoom ({scale.toFixed(2)}x)</Label>
            <input type="range" min={0.5} max={3} step={0.05} value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="mt-2 w-full accent-primary" />
          </div>
          <div>
            <Label>Horizontal ({ox}%)</Label>
            <input type="range" min={-50} max={50} step={1} value={ox}
              onChange={(e) => setOx(Number(e.target.value))}
              className="mt-2 w-full accent-primary" />
          </div>
          <div>
            <Label>Vertical ({oy}%)</Label>
            <input type="range" min={-50} max={50} step={1} value={oy}
              onChange={(e) => setOy(Number(e.target.value))}
              className="mt-2 w-full accent-primary" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save founder photo"}</Button>
          <Button variant="outline" onClick={() => { setScale(1); setOx(0); setOy(0); }}>
            Reset framing
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================== PROFILE ================== */

export function ProfilePage() {
  const { user } = useAuth();
  const { isAdmin, isOwner } = useRoles();
  const { profile, loading, save } = useProfile();
  const { application } = useMyOwnerApplication();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setWhatsapp(profile.whatsapp ?? "");
      setBio(profile.bio ?? "");
      setAvatar(profile.avatar_url ?? "");
    }
  }, [profile]);

  if (!user) return <Navigate to="/auth" state={{ from: "/profile" }} replace />;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await save({
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      whatsapp: whatsapp.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatar.trim() || null,
    });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success("Profile updated");
  };

  const initials = (fullName || user.email || "?")
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary/15 text-primary">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold">{initials}</div>
              )}
            </div>
            <div>
              <div className="text-lg font-semibold">{fullName || "Your profile"}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge variant="secondary">Student</Badge>
                {isOwner && <Badge>Owner</Badge>}
                {isAdmin && <Badge className="bg-primary">Admin</Badge>}
                {application?.status === "pending" && (
                  <Badge variant="outline" className="border-amber-400 text-amber-700">
                    Owner application pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <LayoutDashboard className="mr-1 h-4 w-4" /> Admin
              </Button>
            )}
            {isOwner ? (
              <Button onClick={() => navigate("/owner")}>
                <Building2 className="mr-1 h-4 w-4" /> Owner dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/owner")}>
                <Building2 className="mr-1 h-4 w-4" />
                {application ? "View application" : "Become an owner"}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><RingLoader /></div>
        ) : (
          <form onSubmit={onSave} className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Personal information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+233..." />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} placeholder="+233..." />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={400} placeholder="A little about you..." />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
            </div>
          </form>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link to="/favorites" className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium"><Heart className="h-4 w-4 text-primary" /> Favorites</div>
            <p className="mt-1 text-xs text-muted-foreground">Hostels you've saved.</p>
          </Link>
          <Link to="/requests" className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium"><ListChecks className="h-4 w-4 text-primary" /> My requests</div>
            <p className="mt-1 text-xs text-muted-foreground">Accommodation requests you've submitted.</p>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================== ADMIN: OWNER APPLICATIONS ================== */

export function AdminOwnersPage() {
  const { items, loading, setStatus } = useOwnerApplications();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Owner applications</h1>
      <p className="text-sm text-muted-foreground">
        Approve applicants to grant them access to the owner dashboard.
      </p>
      <div className="mt-6 space-y-3">
        {loading && <RingLoader />}
        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No owner applications yet.
          </div>
        )}
        {items.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{a.full_name || "Unnamed applicant"}</span>
                  <Badge
                    variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}
                  >
                    {a.status}
                  </Badge>
                </div>
                {a.business_name && (
                  <div className="text-sm text-muted-foreground">Business: {a.business_name}</div>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {a.whatsapp}
                  </span>
                  <span>Applied {new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                {a.message && (
                  <p className="mt-3 rounded-md border border-border bg-secondary/40 p-3 text-sm">{a.message}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${a.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-[color:var(--whatsapp)] px-3 py-2 text-xs text-[color:var(--whatsapp-foreground)] hover:opacity-90"
                >
                  <MessageSquare className="h-3 w-3" /> Contact
                </a>
                {a.status !== "approved" && (
                  <Button size="sm" onClick={() => setStatus(a.id, "approved")}>
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                  </Button>
                )}
                {a.status !== "rejected" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "rejected")}>
                    Reject
                  </Button>
                )}
                {a.status !== "pending" && (
                  <Button size="sm" variant="ghost" onClick={() => setStatus(a.id, "pending")}>
                    Reset to pending
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


export function AdminUsersPage() {
  type Row = { id: string; full_name: string | null; phone: string | null; created_at?: string; roles: string[] };
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const refetch = async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap = new Map<string, string[]>();
    ((roles as { user_id: string; role: string }[]) ?? []).forEach((r) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    setRows(
      ((profiles as { id: string; full_name: string | null; phone: string | null; created_at?: string }[]) ?? []).map((p) => ({
        ...p,
        roles: roleMap.get(p.id) ?? [],
      })),
    );
    setLoading(false);
  };

  useEffect(() => { refetch(); }, []);

  const setOwner = async (userId: string, makeOwner: boolean) => {
    if (!supabase) return;
    setBusy(userId);
    if (makeOwner) {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "owner" });
      if (error) toast.error(error.message); else toast.success("Promoted to owner");
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "owner");
      if (error) toast.error(error.message); else toast.success("Owner access revoked");
    }
    setBusy(null);
    refetch();
  };

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (r.full_name ?? "").toLowerCase().includes(q) || (r.phone ?? "").toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">All users</h1>
      <p className="text-sm text-muted-foreground">View every registered user and promote students to owner accounts.</p>

      <div className="mt-4 max-w-sm">
        <Input placeholder="Search by name, phone, or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="mt-6 space-y-3">
        {loading && <RingLoader />}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No users found.
          </div>
        )}
        {filtered.map((u) => {
          const isAdmin = u.roles.includes("admin");
          const isOwner = u.roles.includes("owner");
          return (
            <Card key={u.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{u.full_name || "Unnamed user"}</span>
                    {isAdmin && <Badge>Admin</Badge>}
                    {isOwner ? <Badge variant="secondary">Owner</Badge> : <Badge variant="outline">Student</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {u.phone && <span>{u.phone}</span>}
                    <span className="font-mono truncate max-w-[18rem]">{u.id}</span>
                    {u.created_at && <span>Joined {new Date(u.created_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin ? (
                    <span className="text-xs text-muted-foreground">Admin role managed in DB</span>
                  ) : isOwner ? (
                    <Button size="sm" variant="outline" disabled={busy === u.id} onClick={() => setOwner(u.id, false)}>
                      Revoke owner
                    </Button>
                  ) : (
                    <Button size="sm" disabled={busy === u.id} onClick={() => setOwner(u.id, true)}>
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Make owner
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
    </PublicLayout>
  );
}

/* ================== WAITLIST ================== */

export type WaitlistMode = { enabled: boolean };

export function useWaitlistMode() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const refetch = async () => {
    if (!supabase) { setEnabled(false); return; }
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "waitlist_mode")
      .maybeSingle();
    setEnabled(!!(data?.value as WaitlistMode | null)?.enabled);
  };
  useEffect(() => {
    refetch();
    const id = setInterval(refetch, 30000);
    return () => clearInterval(id);
  }, []);
  return { enabled, refetch };
}

export function WaitlistPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<number | null>(null);

  const fireConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const end = Date.now() + 1500;
    const colors = ["#7c3aed", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("join_waitlist", {
      _name: name.trim(),
      _phone: phone.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPosition(Number(data));
    fireConfetti();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Subtle professional backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(circle_at_85%_90%,hsl(var(--primary)/0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative w-full max-w-xl">
        <div className="mb-8 flex justify-center"><BrandLogo className="h-14 w-14" /></div>

        {position === null ? (
          <Card className="rounded-2xl border bg-card p-8 shadow-xl sm:p-10">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-60" />
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Coming soon
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Join the HostelHub waitlist
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              We're putting the finishing touches on the platform. Leave your details and we'll notify you the moment we go live.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <Label htmlFor="wl-name" className="text-sm font-medium">Full name</Label>
                <Input
                  id="wl-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ama Mensah"
                  required
                  className="mt-2 h-14 rounded-xl border px-4 text-base shadow-sm transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                />
              </div>
              <div>
                <Label htmlFor="wl-phone" className="text-sm font-medium">Phone number</Label>
                <Input
                  id="wl-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 ..."
                  required
                  className="mt-2 h-14 rounded-xl border px-4 text-base shadow-sm transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl text-base font-medium shadow-sm transition"
              >
                {loading ? "Joining..." : "Reserve my spot"}
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No spam, ever</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Priority early access</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Free to join</span>
            </div>
          </Card>
        ) : (
          <Card className="rounded-2xl border bg-card p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              You're on the list, {name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              We'll be in touch soon with early access details.
            </p>
            <div className="mt-8 rounded-xl border bg-muted/30 px-6 py-8">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Your position</div>
              <div className="mt-2 text-7xl font-semibold tabular-nums text-foreground sm:text-8xl">
                #{position}
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-7 h-11 rounded-xl px-6"
              onClick={fireConfetti}
            >
              Celebrate again
            </Button>
          </Card>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Are you an admin? <Link to="/auth" className="font-medium text-foreground underline-offset-4 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export function WaitlistGate({ children }: { children: ReactNode }) {
  const { enabled } = useWaitlistMode();
  const { isAdmin, loading: rolesLoading } = useRoles();
  const { loading: authLoading } = useAuth();
  const location = useLocation();

  if (enabled === null || authLoading || rolesLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><RingLoader /></div>;
  }
  if (!enabled || isAdmin) return <>{children}</>;
  // Allow admin sign-in to remain reachable
  if (location.pathname === "/auth" || location.pathname.startsWith("/admin")) return <>{children}</>;
  return <WaitlistPage />;
}

export function AdminWaitlistPage() {
  const [items, setItems] = useState<{ id: string; position: number; name: string; phone: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { value: mode, refetch: refetchMode } = useSiteSetting<WaitlistMode>("waitlist_mode", { enabled: false });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("waitlist_signups")
      .select("id, position, name, phone, created_at")
      .order("position", { ascending: true });
    setItems((data as typeof items) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (next: boolean) => {
    setSaving(true);
    const { error } = await setSiteSetting("waitlist_mode", { enabled: next });
    setSaving(false);
    if (error) { toast.error(error); return; }
    toast.success(next ? "Waitlist mode is now ON — only admins can access the site." : "Waitlist mode is OFF.");
    refetchMode();
  };

  const downloadExcel = async () => {
    const XLSX = await import("xlsx");
    const rows = items.map((i) => ({
      Position: i.position,
      Name: i.name,
      Phone: i.phone,
      "Signed up": new Date(i.created_at).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 10 }, { wch: 28 }, { wch: 18 }, { wch: 22 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Waitlist");
    XLSX.writeFile(wb, `hostelhub-waitlist-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    if (!confirm("Remove this entry?")) return;
    await supabase.from("waitlist_signups").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Waitlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            When ON, the entire site shows the waitlist landing — only admins can access pages.
          </p>
        </div>
        <Button onClick={downloadExcel} disabled={items.length === 0}>
          <Upload className="mr-2 h-4 w-4 rotate-180" /> Download Excel
        </Button>
      </div>

      <Card className="mt-6 flex items-center justify-between gap-4 p-5">
        <div>
          <div className="font-medium">Waitlist mode</div>
          <div className="text-sm text-muted-foreground">
            Status: <span className={mode.enabled ? "text-primary font-medium" : "text-muted-foreground"}>{mode.enabled ? "ON" : "OFF"}</span>
          </div>
        </div>
        <Switch checked={mode.enabled} disabled={saving} onCheckedChange={toggle} />
      </Card>

      <div className="mt-6">
        <div className="mb-2 text-sm text-muted-foreground">{items.length} signup{items.length === 1 ? "" : "s"}</div>
        {loading ? (
          <div className="py-12 text-center"><DotLoader /></div>
        ) : items.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">No signups yet.</Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">#</th>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Phone</th>
                    <th className="px-4 py-2 font-medium">Signed up</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id} className="border-t">
                      <td className="px-4 py-2 tabular-nums">{i.position}</td>
                      <td className="px-4 py-2">{i.name}</td>
                      <td className="px-4 py-2"><a className="underline" href={`tel:${i.phone}`}>{i.phone}</a></td>
                      <td className="px-4 py-2 text-muted-foreground">{new Date(i.created_at).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">
                        <Button size="sm" variant="ghost" onClick={() => remove(i.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
