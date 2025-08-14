import {
  LingoAttributeComponent as LingoCoreAttributeComponent,
  LingoAttributeComponentProps as LingoCoreAttributeComponentProps,
} from "../core";
import { loadDictionaryFromRequest } from "./utils";

export type LingoAttributeComponentProps = Omit<
  LingoCoreAttributeComponentProps,
  "$dictionary"
>;

export async function LingoAttributeComponent(
  props: LingoAttributeComponentProps,
) {
  const {
    $attrAs,
    $attributes,
    $fileKey,
    $entryKey,
    $loadDictionary,
    ...rest
  } = props;
  const tmp = async (locale: string) => ({});
  const dictionary = await loadDictionaryFromRequest($loadDictionary ?? tmp);
  return (
    <LingoCoreAttributeComponent
      $dictionary={dictionary}
      $as={$attrAs}
      $attributes={$attributes}
      $fileKey={$fileKey}
      {...rest}
    />
  );
}
