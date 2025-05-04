import { I18nConfig } from "@lingo.dev/_spec";

export type SetupState = {
  i18nConfig: I18nConfig;
  auth: {
    id: string;
    email: string;
  } | null;
};

export type LocalizationTask = {
  sourceLocale: string;
  targetLocale: string;
  bucketType: string;
  filePathPlaceholder: string;
};
export type PlanState = {
  tasks: LocalizationTask[];
};

export type ProcessState = {
  tasks: [LocalizationTask, boolean][];
  errors: Error[];
};
