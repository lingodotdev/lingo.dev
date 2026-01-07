import type { PluralizationBatch, PluralizationResponse } from "./types";

/**
 * Few-shot examples: [input, output]
 */
export const shots: [PluralizationBatch, PluralizationResponse][] = [
  // Example 1: Should pluralize
  [
    {
      version: 0.1,
      sourceLocale: "en",
      candidates: {
        candidate: [
          {
            hash: "h1",
            text: "You have {count} items in your cart",
          },
          {
            hash: "h2",
            text: "{fileCount} files uploaded",
          },
        ],
      },
    },
    {
      version: 0.1,
      results: {
        result: [
          {
            hash: "h1",
            shouldPluralize: true,
            icuText:
              "You have {count, plural, =0 {no items} one {# item} other {# items}} in your cart",
            reasoning: "Message varies based on item count",
          },
          {
            hash: "h2",
            shouldPluralize: true,
            icuText:
              "{fileCount, plural, =0 {No files uploaded} one {# file uploaded} other {# files uploaded}}",
            reasoning: "Message varies based on file count",
          },
        ],
      },
    },
  ],

  // Example 2: Should NOT pluralize
  [
    {
      version: 0.1,
      sourceLocale: "en",
      candidates: {
        candidate: [
          {
            hash: "h3",
            text: "Welcome back, {name}",
          },
          {
            hash: "h4",
            text: "Your email is {email}",
          },
        ],
      },
    },
    {
      version: 0.1,
      results: {
        result: [
          {
            hash: "h3",
            shouldPluralize: false,
            reasoning:
              "Variable {name} is a person's name, not a count. No pluralization needed.",
          },
          {
            hash: "h4",
            shouldPluralize: false,
            reasoning:
              "Variable {email} is an email address, not a count. No pluralization needed.",
          },
        ],
      },
    },
  ],
];
