import { I18nConfig } from "@lingo.dev/_spec";
import { LocalizerFn } from "../../processor/_base";

export type SetupState = {
  i18nConfig: I18nConfig;
  auth: {
    id: string;
    email: string;
  } | null;
  localizer: {
    type: string;
    processor: LocalizerFn;
  };
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
  results: {
    task: LocalizationTask;
    success: boolean;
    error?: Error;
  }[];
  errors: Error[];
};
