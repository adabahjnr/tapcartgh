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
} from "lucide-react";
import { toast } from "sonner";
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
import { RingLoader } from "@/components/ui/loader";
import { DoodleHouse, DoodleStar, DoodleSquiggle, DoodleKey, DoodleArrow, DoodleCircle } from "@/components/hh/Doodles";

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
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HomeIcon className="h-4 w-4" />
            </span>
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
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <HomeIcon className="h-3.5 w-3.5" />
                    </span>
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

                <div className="mt-6 border-t border-border pt-4">
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
    </div>
  );
}


function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HomeIcon className="h-3.5 w-3.5" />
            </span>
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
  const featured = hostels.slice(0, 3);
  const verified = hostels.filter((h) => h.is_verified).slice(0, 3);
  const recent = [...hostels].slice(0, 6);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/hostels${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 hh-grain opacity-80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/40 to-background" />

        {/* Floating doodles */}
        <DoodleStar className="absolute left-6 top-10 h-10 w-10 text-[var(--pop-sun)] hh-wiggle" />
        <DoodleHouse className="absolute right-8 top-16 h-16 w-16 text-primary hh-bob" />
        <DoodleSquiggle className="absolute left-10 bottom-6 h-6 w-32 text-[var(--pop-coral)]" />
        <DoodleKey className="absolute right-12 bottom-10 h-12 w-12 text-[var(--pop-mint)] hh-wiggle" />
        <DoodleCircle className="absolute left-1/2 top-24 hidden h-40 w-40 -translate-x-1/2 text-primary/15 md:block hh-spin-slow" />

        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center hh-pop">
            <span className="hh-chip mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              UMaT student housing
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Your hostel,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">sorted.</span>
                <DoodleSquiggle className="absolute -bottom-3 left-0 z-0 h-4 w-full text-primary" />
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
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

      <Section title="Featured" subtitle="Student favorites this week.">
        <HostelGrid hostels={featured} empty="No featured hostels yet." />
      </Section>

      <Section title="Verified" subtitle="Checked and approved.">
        <HostelGrid hostels={verified} empty="No verified hostels yet." />
      </Section>

      <Section title="Fresh listings" subtitle="Just added around campus.">
        <HostelGrid hostels={recent} empty="No hostels listed yet — be the first." />
      </Section>

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


function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
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
          <h3 className="font-semibold leading-tight">{hostel.name}</h3>
          <div className="shrink-0 text-sm font-medium">
            {hostel.price_min ? `GH₵${hostel.price_min}${hostel.price_max ? `–${hostel.price_max}` : ""}` : "—"}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {hostel.location ?? "Location not set"}
          {hostel.distance_km != null && <span> · {hostel.distance_km} km from campus</span>}
        </div>
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

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Hostels near UMaT</h1>
        <p className="mt-1 text-sm text-muted-foreground">{hostels.length} result{hostels.length === 1 ? "" : "s"}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[260px,1fr]">
          <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 h-fit">
            <div>
              <Label className="text-xs">Search</Label>
              <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or area" className="w-full bg-transparent py-2 text-sm outline-none" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Max price (GH₵)</Label>
              <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 3000" />
            </div>
            <div>
              <Label className="text-xs">Max distance (km)</Label>
              <Input type="number" value={maxDistance} onChange={(e) => setMaxDistance(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 2" />
            </div>
            <div>
              <Label className="text-xs">Availability</Label>
              <Select value={availability || "any"} onValueChange={(v) => setAvailability(v === "any" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Amenity</Label>
              <Select value={amenity || "any"} onValueChange={(v) => setAmenity(v === "any" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {["WiFi", "Water", "Generator", "Security", "Kitchen", "Furnished", "Parking"].map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <div className="text-sm font-medium">Verified only</div>
                <div className="text-xs text-muted-foreground">Trusted listings</div>
              </div>
              <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="flex h-40 items-center justify-center"><RingLoader /></div>
            ) : (
              <HostelGrid hostels={hostels} empty="No hostels match these filters yet." />
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================== HOSTEL DETAIL ================== */

export function HostelDetailPage() {
  const { id } = useParams();
  const { hostel, loading } = useHostel(id);
  const { reviews, refetch: refetchReviews } = useReviews(id);
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const avg = avgRating(reviews);

  if (loading) {
    return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><RingLoader /></div></PublicLayout>;
  }
  if (!hostel) {
    return <PublicLayout><div className="mx-auto max-w-3xl px-6 py-24 text-center text-muted-foreground">Hostel not found.</div></PublicLayout>;
  }

  const gallery = hostel.gallery ?? [];
  const isFav = ids.includes(hostel.id);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
            {hostel.cover_image ? (
              <img src={hostel.cover_image} alt={hostel.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No cover image</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gallery.slice(0, 4).map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl bg-secondary">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-2 flex aspect-[2/1] items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                No gallery photos
              </div>
            )}
          </div>
        </div>

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
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{hostel.name}</h1>
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

            <ReviewsSection hostelId={hostel.id} reviews={reviews} onPosted={refetchReviews} />
          </div>

          <aside className="space-y-3 rounded-2xl border border-border bg-card p-5 h-fit">
            <div className="text-sm text-muted-foreground">Price range</div>
            <div className="text-2xl font-semibold">
              {hostel.price_min ? `GH₵${hostel.price_min}${hostel.price_max ? `–${hostel.price_max}` : ""}` : "Contact for price"}
            </div>
            <div className="space-y-2 pt-2">
              {hostel.contact_phone && (
                <a href={`tel:${hostel.contact_phone}`} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">
                  <Phone className="h-4 w-4" /> {hostel.contact_phone}
                </a>
              )}
              {hostel.whatsapp && (
                <a href={`https://wa.me/${hostel.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md bg-[color:var(--whatsapp)] px-3 py-2 text-sm text-[color:var(--whatsapp-foreground)] hover:opacity-90">
                  <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
                </a>
              )}
              {hostel.contact_email && (
                <a href={`mailto:${hostel.contact_email}`} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">
                  <Mail className="h-4 w-4" /> {hostel.contact_email}
                </a>
              )}
            </div>
            {user && (
              <Button variant="outline" className="w-full" onClick={() => toggle(hostel.id)}>
                <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                {isFav ? "Saved" : "Save to favorites"}
              </Button>
            )}
            <Link to="/feedback" className="block pt-2 text-center text-xs text-muted-foreground underline-offset-2 hover:underline">
              Report inaccurate information
            </Link>
          </aside>
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
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name, phone } },
      });
      setLoading(false);
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) toast.error(error.message);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to save favorites and write reviews." : "Join HostelHub in less than a minute."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <Label>Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
                </div>
                <div>
                  <Label>Phone (optional)</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+233..." />
                </div>
              </>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>New here? <button onClick={() => setMode("signup")} className="font-medium text-foreground underline-offset-2 hover:underline">Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode("signin")} className="font-medium text-foreground underline-offset-2 hover:underline">Sign in</button></>
            )}
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
  { to: "/admin/hostels", label: "Hostels", icon: Building2 },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/requests", label: "Requests", icon: ListChecks },
  { to: "/admin/community", label: "Community", icon: Users },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
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
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><HomeIcon className="h-4 w-4" /></span>
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
              <Button size="icon" variant="ghost" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col bg-sidebar p-0">
              <SheetHeader className="sr-only"><SheetTitle>{title}</SheetTitle></SheetHeader>
              <SidebarBody onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <Link to="/" className="font-semibold">HostelHub</Link>
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
