"use client";

import { useTranslation } from "@/i18n";
import { activities, formatRelativeTime } from "@/mock-data";

export function ActivityFeed() {
  const { t, locale } = useTranslation();

  const getActionText = (action: string): string => {
    return t(`activity_actions.${action}`);
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)]">
      <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {t("dashboard.activity.title")}
        </h3>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {activities.length === 0 ? (
          <p className="px-6 py-10 text-sm text-[var(--text-muted)] text-center">
            {t("dashboard.activity.empty")}
          </p>
        ) : (
          activities.slice(0, 8).map((activity) => (
            <div
              key={activity.id}
              className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-hover)] transition-colors duration-150"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {activity.userName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">
                    <span className="font-medium">{activity.userName}</span>{" "}
                    <span className="text-[var(--text-secondary)]">
                      {getActionText(activity.action)}
                    </span>
                  </p>
                </div>
              </div>
              <time className="text-xs text-[var(--text-muted)] flex-shrink-0">
                {formatRelativeTime(activity.timestamp, locale)}
              </time>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
