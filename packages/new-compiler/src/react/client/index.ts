/**
 * React components for Lingo.dev translation runtime
 *
 * This file serves as the CLIENT-SIDE entry point via conditional exports.
 * The server-side entry point is in ./server.ts
 *
 * @module @lingo.dev/compiler/react (client)
 */
export {
  LingoProvider,
  type LingoProviderProps,
} from "../shared/LingoProvider";

export { useLingoContext } from "../shared/LingoContext";

export { useTranslation } from "./useTranslation";

export { LocaleSwitcher } from "../shared/LocaleSwitcher";
