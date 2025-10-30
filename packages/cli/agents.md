## Lingo.dev CLI — Command Reference (agents)

This file is a structured reference of the `lingo.dev` CLI commands and options. It is intended for use by automation, agent integrations, and dynamic help generation.

Format contract (for parsers):

- Command: single-line command name (e.g., `init`)
- Usage: CLI usage pattern
- Description: short description
- Options: list of flags with their parameter form, short/long forms and descriptions
- Examples: 1–3 usage examples
- Env: environment variables that affect command behavior
- Notes: any special behavior or hidden flags

---

## Table of contents

- [Overview (base command)](#overview-base-command)
- [init](#init)
- [i18n (deprecated)](#i18n-deprecated)
- [run](#run)
- [status](#status)
- [ci](#ci)
- [mcp](#mcp)
- [auth / login / logout](#auth--login--logout)
- [show (subcommands)](#show-subcommands)
- [config (set/get/unset)](#config-setgetunset)
- [lockfile](#lockfile)
- [cleanup](#cleanup)
- [purge](#purge)

---

## Overview (base command)

Command: `lingo.dev`

Usage: `lingo.dev [global options] <command> [command options]`

Description: Lingo.dev CLI — AI-powered localization tooling.

Global options:

- `-h, --help` — Show help
- `-v, --version` — Show version
- `-y, --no-interactive` — Run every command in non-interactive mode (no prompts); required when scripting

Exit behavior:

- When help or version is displayed the process exits with code `0`.
- Command runtime errors typically exit with code `1`.

---

## init

Command: `init`

Usage: `lingo.dev init [options]`

Description: Create `i18n.json` configuration file for a new project.

Options:

- `-f, --force` — Overwrite existing configuration instead of aborting (destructive). Default: `false`.
- `-s, --source <locale>` — Primary source locale (defaults to `en`). Validated.
- `-t, --targets <locale...>` — Target locale codes (defaults to `es`). Accepts multiple values separated by spaces or commas.
- `-b, --bucket <type>` — Bucket file format (e.g., `json`, `yaml`, `android`). Default: `json`.
- `-p, --paths [path...]` — When non-interactive, list concrete paths (use `[locale]` placeholder). Accepts multiple values separated by spaces or commas. Default: `[]`.

Examples:

- `lingo.dev init` — interactive initialization.
- `lingo.dev init -s en -t es,fr -b json -p "src/locales/[locale].json"` — non-interactive init with paths.

Notes:

- In interactive mode the command will scan for existing locale files and propose defaults; in non-interactive mode `--paths` must be used to supply file patterns.

---

## i18n (DEPRECATED)

Command: `i18n`

Usage: `lingo.dev i18n [options]`

Description: DEPRECATED: Run localization pipeline (prefer `run`). Kept for backward compatibility.

Options (subset):

- `--locale <locale>` — Repeatable; limit processing to specific target locales.
- `--bucket <bucket>` — Repeatable; limit processing to bucket types.
- `--key <key>` — Process a single translation key.
- `--file [files...]` — Filter processing to buckets whose path contains these substrings.
- `--frozen` — Validate translations without making changes (CI use).
- `--force` — Force re-translation of all keys.
- `--verbose` — Print translation data as JSON.
- `--interactive` — Review and edit AI generated translations before applying.
- `--api-key <api-key>` — Override API key from settings/env.
- `--debug` — Pause before processing to attach a debugger.
- `--strict` — Fail-fast on first error.

Examples:

- `lingo.dev i18n --frozen` — check lockfile in CI (deprecated; use `run --frozen`).

Notes:

- Prefer using `run` instead; options are broadly mirrored in `run` where applicable.

---

## run

Command: `run`

Usage: `lingo.dev run [options]`

Description: Run the localization pipeline (recommended replacement for `i18n`).

Options:

- `--source-locale <source-locale>` — Override the source locale for this run.
- `--target-locale <target-locale>` — Repeatable; limit processing to listed target locales.
- `--bucket <bucket>` — Repeatable; limit processing to bucket types.
- `--file <file>` — Repeatable; filter bucket path patterns by substring.
- `--key <key>` — Repeatable; filter keys by prefix (dot-separated). Example: `auth.login`.
- `--force` — Force re-translation of all keys.
- `--frozen` — Validate translations without making changes (CI use).
- `--api-key <api-key>` — Override API key for the run.
- `--debug` — Pause before processing to attach a debugger.
- `--concurrency <concurrency>` — Number of translation jobs to run concurrently (integer). Default: `10` (max 10).
- `--watch` — Watch source locale files and retranslate when changed.
- `--debounce <milliseconds>` — Watch debounce delay (defaults to 5000).
- `--sound` — Play audio feedback when translations complete.

Examples:

- `lingo.dev run --concurrency 5 --target-locale es --file messages.json`
- `lingo.dev run --frozen` — run validation-only for CI.

Notes:

- `--watch` will keep process running; use `--debounce` to tune latency.
- `--sound` attempts platform-specific audio playback (Linux/macOS/Windows); requires available player utilities.

---

## status

Command: `status`

Usage: `lingo.dev status [options]`

Description: Show the status of the localization process (missing/updated keys, word counts, per-locale stats).

Options:

- `--locale <locale>` — Repeatable; restrict report to listed target locales.
- `--bucket <bucket>` — Repeatable; restrict report to bucket types.
- `--file [files...]` — Filter report to files whose path contains these substrings.
- `--force` — Count all keys as needing translation (estimates for full retranslation).
- `--verbose` — Print detailed output with example keys.
- `--api-key <api-key>` — Override API key.

Examples:

- `lingo.dev status --locale es --bucket json`

Notes:

- Authentication is optional for `status` (it will try and continue without it).

---

## ci

Command: `ci`

Usage: `lingo.dev ci [options]`

Description: Run localization pipeline optimized for CI/CD environments; supports creating PRs or committing directly.

Options:

- `--parallel [boolean]` — Process translations concurrently. Defaults to `false`.
- `--api-key <key>` — Override API key.
- `--pull-request [boolean]` — Use pull-request mode; defaults to `false`.
- `--commit-message <message>` — Commit message for localization changes.
- `--pull-request-title <title>` — PR title in pull-request mode.
- `--working-directory <dir>` — Directory to run localization from.
- `--process-own-commits [boolean]` — Allow processing commits made by this CI user.

Environment variables (set by the command when invoking flows):

- `LINGODOTDEV_API_KEY`
- `LINGODOTDEV_PULL_REQUEST` (string "true"/"false")
- `LINGODOTDEV_COMMIT_MESSAGE`
- `LINGODOTDEV_PULL_REQUEST_TITLE`
- `LINGODOTDEV_WORKING_DIRECTORY`
- `LINGODOTDEV_PROCESS_OWN_COMMITS`

Examples:

- `lingo.dev ci --pull-request true --api-key $LINGODOTDEV_API_KEY`

Notes:

- Behavior depends on detected platform integration kit (GitHub/GitLab/etc.).

---

## mcp

Command: `mcp`

Usage: `lingo.dev mcp [apiKey]`

Description: Start a Model Context Protocol (MCP) server for AI assistant integration. Authenticates using configured API key (or the first positional argument).

Notes:

- Requires a valid API key (from settings or supplied as first positional argument).
- Starts MCP server on stdio and registers a `translate` tool that accepts `{ text: string, targetLocale: string }`.

---

## auth

Command: `auth`

Usage: `lingo.dev auth [--login|--logout]`

Description: Show current authentication status and user email.

Options:

- `--login` — (DEPRECATED) shows deprecation warning and exits. Use `lingo.dev login`.
- `--logout` — (DEPRECATED) shows deprecation warning and exits. Use `lingo.dev logout`.

Examples:

- `lingo.dev auth`

---

## login

Command: `login`

Usage: `lingo.dev login`

Description: Open a browser to authenticate with lingo.dev and save your API key to the local CLI settings (`~/.lingodotdevrc`).

Notes:

- The command opens a local server and waits for the web app to POST the API key. Alternatively, set `LINGODOTDEV_API_KEY` in your environment or `.env`.

---

## logout

Command: `logout`

Usage: `lingo.dev logout`

Description: Remove saved authentication credentials from local settings.

---

## show (subcommands)

Top-level: `lingo.dev show <subcommand>`

Subcommands:

- `config` — `lingo.dev show config`

  - Description: Print effective `i18n.json` merged with defaults.

- `locale` — `lingo.dev show locale <type>`

  - Description: List supported locale codes.
  - Argument: `<type>` — either `sources` or `targets` (both print full supported list).

- `files` — `lingo.dev show files [options]`

  - Description: Expand bucket path patterns into concrete source/target file paths.
  - Options:
    - `--source` — only show source locale variants
    - `--target` — only show target locale variants

- `locked-keys` — `lingo.dev show locked-keys [--bucket <name>]`

  - Description: Show which key-value pairs match `lockedKeys` patterns. Optionally filter by `--bucket`.

- `ignored-keys` — `lingo.dev show ignored-keys [--bucket <name>]`
  - Description: Show which key-value pairs match `ignoredKeys` patterns. Optionally filter by `--bucket`.

Examples:

- `lingo.dev show files --source`
- `lingo.dev show locked-keys --bucket json`

---

## config (set / get / unset)

Top-level: `lingo.dev config <set|get|unset> ...`

`config set <key> <value>`

- Description: Set or update a CLI setting in `~/.lingodotdevrc`.
- Valid keys are enumerated in the CLI; the command prints available keys in help text.

`config get <key>`

- Description: Display the value of a CLI setting. If the key is an object, prints JSON.

`config unset <key>`

- Description: Remove a CLI setting.

Notes:

- Keys are validated against the known `SETTINGS_KEYS` defined in the CLI utils. Use `lingo.dev config set --help` to view available keys.

---

## lockfile

Command: `lockfile`

Usage: `lingo.dev lockfile [--force]`

Description: Generate or refresh `i18n.lock` based on current source locale content.

Options:

- `-f, --force` — Overwrite existing lockfile.

---

## cleanup

Command: `cleanup`

Usage: `lingo.dev cleanup [options]`

Description: Remove translation keys from target locales that no longer exist in the source locale.

Options:

- `--locale <locale>` — Limit cleanup to a specific target locale. Repeatable.
- `--bucket <bucket>` — Limit cleanup to a specific bucket type.
- `--dry-run` — Preview deletions without making changes.
- `--verbose` — Print detailed output.

Examples:

- `lingo.dev cleanup --dry-run --bucket json`

---

## purge

Command: `purge`

Usage: `lingo.dev purge [options]`

Description: Permanently delete translation entries from bucket path patterns. Destructive.

Options:

- `--bucket <bucket>` — Repeatable; limit to bucket types.
- `--file [files...]` — Filter which file paths to purge by substring(s).
- `--key <key>` — Delete only keys matching a prefix/pattern. If omitted, deletes ALL keys (except locked/ignored ones).
- `--locale <locale>` — Repeatable; limit to target locales. Including source locale will delete content from source as well.
- `--yes-really` — Bypass confirmation prompts (use with extreme caution; intended for automation).

Examples:

- `lingo.dev purge --key "auth.login*" --yes-really`

Notes:

- By default the command prompts for confirmation before destructive changes unless `--yes-really` is provided.

---

## Environment variables and settings

- `LINGODOTDEV_API_KEY` — API key used by commands that call the Lingo.dev service (login and config override behavior also uses local settings `~/.lingodotdevrc`).
- `.env` support: the CLI loads `dotenv` early; setting `LINGODOTDEV_API_KEY` in `.env` or environment is supported.

---

## Examples & common workflows

- Initialize a project non-interactively:
  - `lingo.dev init --source en --targets es fr --bucket json --paths "src/locales/[locale].json"
- Run localization in CI (validate lockfile only):
  - `lingo.dev run --frozen --api-key $LINGODOTDEV_API_KEY`
- Start MCP server for agent integration:
  - `lingo.dev mcp $LINGODOTDEV_API_KEY`
