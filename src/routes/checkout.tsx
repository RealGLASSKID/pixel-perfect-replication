import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — UNIK TRENDS" },
      { name: "description", content: "Checkout page for UNIK TRENDS wholesale streetwear." },
      { property: "og:title", content: "Checkout — UNIK TRENDS" },
      { property: "og:description", content: "Checkout page for UNIK TRENDS." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-5xl">Checkout</h1>
      <p className="mt-4 text-muted-foreground">This page is coming soon.</p>
    </div>
  );
}
