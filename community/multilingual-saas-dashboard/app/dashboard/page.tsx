"use client";

import { MetricsGrid, ActivityFeed } from "@/components/dashboard";
import { FadeIn } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAuthMock } from "@/hooks";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthMock();

  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="space-y-8 sm:space-y-10">
      <FadeIn delay={0} direction="up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {t("dashboard.welcome")}, {firstName}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1.5">
            {t("dashboard.overview")}
          </p>
        </div>
      </FadeIn>

      <MetricsGrid />

      <FadeIn delay={500} direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed />
        </div>
      </FadeIn>
    </div>
  );
}
