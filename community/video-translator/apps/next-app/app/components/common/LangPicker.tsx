"use client";

import { useId } from "react";
import { languageNames } from "../../../locals";
import styles from "./LangPicker.module.css";

interface Prop {
  currentLocale: string;
  callback: (code: string) => void;
}

export default function LangPicker({ currentLocale, callback }: Prop) {
  const id = useId();
  const locales = ["en", "es", "de", "fr", "hi", "ja"];
  const changeLocale = (code: string) => callback(code);

  return (
    <div className={styles.lang_select_container}>
      <select
        id={`locale-select-${id}`}
        value={currentLocale}
        onChange={(e) => changeLocale(e.target.value)}
        className={styles.lang_select_dropdown}
      >
        {locales.map((code) => (
          <option key={`${id}-${code}`} value={code}>
            {languageNames[currentLocale]?.[code] || code} ({code.toUpperCase()}
            )
          </option>
        ))}
      </select>
    </div>
  );
}
