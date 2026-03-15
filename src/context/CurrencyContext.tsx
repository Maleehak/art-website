"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Currency } from "@/types";
import { CURRENCIES, formatPrice } from "@/lib/utils";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  format: (amount: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("PKR");

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    format: (amount: number) => formatPrice(amount, currency),
    symbol: CURRENCIES[currency].symbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
