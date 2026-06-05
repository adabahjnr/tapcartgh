import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { getStore, type Product } from "@/lib/mock-data";
import { cart, useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/s/$username")({
  loader: ({ params }) => {
    const store = getStore(params.username);
    if (!store) throw notFound();
    return { store };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.store.name ?? "Store"} — TapCart` },
      { name: "description", content: loaderData?.store.description ?? "" },
      { property: "og:title", content: loaderData?.store.name ?? "" },
      { property: "og:description", content: loaderData?.store.description ?? "" },
      { property: "og:image", content: loaderData?.store.banner ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Store not found</h1>
        <p className="mt-2 text-muted-foreground">This shop doesn't exist (yet).</p>
        <Link to="/" className="mt-6 inline-block text-sm underline">Back to TapCart</Link>
      </div>
    </div>
  ),
  errorComponent: () => <div className="p-12 text-center">Something went wrong.</div>,
  component: StorePage,
});

function StorePage() {
  const { store } = Route.useLoaderData();
  const items = useCart(store.username);
  const [open, setOpen] = useState(false);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const sendWhatsApp = () => {
    const lines = items.map((i) => `• ${i.qty}× ${i.name} — $${(i.qty * i.price).toFixed(2)}`);
    const msg = `Hi ${store.name}! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
    const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-secondary md:h-64">
        <img src={store.banner} alt="" className="h-full w-full object-cover" />
      </div>
      {/* Header */}
      <header className="mx-auto -mt-12 max-w-5xl px-6">
        <div className="flex items-end gap-5">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-secondary shadow-sm md:h-28 md:w-28">
            <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{store.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{store.description}</p>
          </div>
        </div>
      </header>

      {/* Products */}
      <section className="mx-auto mt-16 max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7">
          {store.products.map((p: Product) => (
            <ProductCard key={p.id} p={p} onAdd={() => { cart.add(store.username, p); setOpen(true); }} />
          ))}
        </div>
      </section>

      {/* Floating cart button */}
      {count > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          Cart · {count}
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="text-base font-medium">Your cart</div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="py-20 text-center text-sm text-muted-foreground">Your cart is empty.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((i) => (
                    <li key={i.id} className="flex gap-4 py-5">
                      <div className="h-16 w-16 overflow-hidden rounded-md bg-secondary">
                        <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <div className="text-sm font-medium">{i.name}</div>
                          <div className="text-sm">${(i.price * i.qty).toFixed(2)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button onClick={() => cart.setQty(store.username, i.id, i.qty - 1)} className="px-2 py-1 text-muted-foreground"><Minus className="h-3 w-3" /></button>
                            <span className="px-3 text-xs">{i.qty}</span>
                            <button onClick={() => cart.setQty(store.username, i.id, i.qty + 1)} className="px-2 py-1 text-muted-foreground"><Plus className="h-3 w-3" /></button>
                          </div>
                          <button onClick={() => cart.remove(store.username, i.id)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={sendWhatsApp}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-6 py-3 text-sm font-medium text-[color:var(--whatsapp-foreground)] hover:opacity-90"
                >
                  Order on WhatsApp
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">Sends your order directly to {store.name}.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      <footer className="mx-auto mt-24 max-w-5xl px-6 text-center text-xs text-muted-foreground">
        Powered by <Link to="/" className="underline">TapCart</Link>
      </footer>
    </div>
  );
}

function ProductCard({ p, onAdd }: { p: Product; onAdd: () => void }) {
  return (
    <div className="group">
      <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-sm font-medium">{p.name}</div>
        <div className="text-sm text-muted-foreground">${p.price}</div>
      </div>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
      <button
        onClick={onAdd}
        className="mt-3 w-full rounded-full border border-border bg-background px-4 py-2 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Add to cart
      </button>
    </div>
  );
}
