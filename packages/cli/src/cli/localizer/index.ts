import { I18nConfig } from "@lingo.dev/_spec";

import createLingoDotDevLocalizer from "./lingodotdev";
import createExplicitLocalizer from "./explicit";
import createPseudoLocalizer from "./pseudo";
import { ILocalizer } from "./_types";

export default function createLocalizer(
  provider: I18nConfig["provider"] | "pseudo" | null | undefined,
  apiKey?: string,
): ILocalizer {
  if (provider === "pseudo") {
    return createPseudoLocalizer();
  }

  if (!provider) {
    return createLingoDotDevLocalizer(apiKey);
  } else {
    return createExplicitLocalizer(provider);
  }
}
