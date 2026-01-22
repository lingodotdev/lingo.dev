"use client";

// Map of language codes to country codes for flags
// Handles both simple codes (en, es) and locale codes (pt-BR, zh-Hans)
const languageToCountry: Record<string, string> = {
  // Simple codes
  en: "us",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "br",
  ru: "ru",
  ja: "jp",
  ko: "kr",
  zh: "cn",
  ar: "sa",
  hi: "in",
  tr: "tr",
  nl: "nl",
  pl: "pl",
  sv: "se",
  // Locale codes with regions
  "pt-BR": "br",
  "pt-PT": "pt",
  "zh-Hans": "cn",
  "zh-Hant": "tw",
  "zh-CN": "cn",
  "zh-TW": "tw",
  "en-US": "us",
  "en-GB": "gb",
  "es-ES": "es",
  "es-MX": "mx",
  "fr-FR": "fr",
  "fr-CA": "ca",
};

function getCountryCode(languageCode: string): string {
  // First try exact match
  if (languageToCountry[languageCode]) {
    return languageToCountry[languageCode];
  }
  
  // Try the base language code (before the hyphen)
  const baseCode = languageCode.split("-")[0].toLowerCase();
  if (languageToCountry[baseCode]) {
    return languageToCountry[baseCode];
  }
  
  // Fallback to the base code itself (might be a country code already)
  return baseCode;
}

interface FlagImageProps {
  languageCode: string;
  size?: number;
  className?: string;
}

export function FlagImage({ languageCode, size = 20, className = "" }: FlagImageProps) {
  const countryCode = getCountryCode(languageCode);
  
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      alt={`${countryCode.toUpperCase()} flag`}
      width={size}
      height={Math.round(size * 0.75)}
      className={`inline-block rounded-sm ${className}`}
      style={{ 
        objectFit: "cover",
        verticalAlign: "middle",
      }}
      onError={(e) => {
        // Fallback to a globe icon if flag fails to load
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
