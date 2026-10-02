import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Currency } from "./format";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  image?: string;
  size: string;
  color: string;
  qty: number;
  minQty: number;
  priceNgn: number;
  priceUsd: number;
};

type StoreCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  items: CartItem[];
  add: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  total: (c: Currency) => number;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem("unik_currency");
      if (c === "NGN" || c === "USD") setCurrency(c);
      const i = localStorage.getItem("unik_cart");
      if (i) setItems(JSON.parse(i));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem("unik_cart", JSON.stringify(items));
  }, [items, loaded]);
  useEffect(() => {
    if (loaded) localStorage.setItem("unik_currency", currency);
  }, [currency, loaded]);

  const value = useMemo<StoreCtx>(
    () => ({
      currency,
      setCurrency,
      items,
      add: (item) => {
        const key = `${item.productId}-${item.size}-${item.color}`;
        setItems((prev) => {
          const found = prev.find((p) => p.key === key);
          if (found) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + item.qty } : p));
          return [...prev, { ...item, key }];
        });
      },
      updateQty: (key, qty) =>
        setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(p.minQty, qty) } : p))),
      remove: (key) => setItems((prev) => prev.filter((p) => p.key !== key)),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.qty, 0),
      total: (c) => items.reduce((s, i) => s + i.qty * (c === "NGN" ? i.priceNgn : i.priceUsd), 0),
    }),
    [currency, items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
