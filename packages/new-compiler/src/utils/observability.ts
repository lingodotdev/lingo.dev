import * as machineIdLib from "node-machine-id";
import crypto from "crypto";
import { getRc } from "./rc";
import { getOrgId } from "./org-id";
import { TRACKING_VERSION, COMPILER_PACKAGE } from "./tracking-events";

export default async function trackEvent(
  event: string,
  properties?: Record<string, any>,
) {
  if (process.env.DO_NOT_TRACK === "1") {
    return;
  }

  try {
    const identityInfo = await getDistinctId();

    if (process.env.DEBUG === "true") {
      console.log(
        `[Tracking] Event: ${event}, ID: ${identityInfo.distinct_id}, Source: ${identityInfo.distinct_id_source}`,
      );
    }

    const { PostHog } = await import("posthog-node");
    const posthog = new PostHog(
      "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk",
      {
        host: "https://eu.i.posthog.com",
        flushAt: 1,
        flushInterval: 0,
      },
    );

    await posthog.capture({
      distinctId: identityInfo.distinct_id,
      event,
      properties: {
        ...properties,
        isByokMode: properties?.models !== "lingo.dev",
        tracking_version: TRACKING_VERSION,
        compiler_package: COMPILER_PACKAGE,
        distinct_id_source: identityInfo.distinct_id_source,
        org_id: identityInfo.org_id,
        meta: {
          version: process.env.npm_package_version,
          isCi: process.env.CI === "true",
        },
      },
    });

    await posthog.shutdown();
  } catch (error) {
    if (process.env.DEBUG === "true") {
      console.error("[Tracking] Error:", error);
    }
  }
}

async function getDistinctId(): Promise<{
  distinct_id: string;
  distinct_id_source: string;
  org_id: string | null;
}> {
  const orgId = getOrgId();
  const email = await tryGetEmail();

  if (email) {
    const hashedEmail = crypto.createHash("sha256").update(email).digest("hex");
    return {
      distinct_id: hashedEmail,
      distinct_id_source: "email",
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

  const deviceId = `device-${await machineIdLib.machineId()}`;
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

async function tryGetEmail(): Promise<string | null> {
  const rc = getRc();
  const apiKey = process.env.LINGODOTDEV_API_KEY || rc?.auth?.apiKey;
  const apiUrl =
    process.env.LINGODOTDEV_API_URL ||
    rc?.auth?.apiUrl ||
    "https://engine.lingo.dev";

  if (!apiKey) {
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/whoami`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ContentType: "application/json",
      },
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload?.email) {
        return payload.email;
      }
    }
  } catch (err) {
    // ignore
  }

  return null;
}
