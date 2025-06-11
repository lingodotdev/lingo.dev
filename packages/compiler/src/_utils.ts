import path from "path";

import { LCP_DICTIONARY_FILE_NAME } from "./_const";

export type GetDictionaryPathParams = {
  sourceRoot: string;
  lingoDir: string;
  relativeFilePath: string;
};
export const getDictionaryPath = (params: GetDictionaryPathParams) => {
  const absolute = path.resolve(
    params.sourceRoot,
    params.lingoDir,
    LCP_DICTIONARY_FILE_NAME,
  );

  // let Node figure the relative path first
  const rel = path.relative(params.relativeFilePath, absolute);

  // then normalise the separator once
  return rel.split(path.sep).join(path.posix.sep);
};
