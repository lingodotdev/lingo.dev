"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: "number" | "currency" | "percentage";
  locale?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  format = "number",
  locale = "en",
  delay = 0,
}: MetricCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case "percentage":
        return `${val}%`;
      default:
        return new Intl.NumberFormat(locale).format(val);
    }
  };

  return (
    <div
      className="group relative bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all duration-300 ease-gentle"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            {formatValue(value)}
          </p>
          {trend && (
            <p
              className={`text-sm font-medium inline-flex items-center gap-1 ${
                trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              }`}
            >
              <span className="text-xs">
                {trend.isPositive ? "↑" : "↓"}
              </span>
              {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-[var(--accent-subtle)] rounded-xl">
          <Icon className="w-5 h-5 text-[var(--accent-text)]" />
        </div>
      </div>
    </div>
  );
}
