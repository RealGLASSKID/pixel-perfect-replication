import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/delivery", label: "Delivery" },
  { to: "/contact", label: "Contact" },
] as const;

export function CurrencyToggle() {
  const { currency, setCurrency } = useStore();
  return (
    <div className="flex border-2 border-primary text-xs font-bold" role="group" aria-label="Currency">
      {(["NGN", "USD"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-2 py-1 ${currency === c ? "bg-primary text-primary-foreground" : "text-primary"}`}
        >
          {c === "NGN" ? "₦" : "$"}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { count } = useStore();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-primary bg-background">
      <div className="bg-primary py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
        Wholesale prices for resellers · Nationwide waybill
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-4">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-display text-2xl">
                  {n.label}
                </Link>
              ))}
              <Link to="/account" onClick={() => setOpen(false)} className="font-display text-2xl">
                Account
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="font-display text-2xl text-accent">
                  Admin
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <Logo />
        <nav className="ml-8 hidden gap-6 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="eyebrow hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="eyebrow text-accent">
              Admin
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <CurrencyToggle />
          <Link to={user ? "/account" : "/auth"} aria-label="Account" className="p-1">
            <User className="h-5 w-5" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative p-1">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
