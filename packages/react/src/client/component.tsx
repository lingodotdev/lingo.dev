"use client";

import {
  LingoComponent as LingoCoreComponent,
  LingoComponentProps as LingoCoreComponentProps,
} from "../core";
import { useLingo } from "./context";

export type LingoComponentProps = Omit<LingoCoreComponentProps, "$dictionary">;

export function LingoComponent(props: LingoComponentProps) {
  const { $as, $fileKey, $entryKey, ...rest } = props;
  const lingo = useLingo();
  return (
    <LingoCoreComponent
      $dictionary={lingo.dictionary}
      $as={$as}
      $fileKey={$fileKey}
      $entryKey={$entryKey}
      {...rest}
    />
  );
}

export function LingoHtmlComponent(
  props: React.HTMLAttributes<HTMLHtmlElement>,
) {
  const lingo = useLingo();
  return (
    <html
      {...props}
      lang={lingo?.dictionary?.locale}
      data-lingodotdev-compiler={lingo?.dictionary?.locale}
    />
  );
}
