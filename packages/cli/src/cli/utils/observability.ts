import pkg from "posthog-node";
const { PostHog } = pkg;

export default async function trackEvent(distinctId: string, event: string, properties?: Record<string, any>) {
  if (process.env.DO_NOT_TRACK) {
    return;
  }

  try {
    const safeProperties = properties ? JSON.parse(JSON.stringify(
      properties,
      (key, value) => {
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack,
          };
        }
        return value;
      }
    )) : {};

    const posthog = new PostHog("phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk", {
      host: "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });

    await posthog.capture({
      distinctId,
      event,
      properties: {
        ...safeProperties,
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
