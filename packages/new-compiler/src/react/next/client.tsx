"use client";
import {
  LingoProvider as BaseLingoProvider,
  type LingoProviderProps,
} from "../shared/LingoProvider";
import { useRouter } from "next/navigation";
import { logger } from "../../utils/logger";

export type { LingoProviderProps };

export const createNextCookieLocaleResolver = () => {
  return (locale: string) => {
    logger.warn("Is not supposed to run on client");
    return locale;
  };
};

export const LingoProvider = (props: LingoProviderProps) => {
  // So far we are just injecting the router to reload server components when the locale changes.
  return <BaseLingoProvider {...props} router={useRouter()} />;
};
