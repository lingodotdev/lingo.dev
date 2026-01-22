/**
 * Type definitions for the Auto-Localized Landing Page Generator
 *
 * These types define the structure of landing page content
 * that will be localized using Lingo.dev
 */

/** Feature block with title and description */
export interface Feature {
  title: string;
  description: string;
}

/** Complete landing page content structure */
export interface LandingPageContent {
  productName: string;
  headline: string;
  subheadline: string;
  features: [Feature, Feature, Feature];
  ctaText: string;
}

/** Supported locale codes for translation */
export type SupportedLocale = "en" | "fr" | "de" | "es" | "ja";

/** Mapping of locale codes to their display names */
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ja: "日本語",
};

/** All supported locales array */
export const SUPPORTED_LOCALES: SupportedLocale[] = [
  "en",
  "fr",
  "de",
  "es",
  "ja",
];

/** Target locales (excluding source English) */
export const TARGET_LOCALES: SupportedLocale[] = ["fr", "de", "es", "ja"];

/** Translated content for all locales */
export type TranslatedContent = Record<SupportedLocale, LandingPageContent>;

/** API request body for translation */
export interface TranslationRequest {
  content: LandingPageContent;
}

/** API response with translations */
export interface TranslationResponse {
  translations: TranslatedContent;
  error?: string;
}
