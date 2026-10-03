import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — UNIK TRENDS" },
      { name: "description", content: "Contact page for UNIK TRENDS wholesale streetwear." },
      { property: "og:title", content: "Contact — UNIK TRENDS" },
      { property: "og:description", content: "Contact page for UNIK TRENDS." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-5xl">Contact</h1>
      <p className="mt-4 text-muted-foreground">This page is coming soon.</p>
    </div>
  );
}
