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
          let value = stringMatch[3];
          
          if (translatable === "false") {
            continue;
          }
          
          const cdataRegex = /<!\[CDATA\[([\s\S]*?)\]\]>/g;
          value = value.replace(cdataRegex, (match, content) => content);
          
          value = value.replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&amp;/g, '&')
                       .replace(/&quot;/g, '"')
                       .replace(/&apos;/g, "'");
          
          result[name] = value === "" || /^\s+$/.test(value) ? value : value.trim();
        }
        
        const parsed = await parseStringPromise(input, {
          explicitArray: true,
          mergeAttrs: false,
          normalize: true,
          normalizeTags: false,
          trim: true,
          attrkey: '$',
          charkey: '_',
        });
        
        if (!parsed || !parsed.resources) {
          return result;
        }
        
        if (parsed.resources['string-array']) {
          parsed.resources['string-array'].forEach((arrayItem: any) => {
            if (arrayItem.$ && arrayItem.$.translatable === 'false') {
              return;
            }
            
            const name = arrayItem.$.name;
            const items: string[] = [];
            
            if (arrayItem.item) {
              arrayItem.item.forEach((item: any) => {
                let itemValue = '';
                if (typeof item === 'string') {
                  itemValue = item;
                } else if (item._) {
                  itemValue = item._;
                } else if (item._ === '') {
                  itemValue = '';
                }
                items.push(itemValue === "" || /^\s+$/.test(itemValue) ? itemValue : itemValue.trim());
              });
            }
            
            result[name] = items;
          });
        }
        
        if (parsed.resources.plurals) {
          parsed.resources.plurals.forEach((pluralItem: any) => {
            if (pluralItem.$ && pluralItem.$.translatable === 'false') {
              return;
            }
            
            const name = pluralItem.$.name;
            const pluralObj: Record<string, string> = {};
            
            if (pluralItem.item) {
              pluralItem.item.forEach((item: any) => {
                if (item.$ && item.$.quantity) {
                  let value = '';
                  if (item._) {
                    value = item._;
                  } else if (item._ === '') {
                    value = '';
                  }
                  pluralObj[item.$.quantity] = value === "" || /^\s+$/.test(value) ? value : value.trim();
                }
              });
            }
            
            result[name] = pluralObj;
          });
        }
        
        if (parsed.resources.bool) {
          parsed.resources.bool.forEach((boolItem: any) => {
            if (boolItem.$ && boolItem.$.translatable === 'false') {
              return;
            }
            
            const name = boolItem.$.name;
            result[name] = boolItem._ === 'true';
          });
        }
        
        if (parsed.resources.integer) {
          parsed.resources.integer.forEach((intItem: any) => {
            if (intItem.$ && intItem.$.translatable === 'false') {
              return;
            }
            
            const name = intItem.$.name;
            result[name] = parseInt(intItem._ || '0', 10);
          });
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
        const xmlObj: AndroidResources = {
          resources: {
            string: [],
            'string-array': [],
            plurals: [],
            bool: [],
            integer: []
          }
        };
        
        const processHtmlContent = (str: string): { _: string } => {
          if (typeof str !== 'string') return { _: String(str) };
          
          const containsHtml = /<[a-z][\s\S]*>/i.test(str);
          const containsSpecialChars = /[<>&]/.test(str);
          
          return { _: str };
        };
        
        for (const [key, value] of Object.entries(payload)) {
          if (typeof value === "string") {
            xmlObj.resources.string.push({
              $: { name: key },
              ...processHtmlContent(value)
            });
          } else if (Array.isArray(value)) {
            xmlObj.resources['string-array'].push({
              $: { name: key },
              item: value.map(item => processHtmlContent(item))
            });
          } else if (typeof value === "object") {
            xmlObj.resources.plurals.push({
              $: { name: key },
              item: Object.entries(value).map(([quantity, text]) => ({
                $: { quantity },
                ...processHtmlContent(text as string)
              }))
            });
          } else if (typeof value === "boolean") {
            xmlObj.resources.bool.push({
              $: { name: key },
              _: value.toString()
            });
          } else if (typeof value === "number") {
            xmlObj.resources.integer.push({
              $: { name: key },
              _: value.toString()
            });
          }
        }
        
        const builder = new Builder({
          headless: true,
          renderOpts: {
            pretty: true,
            indent: '  ',
            newline: '\n'
          }
        });
        
        return builder.buildObject(xmlObj);
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

interface AndroidResource {
  $: {
    name: string;
    translatable?: string;
    [key: string]: string | undefined;
  };
  _?: string;
  item?: Array<{
    $?: { quantity?: string };
    _?: string;
  }>;
}

interface AndroidResources {
  resources: {
    string: AndroidResource[];
    'string-array': AndroidResource[];
    plurals: AndroidResource[];
    bool: AndroidResource[];
    integer: AndroidResource[];
  };
}
