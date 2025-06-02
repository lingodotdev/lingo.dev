import {
  LingoComponent as LingoCoreComponent,
  LingoComponentProps as LingoCoreComponentProps,
} from "../core";
import { loadDictionaryFromRequest, loadLocaleFromCookies } from "./utils";

export type LingoComponentProps = Omit<
  LingoCoreComponentProps,
  "$dictionary"
> & {
  $loadDictionary: (locale: string) => Promise<any>;
};

export async function LingoComponent(props: LingoComponentProps) {
  const { $as, $fileKey, $entryKey, $loadDictionary, ...rest } = props;
  const dictionary = await loadDictionaryFromRequest($loadDictionary);

  return (
    <LingoCoreComponent
      {...rest}
      $dictionary={dictionary}
      $as={$as}
      $fileKey={$fileKey}
      $entryKey={$entryKey}
    />
  );
}

export async function LingoHtmlComponent(
  props: React.HTMLAttributes<HTMLHtmlElement>,
) {
  const locale = await loadLocaleFromCookies();
  return <html {...props} lang={locale} data-lingodotdev-compiler={locale} />;
}
