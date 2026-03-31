import { createHash } from "crypto";
import { TRACKING_VERSION, SDK_PACKAGE } from "./tracking-events";

const POSTHOG_API_KEY = "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk";
const POSTHOG_HOST = "https://eu.i.posthog.com";

type IdentityInfo = {
  distinct_id: string;
  distinct_id_source: string;
};

const identityCache = new Map<
  string,
  { identity: IdentityInfo; email?: string }
>();

export function trackEvent(
  apiKey: string,
  apiUrl: string,
  event: string,
  properties?: Record<string, any>,
): void {
  if (process.env.DO_NOT_TRACK === "1") {
    return;
  }

  resolveIdentityAndCapture(apiKey, apiUrl, event, properties).catch(
    (error) => {
      if (process.env.DEBUG === "true") {
        console.error("[Tracking] Error:", error);
      }
    },
  );
}

async function resolveIdentityAndCapture(
  apiKey: string,
  apiUrl: string,
  event: string,
  properties?: Record<string, any>,
) {
  const { identity, email } = await getDistinctId(apiKey, apiUrl);

  if (process.env.DEBUG === "true") {
    console.log(
      `[Tracking] Event: ${event}, ID: ${identity.distinct_id}, Source: ${identity.distinct_id_source}`,
    );
  }

  const { PostHog } = await import("posthog-node");
  const posthog = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  await posthog.capture({
    distinctId: identity.distinct_id,
    event,
    properties: {
      ...properties,
      $set: email ? { email } : {},
      tracking_version: TRACKING_VERSION,
      sdk_package: SDK_PACKAGE,
      distinct_id_source: identity.distinct_id_source,
    },
  });

  // TODO: remove after 2026-04-30 — temporary alias to merge old email-based distinct_ids with database user ID
  if (email) {
    await posthog.alias({
      distinctId: identity.distinct_id,
      alias: email,
    });
  }

  await posthog.shutdown();
}

async function getDistinctId(
  apiKey: string,
  apiUrl: string,
): Promise<{ identity: IdentityInfo; email?: string }> {
  const cached = identityCache.get(apiKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${apiUrl}/users/me`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload?.id) {
        const result = {
          identity: {
            distinct_id: payload.id,
            distinct_id_source: "database_id",
          },
          email: payload.email || undefined,
        };
        identityCache.set(apiKey, result);
        return result;
      }
    }
  } catch {
    // Fall through to API key hash
  }

  // Don't cache the fallback — a transient /users/me failure should not poison the cache for the entire process lifetime
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
