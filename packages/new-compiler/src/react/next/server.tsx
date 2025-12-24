import {
  LingoProvider as BaseLingoProvider,
  type LingoProviderProps,
} from "./client";
import { getServerTranslations } from "../server-only";
import { logger } from "../../utils/logger";
import { createNextCookieLocaleResolver } from "./cookie-locale-resolver";

export { createNextCookieLocaleResolver };

export async function LingoProvider({
  initialLocale,
  initialTranslations = {},
  ...rest
}: LingoProviderProps) {
  const { locale, translations } = await getServerTranslations({
    locale: initialLocale,
  });

  logger.debug(
    `Server. LingoProvider. Initial locale: ${initialLocale}. Resolved locale: ${locale}. Translations: ${JSON.stringify(translations)}`,
  );

  return (
    <BaseLingoProvider
      initialLocale={locale}
      initialTranslations={translations}
      {...rest}
    />
  );
}
