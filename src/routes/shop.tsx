import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useMemo } from "react";
import { Search } from "lucide-react";
import { productsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  gender: z.string().optional(),
  size: z.string().optional(),
  max: z.number().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — UNIK TRENDS" },
      { name: "description", content: "Browse baggy jeans, hoodies and streetwear sets at wholesale prices." },
      { property: "og:title", content: "Shop — UNIK TRENDS" },
      { property: "og:description", content: "Browse UNIK TRENDS streetwear at wholesale prices." },
    ],
  }),
  component: Shop,
});

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`border-2 border-primary px-3 py-1 text-xs font-bold uppercase ${active ? "bg-primary text-primary-foreground" : ""}`}
    >
      {children}
    </button>
  );
}

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { currency } = useStore();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const set = (patch: Partial<typeof search>) => navigate({ search: (s) => ({ ...s, ...patch }), replace: true });

  const sizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), [products]);
  const priceKey = currency === "NGN" ? "price_ngn" : "price_usd";
  const maxPrice = useMemo(() => Math.max(0, ...products.map((p) => Number(p[priceKey]))), [products, priceKey]);

  const filtered = products.filter((p) => {
    if (search.q && !`${p.name} ${p.description}`.toLowerCase().includes(search.q.toLowerCase())) return false;
    if (search.category && p.category !== search.category) return false;
    if (search.gender && p.gender !== search.gender && p.gender !== "unisex") return false;
    if (search.size && !p.sizes.includes(search.size)) return false;
    if (search.max && Number(p[priceKey]) > search.max) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-5xl md:text-7xl">Shop</h1>
      <div className="mt-6 grid gap-4 border-b-2 border-primary pb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            className="pl-9"
            value={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={!search.gender} onClick={() => set({ gender: undefined })}>All</Chip>
          <Chip active={search.gender === "men"} onClick={() => set({ gender: "men" })}>Men</Chip>
          <Chip active={search.gender === "women"} onClick={() => set({ gender: "women" })}>Women</Chip>
          <span className="mx-2 w-px bg-border" />
          {CATEGORIES.map((c) => (
            <Chip key={c} active={search.category === c} onClick={() => set({ category: search.category === c ? undefined : c })}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Size</span>
          {sizes.map((s) => (
            <Chip key={s} active={search.size === s} onClick={() => set({ size: search.size === s ? undefined : s })}>{s}</Chip>
          ))}
        </div>
        {maxPrice > 0 && (
          <label className="flex max-w-md items-center gap-3 text-sm">
            <span className="eyebrow">Max price</span>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={search.max ?? maxPrice}
              onChange={(e) => set({ max: Number(e.target.value) >= maxPrice ? undefined : Number(e.target.value) })}
              className="flex-1 accent-accent"
            />
            <span className="w-20 text-right font-bold">
              {currency === "NGN" ? "₦" : "$"}{(search.max ?? maxPrice).toLocaleString()}
            </span>
          </label>
        )}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{filtered.length} products</p>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse bg-muted" />)}
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
