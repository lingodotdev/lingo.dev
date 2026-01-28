"use client";

import { useEffect } from "react";
import { useLingoLocale, setLingoLocale } from "lingo.dev/react/client";
import { useRouter } from "next/navigation";
import LangPicker from "../common/LangPicker";

interface Props {
  paramLocale: string;
}

export default function UiLangPicker({ paramLocale }: Props) {
  const currentLocale = useLingoLocale();
  const route = useRouter();
  const resolveLocale = currentLocale || paramLocale;

  useEffect(() => {
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lingo-locale="))
      ?.split("=")[1];

    // Validate cookie locale against supported locales
    const isValidCookieLang =
      cookieLang && SUPPORTED_LOCALES.includes(cookieLang);

    // Only redirect when:
    // 1. cookieLang is valid
    // 2. cookieLang differs from explicit URL locale
    if (isValidCookieLang && cookieLang !== paramLocale) {
      route.replace(`/${cookieLang}`);
    }
  }, [route, paramLocale]);


  return <LangPicker currentLocale={ resolveLocale } callback = { changeLocale } />;
}
