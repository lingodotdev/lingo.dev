export const docLinks = {
  i18nNotFound: "https://lingo.dev/cli",
  bucketNotFound: "https://lingo.dev/cli",
  authError: "https://lingo.dev/cli",
  localeTargetNotFound: "https://lingo.dev/cli",
  lockFiletNotFound: "https://lingo.dev/cli",
  failedReplexicaEngine: "https://lingo.dev/cli",
  placeHolderFailed: "https://lingo.dev/cli",
  translationFailed: "https://lingo.dev/cli",
  connectionFailed: "https://lingo.dev/cli",
  invalidType: "https://lingo.dev/cli",
  invalidPathPattern: "https://lingo.dev/cli",
  androidResouceError: "https://lingo.dev/cli",
  invalidBucketType: "https://lingo.dev/cli",
  invalidStringDict: "https://lingo.dev/cli",
};

type DocLinkKeys = keyof typeof docLinks;

export class CLIError extends Error {
  public readonly docUrl: string;
  public readonly errorType: string = 'cli_error';

  constructor({ message, docUrl }: { message: string; docUrl: DocLinkKeys }) {
    super(message);
    this.docUrl = docLinks[docUrl];
    this.message = `${this.message}\n visit: ${this.docUrl}`;
  }
}

export class ConfigError extends CLIError {
  public readonly errorType = 'config_error';
  
  constructor({ message, docUrl }: { message: string; docUrl: DocLinkKeys }) {
    super({ message, docUrl });
    this.name = 'ConfigError';
  }
}

export class AuthenticationError extends CLIError {
  public readonly errorType = 'auth_error';
  
  constructor({ message, docUrl }: { message: string; docUrl: DocLinkKeys }) {
    super({ message, docUrl });
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends CLIError {
  public readonly errorType = 'validation_error';
  
  constructor({ message, docUrl }: { message: string; docUrl: DocLinkKeys }) {
    super({ message, docUrl });
    this.name = 'ValidationError';
  }
}

export class LocalizationError extends Error {
  public readonly errorType = 'locale_error';
  public readonly bucket?: string;
  public readonly sourceLocale?: string;
  public readonly targetLocale?: string;
  public readonly pathPattern?: string;
  
  constructor(message: string, context?: {
    bucket?: string;
    sourceLocale?: string;
    targetLocale?: string;
    pathPattern?: string;
  }) {
    super(message);
    this.name = 'LocalizationError';
    this.bucket = context?.bucket;
    this.sourceLocale = context?.sourceLocale;
    this.targetLocale = context?.targetLocale;
    this.pathPattern = context?.pathPattern;
  }
}

export class BucketProcessingError extends Error {
  public readonly errorType = 'bucket_error';
  public readonly bucket: string;
  
  constructor(message: string, bucket: string) {
    super(message);
    this.name = 'BucketProcessingError';
    this.bucket = bucket;
  }
}

// Type guard functions for robust error detection
export function isConfigError(error: any): error is ConfigError {
  return error instanceof ConfigError || error.errorType === 'config_error';
}

export function isAuthenticationError(error: any): error is AuthenticationError {
  return error instanceof AuthenticationError || error.errorType === 'auth_error';
}

export function isValidationError(error: any): error is ValidationError {
  return error instanceof ValidationError || error.errorType === 'validation_error';
}

export function isLocalizationError(error: any): error is LocalizationError {
  return error instanceof LocalizationError || error.errorType === 'locale_error';
}

export function isBucketProcessingError(error: any): error is BucketProcessingError {
  return error instanceof BucketProcessingError || error.errorType === 'bucket_error';
}

export function getCLIErrorType(error: any): string {
  if (isConfigError(error)) return 'config_error';
  if (isAuthenticationError(error)) return 'auth_error';
  if (isValidationError(error)) return 'validation_error';
  if (isLocalizationError(error)) return 'locale_error';
  if (isBucketProcessingError(error)) return 'bucket_error';
  if (error instanceof CLIError) return 'cli_error';
  return 'unknown_error';
}

// Error detail interface for consistent tracking
export interface ErrorDetail {
  type: 'bucket_error' | 'locale_error' | 'validation_error' | 'auth_error' | 'config_error';
  bucket?: string;
  locale?: string;
  pathPattern?: string;
  message: string;
  stack?: string;
}

// Utility to create previous error context for fatal errors
export function createPreviousErrorContext(errorDetails: ErrorDetail[]) {
  if (errorDetails.length === 0) return undefined;
  
  return {
    count: errorDetails.length,
    types: [...new Set(errorDetails.map(e => e.type))],
    buckets: [...new Set(errorDetails.map(e => e.bucket).filter(Boolean))]
  };
}

// Utility to create aggregated error analytics
export function aggregateErrorAnalytics(
  errorDetails: ErrorDetail[],
  buckets: any[],
  targetLocales: string[],
  i18nConfig: any
) {
  if (errorDetails.length === 0) {
    return {
      errorCount: 0,
      errorTypes: [],
      errorsByBucket: {},
      errorsByType: {},
      firstError: undefined,
      bucketCount: buckets.length,
      localeCount: targetLocales.length,
      i18nConfig: {
        sourceLocale: i18nConfig.locale.source,
        targetLocales: i18nConfig.locale.targets,
        bucketTypes: Object.keys(i18nConfig.buckets)
      }
    };
  }

  const errorsByBucket = errorDetails.reduce((acc, error) => {
    if (error.bucket) {
      acc[error.bucket] = (acc[error.bucket] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const errorsByType = errorDetails.reduce((acc, error) => {
    acc[error.type] = (acc[error.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    errorCount: errorDetails.length,
    errorTypes: [...new Set(errorDetails.map(e => e.type))],
    errorsByBucket,
    errorsByType,
    firstError: {
      type: errorDetails[0].type,
      bucket: errorDetails[0].bucket,
      locale: errorDetails[0].locale,
      pathPattern: errorDetails[0].pathPattern,
      message: errorDetails[0].message
    },
    bucketCount: buckets.length,
    localeCount: targetLocales.length,
    i18nConfig: {
      sourceLocale: i18nConfig.locale.source,
      targetLocales: i18nConfig.locale.targets,
      bucketTypes: Object.keys(i18nConfig.buckets)
    }
  };
}
