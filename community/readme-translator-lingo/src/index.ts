// console.log("readme-translator-lingo CLI is working");
import { Command } from "commander";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { extractCodeBlocks, restoreCodeBlocks } from "./markdown";
import { translateText } from "./translate";

const program = new Command();

program
  .requiredOption("-i, --input <file>")
  .requiredOption("-l, --languages <list>")
  .option("-o, --output <dir>", "./localized");

program.parse();
const opts = program.opts();

const content = fs.readFileSync(opts.input, "utf-8");
const languages = opts.languages.split(",");

(async () => {
  for (const lang of languages) {
    console.log(`Translating to ${lang}...`);

    const { processed, codeBlocks } = extractCodeBlocks(content);
    const translated = await translateText(processed, lang);
    const finalText = restoreCodeBlocks(translated, codeBlocks);

    fs.mkdirSync(opts.output, { recursive: true });

    const outputPath = path.join(
      opts.output,
      `README.${lang}.md`
    );

    fs.writeFileSync(outputPath, finalText);
    console.log(`Generated ${outputPath}`);
  }
})();
