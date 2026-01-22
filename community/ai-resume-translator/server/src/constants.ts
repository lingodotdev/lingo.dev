import { FileType } from "./types/file.type";
import { LanguageCode } from "./types/language.type";

export const ACCEPTED_FILE_TYPES: FileType[] = [
  ...Object.values(FileType),
] as const;

export const SUPPORTED_LANGUAGE_CODES: LanguageCode[] = [
  ...Object.values(LanguageCode),
] as const;
