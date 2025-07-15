/**
 * Loads dictionary for a given locale in client-side applications.
 * 
 * Dynamically loads translation dictionaries based on the current locale in 
 * client-side rendered applications.
 * 
 * @param locale - Locale code for which to load the dictionary.
 * @returns Promise that resolves to the dictionary object containing localized content.
 * 
 * @example Use with LingoProviderWrapper in a Vite app
 * ```tsx
 * import React from "react";
 * import ReactDOM from "react-dom/client";
 * import App from "./App.tsx";
 * import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
 * 
 * ReactDOM.createRoot(document.getElementById("root")!).render(
 *   <React.StrictMode>
 *     <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
 *       <App />
 *     </LingoProviderWrapper>
 *   </React.StrictMode>,
 * );
 * ```
 * 
 * @example Use directly in a component
 * ```tsx
 * import { useState, useEffect } from "react";
 * import { loadDictionary } from "lingo.dev/react/client";
 * 
 * export function MyComponent() {
 *   const [dictionary, setDictionary] = useState(null);
 *   
 *   useEffect(() => {
 *     loadDictionary("es").then(setDictionary);
 *   }, []);
 *   
 *   if (!dictionary) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   return <div>{dictionary.welcome}</div>;
 * }
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
