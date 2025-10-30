import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  LingoProvider,
  LingoProviderWrapper,
  clearDictionaryCache,
} from "./provider";
import { LingoContext } from "./context";

vi.mock("./utils", async (orig) => {
  const actual = await orig();
  return {
    ...(actual as any),
    getLocaleFromCookies: vi.fn(() => "en"),
  };
});

describe("client/provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearDictionaryCache();
  });

  describe("LingoProvider", () => {
    it("throws when dictionary is missing", () => {
      expect(() =>
        render(
          <LingoProvider dictionary={undefined as any}>
            <div />
          </LingoProvider>,
        ),
      ).toThrowError(/dictionary is not provided/i);
    });

    it("provides dictionary via context", () => {
      const dict = { locale: "en", files: {} };
      const Probe = () => {
        return (
          <LingoContext.Consumer>
            {(value) => (
              <div data-testid="probe" data-locale={value.dictionary.locale} />
            )}
          </LingoContext.Consumer>
        );
      };

      render(
        <LingoProvider dictionary={dict}>
          <Probe />
        </LingoProvider>,
      );

      const el = screen.getByTestId("probe");
      expect(el.getAttribute("data-locale")).toBe("en");
    });
  });

  describe("LingoProviderWrapper", () => {
    it("loads dictionary with Suspense and renders children", async () => {
      const loadDictionary = vi
        .fn()
        .mockResolvedValue({ locale: "en", files: {} });

      const Child = () => <div data-testid="child">ok</div>;

      const { findByTestId } = render(
        <LingoProviderWrapper loadDictionary={loadDictionary}>
          <Child />
        </LingoProviderWrapper>,
      );

      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());
      const child = await findByTestId("child");
      expect(child).toBeTruthy();
    });

    it("supports custom fallback UI", async () => {
      const loadDictionary = vi
        .fn()
        .mockResolvedValue({ locale: "en", files: {} });

      const CustomFallback = () => (
        <div data-testid="custom">Custom loading</div>
      );
      const Child = () => <div data-testid="child">ok</div>;

      const { findByTestId } = render(
        <LingoProviderWrapper
          loadDictionary={loadDictionary}
          fallback={<CustomFallback />}
        >
          <Child />
        </LingoProviderWrapper>,
      );

      const child = await findByTestId("child");
      expect(child).toBeTruthy();
      expect(loadDictionary).toHaveBeenCalledWith("en");
    });
  });
});
