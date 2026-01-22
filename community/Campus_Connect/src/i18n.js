import en from "./locales/en.json";
import hi from "./locales/hi.json";
import pa from "./locales/pa.json";

const catalogs = { en, hi, pa };

const getInitialLocale = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lingo_locale') || 'en';
  }
  return 'en';
};

let currentLocale = getInitialLocale();

export function setLocale(locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lingo_locale', locale);
    window.location.reload();
  }
}

export function t(key, options = {}) {
  const keyPath = options.scope || key;
  const parts = keyPath.split(".");
  
  let value = catalogs[currentLocale];

  for (const p of parts) {
    value = value?.[p];
  }

  if (!value) return key;

  return value.replace(/\{\{(\w+)\}\}/g, (_, k) => options[k] ?? "");
}
