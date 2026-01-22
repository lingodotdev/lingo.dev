import { LocaleSwitcher } from "lingo.dev/react/client";

export function LanguageSwitcher() {
  return (
    <div >
      <LocaleSwitcher locales={["en", "de", "fr"]} />
    </div>
  );
}