"use client";

import { LanguageSelector } from "@/components/settings";
import { FadeIn } from "@/components/ui";
import { useTranslation } from "@/i18n";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 sm:space-y-10">
      <FadeIn delay={0} direction="up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1.5">
            {t("settings.subtitle")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={150} direction="up">
        <div className="max-w-2xl">
          <LanguageSelector />
        </div>
      </FadeIn>
    </div>
  );
}
