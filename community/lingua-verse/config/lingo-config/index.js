/**
 * Shared Lingo.dev configuration
 * Used by both frontend and backend
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
];

export const CONTEXT_TYPES = {
  DEVELOPER: "developer",
  BUSINESS: "business",
  CASUAL: "casual",
  TECHNICAL: "technical",
  MARKETING: "marketing",
};

export const GLOSSARY_TERMS = {
  // Technical terms that should remain untranslated
  PRESERVE: [
    "API",
    "SDK",
    "REST",
    "GraphQL",
    "WebSocket",
    "OAuth",
    "JWT",
    "HTTP",
    "HTTPS",
    "JSON",
    "XML",
    "CSS",
    "HTML",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Socket.io",
    "Git",
    "GitHub",
    "Docker",
    "Kubernetes",
  ],

  // Custom translations for domain-specific terms
  CUSTOM: {
    Sprint: {
      es: "Sprint", // Keep in Spanish
      fr: "Sprint", // Keep in French
      de: "Sprint", // Keep in German
    },
    Standup: {
      es: "Reunión diaria",
      fr: "Réunion quotidienne",
      de: "Tägliches Meeting",
    },
    "Pull Request": {
      es: "Solicitud de extracción",
      fr: "Demande de fusion",
      de: "Pull-Anfrage",
    },
  },
};

export const DEFAULT_SOURCE_LANGUAGE = "en";

export default {
  SUPPORTED_LANGUAGES,
  CONTEXT_TYPES,
  GLOSSARY_TERMS,
  DEFAULT_SOURCE_LANGUAGE,
};
