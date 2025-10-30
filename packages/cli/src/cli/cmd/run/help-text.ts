/**
 * Enhanced help text and examples for the run command with watch mode
 */

export const WATCH_MODE_EXAMPLES = `
WATCH MODE EXAMPLES:

  Basic watch mode:
    $ lingo.dev run --watch

  Watch with custom debounce:
    $ lingo.dev run --watch --debounce 3000

  Watch specific file patterns:
    $ lingo.dev run --watch --watch-include "**/*.json" --watch-include "src/locales/**"

  Exclude patterns from watching:
    $ lingo.dev run --watch --watch-exclude "**/node_modules/**" --watch-exclude "**/*.tmp"

  Advanced debouncing strategies:
    $ lingo.dev run --watch --debounce-strategy adaptive --max-wait 15000
    $ lingo.dev run --watch --debounce-strategy batch --batch-size 25

  Performance tuning for large projects:
    $ lingo.dev run --watch --batch-size 100 --rate-limit-delay 50

  Quiet mode with notifications:
    $ lingo.dev run --watch --quiet --notifications --sound

  Using configuration file:
    $ lingo.dev run --watch --watch-config ./watch-config.json

  Development environment setup:
    $ lingo.dev run --watch --debounce 2000 --notifications --progress

  CI/CD environment setup:
    $ lingo.dev run --watch --quiet --no-progress --batch-size 100
`;

export const WATCH_MODE_DETAILED_HELP = `
WATCH MODE DETAILED HELP:

Watch mode enables real-time monitoring of translation source files and automatically
triggers retranslation when changes are detected. This provides hot reload functionality
for translation development, similar to modern development servers.

KEY FEATURES:
  • Real-time file change detection
  • Configurable debouncing strategies
  • Advanced file pattern matching
  • Performance optimization options
  • Desktop notifications and audio feedback
  • Graceful error handling and recovery

DEBOUNCING STRATEGIES:
  simple    - Fixed delay after last change (default, most predictable)
  adaptive  - Adjusts delay based on change frequency (best for variable workflows)
  batch     - Groups changes together efficiently (best for bulk operations)

FILE PATTERNS:
  Include patterns specify which files to watch for changes.
  Exclude patterns specify which files to ignore.
  Both support glob patterns like "**/*.json" or "src/locales/**".

PERFORMANCE TUNING:
  --batch-size      Number of files processed together (default: 50)
  --rate-limit-delay Delay between batches in ms (default: 100)
  --max-wait        Maximum wait time before forcing retranslation

FEEDBACK OPTIONS:
  --quiet           Suppress non-essential output
  --progress        Show progress indicators (default: enabled)
  --notifications   Enable desktop notifications
  --sound           Play audio feedback on completion

For more detailed documentation and examples, see:
packages/cli/docs/watch-mode.md
`;

export const FLAG_DESCRIPTIONS = {
  watch: {
    short: "Enable watch mode for automatic retranslation",
    long: "Watch source locale files continuously and retranslate automatically when files change. Enables hot reload functionality for translation development. Use additional --watch-* flags for advanced configuration.",
  },
  debounce: {
    short: "Delay before retranslation (ms)",
    long: "Delay in milliseconds after file changes before retranslating in watch mode. Prevents excessive retranslation during rapid file changes. Works with --debounce-strategy.",
  },
  watchInclude: {
    short: "Include file patterns for watching",
    long: "Include file patterns for watch mode. Supports glob patterns like '**/*.json' or 'src/locales/**'. Only files matching these patterns will trigger retranslation. Repeat for multiple patterns.",
  },
  watchExclude: {
    short: "Exclude file patterns from watching",
    long: "Exclude file patterns from watch mode. Supports glob patterns to ignore specific files or directories. Useful for excluding temporary files, build outputs, or version control files.",
  },
  watchConfig: {
    short: "Path to watch configuration file",
    long: "Path to watch configuration file with advanced watch settings. Allows complex watch configurations beyond CLI flags. File should contain JSON with watch options.",
  },
  debounceStrategy: {
    short: "Debouncing strategy (simple|adaptive|batch)",
    long: "Debouncing strategy for watch mode: 'simple' (fixed delay), 'adaptive' (adjusts based on change frequency), or 'batch' (groups changes together). Simple is most predictable, adaptive optimizes for different workflows, batch is best for bulk operations.",
  },
  maxWait: {
    short: "Maximum wait time before forced retranslation (ms)",
    long: "Maximum wait time in milliseconds before forcing retranslation in watch mode, regardless of ongoing file changes. Prevents indefinite delays during continuous file modifications. Only applies to 'adaptive' and 'batch' strategies.",
  },
  quiet: {
    short: "Suppress non-essential output",
    long: "Suppress non-essential output in watch mode. Only shows errors and critical information. Useful for background processes or when running in CI environments.",
  },
  progress: {
    short: "Show progress indicators",
    long: "Show progress indicators during retranslation. Displays real-time progress bars and status updates. Enabled by default in interactive terminals. Use --no-progress to disable.",
  },
  notifications: {
    short: "Enable desktop notifications",
    long: "Enable desktop notifications for watch mode events. Shows system notifications when retranslation starts, completes, or fails. Useful when working with the terminal in the background.",
  },
  batchSize: {
    short: "Files per batch in watch mode",
    long: "Number of files to process in a single batch during watch mode. Larger batches improve performance but use more memory. Smaller batches provide more responsive feedback.",
  },
  rateLimitDelay: {
    short: "Delay between batches (ms)",
    long: "Delay between batches in milliseconds to prevent system overload during bulk file processing. Higher values reduce CPU/memory usage but slow processing. Lower values increase responsiveness.",
  },
  sound: {
    short: "Play audio feedback",
    long: "Play audio feedback when translations complete (success or failure sounds). Useful for background monitoring of translation status. Works on Windows, macOS, and Linux.",
  },
};

export const COMMON_SCENARIOS = {
  development: {
    title: "Development Environment",
    command: "lingo.dev run --watch --debounce 2000 --notifications --progress",
    description: "Fast feedback with notifications for active development",
  },
  production: {
    title: "Production/CI Environment",
    command: "lingo.dev run --watch --quiet --no-progress --batch-size 100",
    description: "Optimized for automated environments with minimal output",
  },
  largeProject: {
    title: "Large Project Optimization",
    command:
      "lingo.dev run --watch --batch-size 100 --rate-limit-delay 50 --debounce-strategy batch",
    description: "Performance-tuned for projects with many translation files",
  },
  teamDevelopment: {
    title: "Team Development",
    command: "lingo.dev run --watch --watch-config ./team-watch-config.json",
    description: "Shared configuration for consistent team experience",
  },
  reactApp: {
    title: "React Application",
    command:
      "lingo.dev run --watch --watch-include 'src/locales/**/*.json' --debounce 2000",
    description: "Optimized for React app translation file structure",
  },
  mobileApp: {
    title: "Mobile Application",
    command:
      "lingo.dev run --watch --watch-include 'assets/i18n/**/*.json' --batch-size 20",
    description: "Configured for mobile app translation workflows",
  },
};
