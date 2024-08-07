import { bucketTypeSchema } from '@replexica/spec';
import Z from 'zod';
import path from 'path';
import * as glob from 'glob';

import { composeLoaders } from './_base';
import { textFileLoader } from './text-file';
import { jsonLoader } from './json';
import { flatLoader } from './flat';
import { yamlLoader } from './yaml';
import { rootKeyLoader } from './root-key';
import { markdownLoader } from './markdown';
import { xcodeLoader } from './xcode';
import { androidLoader } from './android';

// Path expansion
export function expandPlaceholderedGlob(pathPattern: string, sourceLocale: string): string[] {
  // Throw if pathPattern is an absolute path
  if (path.isAbsolute(pathPattern)) {
    throw new Error(`Invalid path pattern: ${pathPattern}. Path pattern must be relative.`);
  }
  // Throw if pathPattern points outside the current working directory
  if (path.relative(process.cwd(), pathPattern).startsWith('..')) {
    throw new Error(`Invalid path pattern: ${pathPattern}. Path pattern must be within the current working directory.`);
  }
  // Throw error if pathPattern contains "**" – we don't support recursive path patterns
  if (pathPattern.includes('**')) {
    throw new Error(`Invalid path pattern: ${pathPattern}. Recursive path patterns are not supported.`);
  }
  // Throw error if pathPattern contains "[locale]" several times
  if (pathPattern.split('[locale]').length > 2) {
    throw new Error(`Invalid path pattern: ${pathPattern}. Path pattern must contain at most one "[locale]" placeholder.`);
  }
  // Break down path pattern into parts
  const pathPatternChunks = pathPattern.split(path.sep);
  // Find the index of the segment containing "[locale]"
  const localeSegmentIndex = pathPatternChunks.findIndex((segment) => segment === '[locale]');
  // Find the position of the "[locale]" placeholder within the segment
  const localePlaceholderIndex = pathPatternChunks[localeSegmentIndex]?.indexOf('[locale]') || -1;
  // substitute [locale] in pathPattern with sourceLocale
  const sourcePathPattern = pathPattern.replace(/\[locale\]/g, sourceLocale);
  // get all files that match the sourcePathPattern
  const sourcePaths = glob.sync(sourcePathPattern, { follow: true, withFileTypes: true });
  // transform each source file path back to [locale] placeholder paths
  const placeholderedPaths = sourcePaths.map((sourcePath) => {
    const relativePath = path.relative(process.cwd(), sourcePath.fullpath());
    const relativePathChunks = relativePath.split(path.sep);
    if (localeSegmentIndex >= 0 && localePlaceholderIndex >= 0) {
      const placeholderedPathChunk = relativePathChunks[localeSegmentIndex];
      const placeholderedSegment =
        placeholderedPathChunk.substring(0, localePlaceholderIndex)
        + '[locale]'
        + placeholderedPathChunk.substring(localePlaceholderIndex + '[locale]'.length)
      ;
      relativePathChunks[localeSegmentIndex] = placeholderedSegment;
    }
    const placeholderedPath = relativePathChunks.join(path.sep);
    return placeholderedPath;
  });
  // return the placeholdered paths
  return placeholderedPaths;
}

export function createBucketLoader(
  bucketType: Z.infer<typeof bucketTypeSchema>,
) {
  switch (bucketType) {
    default:
      throw new Error(`Unsupported bucket type: ${bucketType}`);
    case 'json':
      return composeLoaders<string, Record<string, string>>(
        textFileLoader,
        jsonLoader,
        flatLoader,
      );
    case 'yaml':
      return composeLoaders<string, Record<string, string>>(
        textFileLoader,
        yamlLoader,
        flatLoader,
      );
    case 'yaml-root-key':
      return composeLoaders<string, Record<string, string>>(
        textFileLoader,
        yamlLoader,
        rootKeyLoader,
        flatLoader,
      );
    case 'markdown':
      return composeLoaders<string, Record<string, string>>(
        textFileLoader,
        markdownLoader,
        flatLoader,
      );
    case 'xcode':
      return composeLoaders<string, Record<string, string>>(
        textFileLoader,
        jsonLoader,
        xcodeLoader,
        flatLoader,
      );
    case 'android':
      return composeLoaders<string, Record<string, string>>(
        textFileLoader,
        androidLoader,
        flatLoader,
      );
    case 'compiler':
      throw new Error('Compiler bucket type is not supported in CLI');
  }
}
