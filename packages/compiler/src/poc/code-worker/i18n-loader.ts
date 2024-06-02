import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import { CodeWorker, CodeWorkerContext } from './base';

export class I18nLoader extends CodeWorker<t.MemberExpression> {
  public shouldRun(nodePath: NodePath<t.Node>, ctx: CodeWorkerContext) {
    const i18nImport = ctx.importer.upsertNamedImport('@replexica/react/next', 'I18n');

    return t.isMemberExpression(nodePath.node)
      && t.isIdentifier(nodePath.node.object)
      && nodePath.node.object.name === i18nImport.name
      && t.isIdentifier(nodePath.node.property)
      && nodePath.node.property.name === 'fromRscContext';
  }

  public async run(path: NodePath<t.MemberExpression>, ctx: CodeWorkerContext) {
    const i18nImport = ctx.importer.upsertNamedImport('@replexica/react/next', 'I18n');

    path.replaceWith(
      t.callExpression(
        t.memberExpression(
          t.callExpression(
            t.memberExpression(
              t.identifier(i18nImport.name),
              t.identifier('withLoaders'),
            ),
            [
              t.objectExpression(
                ctx.params.supportedLocales.map((locale) => {
                  return t.objectProperty(
                    t.identifier(locale),
                    t.arrowFunctionExpression(
                      [],
                      t.callExpression(
                        t.identifier('import'),
                        [t.stringLiteral(`@replexica/.cache/${locale}.json`)],
                      ),
                    ),
                  );
                }),
              ),
            ],
          ),
          t.identifier('fromRscContext'),
        ),
        [],
      ),
    );
  }
}
