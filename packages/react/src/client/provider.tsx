"use client";

import { useEffect, useState } from "react";
import { LingoContext } from "./context";
import { getLocaleFromCookies } from "./utils";

export type LingoProviderProps<D> = {
  dictionary: D;
  children: React.ReactNode;
};

export function LingoProvider<D>(props: LingoProviderProps<D>) {
  // TODO: handle case when no dictionary is provided - throw suspense? return null / other fallback?
  if (!props.dictionary) {
    throw new Error("LingoProvider: dictionary is not provided.");
  }

  return (
    <LingoContext.Provider
      value={{ dictionary: props.dictionary }}
      children={props.children}
    />
  );
}

export type LingoProviderWrapperProps<D> = {
  loadDictionary: (locale: string) => Promise<D>;
  children: React.ReactNode;
};

export function LingoProviderWrapper<D>(props: LingoProviderWrapperProps<D>) {
  const [dictionary, setDictionary] = useState<D | null>(null);

  // for client-side rendered apps, the dictionary is also loaded on the client
  useEffect(() => {
    (async () => {
      try {
        const locale = getLocaleFromCookies();
        console.log(
          `[Lingo.dev] Loading dictionary file for locale ${locale}...`,
        );
        const localeDictionary = await props.loadDictionary(locale);
        setDictionary(localeDictionary);
      } catch (error) {
        console.log("[Lingo.dev] Failed to load dictionary:", error);
      }
    })();
  }, []);

  // TODO: handle case when the dictionary is loading (throw suspense?)
  if (!dictionary) {
    return null;
  }

  return (
    <LingoProvider dictionary={dictionary}>{props.children}</LingoProvider>
  );
}
