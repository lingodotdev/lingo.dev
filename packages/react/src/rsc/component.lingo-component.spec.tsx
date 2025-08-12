import { describe, it, expect, vi } from "vitest";
import React from "react";

vi.mock("./utils", () => {
  return {
    loadDictionaryFromRequest: vi.fn(async (loader: any) => loader("es")),
  };
});

// Mock core LingoComponent to capture props
vi.mock("../core", () => {
  return {
    LingoComponent: (props: any) => {
      return React.createElement("div", {
        "data-testid": "core-lingo-component",
        "data-dictionary-locale": props.$dictionary?.locale ?? "none",
        "data-entry": props.$entryKey,
        "data-file": props.$fileKey,
      });
    },
  };
});

describe("rsc/component", () => {
  describe("LingoComponent wrapper", () => {
    it("awaits dictionary and forwards props to core component", async () => {
      const { LingoComponent } = await import("./component");
      const { render, screen } = await import("@testing-library/react");

      render(
        await LingoComponent({
          $as: "span",
          $fileKey: "messages",
          $entryKey: "hello",
          $loadDictionary: async (locale: string | null) => ({ locale }),
        }),
      );

      const el = await screen.findByTestId("core-lingo-component");
      expect(el.getAttribute("data-dictionary-locale")).toBe("es");
      expect(el.getAttribute("data-file")).toBe("messages");
      expect(el.getAttribute("data-entry")).toBe("hello");
    });
  });
});
