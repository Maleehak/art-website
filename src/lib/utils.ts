import type { Currency, CurrencyRate } from "@/types";

export const CURRENCIES: Record<Currency, CurrencyRate> = {
  PKR: { code: "PKR", symbol: "₨", rate: 1 },
  USD: { code: "USD", symbol: "$", rate: 0.0036 },
  EUR: { code: "EUR", symbol: "€", rate: 0.0033 },
  GBP: { code: "GBP", symbol: "£", rate: 0.0028 },
};

export function formatPrice(
  amount: number,
  currency: Currency = "PKR"
): string {
  const { symbol } = CURRENCIES[currency];
  const converted = currency === "PKR" ? amount : amount * CURRENCIES[currency].rate;
  return `${symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: currency === "PKR" ? 0 : 2,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  })}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
