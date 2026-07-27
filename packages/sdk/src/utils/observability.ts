import { createHash } from "crypto";
import { TRACKING_VERSION, SDK_PACKAGE } from "./tracking-events";

const POSTHOG_API_KEY = "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk";
const POSTHOG_HOST = "https://eu.i.posthog.com";

type IdentityInfo = {
  distinct_id: string;
  distinct_id_source: string;
};

const identityCache = new Map<string, { identity: IdentityInfo; email?: string; organizationId?: string }>();

export function trackEvent(apiKey: string, apiUrl: string, event: string, properties?: Record<string, any>): void {
  if (process.env.DO_NOT_TRACK === "1") {
    return;
  }

  resolveIdentityAndCapture(apiKey, apiUrl, event, properties).catch((error) => {
    if (process.env.DEBUG === "true") {
      console.error("[Tracking] Error:", error);
    }
  });
}

async function resolveIdentityAndCapture(
  apiKey: string,
  apiUrl: string,
  event: string,
  properties?: Record<string, any>,
) {
  const { identity, email, organizationId } = await getDistinctId(apiKey, apiUrl);

  if (process.env.DEBUG === "true") {
    console.log(`[Tracking] Event: ${event}, ID: ${identity.distinct_id}, Source: ${identity.distinct_id_source}`);
  }

  const { PostHog } = await import("posthog-node");
  const posthog = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    await posthog.capture({
      distinctId: identity.distinct_id,
      event,
      ...(organizationId ? { groups: { organization: organizationId } } : {}),
      properties: {
        ...properties,
        $set: { ...(properties?.$set || {}), ...(email ? { email } : {}) },
        tracking_version: TRACKING_VERSION,
        sdk_package: SDK_PACKAGE,
        distinct_id_source: identity.distinct_id_source,
      },
    });
  } finally {
    await posthog.shutdown();
  }
}

async function getDistinctId(
  apiKey: string,
  apiUrl: string,
): Promise<{
  identity: IdentityInfo;
  email?: string;
  organizationId?: string;
}> {
  const cached = identityCache.get(apiKey);
  if (cached) return cached;

  try {
    // `/whoami` carries the full telemetry identity: `organizationId` for the group,
    // `userId` (the human behind a personal key, null for a service key) and `keyId`
    // (the stable actor a service-key run keys on). `/users/me` returned none of it.
    const res = await fetch(`${apiUrl}/whoami`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const payload = await res.json();
      const organizationId = typeof payload?.organizationId === "string" ? payload.organizationId : undefined;
      let result: { identity: IdentityInfo; email?: string; organizationId?: string } | undefined;

      if (typeof payload?.userId === "string") {
        // Personal key: the actor is the human; email rides as an identify trait.
        result = {
          identity: { distinct_id: payload.userId, distinct_id_source: "database_id" },
          email: payload.email || undefined,
          organizationId,
        };
      } else if (typeof payload?.keyId === "string") {
        // Service key: the actor is the key itself — no human, so no email trait.
        result = {
          identity: { distinct_id: payload.keyId, distinct_id_source: "api_key_id" },
          organizationId,
        };
      } else if (payload?.id) {
        // Back-compat: an older API predating `userId`/`keyId` still returns the user id.
        result = {
          identity: { distinct_id: payload.id, distinct_id_source: "database_id" },
          email: payload.email || undefined,
          organizationId,
        };
      }

      if (result) {
        identityCache.set(apiKey, result);
        return result;
      }
    }
  } catch {
    // Fall through to API key hash
  }

  // Don't cache the fallback — a transient /whoami failure should not poison the cache for the entire process lifetime
  const hash = createHash("sha256").update(apiKey).digest("hex").slice(0, 16);
  return {
    identity: {
      distinct_id: `apikey-${hash}`,
      distinct_id_source: "api_key_hash",
    },
  };
}

export function _resetIdentityCache() {
  identityCache.clear();
}
