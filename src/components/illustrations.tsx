import type { SVGProps } from "react";

/** Soft floating blob backdrop, monochrome with subtle gradient. */
export function BlobBackdrop({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className ?? ""}`} aria-hidden>
      <div className="tc-float-slow tc-blob-morph h-72 w-72 bg-gradient-to-br from-secondary to-background opacity-80" />
    </div>
  );
}

/** Hand-drawn-ish sparkle. */
export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}

/** Mini phone with chat bubble — used in hero/marketing pages. */
export function PhoneChatIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden>
      <defs>
        <linearGradient id="screen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#f0f0f0" />
        </linearGradient>
      </defs>
      <rect x="30" y="10" width="140" height="220" rx="22" fill="white" stroke="#e5e5e5" strokeWidth="1.2" />
      <rect x="38" y="22" width="124" height="196" rx="14" fill="url(#screen)" />
      <rect x="78" y="16" width="44" height="6" rx="3" fill="#e5e5e5" />
      {/* bubble */}
      <g className="tc-float">
        <rect x="50" y="60" width="100" height="42" rx="12" fill="white" stroke="#e5e5e5" />
        <circle cx="64" cy="74" r="4" fill="#111" />
        <rect x="74" y="70" width="60" height="3" rx="1.5" fill="#d4d4d4" />
        <rect x="74" y="78" width="44" height="3" rx="1.5" fill="#e5e5e5" />
        <rect x="74" y="86" width="34" height="3" rx="1.5" fill="#e5e5e5" />
      </g>
      {/* product card */}
      <rect x="50" y="120" width="100" height="80" rx="10" fill="white" stroke="#e5e5e5" />
      <rect x="58" y="128" width="50" height="50" rx="6" fill="#f5f5f5" />
      <rect x="114" y="132" width="30" height="4" rx="2" fill="#d4d4d4" />
      <rect x="114" y="142" width="22" height="4" rx="2" fill="#e5e5e5" />
      <rect x="114" y="168" width="28" height="10" rx="5" fill="#111" />
    </svg>
  );
}

/** Tiny dotted route between two pins, for "How it works". */
export function RouteIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 60" className={className} aria-hidden>
      <circle cx="14" cy="30" r="6" fill="#111" />
      <path d="M22 30 Q 80 0 120 30 T 218 30" stroke="#d4d4d4" strokeWidth="1.5" fill="none" strokeDasharray="3 5" />
      <circle cx="226" cy="30" r="6" fill="none" stroke="#111" strokeWidth="1.5" />
    </svg>
  );
}

/** Empty-state little box. */
export function EmptyBoxIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <path d="M20 40 L60 20 L100 40 L100 80 L60 100 L20 80 Z" fill="#fafafa" stroke="#e5e5e5" />
      <path d="M20 40 L60 60 L100 40" fill="none" stroke="#d4d4d4" />
      <path d="M60 60 L60 100" stroke="#d4d4d4" />
      <circle cx="60" cy="12" r="2" fill="#d4d4d4" className="tc-float" />
      <circle cx="20" cy="22" r="1.5" fill="#e5e5e5" />
      <circle cx="100" cy="22" r="1.5" fill="#e5e5e5" />
    </svg>
  );
}

/** Decorative ticker bar (logos-style placeholder). */
export function LogoTicker() {
  const items = ["bloom", "chai house", "local market", "olive & oak", "rosewater", "north & co", "soko", "fern"];
  const list = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden border-y border-border/60 bg-secondary/30 py-5">
      <div
        className="flex w-max gap-14 px-6 text-sm uppercase tracking-[0.22em] text-muted-foreground"
        style={{ animation: "tc-marquee 28s linear infinite" }}
      >
        {list.map((l, i) => (
          <span key={i} className="whitespace-nowrap">{l}</span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
