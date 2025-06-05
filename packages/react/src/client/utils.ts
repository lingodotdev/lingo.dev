"use client";

import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE } from "../core";
import Cookies from "js-cookie";

export function getLocaleFromCookies(): string {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  return Cookies.get(LOCALE_COOKIE_NAME) || DEFAULT_LOCALE;
}

export function setLocaleInCookies(locale: string): void {
  if (typeof document === "undefined") return;

  Cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    expires: 365,
    sameSite: "lax",
  });
}
