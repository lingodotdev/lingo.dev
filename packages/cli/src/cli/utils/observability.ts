import pkg from "node-machine-id";
const { machineIdSync } = pkg;
import https from "https";

const POSTHOG_API_KEY = "phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk";
const POSTHOG_HOST = "eu.i.posthog.com";
const POSTHOG_PATH = "/i/v0/e/"; // Correct PostHog capture endpoint
const REQUEST_TIMEOUT_MS = 1000;

/**
 * Sends an analytics event to PostHog using direct HTTPS API.
 * This is a fire-and-forget implementation that won't block the process.
 *
 * @param distinctId - Unique identifier for the user/device
 * @param event - Name of the event to track
 * @param properties - Additional properties to attach to the event
 */
export default function trackEvent(
  distinctId: string | null | undefined,
  event: string,
  properties?: Record<string, any>,
): void {
  // Skip tracking if explicitly disabled or in CI environment
  if (process.env.DO_NOT_TRACK === "1") {
    return;
  }

  // Defer execution to next tick to avoid blocking
  setImmediate(() => {
    try {
      const actualId = distinctId || `device-${machineIdSync()}`;

      // PostHog expects distinct_id at the root level, not nested in properties
      const eventData = {
        api_key: POSTHOG_API_KEY,
        event,
        distinct_id: actualId,
        properties: {
          ...properties,
          $lib: "lingo.dev-cli",
          $lib_version: process.env.npm_package_version || "unknown",
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

      // Handle timeout by destroying the request
      req.on("timeout", () => {
        req.destroy();
      });

      // Silently ignore errors to prevent crashes
      req.on("error", (error) => {
        if (process.env.DEBUG === "true") {
          console.error("[Tracking] Error ignored:", error.message);
        }
      });

      // Send payload and close the request
      req.write(payload);
      req.end();

      // Ensure cleanup after timeout
      setTimeout(() => {
        if (!req.destroyed) {
          req.destroy();
        }
      }, REQUEST_TIMEOUT_MS);
    } catch (error) {
      // Catch-all for any synchronous errors
      if (process.env.DEBUG === "true") {
        console.error("[Tracking] Failed to send event:", error);
      }
    }
  });
}
