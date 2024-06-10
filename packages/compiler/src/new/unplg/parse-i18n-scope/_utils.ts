import * as t from '@babel/types';
import { I18nFragment, I18nNode, I18nScope, I18nScopeType } from "./../_types";
import { NodePath } from '@babel/core';
import { I18nScopeParser } from './_types';
import _ from 'lodash';

export const composeScopeParsers = (...parsers: I18nScopeParser<any>[]): I18nScopeParser<t.Node> => {
  return (nodePath) => {
    for (const parser of parsers) {
      const result = parser(nodePath);
      if (result) { return result; }
    }

    return null;
  };
};

export type CreateScopeParserParams<T extends t.Node> = {
  selector: (nodePath: NodePath<T>) => boolean;
  parseFragments: (nodePath: NodePath<T>) => I18nFragment[];
  type: I18nScopeType;
  explicit: boolean;
};

export const createScopeParser = <T extends t.Node>(params: CreateScopeParserParams<T>) =>
  (parseRootScope: I18nScopeParser<t.Node>): I18nScopeParser<T> =>
    (nodePath) => {
      const isMatch = params.selector(nodePath);
      if (!isMatch) { return null; }

      const fragments = params.parseFragments(nodePath);
      const scopes: I18nScope[] = [];

      nodePath.traverse({
        enter(childPath) {
          const childScope = parseRootScope(childPath);
          if (childScope) {
            nodePath.skip();
            scopes.push(childScope);
          }
        }
      });

      return createI18nScope(nodePath, {
        type: params.type,
        hint: '',
        explicit: params.explicit,
        fragments,
        scopes,
      });
    };

export const isLocalizableAttributeName = (name: string) => {
  const commonlyLocalizableAttributes = [
    'title', // Used to render a tooltip when the user hovers over the element
    'alt', // Used to provide a text alternative for images
    'placeholder', // Used to provide a hint to the user of what can be entered in the input
    'label', // Used to provide a label for form elements
  ];

  return commonlyLocalizableAttributes.includes(name);
};

export const isSystemAttributeName = (name: string) => {
  if (name.startsWith('data-')) { return true; }
  if ([
    'key',
  ].includes(name)) { return true; }

  return false;
};

export const createI18nNode = <T extends I18nNode<any>>(
  nodePath: NodePath<t.Node>,
  role: I18nNode<any>['role'],
  data: Omit<T, 'nodePath' | 'role'>
): T => {
  return {
    ...data as any,
    role,
    nodePath,
    toJSON() {
      const keysToOmit: (keyof T)[] = ['role', 'nodePath'];
      const dataCopy = _.omit(this, keysToOmit) as any;
      return {
        ...dataCopy,
        type: this.role,
      };
    }
  };
};

export const createI18nScope = (nodePath: NodePath<t.Node>, data: Omit<I18nScope, 'nodePath' | 'role'>): I18nScope => {
  return createI18nNode<I18nScope>(nodePath, 'scope', data);
}

export const createI18nFragment = (nodePath: NodePath<t.Node>, data: Omit<I18nFragment, 'nodePath' | 'role'>): I18nFragment => {
  return createI18nNode<I18nFragment>(nodePath, 'fragment', data);
}