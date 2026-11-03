import { describe, it, expect } from "vitest";
import { formatDatoError } from "./_utils";

describe("formatDatoError", () => {
  it("uses the message of Error instances", () => {
    const error = Object.assign(
      new Error("GET https://site-api.datocms.com/item-types: 401"),
      {
        request: {
          headers: { authorization: "Bearer secret-token" },
        },
      },
    );

    const formatted = formatDatoError(error);

    expect(formatted).toBe("GET https://site-api.datocms.com/item-types: 401");
    expect(formatted).not.toContain("secret-token");
  });

  it("serializes plain error payloads without request data", () => {
    const formatted = formatDatoError({
      id: "123",
      attributes: { code: "INVALID_FIELD", details: { field: "title" } },
      request: { headers: { authorization: "Bearer secret-token" } },
      headers: { Authorization: "Bearer secret-token" },
    });

    expect(JSON.parse(formatted)).toEqual({
      id: "123",
      attributes: { code: "INVALID_FIELD", details: { field: "title" } },
      headers: {},
    });
  });
});
