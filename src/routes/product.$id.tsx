import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { productQuery } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CurrencyToggle } from "@/components/SiteHeader";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — UNIK TRENDS" },
      { name: "description", content: "Streetwear product details, sizes, colours and wholesale pricing." },
      { property: "og:title", content: "Product — UNIK TRENDS" },
      { property: "og:description", content: "Wholesale streetwear from UNIK TRENDS." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: p, isLoading } = useQuery(productQuery(id));
  const { currency, add } = useStore();
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (p) {
      setQty(p.min_order_qty);
      setSize(p.sizes[0] ?? "");
      setColor(p.colors[0] ?? "");
    }
  }, [p]);

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 py-20">Loading…</div>;
  if (!p)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block underline">Back to shop</Link>
      </div>
    );

  const addToCart = (go: boolean) => {
    if (p.sizes.length && !size) { toast.error("Pick a size"); return; }
    add({
      productId: p.id, name: p.name, image: p.images[0] ?? "", size, color, qty,
      minQty: p.min_order_qty, priceNgn: Number(p.price_ngn), priceUsd: Number(p.price_usd),
    });
    toast.success("Added to cart");
    if (go) navigate({ to: "/cart" });
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          {p.images[img] && <img src={p.images[img]} alt={p.name} className="h-full w-full object-cover" />}
        </div>
        {p.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} className={`h-20 w-16 shrink-0 border-2 ${i === img ? "border-accent" : "border-transparent"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <span className="eyebrow text-accent">{p.category} · {p.gender}</span>
        <h1 className="mt-2 text-4xl md:text-5xl">{p.name}</h1>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-3xl font-bold">{formatPrice(currency === "NGN" ? Number(p.price_ngn) : Number(p.price_usd), currency)}</span>
          <CurrencyToggle />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPrice(Number(p.price_ngn), "NGN")} / {formatPrice(Number(p.price_usd), "USD")} per piece · wholesale
        </p>
        <p className="mt-6 leading-relaxed">{p.description}</p>

        {p.sizes.length > 0 && (
          <div className="mt-6">
            <p className="eyebrow mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-12 border-2 border-primary px-3 py-2 text-sm font-bold ${size === s ? "bg-primary text-primary-foreground" : ""}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {p.colors.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow mb-2">Colour</p>
            <div className="flex flex-wrap gap-2">
              {p.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`border-2 border-primary px-3 py-2 text-sm ${color === c ? "bg-primary text-primary-foreground" : ""}`}>{c}</button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-5">
          <p className="eyebrow mb-2">Quantity · minimum {p.min_order_qty}</p>
          <div className="flex w-fit items-center border-2 border-primary">
            <button className="p-3" onClick={() => setQty((q) => Math.max(p.min_order_qty, q - 1))} aria-label="Decrease"><Minus className="h-4 w-4" /></button>
            <input type="number" value={qty} min={p.min_order_qty} onChange={(e) => setQty(Math.max(p.min_order_qty, Number(e.target.value) || p.min_order_qty))} className="w-16 bg-transparent text-center font-bold" />
            <button className="p-3" onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{p.stock > 0 ? `${p.stock} in stock` : "Currently out of stock"}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="block" size="lg" className="flex-1" disabled={p.stock <= 0} onClick={() => addToCart(false)}>Add to cart</Button>
          <Button variant="accent" size="lg" className="flex-1" disabled={p.stock <= 0} onClick={() => addToCart(true)}>Buy now</Button>
        </div>
      </div>
    </div>
  );
}
