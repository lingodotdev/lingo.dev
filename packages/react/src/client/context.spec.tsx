import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { LingoContext, useLingo } from "./context";

describe("client/context", () => {
  describe("useLingo", () => {
    it("has default dictionary shape and useLingo returns it", () => {
      const Probe = () => {
        const lingo = useLingo();
        return (
          <div
            data-testid="probe"
            data-dict-empty={
              Object.keys(lingo.dictionary).length === 0 ? "yes" : "no"
            }
          />
        );
      };
      render(<Probe />);
      const el = screen.getByTestId("probe");
      expect(el.getAttribute("data-dict-empty")).toBe("yes");
    });

    it("provides value via context provider", () => {
      const Probe = () => {
        const lingo = useLingo();
        return (
          <div data-testid="probe" data-locale={lingo.dictionary.locale} />
        );
      };
      render(
        <LingoContext.Provider value={{ dictionary: { locale: "it" } }}>
          <Probe />
        </LingoContext.Provider>,
      );
      const el = screen.getByTestId("probe");
      expect(el.getAttribute("data-locale")).toBe("it");
    });
  });
});
