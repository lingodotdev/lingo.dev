import { ILocalizer, LocalizerData } from "./_types";
import { pseudoLocalizeObject } from "../../utils/pseudo-localize";

/**
 * Creates a pseudo-localizer that doesn't call any external API.
 * Instead, it performs character replacement with accented versions,
 * useful for testing UI internationalization readiness.
 */
export default function createPseudoLocalizer(): ILocalizer {
  return {
    id: "pseudo",
    checkAuth: async () => {
      return {
        authenticated: true,
      };
    },
    localize: async (input: LocalizerData, onProgress) => {
      // Nothing to translate – return the input as-is.
      if (!Object.keys(input.processableData).length) {
        return input;
      }

      // Pseudo-localize all strings in the processable data
      const processedData = pseudoLocalizeObject(input.processableData, {
        addMarker: true,
        addLengthMarker: false,
      });

      // Call progress callback if provided, simulating completion
      if (onProgress) {
        onProgress(100, input.processableData, processedData);
      }

      return processedData;
    },
  };
}
