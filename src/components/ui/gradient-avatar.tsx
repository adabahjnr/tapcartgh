import { cn } from "@/lib/utils";

const palettes = [
  ["#FDE68A", "#F472B6"],
  ["#C7D2FE", "#818CF8"],
  ["#BBF7D0", "#34D399"],
  ["#FECACA", "#F87171"],
  ["#E9D5FF", "#A78BFA"],
  ["#BAE6FD", "#38BDF8"],
  ["#FED7AA", "#FB923C"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function GradientAvatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const [a, b] = palettes[hash(name) % palettes.length];
  const initials = name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-[0.72rem] font-semibold text-foreground/80 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${a}, ${b})`,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
