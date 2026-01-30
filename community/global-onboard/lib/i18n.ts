import uiEn from "@/data/ui.en.json";
import uiEs from "@/data/ui.es.json";
import uiFr from "@/data/ui.fr.json";
import uiHi from "@/data/ui.hi.json";

import templateEn from "@/data/onboarding_template.en.json";
import templateEs from "@/data/onboarding_template.es.json";
import templateFr from "@/data/onboarding_template.fr.json";
import templateHi from "@/data/onboarding_template.hi.json";

export type Locale = "en" | "es" | "fr" | "hi";
export const SUPPORTED_LOCALES: Locale[] = ["en", "es", "fr", "hi"];

export type Task = {
  id: string;
  title: string;
  description: string;
};

export type OnboardingTemplate = {
  companyName: string;
  role: string;
  tasks: Task[];
};

type UiDictionary = Record<string, string>;

type TemplateMap = {
  template: OnboardingTemplate;
};

const uiByLocale: Record<Locale, UiDictionary> = {
  en: uiEn satisfies UiDictionary,
  es: uiEs satisfies UiDictionary,
  fr: uiFr satisfies UiDictionary,
  hi: uiHi satisfies UiDictionary,
};

const templateByLocale: Record<Locale, TemplateMap> = {
  en: templateEn satisfies TemplateMap,
  es: templateEs satisfies TemplateMap,
  fr: templateFr satisfies TemplateMap,
  hi: templateHi satisfies TemplateMap,
};

export function getUi(locale: Locale): UiDictionary {
  return uiByLocale[locale] ?? uiByLocale.en;
}

export function getTemplate(locale: Locale): OnboardingTemplate {
  return (templateByLocale[locale] ?? templateByLocale.en).template;
}

export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    hi: "हिन्दी",
  };
  return labels[locale];
}
