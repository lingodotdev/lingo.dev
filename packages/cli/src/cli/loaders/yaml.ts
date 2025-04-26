import YAML, { ToStringOptions } from "yaml";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createYamlLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    async pull(locale, input) {
      return YAML.parse(input) || {};
    },
    async push(locale, payload, originalInput) {
      return YAML.stringify(payload, {
        lineWidth: -1,
        defaultKeyType: getKeyType(originalInput),
        defaultStringType: getStringType(originalInput),
      });
    },
  });
}

// check if the yaml keys are using double quotes or single quotes
function getKeyType(yamlString: string | null): ToStringOptions["defaultKeyType"] {
  if (yamlString) {
    const lines = yamlString.split("\n");
    const hasDoubleQuotes = lines.find((line) => {
      return line.trim().startsWith('"') && line.trim().match('":');
    });
    if (hasDoubleQuotes) {
      return "QUOTE_DOUBLE";
    }
  }
  return "PLAIN";
}

// check if the yaml string values are using double quotes or single quotes
function getStringType(yamlString: string | null): ToStringOptions["defaultStringType"] {
  if (yamlString) {
    const lines = yamlString.split("\n");
    const hasDoubleQuotes = lines.find((line) => {
      const trimmedLine = line.trim();
      return (
        (trimmedLine.startsWith('"') || trimmedLine.match(/:\s*"/)) &&
        (trimmedLine.endsWith('"') || trimmedLine.endsWith('",'))
      );
    });
    if (hasDoubleQuotes) {
      return "QUOTE_DOUBLE";
    }
  }
  return "PLAIN";
}
