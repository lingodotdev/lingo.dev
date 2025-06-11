import * as t from "@babel/types";

export function createLocaleImportMap(
  allLocales: string[],
  dictionaryPath: string,
): t.ObjectExpression {
  return t.objectExpression(
    allLocales.map((locale) =>
      t.objectProperty(
        t.stringLiteral(locale),
        t.arrowFunctionExpression(
          [],
          t.callExpression(t.identifier("import"), [
            t.stringLiteral(`${dictionaryPath}?locale=${locale}`),
          ]),
        ),
      ),
    ),
  );
}
