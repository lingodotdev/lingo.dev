"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE } from "../core";

export type LingoContextType = {
  /** Currently active locale */
  locale: string;
  /** Dictionary for the current locale */
  dictionary: any;
  /**
   * Optional setter that switches the active locale.
   * Not available when using the basic `LingoProvider` (server-only pre-render).
   */
  setLocale?: (locale: string) => Promise<void> | void;
};

export const LingoContext = createContext<LingoContextType>({
  locale: DEFAULT_LOCALE,
  dictionary: {},
});

export function useLingo() {
  return useContext(LingoContext);
}
