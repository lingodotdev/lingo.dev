export const PRESETS = [
  {
    name: "SaaS Dashboard (JSON)",
    type: "json" as const,
    content: `{
  "page": {
    "title": "Welcome back to your dashboard",
    "description": "From here, you can monitor usage, manage team members, and configure advanced settings for your organization."
  },
  "notifications": {
    "empty": "You're all caught up. There are no new notifications at this time.",
    "error": "We ran into an unexpected issue while loading your notifications. Please refresh the page or try again later."
  },
  "actions": {
    "primary": "Create a new project",
    "secondary": "View detailed documentation and setup guides"
  }
}`,
  },
  {
    name: "Marketing Page (HTML)",
    type: "html" as const,
    content: `<section>
  <h2>Translate dynamic content with confidence</h2>
  <p>
    LingoStruct enables teams to translate user-generated and dynamic content
    in real time, without relying on static localization files or complex build steps.
  </p>
  <p>
    Whether you're building a SaaS dashboard, a support tool, or a global marketplace,
    LingoStruct ensures your content stays accurate, readable, and structurally intact.
  </p>
  <a href="/docs">Read the full documentation</a>
</section>`,
  },
  {
    name: "Feature Announcement (Text)",
    type: "text" as const,
    content: `Today, we're excited to announce a new feature that simplifies how teams handle localization.
Instead of managing dozens of static translation files, you can now translate content dynamically,
exactly when and where it's needed.

This approach reduces maintenance overhead, improves translation accuracy,
and enables faster iteration across global products.`,
  },
  {
    name: "User Errors & Help (JSON)",
    type: "json" as const,
    content: `{
  "errors": {
    "network": "We couldn't connect to the server. Please check your internet connection and try again.",
    "permission": "You don't have permission to perform this action. If you believe this is a mistake, contact your administrator."
  },
  "help": {
    "intro": "Need assistance getting started? We're here to help.",
    "details": "Visit our documentation for step-by-step guides, best practices, and troubleshooting tips."
  }
}`,
  },
];

export const DEFAULT_PRESET = PRESETS[0];
