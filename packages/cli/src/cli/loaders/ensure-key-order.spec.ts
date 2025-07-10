import { describe, it, expect } from "vitest";
import createEnsureKeyOrderLoader from "./ensure-key-order";

describe("ensure-key-order loader", () => {
  const loader = createEnsureKeyOrderLoader();
  loader.setDefaultLocale("en");

  it("should return input unchanged on pull", async () => {
    const input = { b: 1, a: 2 };
    const result = await loader.pull("en", input);
    expect(result).toEqual(input);
  });

  it("should reorder keys to match original input order on push", async () => {
    const originalInput = { a: 1, b: 2, c: 3 };
    await loader.pull("en", originalInput);
    const data = { b: 22, a: 11, c: 33 };
    const result = await loader.push("en", data);
    expect(result).toEqual({ a: 11, b: 22, c: 33 });
  });

  it("should reorder keys in objects of nested arrays to match original input order on push", async () => {
    const originalInput = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
      {
        values: [
          { a: 7, b: 8, c: 9 },
          { a: 10, b: 11, c: 12 },
        ],
      },
    ];
    await loader.pull("en", originalInput);
    const data = [
      { b: 22, a: 11, c: 33 },
      { b: 55, c: 66, a: 44 },
      {
        values: [
          { b: 88, c: 99, a: 77 },
          { c: 122, b: 111, a: 100 },
        ],
      },
    ];
    const result = await loader.push("en", data);
    expect(result).toEqual([
      { a: 11, b: 22, c: 33 },
      { a: 44, b: 55, c: 66 },
      {
        values: [
          { a: 77, b: 88, c: 99 },
          { a: 100, b: 111, c: 122 },
        ],
      },
    ]);
  });

  it("should reorder falsy keys to match original input order on push", async () => {
    const originalInput = {
      a: 1,
      b: 0,
      c: null,
      d: "a",
      e: false,
      g: "",
      h: undefined,
    };
    await loader.pull("en", originalInput);
    const data = {
      b: 0,
      a: 11,
      c: null,
      d: "b",
      e: false,
      g: "",
      h: undefined,
    };
    const result = await loader.push("en", data);
    expect(result).toEqual({
      a: 11,
      b: 0,
      c: null,
      d: "b",
      e: false,
      g: "",
      h: undefined,
    });
  });

  it("should handle nested objects and preserve key order", async () => {
    const originalInput = { x: { b: 2, a: 1 }, y: 3, z: { d: 9, f: 7, e: 8 } };
    await loader.pull("en", originalInput);
    const data = { x: { a: 11, b: 22 }, z: { d: 99, e: 88, f: 77 }, y: 33 };
    const result = await loader.push("en", data);
    expect(result).toEqual({
      x: { b: 22, a: 11 },
      y: 33,
      z: { d: 99, e: 88, f: 77 },
    });
  });

  it("should skip keys not in original input of source locale", async () => {
    const originalInput = { a: 1, b: 2 };
    await loader.pull("en", originalInput);
    const data = { a: 11, b: 22, c: 33 };
    const result = await loader.push("en", data);
    expect(result).toEqual({ a: 11, b: 22 });
  });

  it("should skip keys not in the target locale data", async () => {
    const originalInput = { a: 1, b: 2, c: 2 };
    await loader.pull("en", originalInput);
    const data = { a: 11, c: 33 };
    const result = await loader.push("en", data);
    expect(result).toEqual({ a: 11, c: 33 });
  });
});
