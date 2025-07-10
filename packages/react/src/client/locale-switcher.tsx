"use client";

import { useState } from "react";
import { useLingo } from "./context";
import { setLocaleInCookies } from "./utils";

export type LocaleSwitcherProps = {
  className?: string;
  locales: string[];
};

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  const lingo = useLingo();
  const { locales } = props;

  const locale = lingo.locale;

  const [isSwitching, setIsSwitching] = useState(false);

  if (!locale) {
    return null;
  }

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === locale) return;
    setIsSwitching(true);

    try {
      if (lingo.setLocale) {
        await lingo.setLocale(newLocale);
      } else {
        // Fallback for provider without dynamic switching
        setLocaleInCookies(newLocale);
        window.location.reload();
      }
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <select
      value={locale}
      className={props.className}
      onChange={(e) => handleLocaleChange(e.target.value)}
      disabled={isSwitching}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  );
}
