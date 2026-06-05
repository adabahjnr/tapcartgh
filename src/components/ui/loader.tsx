import { cn } from "@/lib/utils";

export function DotLoader({ className, label }: { className?: string; label?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex items-center gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-foreground"
            style={{ animation: `tc-dot 1.2s ease-in-out ${i * 0.16}s infinite` }}
          />
        ))}
      </span>
      {label && <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>}
    </div>
  );
}

export function RingLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative inline-flex h-10 w-10", className)} role="status" aria-label="Loading">
      <span className="absolute inset-0 rounded-full border-2 border-border" />
      <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground tc-spin-slow" style={{ animationDuration: "1.1s" }} />
    </div>
  );
}

export function SkeletonShimmer({ className }: { className?: string }) {
  return <div className={cn("tc-shimmer rounded-md", className)} aria-hidden />;
}
