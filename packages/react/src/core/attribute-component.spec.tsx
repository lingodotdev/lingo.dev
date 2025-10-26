import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { LingoAttributeComponent } from "./attribute-component";

describe("core/attribute-component", () => {
  describe("LingoAttributeComponent", () => {
    const dictionary = {
      files: {
        messages: {
          entries: {
            title: "Localized Title",
            hrefVal: "/localized",
          },
        },
      },
    } as const;

    it("maps attributes from dictionary entries and falls back to attribute key when missing", () => {
      const { container } = render(
        <LingoAttributeComponent
          $dictionary={dictionary}
          $as="a"
          $fileKey="messages"
          $attributes={{
            title: "title",
            href: "hrefVal",
            // not in dictionary -> falls back to attribute name (data-test)
            "data-test": "missingEntry",
          }}
        />,
      );

      const a = container.querySelector("a")!;
      expect(a.getAttribute("title")).toBe("Localized Title");
      expect(a.getAttribute("href")).toBe("/localized");
      // fallback uses the attribute key name
      expect(a.getAttribute("data-test")).toBe("data-test");
    });

    it("passes through arbitrary props and forwards ref", () => {
      const ref = { current: null as HTMLButtonElement | null };
      const { container } = render(
        <LingoAttributeComponent
          $dictionary={{}}
          $as="button"
          $fileKey="messages"
          $attributes={{}}
          id="my-btn"
          className="primary"
          ref={(el) => (ref.current = el)}
        />,
      );

      const btn = container.querySelector("button")!;
      expect(btn.id).toBe("my-btn");
      expect(btn.className).toContain("primary");
      expect(ref.current).toBe(btn);
    });

    it("does not leak $fileKey as a DOM attribute", () => {
      const { container } = render(
        <LingoAttributeComponent
          $dictionary={dictionary}
          $as="div"
          $fileKey="messages"
          $attributes={{}}
          data-testid="host"
        />,
      );

      const host = container.querySelector("div[data-testid='host']")!;
      // $fileKey should not be present as a plain attribute
      expect(host.getAttribute("$fileKey")).toBeNull();
    });
  });
});
