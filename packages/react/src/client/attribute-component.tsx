"use client";

import { forwardRef } from "react";
import {
  LingoAttributeComponent as LingoCoreAttributeComponent,
  LingoAttributeComponentProps as LingoCoreAttributeComponentProps,
} from "../core";
import { useLingo } from "./context";

export type LingoAttributeComponentProps = Omit<
  LingoCoreAttributeComponentProps,
  "$dictionary"
>;

export const LingoAttributeComponent = forwardRef<
  any,
  LingoAttributeComponentProps
>(function LingoAttributeComponent(props, ref) {
  const { $attrAs, $attributes, $fileKey, ...rest } = props;
  const lingo = useLingo();
  return (
    <LingoCoreAttributeComponent
      ref={ref}
      $dictionary={lingo.dictionary}
      $as={$attrAs}
      $attributes={$attributes}
      $fileKey={$fileKey}
      {...rest}
    />
  );
});
