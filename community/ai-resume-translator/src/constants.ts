import { FileType } from "./types/file.type";
import { LanguageCode } from "./types/language.type";
import { ResumeLayout } from "./types/resumeLayout.type";

export const ACCEPTED_FILE_TYPES: readonly FileType[] = [
  ...Object.values(FileType),
] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_EXTRACTED_TEXT_LENGTH = 600 as const; // 600 characters

export const SUPPORTED_LANGUAGE_CODES: readonly LanguageCode[] = [
  ...Object.values(LanguageCode),
] as const;

export const DEFAULT_RESUME_LAYOUT: Readonly<ResumeLayout> = {
  page: { size: "A4", margin: 30 },
  fonts: {
    name: 22,
    section: 14,
    body: 11,
  },
  spacing: {
    sectionGap: 10,
    lineGap: 4,
  },
} as const;
