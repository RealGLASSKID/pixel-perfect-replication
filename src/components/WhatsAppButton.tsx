import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { waLink } from "@/lib/format";

export function WhatsAppButton() {
  const { data } = useQuery(settingsQuery);
  if (!data) return null;
  return (
    <a
      href={waLink(data.whatsapp_number, "Hi UNIK TRENDS, I'd like to make an enquiry.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
