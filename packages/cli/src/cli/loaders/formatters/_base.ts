import path from "path";
import { ILoader } from "../_types";
import { createLoader } from "../_utils";

export type BaseFormatterOptions = {
  bucketPathPattern: string;
  stage?: "pull" | "push" | "both";
  alwaysFormat?: boolean;
};

export function createBaseFormatterLoader(
  options: BaseFormatterOptions,
  formatFn: (data: string, filePath: string) => Promise<string>,
): ILoader<string, string> {
  const stage = options.stage || "both";

  const formatData = async (locale: string, data: string) => {
    const draftPath = options.bucketPathPattern.replaceAll("[locale]", locale);
    const finalPath = path.resolve(draftPath);
    return await formatFn(data, finalPath);
  };

  return createLoader({
    async pull(locale, data) {
      if (!["pull", "both"].includes(stage)) {
        return data;
      }
      return await formatData(locale, data);
    },
    async push(locale, data) {
      if (!["push", "both"].includes(stage)) {
        return data;
      }
      return await formatData(locale, data);
    },
  });
}
