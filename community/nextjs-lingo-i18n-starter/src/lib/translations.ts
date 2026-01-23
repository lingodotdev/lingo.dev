import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import es from "@/locales/es.json";

const dictionaries: Record<string, Record<string, string>> = {
  en,
  hi,
  es,
};

export function t(lang: string, key: string): string {
  const dict = dictionaries[lang] ?? dictionaries.en;
  return dict[key] ?? dictionaries.en[key] ?? key;
}
