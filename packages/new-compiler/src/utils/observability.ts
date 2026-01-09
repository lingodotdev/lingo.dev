import * as machineIdLib from "node-machine-id";
import { getRc } from "./rc";
import { getRepositoryId } from "./repository-id";
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
        project_id: identityInfo.project_id,
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
  project_id: string | null;
}> {
  const email = await tryGetEmail();
  if (email) {
    const projectId = getRepositoryId();
    return {
      distinct_id: email,
      distinct_id_source: "email",
      project_id: projectId,
    };
  }

  const repoId = getRepositoryId();
  if (repoId) {
    return {
      distinct_id: repoId,
      distinct_id_source: "git_repo",
      project_id: repoId,
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
    project_id: null,
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
