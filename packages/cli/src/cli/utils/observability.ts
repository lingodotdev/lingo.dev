import pkg from "node-machine-id";
const { machineIdSync } = pkg;

export default async function trackEvent(
  distinctId: string | null | undefined,
  event: string,
  properties?: Record<string, any>,
) {
  if (process.env.DO_NOT_TRACK) {
    return;
  }

  try {
    const actualId = distinctId || `device-${machineIdSync()}`;

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
