import { describe, it, expect, vi } from "vitest";
import React from "react";
import { LingoContext } from "./context";

vi.mock("../core", () => {
  return {
    LingoAttributeComponent: (props: any) => {
      return React.createElement("div", {
        "data-testid": "core-attr",
        "data-has-dictionary": props.$dictionary ? "yes" : "no",
        "data-file": props.$fileKey,
      });
    },
  };
});

describe("client/attribute-component", () => {
  describe("LingoAttributeComponent wrapper", () => {
    it("injects dictionary from context into core attribute component", async () => {
      const dictionary = { locale: "en" } as any;
      const { LingoAttributeComponent } = await import("./attribute-component");
      const { render, screen } = await import("@testing-library/react");

      render(
        <LingoContext.Provider value={{ dictionary }}>
          <LingoAttributeComponent
            $attrAs="a"
            $fileKey="messages"
            $attributes={{ title: "title" }}
          />
        </LingoContext.Provider>,
      );

      const el = await screen.findByTestId("core-attr");
      expect(el.getAttribute("data-has-dictionary")).toBe("yes");
      expect(el.getAttribute("data-file")).toBe("messages");
    });
  });
});
