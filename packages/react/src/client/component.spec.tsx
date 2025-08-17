import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { LingoHtmlComponent } from "./component";
import { LingoContext } from "./context";

describe("client/component", () => {
  describe("LingoHtmlComponent", () => {
    it("sets lang and data-lingodotdev-compiler from context dictionary locale", () => {
      const dictionary = { locale: "ja" } as any;
      const markup = renderToStaticMarkup(
        <LingoContext.Provider value={{ dictionary }}>
          <LingoHtmlComponent />
        </LingoContext.Provider>,
      );
      expect(markup).toContain("<html");
      expect(markup).toContain('lang="ja"');
      expect(markup).toContain('data-lingodotdev-compiler="ja"');
    });
  });
});
