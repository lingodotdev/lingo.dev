import pkg from "node-machine-id";
const { machineIdSync } = pkg;
import https from "https";
import { getOrgId } from "./org-id";

const POSTHOG_API_KEY = "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk";
const POSTHOG_HOST = "eu.i.posthog.com";
const POSTHOG_PATH = "/i/v0/e/";
const REQUEST_TIMEOUT_MS = 3000;
const TRACKING_VERSION = "2.0";

export type UserIdentity = {
  email: string;
  id: string;
} | null;

function determineDistinctId(user: UserIdentity): {
  distinct_id: string;
  distinct_id_source: string;
  org_id: string | null;
} {
  const orgId = getOrgId();

  if (user) {
    return {
      distinct_id: user.id,
      distinct_id_source: "database_id",
      org_id: orgId,
    };
  }

  if (orgId) {
    return {
      distinct_id: orgId,
      distinct_id_source: "git_org",
      org_id: orgId,
    };
  }

  const deviceId = `device-${machineIdSync()}`;
  if (process.env.DEBUG === "true") {
    console.warn(
      "[Tracking] Using device ID fallback. Consider using git repository for consistent tracking.",
    );
  }
  return {
    distinct_id: deviceId,
    distinct_id_source: "device",
    org_id: null,
  };
}

const REDACTED = "[REDACTED]";

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[-_]/g, "");
  return (
    normalized.includes("apikey") ||
    normalized.endsWith("token") ||
    normalized.includes("secret") ||
    normalized.includes("password") ||
    normalized.includes("authorization")
  );
}

function redactString(value: string): string {
  return value.replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, `$1${REDACTED}`);
}

export function sanitizeProperties(
  value: unknown,
  ancestors: Set<object> = new Set(),
): any {
  if (typeof value === "string") {
    return redactString(value);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (typeof (value as any).toJSON === "function") {
    return value;
  }
  if (ancestors.has(value)) {
    return undefined;
  }

  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeProperties(item, ancestors));
    }

    const result: Record<string, any> = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] =
        isSensitiveKey(key) && entry !== undefined && entry !== null
          ? REDACTED
          : sanitizeProperties(entry, ancestors);
    }
    return result;
  } finally {
    ancestors.delete(value);
  }
}

export default function trackEvent(
  user: UserIdentity,
  event: string,
  properties?: Record<string, any>,
): void {
  if (process.env.DO_NOT_TRACK === "1") {
    return;
  }

  setImmediate(() => {
    try {
      const identityInfo = determineDistinctId(user);
      const safeProperties = sanitizeProperties(properties ?? {});

      if (process.env.DEBUG === "true") {
        console.log(
          `[Tracking] Event: ${event}, ID: ${identityInfo.distinct_id}, Source: ${identityInfo.distinct_id_source}`,
        );
      }

      const eventData = {
        api_key: POSTHOG_API_KEY,
        event,
        distinct_id: identityInfo.distinct_id,
        properties: {
          ...safeProperties,
          $set: {
            ...(safeProperties.$set || {}),
            ...(user ? { email: user.email } : {}),
          },
          $lib: "lingo.dev-cli",
          $lib_version: process.env.npm_package_version || "unknown",
          tracking_version: TRACKING_VERSION,
          distinct_id_source: identityInfo.distinct_id_source,
          org_id: identityInfo.org_id,
          node_version: process.version,
          is_ci: !!process.env.CI,
          debug_enabled: process.env.DEBUG === "true",
        },
        timestamp: new Date().toISOString(),
      };

      const payload = JSON.stringify(eventData);

      const options: https.RequestOptions = {
        hostname: POSTHOG_HOST,
        path: POSTHOG_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload).toString(),
        },
        timeout: REQUEST_TIMEOUT_MS,
      };

      const req = https.request(options);

      req.on("timeout", () => {
        req.destroy();
      });

      req.on("error", (error) => {
        if (process.env.DEBUG === "true") {
          console.error("[Tracking] Error ignored:", error.message);
        }
      });

      req.write(payload);
      req.end();

      // TODO: remove after 2026-04-30 — temporary alias to merge old email-based distinct_ids with database user ID
      if (user) {
        const aliasData = JSON.stringify({
          api_key: POSTHOG_API_KEY,
          event: "$create_alias",
          distinct_id: user.id,
          properties: {
            alias: user.email,
          },
          timestamp: new Date().toISOString(),
        });

        const aliasReq = https.request({
          ...options,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(aliasData).toString(),
          },
        });
        aliasReq.on("timeout", () => aliasReq.destroy());
        aliasReq.on("error", () => {});
        aliasReq.write(aliasData);
        aliasReq.end();
        setTimeout(() => {
          if (!aliasReq.destroyed) aliasReq.destroy();
        }, REQUEST_TIMEOUT_MS);
      }

      setTimeout(() => {
        if (!req.destroyed) {
          req.destroy();
        }
      }, REQUEST_TIMEOUT_MS);
    } catch (error) {
      if (process.env.DEBUG === "true") {
        console.error("[Tracking] Failed to send event:", error);
      }
    }
  });
}
