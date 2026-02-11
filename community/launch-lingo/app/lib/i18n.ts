import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import hi from "@/locales/hi.json";
import es from "@/locales/es.json";


export const translations = {
    en,
    fr,
    hi,
    es
};

export function getTranslation(lang: string) {
    return translations[lang as keyof typeof translations] || en;
}
