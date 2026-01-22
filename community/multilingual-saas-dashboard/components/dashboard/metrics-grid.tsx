"use client";

import { Users, UserCheck, DollarSign, TrendingDown } from "lucide-react";
import { MetricCard } from "./metric-card";
import { FadeIn } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { metrics } from "@/mock-data";

export function MetricsGrid() {
  const { t, locale } = useTranslation();

  const metricsData = [
    {
      title: t("dashboard.metrics.total_users"),
      value: metrics.totalUsers,
      icon: Users,
      trend: { value: 8.2, isPositive: true },
      format: "number" as const,
    },
    {
      title: t("dashboard.metrics.active_users"),
      value: metrics.activeUsers,
      icon: UserCheck,
      trend: { value: 5.1, isPositive: true },
      format: "number" as const,
    },
    {
      title: t("dashboard.metrics.monthly_revenue"),
      value: metrics.monthlyRevenue,
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true },
      format: "currency" as const,
    },
    {
      title: t("dashboard.metrics.churn_rate"),
      value: metrics.churnRate,
      icon: TrendingDown,
      trend: { value: 0.3, isPositive: false },
      format: "percentage" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {metricsData.map((metric, index) => (
        <FadeIn key={metric.title} delay={100 + index * 100} direction="up">
          <MetricCard
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            format={metric.format}
            locale={locale}
          />
        </FadeIn>
      ))}
    </div>
  );
}
