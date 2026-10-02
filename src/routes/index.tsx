import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Package, Truck, Tag } from "lucide-react";
import { productsQuery, settingsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UNIK TRENDS — Streetwear at Wholesale Prices" },
      { name: "description", content: "Baggy jeans, heavyweight hoodies and more from a Nigerian manufacturer. Wholesale prices for resellers." },
      { property: "og:title", content: "UNIK TRENDS — Streetwear at Wholesale Prices" },
      { property: "og:description", content: "Trendy Nigerian streetwear for men and women, direct from the manufacturer." },
    ],
  }),
  component: Index,
});

const CATS = [
  { label: "Men", search: { gender: "men" }, img: "/images/baggy-jeans.jpg" },
  { label: "Women", search: { gender: "women" }, img: "/images/women-set.jpg" },
  { label: "Hoodies", search: { category: "Hoodies" }, img: "/images/hoodie.jpg" },
  { label: "Baggy", search: { category: "Baggy" }, img: "/images/baggy-jeans.jpg" },
] as const;

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      <section className="relative h-[78vh] min-h-[520px] overflow-hidden bg-primary">
        <img
          src={settings?.banner_image || "/images/hero.jpg"}
          alt="UNIK TRENDS streetwear"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14">
          <span className="eyebrow mb-3 text-accent">New drop · Made in Nigeria</span>
          <h1 className="max-w-3xl text-5xl leading-[0.9] text-primary-foreground md:text-8xl">
            {settings?.banner_title ?? "Built Different."}
          </h1>
          <p className="mt-4 max-w-lg text-primary-foreground/80">{settings?.banner_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link to="/shop">Shop now <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/delivery">How ordering works</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y-2 border-primary bg-accent py-3 text-accent-foreground">
        <div className="flex w-max animate-marquee gap-10 font-display text-lg">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {["Baggy denim", "Heavyweight hoodies", "Co-ord sets", "Cargo pants", "Wholesale only", "Nationwide waybill"].map((t) => (
                <span key={t}>{t} ✦</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl md:text-5xl">Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATS.map((c) => (
            <Link key={c.label} to="/shop" search={c.search} className="group relative aspect-square overflow-hidden bg-muted">
              <img src={c.img} alt={c.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/30 transition-colors group-hover:bg-primary/10" />
              <span className="absolute bottom-3 left-3 bg-background px-3 py-1 font-display text-lg">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl md:text-5xl">Trending now</h2>
          <Link to="/shop" className="eyebrow flex items-center gap-1 hover:text-accent">View all <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="grid gap-8 border-2 border-primary p-8 shadow-block md:grid-cols-2 md:p-12">
          <div>
            <span className="eyebrow text-accent">For resellers</span>
            <h2 className="mt-2 text-4xl md:text-5xl">Wholesale prices. Your profit.</h2>
            <p className="mt-4 text-muted-foreground">
              We manufacture everything ourselves, so you buy at factory prices and resell at retail. Order in bulk,
              confirm on WhatsApp, and we ship to any state.
            </p>
            <Button asChild variant="block" size="lg" className="mt-6">
              <Link to="/shop">Start your order</Link>
            </Button>
          </div>
          <ul className="grid gap-5">
            {[
              { icon: Tag, t: "Factory-direct pricing", d: "No middlemen — maximum margin for you." },
              { icon: Package, t: "Low minimum orders", d: "MOQ shown on every product." },
              { icon: Truck, t: "Waybill or pick-up", d: "We send nationwide or you collect in Lagos." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center bg-primary text-primary-foreground"><Icon /></span>
                <div>
                  <p className="font-bold">{t}</p>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
