import { I18nConfig } from "@lingo.dev/_spec";

import createLingoDotDevLocalizer from "./lingodotdev";
import createExplicitLocalizer from "./explicit";
import { ILocalizer } from "./_types";

export default function createLocalizer(
  provider: I18nConfig["provider"],
): ILocalizer {
  if (!provider) {
    return createLingoDotDevLocalizer();
  } else {
    return createExplicitLocalizer(provider);
  }
}
