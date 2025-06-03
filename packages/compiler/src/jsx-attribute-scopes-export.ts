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

      lcp.resetScope(payload.fileKey, scopeKey);

      const attributeValue = getJsxAttributeValue(scope, attribute);
      if (!attributeValue) {
        continue;
      }

      lcp.setScopeType(payload.fileKey, scopeKey, "attribute");

      const hash = getJsxAttributeValueHash(String(attributeValue));
      lcp.setScopeHash(payload.fileKey, scopeKey, hash);

      lcp.setScopeContext(payload.fileKey, scopeKey, "");
      lcp.setScopeSkip(payload.fileKey, scopeKey, false);
      lcp.setScopeOverrides(payload.fileKey, scopeKey, {});

      lcp.setScopeContent(payload.fileKey, scopeKey, String(attributeValue));
    }
  }

  lcp.save();

  return payload;
}
