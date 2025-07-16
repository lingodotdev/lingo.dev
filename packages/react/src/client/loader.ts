/**
 * Loads a dictionary containing localized content for the given locale.
 *
 * This function:
 *
 * - Should be used in client-side rendered applications (e.g., Vite-based apps)
 * - Should be passed into the `LingoProviderWrapper` component
 *
 * @param locale - The locale to load the dictionary for.
 *
 * @returns The dictionary object containing localized content.
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
 *     <LingoProviderWrapper loadDictionary={loadDictionary}>
 *       <App />
 *     </LingoProviderWrapper>
 *   </React.StrictMode>,
 * );
 * ```
 */
export const loadDictionary = async (locale: string): Promise<any> => {
  return {};
};

export const loadDictionary_internal = async (
  locale: string,
  loaders: Record<string, () => Promise<any>> = {},
): Promise<any> => {
  const loader = loaders[locale];
  if (!loader) {
    throw new Error(`No loader found for locale: ${locale}`);
  }

  return loader().then((m) => m.default);
};
