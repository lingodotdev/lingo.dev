import webvtt from "node-webvtt";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

const UNSUPPORTED_BLOCK_REGEX = /^(?:STYLE|REGION)\s*$/;

function isUnsupportedBlock(block: string): boolean {
  const firstLine = block.trimStart().split("\n", 1)[0];
  return UNSUPPORTED_BLOCK_REGEX.test(firstLine);
}

// node-webvtt doesn't handle STYLE/REGION blocks — strip them before parsing
function stripUnsupportedBlocks(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .split("\n\n")
    .filter((part) => !isUnsupportedBlock(part))
    .join("\n\n");
}

function getUnsupportedBlocks(input: string): string[] {
  return input.replace(/\r\n/g, "\n").split("\n\n").filter(isUnsupportedBlock);
}

export default function createVttLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    async pull(locale, input) {
      if (!input) {
        return ""; // if VTT file does not exist yet we can not parse it - return empty string
      }
      const vtt = webvtt.parse(stripUnsupportedBlocks(input))?.cues;
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
    async push(locale, payload, originalInput) {
      const output = Object.entries(payload).reduce(
        (cues: any[], [key, text]) => {
          if (!text) return cues;

          const [, timeRange, identifier] = key.split("#");
          const [startTime, endTime] = timeRange.split("-");

          cues.push({
            end: Number(endTime),
            identifier,
            start: Number(startTime),
            styles: "",
            text,
          });
          return cues;
        },
        [],
      );

      const input = {
        valid: true,
        strict: true,
        cues: output,
      };

      const compiled = webvtt.compile(input);

      // Re-insert STYLE/REGION blocks after the WEBVTT header
      const blocks = getUnsupportedBlocks(originalInput ?? "");
      if (blocks.length === 0) return compiled;

      const [header, ...rest] = compiled.split("\n\n");
      return [header, ...blocks, ...rest].join("\n\n");
    },
  });
}
