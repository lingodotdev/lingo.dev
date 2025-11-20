import type { PluginObj } from "@babel/core";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type {
  ComponentType,
  LoaderConfig,
  MetadataSchema,
  TranslationContext,
  TranslationEntry,
} from "../types";
import { generateTranslationHash } from "../utils/hash";

/**
 * Plugin state to track transformation
 */
interface PluginState {
  componentName: string | null;
  componentType: ComponentType;
  needsTranslationImport: boolean;
  hasUseI18nDirective: boolean;
  newEntries: TranslationEntry[];
  config: LoaderConfig;
  metadata: MetadataSchema;
  filePath: string;
  serverPort?: number | null;
}

/**
 * Detect if a function is a React component
 */
function isReactComponent(
  path: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >,
): boolean {
  // Check if function returns JSX
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

  return returnsJSX;
}

/**
 * Detect component type (Client vs Server)
 * In Next.js App Router, components are Server Components by default unless:
 * 1. They have "use client" directive
 * 2. They are imported by a client component
 */
function detectComponentType(path: NodePath<any>): ComponentType {
  // Check for 'use client' directive first
  const program = path.findParent((p) => p.isProgram());
  if (program && program.isProgram()) {
    const directives = program.node.directives || [];
    for (const directive of directives) {
      if (directive.value.value === "use client") {
        return "client" as ComponentType;
      }
    }
  }

  // In Next.js App Router, default is Server Component
  // Server Components can be async or sync
  return "server" as ComponentType;
}

/**
 * Infer component name from various patterns
 */
function inferComponentName(path: NodePath<any>): string | null {
  // Named function: function MyComponent() {}
  if (path.node.id && path.node.id.name) {
    return path.node.id.name;
  }

  // Variable declaration: const MyComponent = () => {}
  const parent = path.parent;
  if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
    return parent.id.name;
  }

  // Export: export default function() {} or export const MyComponent = ...
  if (parent.type === "ExportDefaultDeclaration") {
    return "default";
  }

  return null;
}

/**
 * Check for 'use i18n' directive
 */
function hasUseI18nDirective(program: NodePath<t.Program>): boolean {
  const directives = program.node.directives || [];
  return directives.some(
    (directive: t.Directive) =>
      directive.value.value === "use i18n" ||
      directive.value.value === "use translation",
  );
}

/**
 * Create Babel visitors for auto-translation
 */
export function createBabelVisitors(
  config: LoaderConfig,
  metadata: MetadataSchema,
  filePath: string,
  visitorState: PluginState,
  serverPort?: number | null,
) {
  return {
    Program: {
      enter(path: NodePath<t.Program>) {
        // Initialize state
        visitorState.hasUseI18nDirective = hasUseI18nDirective(path);

        // Check if we should skip this file
        if (config.useDirective && !visitorState.hasUseI18nDirective) {
          // Skip transformation if directive is required but not present
          path.skip();
        }
      },

      exit(path: NodePath<t.Program>) {
        // Inject translation import if needed
        if (visitorState.needsTranslationImport) {
          injectTranslationImport(path, visitorState, serverPort);
        }
      },
    },

    // Capture component functions
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (isReactComponent(path)) {
        visitorState.componentName = inferComponentName(path);
        visitorState.componentType = detectComponentType(path);
      }
    },

    ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      if (isReactComponent(path)) {
        visitorState.componentName = inferComponentName(path);
        visitorState.componentType = detectComponentType(path);
      }
    },

    FunctionExpression(path: NodePath<t.FunctionExpression>) {
      if (isReactComponent(path)) {
        visitorState.componentName = inferComponentName(path);
        visitorState.componentType = detectComponentType(path);
      }
    },

    // Transform JSX text nodes
    JSXText(path: NodePath<t.JSXText>) {
      // Skip if no component context
      if (!visitorState.componentName) {
        return;
      }

      const text = path.node.value.trim();

      // Skip empty or whitespace-only text
      if (!text) {
        return;
      }

      // Skip if text is just newlines/indentation
      if (/^[\s\n]*$/.test(text)) {
        return;
      }

      // Generate hash
      const hash = generateTranslationHash(
        text,
        visitorState.componentName,
        visitorState.filePath,
      );

      // Create translation entry
      const context: TranslationContext = {
        componentName: visitorState.componentName,
        filePath: visitorState.filePath,
        line: path.node.loc?.start.line,
        column: path.node.loc?.start.column,
      };

      const entry: TranslationEntry = {
        sourceText: text,
        context,
        hash,
        addedAt: new Date().toISOString(),
      };

      // Store new entry
      visitorState.newEntries.push(entry);

      // Replace text with {t("hash")}
      const tCall = t.callExpression(t.identifier("t"), [
        t.stringLiteral(hash),
        t.stringLiteral(text),
      ]);

      // path.replaceWith(t.stringLiteral(hash));
      path.replaceWith(t.jsxExpressionContainer(tCall));

      // Mark that we need translation import
      visitorState.needsTranslationImport = true;
    },
  };
}

/**
 * Inject appropriate translation import based on component type
 */
function injectTranslationImport(
  programPath: NodePath<t.Program>,
  state: PluginState,
  serverPort?: number | null,
): void {
  // Determine if we're dealing with a server or client component
  const isServerComponent = state.componentType === "server";

  if (isServerComponent) {
    // Import getServerTranslations for Server Components
    const getServerTranslationsImport = t.importDeclaration(
      [
        t.importSpecifier(
          t.identifier("getServerTranslations"),
          t.identifier("getServerTranslations"),
        ),
      ],
      t.stringLiteral("@lingo.dev/_compiler-beta/react/server"),
    );

    // Import metadata JSON for bundling
    const metadataPath = `./${state.config.lingoDir}/metadata.json`;
    const metadataImport = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier("__lingoMetadata"))],
      t.stringLiteral(metadataPath),
    );

    programPath.node.body.unshift(metadataImport);
    programPath.node.body.unshift(getServerTranslationsImport);
  } else {
    // Import useTranslation for Client Components
    const importDeclaration = t.importDeclaration(
      [
        t.importSpecifier(
          t.identifier("useTranslation"),
          t.identifier("useTranslation"),
        ),
      ],
      t.stringLiteral("@lingo.dev/_compiler-beta/react"),
    );
    programPath.node.body.unshift(importDeclaration);
  }

  // Find the component function and inject appropriate translation call
  programPath.traverse({
    FunctionDeclaration(path) {
      if (path.node.id?.name === state.componentName) {
        if (isServerComponent) {
          injectServerTranslationCall(path, state.config, serverPort);
        } else {
          injectHookCall(path);
        }
      }
    },
    ArrowFunctionExpression(path) {
      // Check if this is our component
      const parent = path.parent;
      if (
        parent.type === "VariableDeclarator" &&
        parent.id.type === "Identifier" &&
        parent.id.name === state.componentName
      ) {
        if (isServerComponent) {
          injectServerTranslationCall(path, state.config, serverPort);
        } else {
          injectHookCall(path);
        }
      }
    },
  });
}

/**
 * Inject const t = useTranslation() at the start of the component (Client Components)
 */
function injectHookCall(
  componentPath: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression>,
): void {
  const body = componentPath.get("body");

  if (!body.isBlockStatement()) {
    return;
  }

  // useTranslation() takes no arguments - serverPort comes from context
  const hookCall = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier("t"),
      t.callExpression(t.identifier("useTranslation"), []),
    ),
  ]);

  // Insert at the beginning of the function body
  body.node.body.unshift(hookCall);
}

/**
 * Inject const t = await getServerTranslations() at the start of the component (Server Components)
 * Also makes the component async if it isn't already
 */
function injectServerTranslationCall(
  componentPath: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression>,
  config: any,
  serverPort?: number | null,
): void {
  const body = componentPath.get("body");

  if (!body.isBlockStatement()) {
    return;
  }

  // Make the component async if it isn't already
  if (!componentPath.node.async) {
    componentPath.node.async = true;
  }

  // Create options object for getServerTranslations
  const optionsProperties = [
    // Pass the imported metadata (required)
    t.objectProperty(t.identifier("metadata"), t.identifier("__lingoMetadata")),
  ];

  // Pass sourceLocale if configured
  if (config.sourceLocale) {
    optionsProperties.push(
      t.objectProperty(
        t.identifier("sourceLocale"),
        t.stringLiteral(config.sourceLocale),
      ),
    );
  }

  // Pass serverPort if available
  if (serverPort) {
    optionsProperties.push(
      t.objectProperty(
        t.identifier("serverPort"),
        t.numericLiteral(serverPort),
      ),
    );
  }

  const callArgs = [t.objectExpression(optionsProperties)];

  const serverCall = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier("t"),
      t.awaitExpression(
        t.callExpression(t.identifier("getServerTranslations"), callArgs),
      ),
    ),
  ]);

  // Insert at the beginning of the function body
  body.node.body.unshift(serverCall);
}
