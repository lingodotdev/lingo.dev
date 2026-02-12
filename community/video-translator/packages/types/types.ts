export interface TranslatePayload {
  text: string;
  sourceLocale?: string | null;
  targetLocale: string;
}

export interface TranslateResponse {
  translated: string;
}
