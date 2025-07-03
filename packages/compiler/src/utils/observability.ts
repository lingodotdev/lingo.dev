import { machineId } from "node-machine-id";
import { getRc } from "./rc";

export default async function trackEvent(
  event: string,
  properties?: Record<string, any>,
) {
  if (process.env.DO_NOT_TRACK) {
    return;
  }

  try {
    const actualId = await getActualId();

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
      distinctId: actualId,
      event,
      properties: {
        ...properties,
        isByokMode: properties?.models !== "lingo.dev",
        meta: {
          version: process.env.npm_package_version,
          isCi: process.env.CI === "true",
        },
      },
    });

    await posthog.shutdown();
  } catch (error) {
    if (process.env.DEBUG) {
      console.error(error);
    }
  }
}

async function getActualId() {
  const rc = getRc();
  const apiKey = process.env.LINGODOTDEV_API_KEY || rc?.auth?.apiKey;
  const apiUrl =
    process.env.LINGODOTDEV_API_URL ||
    rc?.auth?.apiUrl ||
    "https://engine.lingo.dev";

  if (apiKey) {
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
      // ignore, fallback to device id
    }
  }
  const id = await machineId();
  return `device-${id}`;
}
