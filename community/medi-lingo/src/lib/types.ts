/**
 * TypeScript interfaces for medi-lingo
 * These define the structure of medical report analysis and API communication
 */

/**
 * Structured output from medical report analysis
 * This format is designed for consistency and translation-readiness
 */
export interface MedicalReportAnalysis {
  /** High-level summary of the report (3-4 sentences) */
  overview: string;
  /** List of factual findings from the report */
  key_findings: string[];
  /** Simple explanations of what each finding means */
  what_it_means: string[];
  /** Glossary of medical terms with plain language definitions */
  medical_terms_explained: Record<string, string>;
  /** General warning signs to be aware of */
  when_to_be_careful: string[];
  /** General next steps (no medical advice) */
  next_steps_general: string[];
  /** Mandatory disclaimer text */
  disclaimer: string;
}

/**
 * Request body for the /api/analyze endpoint
 */
export interface AnalyzeRequest {
  /** Raw text extracted from the medical report */
  reportText: string;
  /** Target language code for translation (e.g., "es", "hi", "zh-Hans") */
  targetLanguage: string;
}

/**
 * Response from the /api/analyze endpoint
 */
export interface AnalyzeResponse {
  /** Whether the analysis was successful */
  success: boolean;
  /** The analyzed and optionally translated report */
  data?: MedicalReportAnalysis;
  /** Source language (always "en" for initial analysis) */
  originalLanguage: string;
  /** Target language the report was translated to */
  translatedLanguage: string;
  /** Error message if analysis failed */
  error?: string;
}

/**
 * Supported input methods for medical reports
 */
export type InputMethod = "text" | "pdf" | "image";

/**
 * State for the report input component
 */
export interface ReportInputState {
  /** Currently selected input method */
  method: InputMethod;
  /** Extracted text content */
  text: string;
  /** Whether text extraction is in progress */
  isExtracting: boolean;
  /** Error during extraction */
  extractionError?: string;
}

/**
 * Language option for the language selector
 */
export interface LanguageOption {
  /** Language code (BCP-47 format) */
  code: string;
  /** Display name of the language */
  name: string;
  /** Native name of the language */
  nativeName: string;
}

/**
 * Application state
 */
export interface AppState {
  /** Current step in the flow */
  step: "input" | "analyzing" | "results";
  /** Input report text */
  reportText: string;
  /** Selected target language */
  targetLanguage: string;
  /** Analysis result */
  result?: MedicalReportAnalysis;
  /** Error message */
  error?: string;
}
