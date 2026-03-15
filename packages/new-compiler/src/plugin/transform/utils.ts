import type { TranslationEntry } from "../../types";
import type { NodePath } from "@babel/traverse";
import type { VariableDeclaration } from "@babel/types";
import * as t from "@babel/types";
import { generateTranslationHash } from "../../utils/hash";
import { useI18n } from "./use-i18n";

type TranslationEntryByType = {
  [T in TranslationEntry as T["type"]]: T;
};

const root = "@lingo.dev/compiler";
// TODO (AleksandrSl 28/11/2025): See jsx-content.ts in the old compiler for future improvements.

/**
 * Normalize whitespace in translatable text.
 * - Collapses multiple spaces/tabs/newlines into a single space
 * - Preserves single spaces between words
 * - Trims leading and trailing whitespace
 *
 * Example: "Hello\n    world  \n  foo" → "Hello world foo"
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\s+/g, " ") // Collapse all whitespace sequences to single space
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Escape literal angle brackets that are not part of ICU MessageFormat tags
 */
export function escapeTextForICU(text: string): string {
  // Related spec - https://unicode-org.github.io/icu/userguide/format_parse/messages/#quotingescaping
  return text
    .replace(/'/g, "''")
    .replace(/\{/g, "'{'")
    .replace(/}/g, "'}'")
    .replace(/</g, "'<'")
    .replace(/#/g, "'#'");
}

/**
 * Detect if a function is a React component by checking if it returns JSX
 */
export function isReactComponent(
  path: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >,
): boolean {
  // Check for arrow function with JSX expression body: () => <div>...</div>
  if (path.isArrowFunctionExpression()) {
    const body = path.node.body;
    if (body.type === "JSXElement" || body.type === "JSXFragment") {
      return true;
    }
  }

  // Babel traverses with DFS so we get the innermost function return first if any.
  // But if at least one function returns JSX I guess we should transform the whole function.
  // It's a weird corner case.

  // Check for explicit return statements with JSX
  // We could also check for the first JSX?
  let returnsJSX = false;
  path.traverse({
    ReturnStatement(returnPath) {
      const argument = returnPath.node.argument;
      if (
        argument &&
        (argument.type === "JSXElement" || argument.type === "JSXFragment")
      ) {
        returnsJSX = true;
      }
    },
  });

  // ts doesn't see what happens inside path.traverse, and erroneously narrows returnsJsx to false
  return returnsJSX as boolean;
}

/**
 * Infer component name from various patterns
 */
export function inferComponentName(path: NodePath<any>): string | null {
  // Named function: function MyComponent() {}
  if (path.node.id && path.node.id.name) {
    return path.node.id.name;
  }

  // Variable declaration: const MyComponent = () => {}
  const parent = path.parent;
  if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
    return parent.id.name;
  }

  // TODO (AleksandrSl 25/11/2025): It should support export const $NAME$
  // Export: export default function() {}
  if (parent.type === "ExportDefaultDeclaration") {
    return "default";
  }

  return null;
}

/**
 * Check for 'use i18n' directive at program level
 */
export function hasUseI18nDirective(program: NodePath<t.Program>): boolean {
  const directives = program.node.directives || [];
  return directives.some(
    (directive: t.Directive) => directive.value.value === useI18n,
  );
}

export function createTranslationEntry<T extends keyof TranslationEntryByType>(
  type: T,
  text: string,
  context: Omit<TranslationEntryByType[T]["context"], "filePath">,
  filePath: string,
  line?: number,
  column?: number,
  overrides?: Record<string, string>,
): TranslationEntryByType[T] {
  const fullContext = { ...context, filePath };
  const hash = generateTranslationHash(text, fullContext);

  return {
    type,
    sourceText: text,
    context: fullContext,
    hash,
    location: {
      filePath,
      line,
      column,
    },
    overrides:
      overrides && Object.keys(overrides).length > 0 ? overrides : undefined,
    // Seems like the only approach without the cast is function overloads, which are noisy. The type cast is not that bad since it's inside the function.
  } as TranslationEntryByType[T];
}

/**
 * Create {t(hash, fallback, { var1, var2, tag0: (chunks) => <Tag>{chunks}</Tag> })} call expression
 */
export function constructTranslationCall(
  hash: string,
  fallbackText: string,
  args?: {
    variables: string[];
    expressions: Map<string, t.Expression>;
    components: Map<string, t.JSXElement>;
  },
): t.JSXExpressionContainer {
  const callArguments: t.Expression[] = [
    t.stringLiteral(hash),
    t.stringLiteral(fallbackText),
  ];

  if (args) {
    const properties: t.ObjectProperty[] = [];

    // Add variable properties (shorthand)
    for (const varName of args.variables) {
      properties.push(
        t.objectProperty(
          t.identifier(varName),
          t.identifier(varName),
          false,
          true, // shorthand
        ),
      );
    }

    for (const [name, expr] of args.expressions) {
      properties.push(t.objectProperty(t.identifier(name), expr, false, false));
    }

    // Add component renderer functions
    for (const [tagName, element] of args.components) {
      const renderFn =
        element.extra?.shouldTranslate === false
          ? // Even when doing: tagName: () => <Element />, we need a function for formatjs to work.
            t.arrowFunctionExpression([], element)
          : // Create: tagName: (chunks) => <Element>{chunks}</Element>
            t.arrowFunctionExpression(
              [t.identifier("chunks")],
              t.jsxElement(
                t.jsxOpeningElement(
                  element.openingElement.name,
                  element.openingElement.attributes,
                  false,
                ),
                t.jsxClosingElement(
                  element.closingElement?.name || element.openingElement.name,
                ),
                [t.jsxExpressionContainer(t.identifier("chunks"))],
                false,
              ),
            );

      properties.push(
        t.objectProperty(t.identifier(tagName), renderFn, false, false),
      );
    }

    if (properties.length > 0) {
      callArguments.push(t.objectExpression(properties));
    }
  }

  return t.jsxExpressionContainer(
    t.callExpression(t.identifier("t"), callArguments),
  );
}

/**
 * Check if a JSX element is self-closing or empty
 */
export function isVoidElement(element: t.JSXElement): boolean {
  return element.openingElement.selfClosing || element.children.length === 0;
}

/**
 * Create unified import: import { useTranslation } from "@lingo.dev/compiler/react"
 *
 * Via conditional exports, this resolves to:
 * - server.ts in Server Components (React cache + use)
 * - index.ts in Client Components (Context)
 */
export function comstructUnifiedImport(): t.ImportDeclaration {
  return t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier("useTranslation"),
        t.identifier("useTranslation"),
      ),
    ],
    t.stringLiteral(`${root}/react`),
  );
}

/**
 * Create import for server components: import { getServerTranslations } from "..."
 */
export function constructServerImport(): t.ImportDeclaration {
  return t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier("getServerTranslations"),
        t.identifier("getServerTranslations"),
      ),
    ],
    t.stringLiteral(`${root}/react/server`),
  );
}

/**
 * Constructs a server translation hook call using provided configuration, server port, and hashes.
 * const { t } = await getServerTranslations({ ... })
 *
 * @param {Object} options - The input parameters.
 * @param {string[]} options.hashes - An array of hash strings related to translations.
 * @return {VariableDeclaration} - Returns an object containing the constructed translation hook code to be used on the server.
 */
export function constructServerTranslationHookCall({
  hashes,
  needsLocale = false,
}: {
  hashes: string[];
  needsLocale?: boolean;
}): VariableDeclaration {
  const optionsProperties = [];

  const hashArray = t.arrayExpression(
    hashes.map((hash) => t.stringLiteral(hash)),
  );
  optionsProperties.push(t.objectProperty(t.identifier("hashes"), hashArray));

  const destructureProperties = [
    t.objectProperty(
      t.identifier("t"),
      t.identifier("t"),
      false,
      true, // shorthand
    ),
  ];

  if (needsLocale) {
    destructureProperties.push(
      t.objectProperty(
        t.identifier("locale"),
        t.identifier("locale"),
        false,
        true, // shorthand
      ),
    );
  }

  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.objectPattern(destructureProperties),
      t.awaitExpression(
        t.callExpression(t.identifier("getServerTranslations"), [
          t.objectExpression(optionsProperties),
        ]),
      ),
    ),
  ]);
}

/**
 * Inject unified `const t = useTranslation([...hashes])` at component start
 *
 * This hook works in BOTH Server and Client Components via conditional exports:
 * - In Server Components: loads server.ts (uses React cache() + use())
 * - In Client Components: loads index.ts (uses Context)
 *
 * This is the new default for non-async components!
 *
 * @param componentPath
 * @param hashes
 * @param needsLocale If true, destructures locale from hook: const { t, locale } = ...
 */
export function injectUnifiedHook(
  componentPath: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >,
  hashes: string[],
  needsLocale: boolean = false,
): void {
  const body = componentPath.get("body");

  let blockBody: NodePath<t.BlockStatement> | undefined;
  // Handle arrow functions with expression bodies: () => <jsx>
  // Convert to block statement: () => { const t = ...; return <jsx>; }
  if (!body.isBlockStatement()) {
    if (componentPath.isArrowFunctionExpression() && body.isExpression()) {
      const returnStatement = t.returnStatement(body.node as t.Expression);
      componentPath.node.body = t.blockStatement([returnStatement]);
      // Re-get the body after conversion
      blockBody = componentPath.get("body") as NodePath<t.BlockStatement>;
    }
  } else {
    blockBody = body;
  }

  if (!blockBody) {
    return;
  }

  const hashArray = t.arrayExpression(
    hashes.map((hash) => t.stringLiteral(hash)),
  );

  const pattern = t.objectPattern([
    t.objectProperty(t.identifier("t"), t.identifier("t"), false, true),
  ]);
  if (needsLocale) {
    pattern.properties.push(
      t.objectProperty(
        t.identifier("locale"),
        t.identifier("locale"),
        false,
        true,
      ),
    );
  }

  const hookCall = t.variableDeclaration("const", [
    t.variableDeclarator(
      pattern,
      t.callExpression(t.identifier("useTranslation"), [hashArray]),
    ),
  ]);

  blockBody.node.body.unshift(hookCall);
}

/**
 * Inject `const { t } = await getServerTranslations([...hashes])` at component start (Server Components)
 * Makes the component async if needed
 *
 * @param componentPath
 * @param hashes
 * @param needsLocale If true, destructures locale from hook: const { t, locale } = ...
 */
export function injectServerHook(
  componentPath: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >,
  hashes: string[],
  needsLocale: boolean = false,
): void {
  const body = componentPath.get("body");

  // Handle arrow functions with expression bodies: () => <jsx>
  // Convert to block statement: async () => { const { t } = await ...; return <jsx>; }
  if (!body.isBlockStatement()) {
    if (componentPath.isArrowFunctionExpression() && body.isExpression()) {
      const returnStatement = t.returnStatement(body.node as t.Expression);
      componentPath.node.body = t.blockStatement([returnStatement]);
      componentPath.node.async = true;
      // Re-get the body after conversion
      const newBody = componentPath.get("body") as NodePath<t.BlockStatement>;

      // Create: const { t } = await getServerTranslations({ ... })
      const serverCall = constructServerTranslationHookCall({
        hashes,
        needsLocale,
      });

      newBody.node.body.unshift(serverCall);
    }
    return;
  }

  if (!componentPath.node.async) {
    componentPath.node.async = true;
  }

  // Create: const { t } = await getServerTranslations({ ... })
  const serverCall = constructServerTranslationHookCall({
    hashes,
    needsLocale,
  });

  body.node.body.unshift(serverCall);
}
