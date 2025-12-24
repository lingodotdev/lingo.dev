/**
 * WebSocket event types for real-time translation progress
 * Sent from translation server to dev widget clients
 */

import type { LocaleCode } from "lingo.dev/spec";

/**
 * Base event structure
 */
interface BaseEvent {
  type: string;
  timestamp: number;
}

/**
 * Server connection established
 */
export interface ConnectedEvent extends BaseEvent {
  type: "connected";
  serverUrl: string;
}

/**
 * Single translation started
 */
export interface TranslationStartEvent extends BaseEvent {
  type: "translation:start";
  hash: string;
  locale: LocaleCode;
  sourceText: string;
}

/**
 * Single translation completed successfully
 */
export interface TranslationCompleteEvent extends BaseEvent {
  type: "translation:complete";
  hash: string;
  locale: LocaleCode;
  translatedText: string;
  duration: number; // ms
}

/**
 * Single translation failed
 */
export interface TranslationErrorEvent extends BaseEvent {
  type: "translation:error";
  hash: string;
  locale: LocaleCode;
  error: string;
}

/**
 * Batch translation started
 */
export interface BatchStartEvent extends BaseEvent {
  type: "batch:start";
  locale: LocaleCode;
  total: number;
  hashes: string[];
}

/**
 * Batch translation progress update
 */
export interface BatchProgressEvent extends BaseEvent {
  type: "batch:progress";
  locale: LocaleCode;
  completed: number;
  total: number;
  percent: number;
}

/**
 * Batch translation completed
 */
export interface BatchCompleteEvent extends BaseEvent {
  type: "batch:complete";
  locale: LocaleCode;
  total: number;
  successful: number;
  failed: number;
  duration: number; // ms
}

/**
 * Metadata updated (new translatable text discovered)
 */
export interface MetadataUpdateEvent extends BaseEvent {
  type: "metadata:update";
  newEntries: number;
  totalEntries: number;
}

/**
 * Cache updated
 */
export interface CacheUpdateEvent extends BaseEvent {
  type: "cache:update";
  locale: LocaleCode;
  entriesCount: number;
}

/**
 * Server is now busy processing translations
 */
export interface ServerBusyEvent extends BaseEvent {
  type: "server:busy";
  activeTranslations: number;
}

/**
 * Server is now idle (no active translations)
 */
export interface ServerIdleEvent extends BaseEvent {
  type: "server:idle";
}

/**
 * Union type of all possible events
 */
export type TranslationServerEvent =
  | ConnectedEvent
  | TranslationStartEvent
  | TranslationCompleteEvent
  | TranslationErrorEvent
  | BatchStartEvent
  | BatchProgressEvent
  | BatchCompleteEvent
  | MetadataUpdateEvent
  | CacheUpdateEvent
  | ServerBusyEvent
  | ServerIdleEvent;

type TranslationServerEventByType = {
  [T in TranslationServerEvent as T["type"]]: T;
};

/**
 * Helper to create events with timestamp
 */
export function createEvent<T extends keyof TranslationServerEventByType>(
  type: T,
  event: Omit<TranslationServerEventByType[T], "timestamp" | "type">,
): TranslationServerEventByType[T] {
  return {
    ...event,
    timestamp: Date.now(),
    type,
  } as TranslationServerEventByType[T];
}
