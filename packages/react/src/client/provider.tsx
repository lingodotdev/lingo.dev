"use client";

import { useEffect, useState, useCallback } from "react";
import { LingoContext } from "./context";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";
import { DEFAULT_LOCALE } from "../core";

export type LingoProviderProps<D> = {
  dictionary: D;
  locale?: string;
  /** Optional setter. Normally supplied by `LingoProviderWrapper`. */
  setLocale?: (locale: string) => Promise<void> | void;
  children: React.ReactNode;
};

export function LingoProvider<D>(props: LingoProviderProps<D>) {
  // TODO: handle case when no dictionary is provided - throw suspense? return null / other fallback?
  if (!props.dictionary) {
    throw new Error("LingoProvider: dictionary is not provided.");
  }

  return (
    <LingoContext.Provider
      value={{
        dictionary: props.dictionary,
        locale:
          props.locale ?? (props as any).dictionary?.locale ?? DEFAULT_LOCALE,
        setLocale: props.setLocale,
      }}
    >
      {props.children}
    </LingoContext.Provider>
  );
}

export type LingoProviderWrapperProps<D> = {
  loadDictionary: (locale: string) => Promise<D>;
  children: React.ReactNode;
};

export function LingoProviderWrapper<D>(props: LingoProviderWrapperProps<D>) {
  const [locale, setLocaleState] = useState<string>(getLocaleFromCookies());
  const [dictionary, setDictionary] = useState<D | null>(null);

  // load dictionary whenever locale changes
  useEffect(() => {
    (async () => {
      try {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            `[Lingo.dev] Loading dictionary file for locale ${locale}...`,
          );
        }

        const localeDictionary = await props.loadDictionary(locale);
        setDictionary(localeDictionary);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[Lingo.dev] Failed to load dictionary:", error);
        }
      }
    })();
  }, [locale, props.loadDictionary]);

  const setLocale = useCallback(
    async (nextLocale: string) => {
      if (nextLocale === locale) return;
      try {
        const nextDictionary = await props.loadDictionary(nextLocale);
        setLocaleInCookies(nextLocale);
        setDictionary(nextDictionary);
        setLocaleState(nextLocale);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[Lingo.dev] Failed to switch locale:", error);
        }
      }
    },
    [locale, props.loadDictionary],
  );

  // TODO: handle case when the dictionary is loading (throw suspense?)
  if (!dictionary) {
    return null;
  }

  return (
    <LingoProvider
      dictionary={dictionary}
      locale={locale}
      setLocale={setLocale}
    >
      {props.children}
    </LingoProvider>
  );
}
