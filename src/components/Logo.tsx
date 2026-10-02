import { Link } from "@tanstack/react-router";

/** Placeholder text logo — replace the inner content with an <img> of your logo. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-baseline gap-1 leading-none" aria-label="UNIK TRENDS home">
      <span className={`font-display text-2xl ${inverted ? "text-primary-foreground" : "text-primary"}`}>UNIK</span>
      <span className="text-xs font-bold lowercase tracking-widest text-accent">trends</span>
    </Link>
  );
}
