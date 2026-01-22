import { useLingoContext } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLingoContext();

  return (
    <select
      className="bg-blue-50 p-2 rounded-2xl"
      value={locale}
      onChange={(e) => setLocale(e.target.value as any)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="hi">Hindi</option>
    </select>
  );
}
