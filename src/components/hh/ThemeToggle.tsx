import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, floating = false }: { className?: string; floating?: boolean }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("hh-theme");
    if (saved) return saved === "dark";
    return false; // default to light
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("hh-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setDark((v) => !v)}
      className={cn(
        floating
          ? "hh-fab"
          : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition hover:bg-secondary hover:scale-105",
        className,
      )}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
