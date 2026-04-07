"use client";

import NextLink from "next/link";
import { useLingoContext } from "@lingo.dev/compiler/react";
import type { ComponentProps } from "react";

/**
 * Link component that automatically prefixes hrefs with current locale
 */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { locale } = useLingoContext();

  // If href is already locale-prefixed or external, use as-is
  const localizedHref = typeof href === "string" && !href.startsWith("http") && !href.startsWith(`/${locale}`)
    ? `/${locale}${href.startsWith("/") ? "" : "/"}${href}`
    : href;

  return <NextLink href={localizedHref} {...props} />;
}
