import type { Activity } from "@/types";

function getRelativeTimestamp(hoursAgo: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export const activities: Activity[] = [
  {
    id: "act_001",
    userName: "Priya Sharma",
    action: "logged_in",
    timestamp: getRelativeTimestamp(0.5),
  },
  {
    id: "act_002",
    userName: "Emily Chen",
    action: "updated_settings",
    timestamp: getRelativeTimestamp(1),
  },
  {
    id: "act_003",
    userName: "Jean-Pierre Dubois",
    action: "created_user",
    timestamp: getRelativeTimestamp(2),
  },
  {
    id: "act_004",
    userName: "Carlos Rodriguez",
    action: "updated_profile",
    timestamp: getRelativeTimestamp(3),
  },
  {
    id: "act_005",
    userName: "Hans Mueller",
    action: "exported_data",
    timestamp: getRelativeTimestamp(4),
  },
  {
    id: "act_006",
    userName: "Sophie Martin",
    action: "logged_in",
    timestamp: getRelativeTimestamp(5),
  },
  {
    id: "act_007",
    userName: "Michael Johnson",
    action: "changed_password",
    timestamp: getRelativeTimestamp(6),
  },
  {
    id: "act_008",
    userName: "Maria Garcia",
    action: "deleted_user",
    timestamp: getRelativeTimestamp(8),
  },
  {
    id: "act_009",
    userName: "Rahul Verma",
    action: "logged_out",
    timestamp: getRelativeTimestamp(10),
  },
  {
    id: "act_010",
    userName: "Claire Lefevre",
    action: "updated_settings",
    timestamp: getRelativeTimestamp(12),
  },
];

export function formatRelativeTime(timestamp: string, locale: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffMins < 60) {
    return rtf.format(-diffMins, "minute");
  } else if (diffHours < 24) {
    return rtf.format(-diffHours, "hour");
  } else {
    return rtf.format(-diffDays, "day");
  }
}
