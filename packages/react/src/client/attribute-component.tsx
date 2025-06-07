"use client";

import {
  LingoAttributeComponent as LingoCoreAttributeComponent,
  LingoAttributeComponentProps as LingoCoreAttributeComponentProps,
} from "../core";
import { useLingo } from "./context";

export type LingoAttributeComponentProps = Omit<
  LingoCoreAttributeComponentProps,
  "$dictionary"
>;

export function LingoAttributeComponent(props: LingoAttributeComponentProps) {
  const { $attrAs, $attributes, $fileKey, ...rest } = props;
  const lingo = useLingo();
  return (
    <LingoCoreAttributeComponent
      $dictionary={lingo.dictionary}
      $as={$attrAs}
      $attributes={$attributes}
      $fileKey={$fileKey}
      {...rest}
    />
  );
}
