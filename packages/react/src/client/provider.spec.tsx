import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { LingoProvider, LingoProviderWrapper } from "./provider";
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
    it("loads dictionary and renders children; returns null while loading", async () => {
      const loadDictionary = vi
        .fn()
        .mockResolvedValue({ locale: "en", files: {} });

      const Child = () => <div data-testid="child">ok</div>;

      const { container, findByTestId } = render(
        <LingoProviderWrapper loadDictionary={loadDictionary}>
          <Child />
        </LingoProviderWrapper>,
      );

      // initially null during loading
      expect(container.firstChild).toBeNull();

      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());
      const child = await findByTestId("child");
      expect(child != null).toBe(true);
    });

    it("swallows load errors and stays null", async () => {
      const loadDictionary = vi.fn().mockRejectedValue(new Error("boom"));
      const { container } = render(
        <LingoProviderWrapper loadDictionary={loadDictionary}>
          <div />
        </LingoProviderWrapper>,
      );

      await vi.waitFor(() => expect(loadDictionary).toHaveBeenCalled());
      expect(container.firstChild).toBeNull();
    });

    it("renders custom loading component while loading", async () => {
      const loadDictionary = vi
        .fn()
        .mockResolvedValue({ locale: "en", files: {} });

      const LoadingComponent = () => (
        <div data-testid="loading">Loading...</div>
      );

      const { getByTestId, findByTestId } = render(
        <LingoProviderWrapper
          loadDictionary={loadDictionary}
          loadingComponent={<LoadingComponent />}
        >
          <div data-testid="child">Content</div>
        </LingoProviderWrapper>,
      );

      // should show loading component initially
      expect(getByTestId("loading")).toBeTruthy();

      // wait for dictionary to load
      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());

      // should show child content after loading
      const child = await findByTestId("child");
      expect(child).toBeTruthy();
    });

    it("renders custom error component when loading fails", async () => {
      const testError = new Error("Network error");
      const loadDictionary = vi.fn().mockRejectedValue(testError);

      const ErrorComponent = ({ error }: { error: Error }) => (
        <div data-testid="error">Error: {error.message}</div>
      );

      const { findByTestId } = render(
        <LingoProviderWrapper
          loadDictionary={loadDictionary}
          errorComponent={ErrorComponent}
        >
          <div>Content</div>
        </LingoProviderWrapper>,
      );

      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());

      const errorEl = await findByTestId("error");
      expect(errorEl.textContent).toBe("Error: Network error");
    });

    it("converts non-Error objects to Error in error state", async () => {
      const loadDictionary = vi.fn().mockRejectedValue("string error");

      const ErrorComponent = ({ error }: { error: Error }) => (
        <div data-testid="error">{error.message}</div>
      );

      const { findByTestId } = render(
        <LingoProviderWrapper
          loadDictionary={loadDictionary}
          errorComponent={ErrorComponent}
        >
          <div>Content</div>
        </LingoProviderWrapper>,
      );

      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());

      const errorEl = await findByTestId("error");
      expect(errorEl.textContent).toBe("string error");
    });

    it("transitions from loading to loaded to error states correctly", async () => {
      const loadDictionary = vi
        .fn()
        .mockResolvedValue({ locale: "en", files: {} });

      const { findByTestId, rerender } = render(
        <LingoProviderWrapper
          loadDictionary={loadDictionary}
          loadingComponent={<div data-testid="loading">Loading</div>}
        >
          <div data-testid="content">Content</div>
        </LingoProviderWrapper>,
      );

      // verify loading state
      expect(await findByTestId("loading")).toBeTruthy();

      // wait for successful load
      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());

      // verify loaded state
      expect(await findByTestId("content")).toBeTruthy();
    });
  });
});
