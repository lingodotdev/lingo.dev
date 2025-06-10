import { getJsxAttributeValue } from "./utils";
import _ from "lodash";
import { getAstKey } from "./utils/ast-key";
import { LCP } from "./lib/lcp";
import { getJsxElementHash } from "./utils/hash";
import { getJsxAttributesMap } from "./utils/jsx-attribute";
import { extractJsxContent } from "./utils/jsx-content";
import { collectJsxScopes } from "./utils/jsx-scope";
import { CompilerPayload } from "./_base";

// Processes only JSX element scopes
export function jsxScopesExportMutation(
  payload: CompilerPayload,
): CompilerPayload {
  const scopes = collectJsxScopes(payload.ast);
  if (_.isEmpty(scopes)) {
    return payload;
  }

  const lcp = LCP.getInstance({
    sourceRoot: payload.params.sourceRoot,
    lingoDir: payload.params.lingoDir,
  });

  for (const scope of scopes) {
    const scopeKey = getAstKey(scope);

    lcp.resetScope(payload.relativeFilePath, scopeKey);

    lcp.setScopeType(payload.relativeFilePath, scopeKey, "element");

    const hash = getJsxElementHash(scope);
    lcp.setScopeHash(payload.relativeFilePath, scopeKey, hash);

    const context = getJsxAttributeValue(scope, "data-lingo-context");
    lcp.setScopeContext(
      payload.relativeFilePath,
      scopeKey,
      String(context || ""),
    );

    const skip = getJsxAttributeValue(scope, "data-lingo-skip");
    lcp.setScopeSkip(
      payload.relativeFilePath,
      scopeKey,
      Boolean(skip || false),
    );

    const attributesMap = getJsxAttributesMap(scope);
    const overrides = _.chain(attributesMap)
      .entries()
      .filter(([attributeKey]) =>
        attributeKey.startsWith("data-lingo-override-"),
      )
      .map(([k, v]) => [k.split("data-lingo-override-")[1], v])
      .filter(([k]) => !!k)
      .filter(([, v]) => !!v)
      .fromPairs()
      .value();
    lcp.setScopeOverrides(payload.relativeFilePath, scopeKey, overrides);

    const content = extractJsxContent(scope);
    lcp.setScopeContent(payload.relativeFilePath, scopeKey, content);
  }

  lcp.save();

  return payload;
}
