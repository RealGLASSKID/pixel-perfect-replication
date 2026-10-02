import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm opacity-70">
            Trendy streetwear made in Nigeria. Baggy denim, heavyweight hoodies and more — at wholesale prices for
            resellers.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-2 text-accent">Shop</span>
          <Link to="/shop">All products</Link>
          <Link to="/shop" search={{ gender: "men" }}>Men</Link>
          <Link to="/shop" search={{ gender: "women" }}>Women</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-2 text-accent">Info</span>
          <Link to="/about">About</Link>
          <Link to="/delivery">Delivery & Pick-up</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/account">My account</Link>
        </div>
      </div>
      <div className="border-t border-sidebar-border py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} UNIK TRENDS. All rights reserved.
      </div>
    </footer>
  );
}
