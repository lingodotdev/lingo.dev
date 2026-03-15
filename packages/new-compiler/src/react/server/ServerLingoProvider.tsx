import {
  LingoProvider as BaseLingoProvider,
  type LingoProviderProps,
} from "../shared/LingoProvider";
import { getServerTranslations } from "../server-only";
import { logger } from "../../utils/logger";

export async function LingoProvider({
  initialLocale,
  initialTranslations = {},
  ...rest
}: LingoProviderProps) {
  const { locale, translations } = await getServerTranslations({
    locale: initialLocale,
  });

  logger.debug(`Server. LingoProvider. Resolved locale: ${locale}`);

  return (
    <BaseLingoProvider
      initialLocale={locale}
      initialTranslations={translations}
      {...rest}
    />
  );
}
