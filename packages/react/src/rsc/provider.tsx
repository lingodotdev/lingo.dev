import { LingoProvider as LingoClientProvider } from "../client";
import { loadDictionaryFromRequest, loadLocaleFromCookies } from "./utils";

export type LingoProviderProps = {
  loadDictionary: (locale: string) => Promise<any>;
  children: React.ReactNode;
};

export async function LingoProvider(props: LingoProviderProps) {
  const dictionary = await loadDictionaryFromRequest(props.loadDictionary);

  return (
    <LingoClientProvider dictionary={dictionary}>
      {props.children}
    </LingoClientProvider>
  );
}
