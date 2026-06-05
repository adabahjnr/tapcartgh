import { useSyncExternalStore } from "react";
import type { Product } from "./mock-data";

type CartItem = Product & { qty: number };
type CartState = Record<string, CartItem[]>; // username -> items

const state: CartState = {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function useCart(username: string) {
  const items = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state[username] ?? EMPTY,
    () => EMPTY,
  );
  return items;
}
const EMPTY: CartItem[] = [];

export const cart = {
  add(username: string, p: Product) {
    const list = state[username] ?? (state[username] = []);
    const existing = list.find((i) => i.id === p.id);
    if (existing) existing.qty++;
    else list.push({ ...p, qty: 1 });
    state[username] = [...list];
    emit();
  },
  remove(username: string, id: string) {
    state[username] = (state[username] ?? []).filter((i) => i.id !== id);
    emit();
  },
  setQty(username: string, id: string, qty: number) {
    const list = state[username] ?? [];
    const item = list.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    state[username] = [...list];
    emit();
  },
  clear(username: string) { state[username] = []; emit(); },
};
