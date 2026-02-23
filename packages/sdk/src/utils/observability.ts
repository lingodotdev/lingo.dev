import { createHash } from "crypto";
import { TRACKING_VERSION, SDK_PACKAGE } from "./tracking-events";

const POSTHOG_API_KEY = "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk";
const POSTHOG_HOST = "https://eu.i.posthog.com";

type IdentityInfo = {
  distinct_id: string;
  distinct_id_source: string;
};

const identityCache = new Map<string, IdentityInfo>();

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
  const identityInfo = await getDistinctId(apiKey, apiUrl);

  if (process.env.DEBUG === "true") {
    console.log(
      `[Tracking] Event: ${event}, ID: ${identityInfo.distinct_id}, Source: ${identityInfo.distinct_id_source}`,
    );
  }

  const { PostHog } = await import("posthog-node");
  const posthog = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  await posthog.capture({
    distinctId: identityInfo.distinct_id,
    event,
    properties: {
      ...properties,
      tracking_version: TRACKING_VERSION,
      sdk_package: SDK_PACKAGE,
      distinct_id_source: identityInfo.distinct_id_source,
    },
  });

  await posthog.shutdown();
}

async function getDistinctId(
  apiKey: string,
  apiUrl: string,
): Promise<IdentityInfo> {
  const cached = identityCache.get(apiKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${apiUrl}/whoami`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload?.email) {
        const identity: IdentityInfo = {
          distinct_id: payload.email,
          distinct_id_source: "email",
        };
        identityCache.set(apiKey, identity);
        return identity;
      }
    }
  } catch {
    // Fall through to API key hash
  }

  const hash = createHash("sha256").update(apiKey).digest("hex").slice(0, 16);
  const identity: IdentityInfo = {
    distinct_id: `apikey-${hash}`,
    distinct_id_source: "api_key_hash",
  };
  identityCache.set(apiKey, identity);
  return identity;
}

export function _resetIdentityCache() {
  identityCache.clear();
}
