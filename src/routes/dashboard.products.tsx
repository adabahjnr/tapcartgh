import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { sampleStores } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({ meta: [{ title: "Products — TapCart" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const [products, setProducts] = useState(sampleStores[0].products);
  const [adding, setAdding] = useState(false);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">{products.length} in your store</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      {adding && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium">Add product</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Name" />
            <input className="input" placeholder="Price" />
            <input className="input md:col-span-2" placeholder="Short description" />
            <input className="input" placeholder="Stock" />
            <button type="button" className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">Upload image</button>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={() => setAdding(false)} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Save</button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Product</th>
              <th className="px-6 py-3 text-left font-medium">Price</th>
              <th className="px-6 py-3 text-left font-medium">Stock</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-md bg-secondary">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .9rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--foreground)}`}</style>
    </div>
  );
}
