import webvtt from "node-webvtt";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

// node-webvtt doesn't handle STYLE/REGION blocks — strip them before parsing
function extractUnsupportedBlocks(input: string): {
  cleaned: string;
  blocks: string[];
} {
  const parts = input.replace(/\r\n/g, "\n").split("\n\n");
  const blocks: string[] = [];
  const kept: string[] = [];

  const unsupportedRegex = /^(?:STYLE|REGION)/;

  for (const part of parts) {
    const firstLine = part.trimStart().split("\n", 1)[0];

    if (unsupportedRegex.test(firstLine)) {
      blocks.push(part);
    } else {
      kept.push(part);
    }
  }

  return { cleaned: kept.join("\n\n"), blocks };
}

export default function createVttLoader(): ILoader<
  string,
  Record<string, any>
> {
  let savedBlocks: string[] = [];

  return createLoader({
    async pull(locale, input) {
      if (!input) {
        return ""; // if VTT file does not exist yet we can not parse it - return empty string
      }
      const { cleaned, blocks } = extractUnsupportedBlocks(input);
      savedBlocks = blocks;
      const vtt = webvtt.parse(cleaned)?.cues;
      if (Object.keys(vtt).length === 0) {
        return {};
      } else {
        return vtt.reduce((result: any, cue: any, index: number) => {
          const key = `${index}#${cue.start}-${cue.end}#${cue.identifier}`;
          result[key] = cue.text;
          return result;
        }, {});
      }
    },
    async push(locale, payload) {
      const output = Object.entries(payload).map(([key, text]) => {
        const [id, timeRange, identifier] = key.split("#");
        const [startTime, endTime] = timeRange.split("-");

        return {
          end: Number(endTime),
          identifier: identifier,
          start: Number(startTime),
          styles: "",
          text: text,
        };
      });

      const input = {
        valid: true,
        strict: true,
        cues: output,
      };

      const compiled = webvtt.compile(input);
      if (savedBlocks.length === 0) return compiled;

      // Re-insert STYLE/REGION blocks after the WEBVTT header
      const [header, ...rest] = compiled.split("\n\n");
      return [header, ...savedBlocks, ...rest].join("\n\n");
    },
  });
}
