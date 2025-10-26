import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LingoHtmlComponent } from "./component";

vi.mock("./utils", () => {
  return {
    loadLocaleFromCookies: vi.fn(async () => "nl"),
    loadDictionaryFromRequest: vi.fn(),
  };
});

describe("rsc/component", () => {
  describe("LingoHtmlComponent", () => {
    it("sets lang and data-lingodotdev-compiler from cookies-derived locale", async () => {
      const element = await LingoHtmlComponent({});
      const markup = renderToStaticMarkup(element);
      expect(markup).toContain("<html");
      expect(markup).toContain('lang="nl"');
      expect(markup).toContain('data-lingodotdev-compiler="nl"');
    });
  });
});
