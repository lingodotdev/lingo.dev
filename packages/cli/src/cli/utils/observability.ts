import { PostHog } from "posthog-node";

export default async function trackEvent(distinctId: string, event: string, properties?: Record<string, any>) {
  if (process.env.DO_NOT_TRACK) {
    return;
  }

  const posthog = new PostHog("phc_eR0iSoQufBxNY36k0f0T15UvHJdTfHlh8rJcxsfhfXk", {
    host: "https://eu.i.posthog.com",
  });

  await posthog.capture({
    distinctId,
    event,
    properties,
  });
}
