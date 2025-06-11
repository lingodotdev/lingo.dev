import { describe, it, expect } from "vitest";
import * as t from "@babel/types";
import { createLocaleImportMap } from "./create-locale-import-map";

describe("createLocaleImportMap", () => {
  const allLocales = ["en", "de", "en-US"];
  const dictionaryPath = "/foo/bar";

  const objExpr = createLocaleImportMap(allLocales, dictionaryPath);

  it("returns a Babel ObjectExpression", () => {
    expect(t.isObjectExpression(objExpr)).toBe(true);
  });

  it("creates one property per locale", () => {
    expect(objExpr.properties.length).toBe(allLocales.length);
  });

  it("uses string literal keys and import arrow functions correctly", () => {
    for (const prop of objExpr.properties) {
      // Ensure property is ObjectProperty
      expect(t.isObjectProperty(prop)).toBe(true);
      if (!t.isObjectProperty(prop)) continue;

      // Check the key is a string literal matching one of the locales
      expect(t.isStringLiteral(prop.key)).toBe(true);
      const keyLiteral = prop.key as t.StringLiteral;
      expect(allLocales).toContain(keyLiteral.value);

      // Ensure value is an arrow function with no params
      expect(t.isArrowFunctionExpression(prop.value)).toBe(true);
      const arrowFn = prop.value as t.ArrowFunctionExpression;
      expect(arrowFn.params.length).toBe(0);

      // The body should be a call expression to dynamic import
      expect(t.isCallExpression(arrowFn.body)).toBe(true);
      const callExpr = arrowFn.body as t.CallExpression;

      // Callee is identifier 'import'
      expect(t.isIdentifier(callExpr.callee)).toBe(true);
      if (t.isIdentifier(callExpr.callee)) {
        expect(callExpr.callee.name).toBe("import");
      }

      // Single argument: string literal with proper path
      expect(callExpr.arguments.length).toBe(1);
      const arg = callExpr.arguments[0];
      expect(t.isStringLiteral(arg)).toBe(true);
      if (t.isStringLiteral(arg)) {
        expect(arg.value).toBe(`${dictionaryPath}?locale=${keyLiteral.value}`);
      }
    }
  });
});
