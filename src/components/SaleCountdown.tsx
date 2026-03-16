"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

interface SaleCountdownProps {
  endTime: number;
  size?: "sm" | "md";
}

export function SaleCountdown({ endTime, size = "sm" }: SaleCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    setMounted(true);
    setRemaining(Math.max(0, endTime - Date.now()));
  }, [endTime]);

  useEffect(() => {
    if (!mounted || remaining <= 0) return;
    const timer = setInterval(() => {
      const left = Math.max(0, endTime - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, mounted, remaining]);

  if (!mounted) return null;
  if (remaining <= 0) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (size === "md") {
    return (
      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
        <Zap className="h-4 w-4 text-amber-600 fill-amber-600" />
        <span className="text-sm font-semibold text-amber-700">
          Sale ends in {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
      <Zap className="h-3 w-3 fill-amber-600" />
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
