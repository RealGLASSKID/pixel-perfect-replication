import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, Store, Truck } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { waLink } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery & Pick-up — UNIK TRENDS" },
      {
        name: "description",
        content:
          "Nationwide waybill to any state in Nigeria or pick up your wholesale streetwear order in person at our Lagos workshop.",
      },
      { property: "og:title", content: "Delivery & Pick-up — UNIK TRENDS" },
      {
        property: "og:description",
        content: "Waybill to any state in Nigeria, or collect in person at our Lagos workshop.",
      },
    ],
  }),
  component: Page,
});

const OPTIONS = [
  {
    icon: Truck,
    title: "Waybill to another state",
    tag: "Nationwide",
    body: "We send your order to any state in Nigeria through trusted park / logistics partners. Enter a terminal that is convenient for you and collect from there.",
    note: "Waybill fee is paid by you on pickup — it is never added to the item price.",
  },
  {
    icon: Store,
    title: "Pick-up in person",
    tag: "Lagos",
    body: "Once your order is confirmed and packed, you can collect it in person at our Lagos workshop. Great if you are around — inspect everything before you leave.",
    note: "Collection is after order confirmation. No waybill fee.",
  },
  {
    icon: MessageCircle,
    title: "Other",
    tag: "On request",
    body: "Have a dispatch rider, your own logistics company, or a different arrangement in mind? Chat with us on WhatsApp and we will work it out with you.",
    note: "Arranged case by case on WhatsApp.",
  },
] as const;

const STEPS = [
  { n: "01", title: "Pick your pieces", body: "Shop the collection, choose sizes and colours, and meet the minimum order quantity on each item." },
  { n: "02", title: "Confirm on WhatsApp", body: "We confirm your order, quantities and delivery preference with you directly on WhatsApp." },
  { n: "03", title: "Make payment", body: "Pay the agreed amount for the goods. Waybill fees, if any, are settled separately on pickup." },
  { n: "04", title: "Receive or collect", body: "We dispatch to your state via waybill, or hold your order ready for pick-up at our Lagos workshop." },
] as const;

function Page() {
  const { data: settings } = useQuery(settingsQuery);
  const wa = waLink(settings?.whatsapp_number ?? "2348000000000", "Hi UNIK TRENDS, I have a question about delivery.");

  return (
    <div>
      {/* Hero */}
      <section className="border-b-2 border-primary bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <span className="eyebrow text-accent">Nationwide · Lagos pick-up</span>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[0.9] md:text-7xl">Delivery &amp; pick-up</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            We ship to every state in Nigeria — or come collect from us in Lagos. Whichever way, everything is
            confirmed with you on WhatsApp first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <a href={wa} target="_blank" rel="noreferrer">
                Ask about delivery <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/shop">Start your order</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl md:text-5xl">Choose how you receive it</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {OPTIONS.map(({ icon: Icon, title, tag, body, note }) => (
            <article key={title} className="flex flex-col border-2 border-primary bg-card p-6 shadow-block">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center bg-primary text-primary-foreground">
                  <Icon />
                </span>
                <span className="eyebrow bg-secondary px-2 py-1 text-primary">{tag}</span>
              </div>
              <h3 className="mt-5 text-xl leading-tight">{title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{body}</p>
              <p className="mt-4 border-t-2 border-dashed border-border pt-4 text-xs font-bold">{note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Fee strip */}
      <section className="border-y-2 border-primary bg-accent py-3">
        <div className="mx-auto max-w-7xl px-4 text-center font-display text-sm md:text-base">
          Waybill fee is paid by the customer on pickup — never included in the item price.
        </div>
      </section>

      {/* How ordering works */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl md:text-5xl">How ordering works</h2>
          <Link to="/shop" className="eyebrow hidden items-center gap-1 hover:text-accent sm:flex">
            Shop now <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="border-2 border-primary p-6">
              <span className="font-display text-4xl text-accent">{s.n}</span>
              <h3 className="mt-3 text-lg leading-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Policy block */}
      {settings?.delivery_info && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="border-2 border-primary bg-secondary p-6 md:p-8">
            <span className="eyebrow text-accent">Official delivery policy</span>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{settings.delivery_info}</p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 border-2 border-primary p-8 shadow-block md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-3xl md:text-5xl">Not sure which way to go?</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Tell us your city and order size on WhatsApp — we will recommend the cheapest and fastest way to get
              your stock to you.
            </p>
          </div>
          <Button asChild variant="whatsapp" size="lg" className="justify-self-start md:justify-self-end">
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle /> Chat with us
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
