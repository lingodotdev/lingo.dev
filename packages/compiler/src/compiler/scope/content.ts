import * as t from '@babel/types';
import { NodePath } from '@babel/core';
import { IReplexicaScope } from "./types";
import { findImmediateJsxParent, getDefaultImportName, getImportName, hasJsxTextChildren, injectDefaultImport, injectImport } from './../../utils/ast';
import { ReplexicaChunk } from './chunk';
import { generateScopeId } from '../../utils/id';
import { ReplexicaScopeData, ReplexicaScopeHint } from '../types';
import { ReplexicaBaseScope } from './base';

export class ReplexicaContentScope extends ReplexicaBaseScope implements IReplexicaScope {
  public static fromNode(path: NodePath<t.Node>): IReplexicaScope[] {
    if (!path.isJSXElement() && !path.isJSXFragment()) { return []; }
    // to return true, must have non-empty when trimmed JSXText children
    // and either not have a parent JSX element at all, or have a parent JSX element with no text children
    const hasTextContent = hasJsxTextChildren(path);
    if (!hasTextContent) { return []; }

    const jsxElementContainer = findImmediateJsxParent(path);
    if (jsxElementContainer && hasJsxTextChildren(jsxElementContainer)) { return []; }

    const scope = new ReplexicaContentScope(path);
    return [scope];
  }

  private constructor(
    private readonly path: NodePath<t.JSXElement | t.JSXFragment>,
  ) {
    super();
    const _scope = this;

    path.traverse({
      JSXOpeningElement(path) {
        path.skip();
      },
      JSXText(path) {
        const chunk = ReplexicaChunk.fromJsxText(path);
        if (chunk.text.length) {
          _scope._chunks.add(chunk);
        }
      },
      JSXExpressionContainer(path) {
        const chunk = ReplexicaChunk.fromJsxExpressionContainer(path);
        if (chunk.text.length) {
          _scope._chunks.add(chunk);
        }
      },
    });

    const chunkIds = Array.from(this._chunks).map((chunk) => chunk.id);
    this._id = generateScopeId(chunkIds, 0);
  }

  private _chunks: Set<ReplexicaChunk> = new Set();
  private _id: string;

  public get id(): string {
    return this._id;
  }

  public injectIntl(fileId: string, isServer: boolean): ReplexicaScopeData {
    const result: ReplexicaScopeData = {};

    const programNode = this.path.findParent((p) => p.isProgram()) as NodePath<t.Program> | null;
    if (!programNode) { throw new Error(`Couldn't find file node`); }

    const packageName = isServer ? '@replexica/react/next' : '@replexica/react/client';
    const localHelperName = 'I18nChunk';

    for (const chunk of this._chunks) {
      if (chunk.isPlaceholder) { continue; }

      let helperName = getImportName(programNode, packageName, localHelperName);
      if (!helperName) {
        helperName = injectImport(programNode, packageName, localHelperName);
      }

      const injectedElement = t.jsxOpeningElement(
        t.jsxIdentifier(helperName),
        [
          t.jsxAttribute(t.jsxIdentifier('fileId'), t.stringLiteral(fileId)),
          t.jsxAttribute(t.jsxIdentifier('scopeId'), t.stringLiteral(this.id)),
          t.jsxAttribute(t.jsxIdentifier('chunkId'), t.stringLiteral(chunk.id)),
        ],
        true,
      );

      if (isServer) {
        // TODO: instead of the below code, we should be able to do the following:
        // 0. Decide if i18n files must be in project or seamlessly in node modules
        // 1. use loadI18nFromCookie({ en: () => import ('./src/i18n/en.json') }) to pass into the component props
        // 2. find and replace loadI18nFromCookie() with loadI18nFromCookie({ en: () => import ('./src/i18n/en.json') })
        // 3. find and replace loadI18nFromParam() with loadI18nFromParam({ en: () => import ('./src/i18n/en.json') })
        // 4. Enable Attribute scopes and Skip scopes
        // 5. Move everything into the replexica package
        // 6. Perform i18n during the production build
        // 7. Show i18n data missing screen during development
        // 8. Provide a command to export hidden i18n data

        // make sure the following import is available in the file:
        // import i18n from '@/i18n';
        let localeDataLoaderImportName = getDefaultImportName(programNode, '@/i18n');
        if (!localeDataLoaderImportName) {
          localeDataLoaderImportName = injectDefaultImport(programNode, '@/i18n', 'loadI18n');
        }

        // add the following props to the injected element:
        // loadLocaleData={localeDataLoaderImportName.loadData}
        injectedElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('loadI18n'),
            t.jsxExpressionContainer(
              t.identifier(localeDataLoaderImportName),
            ),
          )
        );
      }

      chunk.path.replaceWith(
        t.jsxElement(
          injectedElement,
          null,
          [],
          true,
        )  
      );

      result[chunk.id] = chunk.text;
    }

    return result;
  }

  public extractHints(): ReplexicaScopeHint[] {    
    const result = this._extractBaseHints(this.path);
    return result;
  }
}
