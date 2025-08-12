import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./utils", () => {
  return {
    loadDictionaryFromRequest: vi.fn(async (loader: any) => loader("en")),
  };
});

describe("rsc/provider", () => {
  describe("LingoProvider", () => {
    it("loads dictionary via helper and renders children through client provider", async () => {
      const { LingoProvider } = await import("./provider");
      const loadDictionary = vi.fn(async () => ({ locale: "en" }));
      render(
        await LingoProvider({
          loadDictionary,
          children: <div data-testid="child" />,
        }),
      );
      expect(screen.getByTestId("child")).toBeTruthy();
      expect(loadDictionary).toHaveBeenCalledWith("en");
    });
  });
});
