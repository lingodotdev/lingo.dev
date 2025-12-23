/**
 * Type definitions for the framework-agnostic dev widget
 */
import type { LocaleCode } from "lingo.dev/spec";

export type WidgetPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface ServerTranslationProgress {
  locale: LocaleCode;
  total: number;
  completed: number;
  status: "in-progress" | "complete" | "error";
}

export interface LingoDevState {
  isLoading: boolean;
  locale: LocaleCode;
  sourceLocale: string;
  pendingCount: number;
  position: WidgetPosition;
  serverProgress?: ServerTranslationProgress;
}

declare global {
  interface Window {
    __LINGO_DEV_STATE__?: LingoDevState;
    __LINGO_DEV_UPDATE__?: () => void;
    __LINGO_DEV_WS_URL__?: string;
  }
}
