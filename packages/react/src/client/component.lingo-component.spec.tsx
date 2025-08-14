import { describe, it, expect, vi } from "vitest";
import React from "react";
import { LingoContext } from "./context";

// Mock core LingoComponent to capture received props
vi.mock("../core", () => {
  return {
    LingoComponent: (props: any) => {
      return React.createElement("div", {
        "data-testid": "core-lingo-component",
        "data-has-dictionary": props.$dictionary ? "yes" : "no",
        "data-entry": props.$entryKey,
        "data-file": props.$fileKey,
      });
    },
  };
});

describe("client/component", () => {
  describe("LingoComponent wrapper", () => {
    it("renders core component with dictionary from context and forwards keys", async () => {
      const dictionary = { locale: "en" } as any;
      const { LingoComponent } = await import("./component");
      const { render, screen } = await import("@testing-library/react");

      render(
        <LingoContext.Provider value={{ dictionary }}>
          <LingoComponent $as="span" $fileKey="messages" $entryKey="hello" />
        </LingoContext.Provider>,
      );

      const el = await screen.findByTestId("core-lingo-component");
      expect(el.getAttribute("data-has-dictionary")).toBe("yes");
      expect(el.getAttribute("data-file")).toBe("messages");
      expect(el.getAttribute("data-entry")).toBe("hello");
    });
  });
});
