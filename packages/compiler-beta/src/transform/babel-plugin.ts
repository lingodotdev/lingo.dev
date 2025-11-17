import type { PluginObj, types as t } from "@babel/core";
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
 */
function detectComponentType(path: NodePath<any>): ComponentType {
  // Check if it's an async function (Server Component)
  if (path.node.async === true) {
    return "server" as ComponentType;
  }

  // Check for 'use client' directive
  const program = path.findParent((p) => p.isProgram());
  if (program && program.isProgram()) {
    const directives = program.node.directives || [];
    for (const directive of directives) {
      if (directive.value.value === "use client") {
        return "client" as ComponentType;
      }
    }
  }

  // Default to client for non-async components
  return "client" as ComponentType;
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
 * Create the Babel plugin for auto-translation
 */
export function createBabelPlugin(
  config: LoaderConfig,
  metadata: MetadataSchema,
  filePath: string,
): PluginObj {
  return {
    name: "lingo-auto-translate",
    visitor: {
      Program: {
        enter(path, state: any) {
          const pluginState: PluginState = {
            componentName: null,
            componentType: "unknown" as ComponentType,
            needsTranslationImport: false,
            hasUseI18nDirective: hasUseI18nDirective(path),
            newEntries: [],
            config,
            metadata,
            filePath,
          };

          // Store state
          state.pluginState = pluginState;

          // Check if we should skip this file
          if (config.useDirective && !pluginState.hasUseI18nDirective) {
            // Skip transformation if directive is required but not present
            path.skip();
          }
        },

        exit(path, state: any) {
          const pluginState: PluginState = state.pluginState;

          // Inject translation import if needed
          if (pluginState.needsTranslationImport) {
            injectTranslationImport(path, pluginState);
          }
        },
      },

      // Capture component functions
      FunctionDeclaration(path, state: any) {
        const pluginState: PluginState = state.pluginState;

        if (isReactComponent(path)) {
          pluginState.componentName = inferComponentName(path);
          pluginState.componentType = detectComponentType(path);
        }
      },

      ArrowFunctionExpression(path, state: any) {
        const pluginState: PluginState = state.pluginState;

        if (isReactComponent(path)) {
          pluginState.componentName = inferComponentName(path);
          pluginState.componentType = detectComponentType(path);
        }
      },

      FunctionExpression(path, state: any) {
        const pluginState: PluginState = state.pluginState;

        if (isReactComponent(path)) {
          pluginState.componentName = inferComponentName(path);
          pluginState.componentType = detectComponentType(path);
        }
      },

      // Transform JSX text nodes
      JSXText(path, state: any) {
        const pluginState: PluginState = state.pluginState;
        const t = state.types;

        // Skip if no component context
        if (!pluginState.componentName) {
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
          pluginState.componentName,
          pluginState.filePath,
        );

        // Create translation entry
        const context: TranslationContext = {
          componentName: pluginState.componentName,
          filePath: pluginState.filePath,
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
        pluginState.newEntries.push(entry);

        // Replace text with {t("hash")}
        const tCall = t.callExpression(t.identifier("t"), [
          t.stringLiteral(hash),
        ]);

        path.replaceWith(t.jsxExpressionContainer(tCall));

        // Mark that we need translation import
        pluginState.needsTranslationImport = true;
      },
    },
  };
}

/**
 * Inject appropriate translation import based on component type
 */
function injectTranslationImport(
  programPath: NodePath<t.Program>,
  state: PluginState,
): void {
  const t = require("@babel/types") as typeof import("@babel/types");

  // For now, inject a simple useTranslation hook
  // TODO: Differentiate between client and server components
  const importDeclaration = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier("useTranslation"),
        t.identifier("useTranslation"),
      ),
    ],
    t.stringLiteral("@lingo.dev/runtime"), // TODO: Make this configurable
  );

  // Insert at the top of the file
  programPath.node.body.unshift(importDeclaration);

  // Find the component function and inject hook call
  programPath.traverse({
    FunctionDeclaration(path) {
      if (path.node.id?.name === state.componentName) {
        injectHookCall(path, t);
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
        injectHookCall(path, t);
      }
    },
  });
}

/**
 * Inject const t = useTranslation() at the start of the component
 */
function injectHookCall(
  componentPath: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression>,
  t: typeof import("@babel/types"),
): void {
  const body = componentPath.get("body");

  if (!body.isBlockStatement()) {
    return;
  }

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
 * Extract new entries from plugin state
 */
export function extractNewEntries(state: any): TranslationEntry[] {
  return state.pluginState?.newEntries || [];
}
