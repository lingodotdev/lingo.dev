/**
 * Server-side translation hook using React Server Module Conventions
 * This file is loaded via "react-server" conditional export in package.json
 *
 * When you import from '@lingo.dev/compiler/react' in a Server Component,
 * the bundler automatically loads THIS file instead of the client version.
 *
 * ARCHITECTURE:
 * This module orchestrates two separate concerns:
 * 1. Locale resolution (framework-specific) - via config.ts
 * 2. Translation fetching (universal) - via server/translations.ts
 *
 * @module @lingo.dev/compiler/react (server)
 */
export { LingoProvider } from "./ServerLingoProvider";
export { LocaleSwitcher } from "../shared/LocaleSwitcher";
export { useTranslation } from "./useTranslation";
