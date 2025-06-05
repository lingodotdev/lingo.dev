"use client";

import { useState, useEffect } from "react";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

export type LocaleSwitcherProps = {
  locales: string[];
};

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  const { locales } = props;
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    const currentLocale = getLocaleFromCookies();
    setLocale(currentLocale);
  }, [locales]);

  if (!locale) {
    return null;
  }

  return (
    <select
      value={locale}
      onChange={(e) => {
        handleLocaleChange(e.target.value);
      }}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </select>
  );

  function handleLocaleChange(newLocale: string): Promise<void> {
    setLocaleInCookies(newLocale);
    window.location.reload();
    return Promise.resolve();
  }
}
