import { createElement } from "react";
import _ from "lodash";
import React from "react";

export type LingoAttributeComponentProps = {
  $as: string;
  $attributes: Record<string, string>;
  $fileKey: string;
  [key: string]: any;
};

export const LingoAttributeComponent = React.forwardRef(
  (props: Omit<LingoAttributeComponentProps, "ref">, ref: React.Ref<any>) => {
    const { $as, $attributes, $fileKey, $dictionary, ...rest } = props;

    const localizedAttributes = _.mapValues($attributes, (v, k) => {
      return $dictionary?.files?.[$fileKey]?.entries?.[v] ?? k;
    });

    return createElement($as, {
      ...rest,
      ...localizedAttributes,
      ref,
    });
  },
);
