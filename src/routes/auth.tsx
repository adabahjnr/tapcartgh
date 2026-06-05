import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["signin", "signup"]).optional() }),
  head: () => ({
    meta: [
      { title: "Sign in — TapCart" },
      { name: "description", content: "Sign in or create your TapCart account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <Link to="/" className="text-base font-semibold tracking-tight">TapCart</Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isSignup ? "Create your store" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "It's free, forever." : "Sign in to your dashboard."}
          </p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
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
