/**
 * Transforms Next.js metadata object to use t() calls. See https://nextjs.org/docs/app/getting-started/metadata-and-og-images for docs on next metadata.
 */
import * as t from "@babel/types";
import {
  isObjectExpression,
  isReturnStatement,
  type VariableDeclarator,
} from "@babel/types";
import {
  constructServerTranslationHookCall,
  createTranslationEntry,
} from "./utils";
import type { NodePath } from "@babel/traverse";
import type { TranslationEntry } from "../../types";
import type { VisitorsInternalState } from "./process-file";

/**
 * Whitelist of metadata fields that should be translated.
 * Other fields (like technical configurations, URLs, etc.) are left unchanged.
 */
const TRANSLATABLE_METADATA_FIELDS = new Set([
  // Top-level fields
  "title",
  "description",

  // Title object fields (template and default)
  "title.template",
  "title.default",

  // OpenGraph fields
  "openGraph.title",
  "openGraph.description",
  "openGraph.images[*].alt",

  // Twitter fields
  "twitter.title",
  "twitter.description",
  "twitter.images[*].alt",

  // Apple Web App
  "appleWebApp.title",
]);

const NEXT_METADATA_EXPORT_NAME = "metadata";
const NEXT_GENERATE_METADATA_FUNCTION_NAME = "generateMetadata";

type MetadataInputState = Pick<VisitorsInternalState, "filePath">;
export type MetadataOutputState = Pick<
  VisitorsInternalState,
  "newEntries" | "needsAsyncImport"
>;

/**
 * Check if a field path matches a pattern with array indices.
 * For example: "openGraph.images[0].alt" matches "openGraph.images[*].alt"
 */
function matchesArrayPattern(fieldPath: string, pattern: string): boolean {
  // Replace [number] with [*] for comparison
  const normalizedPath = fieldPath.replace(/\[\d+]/g, "[*]");
  return normalizedPath === pattern;
}

/**
 * Check if a metadata field path should be translated
 */
function isTranslatableMetadataField(fieldPath: string): boolean {
  // Direct match
  if (TRANSLATABLE_METADATA_FIELDS.has(fieldPath)) {
    return true;
  }

  // Check for array pattern matches (e.g., images[0].alt matches images[*].alt)
  for (const pattern of TRANSLATABLE_METADATA_FIELDS) {
    if (pattern.includes("[*]") && matchesArrayPattern(fieldPath, pattern)) {
      return true;
    }
  }

  return false;
}

function isNextGenerateMetadataFunction(path: NodePath<t.FunctionDeclaration>) {
  if (path.node.id?.name === NEXT_GENERATE_METADATA_FUNCTION_NAME) {
    // Check if it's exported
    const parent = path.parent;
    if (parent.type === "ExportNamedDeclaration" || parent.type === "Program") {
      return true;
    }
  }
}

function getNextMetadataObjectOrNull(
  path: NodePath<t.ExportNamedDeclaration>,
): VariableDeclarator["init"] | null {
  const declaration = path.node.declaration;
  if (!declaration || declaration.type !== "VariableDeclaration") return null;

  const declarator = declaration.declarations[0];
  if (!declarator || declarator.id.type !== "Identifier") return null;
  if (declarator.id.name === NEXT_METADATA_EXPORT_NAME && declarator.init) {
    return declarator.init;
  }
}

/**
 * Recursively transforms metadata object properties to use t() calls
 */
function transformMetadataObject(
  objectExpression: t.ObjectExpression,
  state: MetadataInputState,
  entries: TranslationEntry[],
  parentPath: string = "",
): void {
  for (const prop of objectExpression.properties) {
    if (prop.type !== "ObjectProperty") continue;

    // Get the key name
    let keyName: string | null = null;
    if (prop.key.type === "Identifier") {
      keyName = prop.key.name;
    } else if (prop.key.type === "StringLiteral") {
      keyName = prop.key.value;
    }

    if (!keyName) continue;

    const fieldPath = parentPath ? `${parentPath}.${keyName}` : keyName;

    // Check if this field should be translated
    const shouldTranslate = isTranslatableMetadataField(fieldPath);
    // Transform string values (only if whitelisted)
    if (prop.value.type === "StringLiteral" && shouldTranslate) {
      const text = prop.value.value;
      const entry = createTranslationEntry(
        "metadata",
        text,
        {
          fieldPath: fieldPath,
        },
        state.filePath,
        prop.value.loc?.start.line,
        prop.value.loc?.start.column,
      );
      entries.push(entry);

      // Replace with t(hash, fallback) call
      prop.value = t.callExpression(t.identifier("t"), [
        t.stringLiteral(entry.hash),
        t.stringLiteral(text),
      ]);
      // Only static template literals like `content`
    } else if (prop.value.type === "TemplateLiteral" && shouldTranslate) {
      if (
        prop.value.expressions.length === 0 &&
        prop.value.quasis.length === 1
      ) {
        const staticValue = prop.value.quasis[0].value.cooked;
        if (staticValue) {
          const entry = createTranslationEntry(
            "metadata",
            staticValue,
            {
              fieldPath: fieldPath,
            },
            state.filePath,
            prop.value.loc?.start.line,
            prop.value.loc?.start.column,
          );
          entries.push(entry);

          // Replace with t(hash, fallback) call
          prop.value = t.callExpression(t.identifier("t"), [
            t.stringLiteral(entry.hash),
            t.stringLiteral(staticValue),
          ]);
        }
      }
    }
    // Transform nested objects (always recurse to check nested fields)
    else if (prop.value.type === "ObjectExpression") {
      transformMetadataObject(prop.value, state, entries, fieldPath);
    }
    // Handle arrays (e.g., images: [{url: '...', alt: '...'}])
    else if (prop.value.type === "ArrayExpression") {
      prop.value.elements.forEach((element, index) => {
        if (element && element.type === "ObjectExpression") {
          transformMetadataObject(
            element,
            state,
            entries,
            `${fieldPath}[${index}]`,
          );
        }
      });
    }
  }
}

/**
 * Transform existing generateMetadata function to add translations
 */
function transformMetadataFunction(
  path: NodePath<t.FunctionDeclaration>,
  state: MetadataInputState,
): MetadataOutputState | null {
  const body = path.get("body");
  if (!body.isBlockStatement()) return null;

  // Find the return statement with metadata object
  let metadataReturn = undefined as NodePath<t.ReturnStatement> | undefined;
  body.traverse({
    ReturnStatement(returnPath) {
      if (!metadataReturn) {
        metadataReturn = returnPath;
      }
    },
  });

  if (!isReturnStatement(metadataReturn) || !metadataReturn.node.argument)
    return null;
  if (!isObjectExpression(metadataReturn.node.argument)) return null;

  const entries: TranslationEntry[] = [];
  const metadataObject = metadataReturn.node.argument;
  transformMetadataObject(metadataObject, state, entries);

  if (entries.length === 0) {
    return null;
  }

  // Server translations require function to be async.
  if (!path.node.async) {
    path.node.async = true;
  }

  const serverCall = constructServerTranslationHookCall({
    hashes: entries.map((e) => e.hash),
  });
  body.node.body.unshift(serverCall);

  return {
    needsAsyncImport: true,
    newEntries: entries,
  };
}

/**
 * Process static metadata export
 * Only converts to function if there are translatable strings
 */
export function processNextStaticMetadata(
  path: NodePath<t.ExportNamedDeclaration>,
  state: MetadataInputState,
): MetadataOutputState | null {
  // Get the metadata object
  const metadataObject = getNextMetadataObjectOrNull(path);
  if (!metadataObject || metadataObject.type !== "ObjectExpression")
    return null;

  // Clone and try transforming (transformMetadataObject modifies in place)
  const clonedObject = t.cloneNode(metadataObject, true);
  const entries: TranslationEntry[] = [];
  transformMetadataObject(clonedObject, state, entries);

  // If nothing to translate, leave as-is
  if (entries.length === 0) {
    return null;
  }

  // Create async generateMetadata function with transformed object
  const serverCall = constructServerTranslationHookCall({
    hashes: entries.map((e) => e.hash),
  });

  const generateMetadataFunction = t.functionDeclaration(
    t.identifier(NEXT_GENERATE_METADATA_FUNCTION_NAME),
    [],
    t.blockStatement([serverCall, t.returnStatement(clonedObject)]),
    false,
    true, // async - required for server translations
  );

  // Replace static export with function export
  path.replaceWith(t.exportNamedDeclaration(generateMetadataFunction, []));
  path.skip();

  return {
    needsAsyncImport: true,
    newEntries: entries,
  };
}

export function processNextDynamicMetadata(
  path: NodePath<t.FunctionDeclaration>,
  state: MetadataInputState,
): MetadataOutputState | null {
  if (!isNextGenerateMetadataFunction(path)) return null;
  const newState = transformMetadataFunction(path, state);
  path.skip();
  return newState;
}
