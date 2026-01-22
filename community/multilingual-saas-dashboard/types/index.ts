export type Locale = "en" | "hi" | "fr" | "es";

export type UserRole = "admin" | "manager" | "user";

export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  joinedAt: string;
}

export interface Metrics {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  growthRate: number;
}

export interface Activity {
  id: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}
