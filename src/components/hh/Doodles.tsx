import type { SVGProps } from "react";

export function DoodleHouse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 38 L40 14 L70 38" />
      <path d="M18 36 V64 H62 V36" />
      <rect x="34" y="46" width="12" height="18" />
      <circle cx="40" cy="55" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function DoodleStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 4 L24 16 L36 18 L27 26 L30 38 L20 31 L10 38 L13 26 L4 18 L16 16 Z" />
    </svg>
  );
}

export function DoodleSquiggle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...props}>
      <path d="M2 12 Q 17 -2, 32 12 T 62 12 T 92 12 T 118 12" />
    </svg>
  );
}

export function DoodleKey(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="30" r="10" />
      <path d="M28 30 H56" />
      <path d="M46 30 V40" />
      <path d="M52 30 V38" />
    </svg>
  );
}

export function DoodleArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 50 Q 50 -10, 110 30" />
      <path d="M110 30 L100 22 M110 30 L102 38" />
    </svg>
  );
}

export function DoodleCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...props}>
      <path d="M50 8 C 80 8, 95 30, 92 55 C 88 80, 60 95, 35 90 C 12 86, 4 60, 12 38 C 18 20, 35 8, 50 8 Z" />
    </svg>
  );
}
