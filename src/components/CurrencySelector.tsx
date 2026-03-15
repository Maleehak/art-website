"use client";

import { useCurrency } from "@/context/CurrencyContext";
import type { Currency } from "@/types";

const options: { value: Currency; label: string }[] = [
  { value: "USD", label: "$ USD" },
  { value: "PKR", label: "₨ PKR" },
  { value: "EUR", label: "€ EUR" },
  { value: "GBP", label: "£ GBP" },
];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="text-xs font-medium text-gallery-gray bg-transparent border border-warm-white rounded px-2 py-1 cursor-pointer hover:border-accent transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
