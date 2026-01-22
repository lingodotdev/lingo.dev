import { FileType } from "./types/file.type";
import { LanguageCode } from "./types/language.type";
import { ResumeLayout } from "./types/resumeLayout.type";

export const ACCEPTED_FILE_TYPES: FileType[] = [
  ...Object.values(FileType),
] as const;

export const SUPPORTED_LANGUAGE_CODES: LanguageCode[] = [
  ...Object.values(LanguageCode),
] as const;

export const DEFAULT_RESUME_LAYOUT: ResumeLayout = {
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
