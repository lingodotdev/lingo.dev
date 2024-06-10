import * as t from '@babel/types';
import { createI18nFragment, createScopeParser, isLocalizableAttributeName, isSystemAttributeName } from "./_utils";
import { NodePath } from '@babel/core';
import { I18nFragment } from './../_types';

export const jsxAttributeScopeParser = createScopeParser({
  selector: (nodePath) => {
    if (!t.isJSXAttribute(nodePath.node)) { return false; }

    const jsxAttr = nodePath.node;
    const jsxAttrName = jsxAttr.name.name;
    if (!(typeof jsxAttrName === 'string')) { return false; }
    if (!isLocalizableAttributeName(jsxAttrName)) { return false; }
    if (isSystemAttributeName(jsxAttrName)) { return false; }

    return true;
  },
  parseFragments: (nodePath: NodePath<t.JSXAttribute>): I18nFragment[] => {
    if (!t.isJSXAttribute(nodePath.node)) { return []; }

    const jsxAttr = nodePath.node;

    const jsxAttrValue = jsxAttr.value;
    // Only string literals are supported for now
    if (!t.isStringLiteral(jsxAttrValue)) { return []; }

    return [
      createI18nFragment(nodePath, {
        type: 'js/text',
        value: jsxAttrValue.value,
      }),
    ];
  },
  type: 'jsx/attribute',
  explicit: false,
});
