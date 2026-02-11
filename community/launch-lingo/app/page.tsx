"use client";

import { useState } from "react";
import { getTranslation } from "./lib/i18n";

export default function Home() {
  const [lang, setLang] = useState("en");
  const trans = getTranslation(lang)

  return (
    <div className="p-10">
      <div className="mb-6 space-x-2">
        <button onClick={() => setLang("en")}>EN</button>
        <button onClick={() => setLang("fr")}>FR</button>
        <button onClick={() => setLang("hi")}>HI</button>
        <button onClick={() => setLang("es")}>ES</button>
      </div>

      <h1 className="text-3xl font-bold">{trans["hero.title"]}</h1>
      <p className="mt-4">{trans["hero.subtitle"]}</p>
      <button className="mt-6 bg-black text-white px-4 py-2">
        {trans["cta.start"]}
      </button>
    </div>
  );
}
