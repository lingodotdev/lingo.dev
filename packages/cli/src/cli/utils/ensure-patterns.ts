import fs from "fs";
import path from "path";
import { glob } from "glob";
import _ from "lodash";
import { LocaleCode, resolveLocaleCode } from "@lingo.dev/_spec";

export function ensurePatterns(patterns: string[], source: string) {
  if (patterns.length === 0) {
    throw new Error("No patterns found");
  }

  patterns.forEach((pattern) => {
    const filePath = pattern.replace("[locale]", source);
    if (!fs.existsSync(filePath)) {
      const defaultContent = getDefaultContent(path.extname(filePath), source);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, defaultContent);
    }
  });
}

function getDefaultContent(ext: string, source: string) {
  const defaultGreeting = "Hello from Lingo.dev";
  switch (ext) {
    case ".json":
    case ".arb":
      return `{\n\t"greeting": "${defaultGreeting}"\n}`;
    case ".yml":
      return `${source}:\n\tgreeting: "${defaultGreeting}"`;
    case ".xml":
      return `<resources>\n\t<string name="greeting">${defaultGreeting}</string>\n</resources>`;
    case ".md":
      return `# ${defaultGreeting}`;
    case ".xcstrings":
      return `{
  "sourceLanguage" : "${source}",
  "strings" : {
    "${defaultGreeting}" : {
      "extractionState" : "manual",
      "localizations" : {
        "${source}" : {
          "stringUnit" : {
            "state" : "translated",
            "value" : "${defaultGreeting}"
          }
        }
      }
    }
  }
}`;
    case ".strings":
      return `"greeting" = "${defaultGreeting}";`;
    case ".stringsdict":
      return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>key</key>
  <dict>
    <key>NSStringLocalizedFormatKey</key>
    <string>%#@count@</string>
    <key>count</key>
    <dict>
      <key>NSStringFormatSpecTypeKey</key>
      <string>NSStringPluralRuleType</string>
      <key>NSStringFormatValueTypeKey</key>
      <string>d</string>
      <key>zero</key>
      <string>No items</string>
      <key>one</key>
      <string>One item</string>
      <key>other</key>
      <string>%d items</string>
    </dict>
  </dict>
</dict>
</plist>`;
    default:
      throw new Error(`Unsupported file extension: ${ext}`);
  }
}
