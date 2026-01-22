import type { Metrics } from "@/types";

export const metrics: Metrics = {
  totalUsers: 12480,
  activeUsers: 8932,
  monthlyRevenue: 84250,
  churnRate: 2.4,
  growthRate: 12.8,
};

export const metricsHistory = {
  users: [
    { month: "Jul", value: 9200 },
    { month: "Aug", value: 9800 },
    { month: "Sep", value: 10400 },
    { month: "Oct", value: 11200 },
    { month: "Nov", value: 11850 },
    { month: "Dec", value: 12480 },
  ],
  revenue: [
    { month: "Jul", value: 62000 },
    { month: "Aug", value: 67500 },
    { month: "Sep", value: 71200 },
    { month: "Oct", value: 76800 },
    { month: "Nov", value: 80100 },
    { month: "Dec", value: 84250 },
  ],
};
