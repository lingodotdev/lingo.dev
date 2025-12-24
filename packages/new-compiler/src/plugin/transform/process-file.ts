/**
 * Keep mutations to the current node and children. Do not mutate program inserting imports when processing the component.
 * This should be done in the end.
 * The overall idea is that state is used for side effect tracking. When we exit relevant points, we check if we need to make extra changes at this level.
 * e.g. when we transform elements to insert translations, we record their hashes and add the translation hook call when leaving the component.
 */
import * as t from "@babel/types";
import type { NodePath, TraverseOptions } from "@babel/traverse";
import type { TranslationEntry } from "../../types";
import { logger } from "../../utils/logger";
import {
  comstructUnifiedImport,
  constructServerImport,
  constructTranslationCall,
  createTranslationEntry,
  escapeTextForICU,
  hasUseI18nDirective,
  inferComponentName,
  injectServerHook,
  injectUnifiedHook,
  isReactComponent,
  isVoidElement,
  normalizeWhitespace,
} from "./utils";
import {
  type MetadataOutputState,
  processNextDynamicMetadata,
  processNextStaticMetadata,
} from "./metadata";
import { traverse } from "./babel-compat";
import { processOverrideAttributes } from "./parse-override";

type ComponentEntry = {
  name: string;
  isAsync: boolean;
};

/**
 * State shared between all the visitors.
 */
export interface VisitorsInternalState {
  needsDirective: boolean;
  filePath: string;
  newEntries: TranslationEntry[];
  /** Stores component encountered up the tree at the current point, to avoid lookups. */
  componentsStack: ComponentEntry[];
  /** Map component names to their translation hashes */
  componentHashes: Map<string, string[]>;
  /** Track metadata functions that need translation */
  /** Track if we need the unified hook import */
  needsUnifiedImport: boolean;
  /** Track if we need the async API import */
  needsAsyncImport: boolean;
  /** Track which components need locale from hook (for <html> lang attribute) */
  componentsNeedingLocale: Set<string>;
}

function updateWithMetadataState(
  state: VisitorsInternalState,
  newState: MetadataOutputState,
): VisitorsInternalState {
  state.newEntries = [...state.newEntries, ...newState.newEntries];
  state.needsAsyncImport = state.needsAsyncImport || newState.needsAsyncImport;
  return state;
}

const SKIP_ATTRIBUTE = "data-lingo-skip";

/**
 * Elements whose content should not be translated by default.
 * These are typically code-related or technical elements where translation
 * would break functionality or meaning.
 */
const NON_TRANSLATABLE_ELEMENTS = new Set([
  "code",
  "pre",
  "script",
  "style",
  "kbd",
  "samp",
  "var",
]);

const TRANSLATABLE_ATTRIBUTES = new Set([
  "title",
  "aria-label",
  "aria-description",
  "alt",
  "label",
  "description",
  "placeholder",
  "content",
  "subtitle",
]);

/**
 * Check if a JSX element should skip translation based on:
 * 1. Element type (code, pre, script, style, etc.)
 * 2. translate="no" attribute (HTML standard)
 * 3. data-lingo-skip attribute
 */
function shouldSkipTranslationForElement(
  element: t.JSXElement | t.JSXFragment,
): boolean {
  // We always translate fragments
  if (element.type === "JSXFragment") {
    return false;
  }
  const openingElement = element.openingElement;

  // Check element type
  if (openingElement.name.type === "JSXIdentifier") {
    if (NON_TRANSLATABLE_ELEMENTS.has(openingElement.name.name)) {
      return true;
    }
  }

  for (const attr of openingElement.attributes) {
    if (attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier") {
      // Check for translate="no" (HTML standard)
      if (attr.name.name === "translate") {
        if (attr.value?.type === "StringLiteral" && attr.value.value === "no") {
          return true;
        }
      }

      if (attr.name.name === SKIP_ATTRIBUTE) {
        return true;
      }
    }
  }

  return false;
}

// Called even on the element which are not translatable.
function translateAttributes(
  node: t.JSXElement,
  state: VisitorsInternalState,
): void {
  const openingElement = node.openingElement;

  const component = state.componentsStack.at(-1);
  if (!component) return;

  for (const attr of openingElement.attributes) {
    if (
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      TRANSLATABLE_ATTRIBUTES.has(attr.name.name) &&
      attr.value?.type === "StringLiteral"
    ) {
      const text = normalizeWhitespace(attr.value.value);
      if (text.length == 0) continue;

      const entry = createTranslationEntry(
        "attribute",
        text,
        {
          attributeName: attr.name.name,
          componentName: component.name,
        },
        state.filePath,
        node.loc?.start.line,
        node.loc?.start.column,
      );
      registerEntry(entry, state, component.name);

      attr.value = constructTranslationCall(entry.hash, text);
    }
  }
}

/**
 * Check if a JSX element has mixed content that needs rich text translation
 * Mixed content = text nodes + expressions + nested JSX elements (excluding void elements)
 */
function hasMixedContent(element: t.JSXElement | t.JSXFragment): boolean {
  const children = element.children;
  if (children.length === 0) return false;
  // 001
  // 221
  // 101
  // States:
  // 0 - no text or translatable nodes
  // 1 - text node
  // 2 - expression or translatable element
  // 3 - interrupted text node
  // 4 - mixed
  //
  let state = 0;

  for (const child of children) {
    if (child.type === "JSXText") {
      if (child.value.trim().length > 0) {
        switch (state) {
          case 0:
            state = 1;
            break;
          case 1:
            break;
          case 2:
            return true;
          case 3:
            return true;
        }
      }
      // Expressions require a substitution of the placeholder and are usually a part of the text so should be translated in one context
    } else if (child.type === "JSXExpressionContainer") {
      switch (state) {
        case 0:
          state = 2;
          break;
        case 1:
          return true;
        case 2:
          break;
        case 3:
          return true;
      }
    } else if (child.type === "JSXElement") {
      if (!isVoidElement(child)) {
        switch (state) {
          case 0:
            state = 2;
            break;
          case 1:
            return true;
          case 2:
            break;
          case 3:
            return true;
        }
      } else {
        switch (state) {
          case 0:
            break;
          case 1:
            state = 3;
            break;
          case 2:
            break;
          case 3:
            break;
        }
      }
    }
  }
  return false;
}

/**
 * Result of serializing JSX children to a translation string
 */
interface SerializedJSX {
  /** The serialized string with placeholders, e.g. "Hello {name}, you have <strong0>{count}</strong0> messages" */
  text: string;
  /** Variable identifiers extracted from expressions, e.g. ["name", "count"] */
  variables: string[];
  expressions: Map<string, t.Expression>;
  /** Component mappings for nested elements, e.g. { strong0: <strong>...</strong> } */
  components: Map<string, t.JSXElement>;
}

/**
 * Serialize JSX children to a translation string with placeholders
 */
function serializeJSXChildren(
  children: Array<
    | t.JSXText
    | t.JSXExpressionContainer
    | t.JSXElement
    | t.JSXSpreadChild
    | t.JSXFragment
  >,
  state: VisitorsInternalState,
): SerializedJSX {
  let text = "";
  const variables: string[] = [];
  const expressions = new Map<string, t.Expression>();
  const components = new Map<string, t.JSXElement>();
  const elementCounts = new Map<string, number>();

  for (const child of children) {
    if (child.type === "JSXText") {
      // Normalize whitespace within this text node
      let normalized = normalizeWhitespace(child.value);

      // If we have accumulated text and this node starts with whitespace,
      // ensure there's a space separator
      if (
        text.length > 0 &&
        child.value.match(/^\s/) &&
        normalized.length > 0
      ) {
        if (!text.endsWith(" ")) {
          normalized = ` ${normalized}`;
        }
      }

      // If this node ends with whitespace and has content, add trailing space
      if (normalized.length > 0 && child.value.match(/\s$/)) {
        if (!text.endsWith(" ")) {
          normalized = `${normalized} `;
        }
      }

      text += escapeTextForICU(normalized);
    } else if (child.type === "JSXExpressionContainer") {
      // Extract variable name from expression
      const expr = child.expression;
      if (expr.type === "Identifier") {
        text += `{${expr.name}}`;
        if (!variables.includes(expr.name)) {
          variables.push(expr.name);
        }
      } else if (expr.type === "StringLiteral") {
        // String literal (like {" "}) - include the literal text directly
        text += escapeTextForICU(expr.value);
      } else if (expr.type !== "JSXEmptyExpression") {
        const name = `expression${expressions.size}`;
        text += `{${name}}`;
        expressions.set(name, expr);
      }
    } else if (child.type === "JSXElement") {
      let shouldTranslate = true;
      // Skip void elements (they cannot have children and shouldn't be in rich text)
      if (isVoidElement(child)) {
        // Void elements are ignored in the translation string
        // They will remain in their original position in the JSX tree
        shouldTranslate = false;
      }

      // Skip elements that should not be translated (code, pre, etc.)
      // These elements remain in the JSX tree but are not included in translation
      if (shouldSkipTranslationForElement(child)) {
        shouldTranslate = false;
      }

      // Get element name
      const openingElement = child.openingElement;
      let elementName = "";
      if (openingElement.name.type === "JSXIdentifier") {
        elementName = openingElement.name.name;
      } else {
        // TODO (AleksandrSl 02/12/2025): What is this corner case?
        //  I thought it may be a fragment, but it seems that fragment is a separate JSXFragment node.
        elementName = "element";
      }

      // Generate unique tag name with index
      const count = elementCounts.get(elementName) || 0;
      elementCounts.set(elementName, count + 1);
      const tagName = `${elementName}${count}`;

      translateAttributes(child, state);

      if (shouldTranslate) {
        // Recursively serialize nested content
        const nested = serializeJSXChildren(child.children, state);
        text += `<${tagName}>${nested.text}</${tagName}>`;

        // Merge nested variables
        for (const v of nested.variables) {
          if (!variables.includes(v)) {
            variables.push(v);
          }
        }

        // Merge nested component mappings with prefixes to avoid conflicts
        for (const [nestedTag, nestedElement] of nested.components) {
          components.set(`${tagName}_${nestedTag}`, nestedElement);
        }
      } else {
        // There is no support for self-closing tags in format js, so we should generate empty ones.
        text += `<${tagName}></${tagName}>`;
        child.extra = {
          ...child.extra,
          shouldTranslate: false,
        };
      }

      // Store component mapping
      components.set(tagName, child);
    }
  }

  return { text, variables, expressions, components };
}

function transformVoidElement(
  node: t.JSXElement,
  state: VisitorsInternalState,
) {
  translateAttributes(node, state);
}

type TranslationScope =
  | { kind: "mixed"; text: string; args: any }
  | { kind: "text"; text: string; textNodeIndex: number };

function getTranslationScope(
  node: t.JSXElement | t.JSXFragment,
  state: VisitorsInternalState,
): TranslationScope | null {
  if (hasMixedContent(node)) {
    const serialized = serializeJSXChildren(node.children, state);
    const text = serialized.text.trim();
    if (text.length === 0) return null;

    return {
      kind: "mixed",
      text,
      args: {
        variables: serialized.variables,
        expressions: serialized.expressions,
        components: serialized.components,
      },
    };
  }

  // Non-mixed: allow exactly one meaningful JSXText + optional void elements + whitespace
  const textNodeIndex = node.children.findIndex(
    (child) => child.type === "JSXText" && child.value.trim().length > 0,
  );
  if (textNodeIndex === -1) return null;

  const allowed = node.children.every(
    (child) =>
      child.type === "JSXText" ||
      (child.type === "JSXElement" && isVoidElement(child)),
  );
  if (!allowed) return null;

  const textNode = node.children[textNodeIndex] as t.JSXText;
  const text = normalizeWhitespace(textNode.value);
  if (text.length === 0) return null;

  return { kind: "text", text, textNodeIndex };
}

function registerEntry(
  entry: ReturnType<typeof createTranslationEntry>,
  state: VisitorsInternalState,
  componentName: string,
) {
  state.newEntries.push(entry);

  const hashes = state.componentHashes.get(componentName) ?? [];
  hashes.push(entry.hash);
  state.componentHashes.set(componentName, hashes);
}

function rewriteChildren(
  path: NodePath<t.JSXElement | t.JSXFragment>,
  state: VisitorsInternalState,
  translationScope: TranslationScope,
  entryHash: string,
) {
  if (translationScope.kind === "mixed") {
    path.node.children = [
      constructTranslationCall(
        entryHash,
        translationScope.text,
        translationScope.args,
      ),
    ];
    return;
  }

  const { textNodeIndex, text } = translationScope;

  path.node.children = path.node.children.map((child, index) => {
    if (index === textNodeIndex) {
      return constructTranslationCall(entryHash, text);
    }
    if (child.type === "JSXElement") {
      transformVoidElement(child, state);
    }
    return child;
  });
}

function processJSXElement(
  path: NodePath<t.JSXElement | t.JSXFragment>,
  state: VisitorsInternalState,
): void {
  const component = state.componentsStack.at(-1);
  if (!component) return;

  const scope = getTranslationScope(path.node, state);
  if (!scope) return;

  const overrides = processOverrideAttributes(path);

  const entry = createTranslationEntry(
    "content",
    scope.text,
    { componentName: component.name },
    state.filePath,
    path.node.loc?.start.line,
    path.node.loc?.start.column,
    overrides,
  );

  registerEntry(entry, state, component.name);
  rewriteChildren(path, state, scope, entry.hash);

  path.skip();
}

/**
 * Inject dynamic locale attribute into <html> elements
 * Transforms: <html> → <html lang={locale}>
 *
 * Only injects if:
 * 1. Element is <html>
 * 2. No existing lang/language attribute
 * 3. We're inside a React component (has locale context)
 */
function injectHtmlLangAttribute(
  node: t.JSXElement,
  state: VisitorsInternalState,
): void {
  const openingElement = node.openingElement;

  if (
    openingElement.name.type !== "JSXIdentifier" ||
    openingElement.name.name !== "html"
  ) {
    return;
  }

  // Check if lang attribute already exists
  const hasLangAttr = openingElement.attributes.some((attr) => {
    return (
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      (attr.name.name === "lang" || attr.name.name === "language")
    );
  });

  if (hasLangAttr) {
    // Already has lang attribute, don't inject
    return;
  }

  // Check if we're inside a component (has access to locale context)
  const component = state.componentsStack.at(-1);
  if (!component) {
    // Not inside a component, can't inject locale
    return;
  }

  // Inject lang={locale} attribute
  // This creates: <html lang={locale}>
  const langAttr = t.jsxAttribute(
    t.jsxIdentifier("lang"),
    t.jsxExpressionContainer(t.identifier("locale")),
  );

  openingElement.attributes.push(langAttr);

  logger.debug(
    `Injected locale attribute into <html> element in component: ${component.name}`,
  );

  // Mark that this component needs locale destructured from the hook
  state.componentsNeedingLocale.add(component.name);
}

/**
 * Inject translation hook into a component when it's done processing
 * Called when popping component from stack
 */
export function injectTranslationHook(
  path: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >,
  component: ComponentEntry,
  state: VisitorsInternalState,
): void {
  const needsLocale = state.componentsNeedingLocale.has(component.name);
  const hashes = state.componentHashes.get(component.name);
  if ((!hashes || hashes.length === 0) && !needsLocale) {
    return; // No translations needed
  }

  if (component.isAsync) {
    // Async component uses getServerTranslations
    injectServerHook(path, hashes ?? [], needsLocale);
    state.needsAsyncImport = true;
  } else {
    // Non-async component uses unified hook (useTranslation)
    injectUnifiedHook(path, hashes ?? [], needsLocale);
    state.needsUnifiedImport = true;
  }
}

/**
 * Add translation imports at the top of the file
 * Called on Program exit after all components have been processed
 */
function addTranslationImports(
  programPath: NodePath<t.Program>,
  state: VisitorsInternalState,
): void {
  // A file can have both async and non-async components!
  if (state.needsAsyncImport) {
    programPath.node.body.unshift(constructServerImport());
  }
  if (state.needsUnifiedImport) {
    programPath.node.body.unshift(comstructUnifiedImport());
  }
}

/**
 * Handle component function detection and state update
 */
function processComponentFunction(
  path: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >,
  state: VisitorsInternalState,
): void {
  if (!isReactComponent(path)) {
    path.skip();
    logger.debug(`Skipping non-React component: ${path.node.type}`);
    return;
  }

  const componentName = inferComponentName(path);
  if (!componentName) {
    path.skip();
    return;
  }

  // Store component info for later hook injection
  if (!state.componentHashes.has(componentName)) {
    state.componentHashes.set(componentName, []);
  }

  // Push component to stack with async info and path reference
  const componentEntry: ComponentEntry = {
    name: componentName,
    isAsync: path.node.async,
  };
  state.componentsStack.push(componentEntry);
  logger.debug(`Component ${JSON.stringify(componentEntry)} entered`);

  path.setData("componentName", componentName);
  path.traverse(componentVisitors, { visitorState: state });
  const component = state.componentsStack.pop();
  if (component) {
    injectTranslationHook(path, component, state);
  }
  // We have already traversed the path's children so the main traverse can skip it.
  path.skip();
}

const componentVisitors = {
  // 1. Handle nested components. FunctionDeclaration|FunctionExpression|ArrowFunctionExpression unfortunately doesn't give the correct type signature for the path.
  FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
    processComponentFunction(path, this.visitorState);
  },
  ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
    processComponentFunction(path, this.visitorState);
  },
  FunctionExpression(path: NodePath<t.FunctionExpression>) {
    processComponentFunction(path, this.visitorState);
  },
  // 2. Fragments are separate from other JSX elements. Both <> and <Fragment> are the same AST node type.
  JSXFragment(path: NodePath<t.JSXFragment>) {
    // No attributes to translate on the fragment, so we only check if it has mixed content. If it doesn't, go ahead and its children will be checked.
    // We also do not check for translation skip, because fragments are mostly used to make the bare text translatable.
    // But if we want to support <Fragment data-lingo-skip>Text</Fragment> we should do it here.
    processJSXElement(path, this.visitorState);
  },

  // Transform JSX elements with mixed content (text + expressions or nested elements)
  JSXElement(path: NodePath<t.JSXElement>) {
    translateAttributes(path.node, this.visitorState);

    // Inject locale attribute into <html> elements for Next.js
    injectHtmlLangAttribute(path.node, this.visitorState);

    if (shouldSkipTranslationForElement(path.node)) {
      path.skip();
      return;
    }
    processJSXElement(path, this.visitorState);
  },
} satisfies TraverseOptions<{ visitorState: VisitorsInternalState }>;

const fileVisitors = {
  // Handle static metadata exports: export const metadata = { ... }
  ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
    // Check if the export is a metadata export and converts it to a function
    const metadataState = processNextStaticMetadata(path, {
      filePath: this.visitorState.filePath,
    });

    if (metadataState) {
      updateWithMetadataState(this.visitorState, metadataState);
    }
  },

  // All component function types share the same handler
  FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
    const metadataState = processNextDynamicMetadata(path, {
      filePath: this.visitorState.filePath,
    });
    if (metadataState) {
      updateWithMetadataState(this.visitorState, metadataState);
    }

    // Otherwise, handle as component
    processComponentFunction(path, this.visitorState);
  },

  // export const MyComponent = () => {}
  ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
    processComponentFunction(path, this.visitorState);
  },

  // All these are considered function expressions
  // const myFunction = function() {
  //   return 'hello';
  // };
  //
  // const myFunction2 = function namedFunc() {
  //   return 'hello';
  // };
  //
  // setTimeout(function() {
  //   console.log('hello');
  // }, 1000);
  // While
  // export default function() {}
  // is not
  FunctionExpression(path: NodePath<t.FunctionExpression>) {
    processComponentFunction(path, this.visitorState);
  },
} satisfies TraverseOptions<{ visitorState: VisitorsInternalState }>;

/**
 * Create Babel visitors for auto-translation (single-pass transformation)
 */
const programVisitor = {
  Program: {
    enter(path: NodePath<t.Program>) {
      // We do the check on the loader level, but since they could be false positive, accepting the files we don't need to process, we do the check here as well.
      if (this.visitorState.needsDirective && !hasUseI18nDirective(path)) {
        path.skip();
        return;
      }

      path.traverse(fileVisitors, {
        visitorState: this.visitorState,
      });
    },

    exit(path: NodePath<t.Program>) {
      if (
        this.visitorState.needsUnifiedImport ||
        this.visitorState.needsAsyncImport
      ) {
        addTranslationImports(path, this.visitorState);
      }
    },
  },
} satisfies TraverseOptions<{ visitorState: VisitorsInternalState }>;

export function processFile(
  ast: t.Node,
  options: { relativeFilePath: string; needsDirective: boolean },
) {
  const state: VisitorsInternalState = {
    needsDirective: options.needsDirective,
    filePath: options.relativeFilePath,
    newEntries: [],
    componentsStack: [],
    componentHashes: new Map<string, string[]>(),
    needsUnifiedImport: false,
    needsAsyncImport: false,
    componentsNeedingLocale: new Set<string>(),
  };

  traverse(ast, programVisitor, undefined, { visitorState: state });

  return state.newEntries;
}
