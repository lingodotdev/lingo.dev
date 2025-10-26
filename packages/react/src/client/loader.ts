import { getDictionary } from "../core";

/**
 * A placeholder function for loading dictionaries that contain localized content.
 *
 * This function:
 *
 * - Should be used in client-side rendered applications (e.g., Vite-based apps)
 * - Should be passed into the `LingoProviderWrapper` component
 * - Is transformed into functional code by Lingo.dev Compiler
 *
 * @param locale - The locale to load the dictionary for.
 *
 * @returns Promise that resolves to the dictionary object containing localized content.
 *
 * @example Use in a Vite application
 * ```tsx
 * import React from "react";
 * import ReactDOM from "react-dom/client";
 * import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
 * import { App } from "./App.tsx";
 *
 * ReactDOM.createRoot(document.getElementById("root")!).render(
 *   <React.StrictMode>
 *     <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
 *       <App />
 *     </LingoProviderWrapper>
 *   </React.StrictMode>,
 * );
 * ```
 */
export const loadDictionary = async (locale: string | null): Promise<any> => {
  return {};
};

export const loadDictionary_internal = async (
  locale: string | null,
  dictionaryLoaders: Record<string, () => Promise<any>> = {},
): Promise<any> => {
  return getDictionary(locale, dictionaryLoaders);
};
