import { describe, it, expect } from "vitest";
import { jsxFragmentMutation } from "./jsx-fragment";
import { createPayload, createOutput, defaultParams } from "./_base";

// Helper function to run mutation and get result
function runMutation(code: string) {
  const input = createPayload({ code, params: defaultParams, fileKey: "test" });
  const mutated = jsxFragmentMutation(input);
  if (!mutated) return code; // Return original code if no changes made
  return createOutput(mutated).code;
}

describe("jsxFragmentMutation", () => {
  it("should transform empty fragment shorthand to explicit Fragment", () => {
    const input = `
function Component() {
  return <></>;
}
`.trim();

    const expected = `
import { Fragment } from "react";
function Component() {
  return <Fragment></Fragment>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should transform fragment shorthand with content to explicit Fragment", () => {
    const input = `
function Component() {
  return <>Hello world</>;
}
`.trim();

    const expected = `
import { Fragment } from "react";
function Component() {
  return <Fragment>Hello world</Fragment>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should transform nested fragment shorthand", () => {
    const input = `
function Component() {
  return <>
    <div>Outer content</div>
    <>Inner fragment</>
  </>;
}
`.trim();

    const expected = `
import { Fragment } from "react";
function Component() {
  return <Fragment>
    <div>Outer content</div>
    <Fragment>Inner fragment</Fragment>
  </Fragment>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle existing Fragment import", () => {
    const input = `
import { Fragment } from "react";

function Component() {
  return <></>;
}
`.trim();

    const expected = `
import { Fragment } from "react";
function Component() {
  return <Fragment></Fragment>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle renamed Fragment import", () => {
    const input = `
import { Fragment as ReactFragment } from "react";

function Component() {
  return <></>;
}
`.trim();

    const expected = `
import { Fragment as ReactFragment } from "react";
function Component() {
  return <ReactFragment></ReactFragment>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should return null (no changes) when no fragments found", () => {
    const input = `
function Component() {
  return <div>No fragments here</div>;
}
`.trim();

    const result = runMutation(input);
    expect(result).toBe(input);
  });
});
