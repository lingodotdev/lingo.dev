import { ILoader } from "./_types";
import { createLoader } from './_utils';
import srtParser from "srt-parser-2";
import fs from 'fs/promises';

export default function createSrtLoader(): ILoader<string, Record<string, any>> {
  const parser = new srtParser();
  return createLoader({

    async pull(locale, input) {      
      return parser.fromSrt(input) || {};
    },
    async push(locale, payload) {
      const output = Object.values(payload);

      const srtContent = parser.toSrt(output).trim().replace(/\r?\n/g, '\n');
      console.log(srtContent);

      return srtContent;
    }
  });
}

