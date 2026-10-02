export type Currency = "NGN" | "USD";

export function formatPrice(amount: number, currency: Currency) {
  if (currency === "NGN") return "₦" + Math.round(amount).toLocaleString("en-NG");
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const ORDER_STATUSES = ["Pending", "Confirmed/Paid", "Shipped", "Delivered", "Cancelled"] as const;
export const DELIVERY_OPTIONS = ["Waybill to another state", "Pick-up in person", "Other"] as const;
export const CATEGORIES = ["Men", "Women", "Hoodies", "Baggy", "Other"] as const;
export const GENDERS = ["men", "women", "unisex"] as const;

export function waLink(number: string, text: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
