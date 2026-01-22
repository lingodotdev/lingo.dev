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

    route.replace(cookieLang ? `/${cookieLang}` : "/en");
  }, [route]);

  const changeLocale = (code: string) => {
    setLingoLocale(code);
    route.push(`/${code}`);
  };

  return <LangPicker currentLocale={resolveLocale} callback={changeLocale} />;
}
