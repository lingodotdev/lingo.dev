"use client";

import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import {
  LingoComponent as LingoCoreComponent,
  LingoComponentProps as LingoCoreComponentProps,
} from "../core";
import { useLingo } from "./context";

export type LingoComponentProps = Omit<LingoCoreComponentProps, "$dictionary">;

export const LingoComponent = forwardRef<any, LingoComponentProps>(
  function LingoComponent(props, ref) {
    const { $as, $fileKey, $entryKey, ...rest } = props;
    const lingo = useLingo();
    return (
      <LingoCoreComponent
        ref={ref}
        $dictionary={lingo.dictionary}
        $as={$as}
        $fileKey={$fileKey}
        $entryKey={$entryKey}
        {...rest}
      />
    );
  },
);

export function LingoHtmlComponent(props: HTMLAttributes<HTMLHtmlElement>) {
  const lingo = useLingo();
  return (
    <html
      {...props}
      lang={lingo?.dictionary?.locale}
      data-lingodotdev-compiler={lingo?.dictionary?.locale}
    />
  );
}
