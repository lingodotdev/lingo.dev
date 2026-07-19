import type { DictionarySchema } from "../api";

/**
 * Few-shot examples for LLM translation
 * These help the LLM understand the expected format and behavior
 */
const source: DictionarySchema = {
  version: 0.1,
  locale: "en",
  entries: {
    "1z2x3c4v": "Dashboard",
    "5t6y7u8i": "Settings",
    "9o0p1q2r": "Logout",
    "9k0l1m2n": "© 2025 Lingo.dev. All rights reserved.",
  },
};

function target(
  locale: DictionarySchema["locale"],
  dashboard: string,
  settings: string,
  logout: string,
  rights: string,
): DictionarySchema {
  return {
    version: 0.1,
    locale,
    entries: {
      "1z2x3c4v": dashboard,
      "5t6y7u8i": settings,
      "9o0p1q2r": logout,
      "9k0l1m2n": `© 2025 Lingo.dev. ${rights}`,
    },
  };
}

// One example per target language. getShots() only returns the example whose
// language matches the requested target, so the model is never shown a
// demonstration in the wrong language (see #2041).
export const shots: [DictionarySchema, DictionarySchema][] = [
  [source, target("es", "Panel de control", "Configuración", "Cerrar sesión", "Todos los derechos reservados.")],
  [source, target("fr", "Tableau de bord", "Paramètres", "Déconnexion", "Tous droits réservés.")],
  [source, target("de", "Übersicht", "Einstellungen", "Abmelden", "Alle Rechte vorbehalten.")],
  [source, target("it", "Pannello di controllo", "Impostazioni", "Esci", "Tutti i diritti riservati.")],
  [source, target("pt", "Painel", "Configurações", "Sair", "Todos os direitos reservados.")],
  [source, target("nl", "Overzicht", "Instellingen", "Afmelden", "Alle rechten voorbehouden.")],
  [source, target("ru", "Панель управления", "Настройки", "Выйти", "Все права защищены.")],
  [source, target("ja", "ダッシュボード", "設定", "ログアウト", "無断転載を禁じます。")],
  [source, target("ko", "대시보드", "설정", "로그아웃", "모든 권리 보유.")],
  [source, target("zh-Hans", "仪表板", "设置", "退出登录", "保留所有权利。")],
  [source, target("zh-Hant", "儀表板", "設定", "登出", "保留所有權利。")],
];

export function getShots(
  targetLocale: string,
): [DictionarySchema, DictionarySchema][] {
  return shots.filter(([, output]) => localeMatches(output.locale, targetLocale));
}

function localeMatches(shotLocale: string, targetLocale: string): boolean {
  const shot = normalize(shotLocale);
  const target = normalize(targetLocale);
  if (shot.split("-")[0] !== target.split("-")[0]) {
    return false;
  }
  // Chinese is the only language we ship examples for that splits by script, so
  // a bare language-subtag match isn't enough: never serve a Simplified example
  // for a Traditional target or vice versa.
  if (shot.split("-")[0] === "zh") {
    return chineseScript(shot) === chineseScript(target);
  }
  return true;
}

function normalize(locale: string): string {
  return locale.replace(/_/g, "-").toLowerCase();
}

function chineseScript(locale: string): "hans" | "hant" {
  if (locale.includes("hant")) return "hant";
  if (locale.includes("hans")) return "hans";
  const region = locale.split("-")[1];
  if (region === "tw" || region === "hk" || region === "mo") return "hant";
  return "hans";
}
