"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import es from "@/messages/es.json";

const messages: any = { en, hi, es };

export default function Home() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  const changeLang = (l: string) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <LanguageSwitcher value={lang} onChange={changeLang} />

      <h1 className="text-3xl font-bold mt-6">{messages[lang].home_title}</h1>

      <p className="mt-3 text-gray-600">{messages[lang].home_desc}</p>
    </main>
  );
}
