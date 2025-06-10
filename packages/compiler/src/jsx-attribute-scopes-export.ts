import { getJsxAttributeValue } from "./utils";
import { LCP } from "./lib/lcp";
import { getJsxAttributeValueHash } from "./utils/hash";
import { collectJsxAttributeScopes } from "./utils/jsx-attribute-scope";
import { CompilerPayload } from "./_base";
import _ from "lodash";

// Processes only JSX attribute scopes
export function jsxAttributeScopesExportMutation(
  payload: CompilerPayload,
): CompilerPayload {
  const attributeScopes = collectJsxAttributeScopes(payload.ast);
  if (_.isEmpty(attributeScopes)) {
    return payload;
  }

  const lcp = LCP.getInstance({
    sourceRoot: payload.params.sourceRoot,
    lingoDir: payload.params.lingoDir,
  });

  for (const [scope, attributes] of attributeScopes) {
    for (const attributeDefinition of attributes) {
      const [attribute, scopeKey] = attributeDefinition.split(":");

      lcp.resetScope(payload.relativeFilePath, scopeKey);

      const attributeValue = getJsxAttributeValue(scope, attribute);
      if (!attributeValue) {
        continue;
      }

      lcp.setScopeType(payload.relativeFilePath, scopeKey, "attribute");

      const hash = getJsxAttributeValueHash(String(attributeValue));
      lcp.setScopeHash(payload.relativeFilePath, scopeKey, hash);

      lcp.setScopeContext(payload.relativeFilePath, scopeKey, "");
      lcp.setScopeSkip(payload.relativeFilePath, scopeKey, false);
      lcp.setScopeOverrides(payload.relativeFilePath, scopeKey, {});

      lcp.setScopeContent(
        payload.relativeFilePath,
        scopeKey,
        String(attributeValue),
      );
    }
  }

  lcp.save();

  return payload;
}
