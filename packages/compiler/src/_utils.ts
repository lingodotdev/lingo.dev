import path from "path";

import { LCP_DICTIONARY_FILE_NAME } from "./_const";

export type GetDictionaryPathParams = {
  sourceRoot: string;
  lingoDir: string;
  relativeFilePath: string;
};
export const getDictionaryPath = (params: GetDictionaryPathParams) => {
  return path.relative(
    params.relativeFilePath,
    path.resolve(params.sourceRoot, params.lingoDir, LCP_DICTIONARY_FILE_NAME),
  );
};
