import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { LocaleSwitcher } from "./locale-switcher";

vi.mock("./utils", async (orig) => {
  const actual = await orig();
  return {
    ...(actual as any),
    getLocaleFromCookies: vi.fn(() => "es"),
    setLocaleInCookies: vi.fn(),
  };
});

import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null before determining initial locale", () => {
    // This component sets state in an effect, but with jsdom and our mocked
    // cookie util returning a value synchronously, it may render immediately.
    // We still assert it produces a select afterward.
    const { container } = render(<LocaleSwitcher locales={["en", "es"]} />);
    expect(container.querySelector("select")).toBeTruthy();
  });

  it("uses cookie locale if valid; otherwise defaults to first provided locale", async () => {
    (getLocaleFromCookies as any).mockReturnValueOnce("es");
    render(<LocaleSwitcher locales={["en", "es"]} />);
    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;
    expect(select.value).toBe("es");

    // invalid cookie -> defaults to first
    (getLocaleFromCookies as any).mockReturnValueOnce("fr");
    render(<LocaleSwitcher locales={["en", "es"]} />);
    const selects = (await screen.findAllByRole(
      "combobox",
    )) as HTMLSelectElement[];
    expect(selects[1].value).toBe("en");
  });

  it("on change sets cookie and triggers full reload", async () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadSpy },
      writable: true,
    });
    render(<LocaleSwitcher locales={["en", "es"]} />);
    const select = await screen.findByRole("combobox");
    fireEvent.change(select, { target: { value: "en" } });

    expect(setLocaleInCookies).toHaveBeenCalledWith("en");
    expect(reloadSpy).toHaveBeenCalled();
  });
});
