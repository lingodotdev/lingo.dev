"use client";

import { LocaleSwitcher } from "@lingo.dev/_compiler-beta/react";
import { router } from "next/client";

export const LanguageSwitcher = () => {
  return (
    <LocaleSwitcher
      router={router}
      locales={[
        { code: "en", label: "English" },
        { code: "de", label: "Deutsch" },
        { code: "fr", label: "Français" },
      ]}
    />
  );
};
