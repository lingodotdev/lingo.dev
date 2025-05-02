import { parseStringPromise, Builder } from "xml2js";
import { ILoader } from "./_types";
import { CLIError } from "../utils/errors";
import { createLoader } from "./_utils";

export default function createAndroidLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    async pull(locale, input) {
      try {
        if (!input) {
          return {};
        }

        const result: Record<string, any> = {};
        
        const stringRegex = /<string\s+name="([^"]+)"(?:\s+translatable="([^"]+)")?[^>]*>([\s\S]*?)<\/string>/gi;
        let stringMatch;
        while ((stringMatch = stringRegex.exec(input)) !== null) {
          const name = stringMatch[1];
          const translatable = stringMatch[2];
          const value = stringMatch[3];
          
          if (translatable === "false") {
            continue;
          }
          
          result[name] = value.trim();
        }
        
        const arrayRegex = /<string-array\s+name="([^"]+)"(?:\s+translatable="([^"]+)")?[^>]*>([\s\S]*?)<\/string-array>/gi;
        let arrayMatch;
        while ((arrayMatch = arrayRegex.exec(input)) !== null) {
          const name = arrayMatch[1];
          const translatable = arrayMatch[2];
          const arrayContent = arrayMatch[3];
          
          if (translatable === "false") {
            continue;
          }
          
          const items: string[] = [];
          const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
          let itemMatch;
          while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
            items.push(itemMatch[1].trim());
          }
          
          result[name] = items;
        }
        
        const pluralsRegex = /<plurals\s+name="([^"]+)"(?:\s+translatable="([^"]+)")?[^>]*>([\s\S]*?)<\/plurals>/gi;
        let pluralsMatch;
        while ((pluralsMatch = pluralsRegex.exec(input)) !== null) {
          const name = pluralsMatch[1];
          const translatable = pluralsMatch[2];
          const pluralsContent = pluralsMatch[3];
          
          if (translatable === "false") {
            continue;
          }
          
          const pluralObj: Record<string, string> = {};
          const quantityRegex = /<item\s+quantity="([^"]+)">([\s\S]*?)<\/item>/gi;
          let quantityMatch;
          while ((quantityMatch = quantityRegex.exec(pluralsContent)) !== null) {
            const quantity = quantityMatch[1];
            const value = quantityMatch[2];
            pluralObj[quantity] = value.trim();
          }
          
          result[name] = pluralObj;
        }
        
        const cdataRegex = /<string\s+name="([^"]+)"(?:\s+translatable="([^"]+)")?[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/string>/gi;
        let cdataMatch;
        while ((cdataMatch = cdataRegex.exec(input)) !== null) {
          const name = cdataMatch[1];
          const translatable = cdataMatch[2];
          const value = cdataMatch[3];
          
          if (translatable === "false") {
            continue;
          }
          
          result[name] = value.trim();
        }
        
        return result;
      } catch (error) {
        console.error("Error parsing Android resource file:", error);
        throw new CLIError({
          message: "Failed to parse Android resource file",
          docUrl: "androidResouceError",
        });
      }
    },
    async push(locale, payload) {
      try {
        let xmlContent = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
        
        const escapeXml = (str: string) => {
          if (typeof str !== 'string') return str;
          if (/<[a-z][\s\S]*>/i.test(str)) {
            return `<![CDATA[${str}]]>`;
          }
          return str;
        };
        
        for (const [key, value] of Object.entries(payload)) {
          if (typeof value === "string") {
            xmlContent += `  <string name="${key}">${escapeXml(value)}</string>\n`;
          } else if (Array.isArray(value)) {
            xmlContent += `  <string-array name="${key}">\n`;
            for (const item of value) {
              xmlContent += `    <item>${escapeXml(item)}</item>\n`;
            }
            xmlContent += `  </string-array>\n`;
          } else if (typeof value === "object") {
            xmlContent += `  <plurals name="${key}">\n`;
            for (const [quantity, text] of Object.entries(value)) {
              xmlContent += `    <item quantity="${quantity}">${escapeXml(text as string)}</item>\n`;
            }
            xmlContent += `  </plurals>\n`;
          } else if (typeof value === "boolean") {
            xmlContent += `  <bool name="${key}">${value}</bool>\n`;
          } else if (typeof value === "number") {
            xmlContent += `  <integer name="${key}">${value}</integer>\n`;
          }
        }
        
        xmlContent += '</resources>';
        return xmlContent;
      } catch (error) {
        console.error("Error generating Android resource file:", error);
        throw new CLIError({
          message: "Failed to generate Android resource file",
          docUrl: "androidResouceError",
        });
      }
    },
  });
}
