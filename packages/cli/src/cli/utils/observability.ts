import pkg from "node-machine-id";
const { machineIdSync } = pkg;
import https from "https";
import { getRepositoryId } from "./repository-id";

const POSTHOG_API_KEY = "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk";
const POSTHOG_HOST = "eu.i.posthog.com";
const POSTHOG_PATH = "/i/v0/e/";
const REQUEST_TIMEOUT_MS = 3000;
const TRACKING_VERSION = "2.0";

function determineDistinctId(providedId: string | null | undefined): {
  distinct_id: string;
  distinct_id_source: string;
  project_id: string | null;
} {
  if (providedId) {
    const projectId = getRepositoryId();
    return {
      distinct_id: providedId,
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

  const deviceId = `device-${machineIdSync()}`;
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

export default function trackEvent(
  distinctId: string | null | undefined,
  event: string,
  properties?: Record<string, any>,
): void {
  if (process.env.DO_NOT_TRACK === "1") {
    return;
  }

  setImmediate(() => {
    try {
      const identityInfo = determineDistinctId(distinctId);

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
          ...properties,
          $lib: "lingo.dev-cli",
          $lib_version: process.env.npm_package_version || "unknown",
          tracking_version: TRACKING_VERSION,
          distinct_id_source: identityInfo.distinct_id_source,
          project_id: identityInfo.project_id,
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
