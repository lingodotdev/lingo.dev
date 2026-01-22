export const dictionary: Record<string, Record<string, string>> = {
  // Navigation
  "Overview": {
    hi: "अवलोकन",
    es: "Visión General",
    fr: "Aperçu"
  },
  "Database": {
    hi: "डेटाबेस",
    es: "Base de Datos",
    fr: "Base de Données"
  },
  "Storage": {
    hi: "स्टोरेज",
    es: "Almacenamiento",
    fr: "Stockage"
  },
  "Analytics": {
    hi: "एनालिटिक्स",
    es: "Analítica",
    fr: "Analytique"
  },
  "Documentation": {
    hi: "दस्तावेज़ीकरण",
    es: "Documentación",
    fr: "Documentation"
  },
  "Platform": {
    hi: "प्लेटफ़ॉर्म",
    es: "Plataforma",
    fr: "Plateforme"
  },
  "Settings": {
    hi: "सेटिंग्स",
    es: "Configuración",
    fr: "Paramètres"
  },
  "Project Settings": {
    hi: "प्रोजेक्ट सेटिंग्स",
    es: "Configuración del Proyecto",
    fr: "Paramètres du Projet"
  },

  // Dashboard
  "Project Overview": {
    hi: "परियोजना अवलोकन",
    es: "Descripción del Proyecto",
    fr: "Aperçu du Projet"
  },
  "Monitor your database, storage, and API usage in real-time.": {
    hi: "अपने डेटाबेस, स्टोरेज और एपीआई उपयोग की रीयल-टाइम निगरानी करें।",
    es: "Monitorea tu base de datos, almacenamiento y uso de API en tiempo real.",
    fr: "Surveillez votre base de données, stockage et utilisation API en temps réel."
  },
  "Total Requests": {
    hi: "कुल अनुरोध",
    es: "Solicitudes Totales",
    fr: "Requêtes Totales"
  },
  "Last 30 Days": {
    hi: "पिछले 30 दिन",
    es: "Últimos 30 días",
    fr: "30 derniers jours"
  },
  "Database Collections": {
    hi: "डेटाबेस कलेक्शंस",
    es: "Colecciones de Base de Datos",
    fr: "Collections de Base de Données"
  },
  "142MB Data Stored": {
    hi: "142MB डेटा संग्रहीत",
    es: "142MB Almacenados",
    fr: "142MB Stockés"
  },
  "Storage Used": {
    hi: "उपयोग किया गया स्टोरेज",
    es: "Almacenamiento Usado",
    fr: "Stockage Utilisé"
  },
  "Healthy": {
    hi: "स्वस्थ",
    es: "Saludable",
    fr: "Sain"
  },
  "Recent API Activity": {
    hi: "हालिया एपीआई गतिविधि",
    es: "Actividad Reciente de API",
    fr: "Activité API Récente"
  },
  "Method": {
    hi: "तरीका",
    es: "Método",
    fr: "Méthode"
  },
  "Endpoint": {
    hi: "एंडपॉइंट",
    es: "Punto Final",
    fr: "Point de Terminaison"
  },
  "Status": {
    hi: "स्थिति",
    es: "Estado",
    fr: "Statut"
  },
  "Latency": {
    hi: "विलंबता",
    es: "Latencia",
    fr: "Latence"
  },
  "Time": {
    hi: "समय",
    es: "Tiempo",
    fr: "Temps"
  }
};

export function t(text: string, locale: string) {
  if (locale === 'en') return text;
  return dictionary[text]?.[locale] || text;
}
