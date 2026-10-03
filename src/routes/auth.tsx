import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — UNIK TRENDS" },
      { name: "description", content: "Sign in page for UNIK TRENDS wholesale streetwear." },
      { property: "og:title", content: "Sign in — UNIK TRENDS" },
      { property: "og:description", content: "Sign in page for UNIK TRENDS." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-5xl">Sign in</h1>
      <p className="mt-4 text-muted-foreground">This page is coming soon.</p>
    </div>
  );
}
