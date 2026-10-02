import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { currency } = useStore();
  const price = currency === "NGN" ? Number(product.price_ngn) : Number(product.price_usd);
  return (
    <Link to="/product/$id" params={{ id: product.id }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.featured && (
          <span className="eyebrow absolute left-2 top-2 bg-accent px-2 py-1 text-accent-foreground">Trending</span>
        )}
        {product.stock <= 0 && (
          <span className="eyebrow absolute right-2 top-2 bg-primary px-2 py-1 text-primary-foreground">Sold out</span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-sans text-sm font-bold normal-case tracking-normal">{product.name}</h3>
          <p className="text-xs text-muted-foreground">
            {product.category} · MOQ {product.min_order_qty}
          </p>
        </div>
        <span className="text-sm font-bold">{formatPrice(price, currency)}</span>
      </div>
    </Link>
  );
}
