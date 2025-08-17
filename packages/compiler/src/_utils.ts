import path from "path";

import { LCP_DICTIONARY_FILE_NAME } from "./_const";

export type GetDictionaryPathParams = {
  sourceRoot: string;
  lingoDir: string;
  relativeFilePath: string;
};
export const getDictionaryPath = (params: GetDictionaryPathParams) => {
  const toFile = path.resolve(
    params.sourceRoot,
    params.lingoDir,
    LCP_DICTIONARY_FILE_NAME,
  );
  const fromDir = path.dirname(
    path.resolve(params.sourceRoot, params.relativeFilePath),
  );
  const relativePath = path.relative(fromDir, toFile);
  const normalizedPath = relativePath.split(path.sep).join(path.posix.sep);
  return `./${normalizedPath}`;
};
