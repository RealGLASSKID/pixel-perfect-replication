import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — UNIK TRENDS" },
      { name: "description", content: "Review your wholesale order before checkout." },
      { property: "og:title", content: "Your Cart — UNIK TRENDS" },
      { property: "og:description", content: "Review your UNIK TRENDS wholesale order." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, updateQty, remove, currency, total } = useStore();
  if (!items.length)
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-5xl">Cart is empty</h1>
        <Button asChild variant="block" size="lg" className="mt-8"><Link to="/shop">Go shopping</Link></Button>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-5xl">Cart</h1>
        <ul className="mt-6 divide-y-2 divide-border border-y-2 border-primary">
          {items.map((i) => (
            <li key={i.key} className="flex gap-4 py-4">
              <img src={i.image} alt={i.name} className="h-28 w-22 shrink-0 bg-muted object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-bold">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{[i.size, i.color].filter(Boolean).join(" · ")} · MOQ {i.minQty}</p>
                  </div>
                  <button onClick={() => remove(i.key)} aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border-2 border-primary">
                    <button className="p-2" onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                    <input type="number" value={i.qty} onChange={(e) => updateQty(i.key, Number(e.target.value) || i.minQty)} className="w-14 bg-transparent text-center text-sm font-bold" />
                    <button className="p-2" onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-bold">{formatPrice(i.qty * (currency === "NGN" ? i.priceNgn : i.priceUsd), currency)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit border-2 border-primary p-6 shadow-block">
        <h2 className="text-2xl">Summary</h2>
        <div className="mt-4 flex justify-between text-lg font-bold">
          <span>Total</span><span>{formatPrice(total(currency), currency)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {currency === "NGN" ? formatPrice(total("USD"), "USD") : formatPrice(total("NGN"), "NGN")} · delivery fee agreed on WhatsApp
        </p>
        <Button asChild variant="accent" size="lg" className="mt-6 w-full"><Link to="/checkout">Checkout</Link></Button>
      </aside>
    </div>
  );
}
