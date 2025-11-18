import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
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
    it("renders nothing while loading by default, then shows children", async () => {
      const deferred = createDeferred<{
        locale: string;
        files: Record<string, unknown>;
      }>();
      const loadDictionary = vi.fn(() => deferred.promise);

      const Child = () => <div data-testid="child">ok</div>;

      const { container, findByTestId } = render(
        <LingoProviderWrapper loadDictionary={loadDictionary}>
          <Child />
        </LingoProviderWrapper>,
      );

      // No fallback by default (renders nothing during load)
      expect(container.firstChild).toBeNull();

      await act(async () => {
        deferred.resolve({ locale: "en", files: {} });
        await deferred.promise;
      });

      await waitFor(() => expect(loadDictionary).toHaveBeenCalled());
      const child = await findByTestId("child");
      expect(child).not.toBeNull();
    });

    it("supports a custom fallback", () => {
      const loadDictionary = vi.fn(() => new Promise(() => {}));

      render(
        <LingoProviderWrapper
          loadDictionary={loadDictionary}
          fallback={<div data-testid="fallback">waiting</div>}
        >
          <div />
        </LingoProviderWrapper>,
      );

      const fallback = screen.getByTestId("fallback");
      expect(fallback).not.toBeNull();
      expect(fallback.textContent).toBe("waiting");
    });

    it("propagates load errors to the nearest error boundary", async () => {
      const loadDictionary = vi.fn().mockRejectedValue(new Error("boom"));
      const onError = vi.fn();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <TestErrorBoundary onError={onError}>
          <LingoProviderWrapper loadDictionary={loadDictionary}>
            <div />
          </LingoProviderWrapper>
        </TestErrorBoundary>,
      );

      await waitFor(() => expect(onError).toHaveBeenCalled());
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onError.mock.calls[0][0].message).toBe("boom");

      const errorBoundary = await screen.findByTestId("boundary-error");
      expect(errorBoundary).not.toBeNull();
      expect(errorBoundary.textContent).toBe("error");

      consoleSpy.mockRestore();
    });
  });
});

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

class TestErrorBoundary extends React.Component<
  { onError: (error: Error) => void; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="boundary-error">error</div>;
    }

    return this.props.children;
  }
}
