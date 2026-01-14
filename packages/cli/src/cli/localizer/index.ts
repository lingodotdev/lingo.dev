import { I18nConfig } from "@lingo.dev/_spec";

import createLingoDotDevLocalizer from "./lingodotdev";
import createLingoDotDevVNextLocalizer from "./lingodotdev-vnext";
import createExplicitLocalizer from "./explicit";
import createPseudoLocalizer from "./pseudo";
import { ILocalizer } from "./_types";

export default function createLocalizer(
  provider: I18nConfig["provider"] | "pseudo" | null | undefined,
  apiKey?: string,
  vNext?: string,
): ILocalizer {
  if (provider === "pseudo") {
    return createPseudoLocalizer();
  }

  // Check if vNext is configured
  if (vNext) {
    return createLingoDotDevVNextLocalizer(vNext);
  }

  if (!provider) {
    return createLingoDotDevLocalizer(apiKey);
  } else {
    return createExplicitLocalizer(provider);
  }
}
