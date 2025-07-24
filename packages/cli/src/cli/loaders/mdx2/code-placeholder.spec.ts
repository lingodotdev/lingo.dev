import { describe, it, expect } from "vitest";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import dedent from "dedent";
import { md5 } from "../../utils/md5";

const PLACEHOLDER_REGEX = /---CODE-PLACEHOLDER-[0-9a-f]+---/g;

const sampleContent = dedent`
Paragraph with some code:

\`\`\`js
console.log("foo");
\`\`\`
`;

describe("MDX Code Placeholder Loader", () => {
  const loader = createMdxCodePlaceholderLoader();
  loader.setDefaultLocale("en");

  it("should replace fenced code with placeholder on pull", async () => {
    const result = await loader.pull("en", sampleContent);
    const hash = md5('```js\nconsole.log("foo");\n```');
    const expected = `Paragraph with some code:\n\n---CODE-PLACEHOLDER-${hash}---`;
    expect(result.trim()).toBe(expected);
  });

  it("should restore fenced code from placeholder on push", async () => {
    const pulled = await loader.pull("en", sampleContent);
    const translated = pulled.replace("Paragraph", "Párrafo");
    const output = await loader.push("es", translated);
    const expected = dedent`
      Párrafo with some code:

      \`\`\`js
      console.log("foo");
      \`\`\`
    `;
    expect(output.trim()).toBe(expected.trim());
  });

  describe("round-trip scenarios", () => {
    it("round-trips a fenced block with language tag", async () => {
      const md = dedent`
        Example:

        \`\`\`js
        console.log()
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block without language tag", async () => {
      const md = dedent`
        Intro:

        \`\`\`
        generic code
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a meta-tagged fenced block", async () => {
      const md = dedent`
        Meta:

        \`\`\`js {1,2} title="Sample"
        line1
        line2
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside a blockquote", async () => {
      const md = dedent`
        > Quote start
        > \`\`\`ts
        > let x = 42;
        > \`\`\`
        > Quote end
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips multiple separated fenced blocks", async () => {
      const md = dedent`
        A:

        \`\`\`js
        1
        \`\`\`

        B:

        \`\`\`js
        2
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips adjacent fenced blocks", async () => {
      const md = dedent`
        \`\`\`
        a()
        \`\`\`
        \`\`\`
        b()
        \`\`\`
      `;
      const expected = dedent`
        \`\`\`
        a()
        \`\`\`

        \`\`\`
        b()
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });

    it("round-trips an indented fenced block", async () => {
      const md = dedent`
        Outer:

        \`\`\`py
        pass
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block after a heading", async () => {
      const md = dedent`
        # Title

        \`\`\`bash
        echo hi
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside a list item", async () => {
      const md = `
- item:

  \`\`\`js
  io()
  \`\`\`
      `.trim();
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside JSX component", async () => {
      const md = dedent`
        <Component>

        \`\`\`js
        x
        \`\`\`

        </Component>
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside JSX component - adds new lines", async () => {
      const md = dedent`
        <Component>
        \`\`\`js
        x
        \`\`\`
        </Component>
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(
        dedent`
        <Component>

        \`\`\`js
        x
        \`\`\`
        
        </Component>
      `,
      );
    });

    it("round-trips a large JSON fenced block", async () => {
      const md = dedent`
        \`\`\`shell
        { "key": [1,2,3] }
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("handles identical code snippets correctly", async () => {
      const md = dedent`
        First paragraph:

        \`\`\`shell
        echo "hello world"
        \`\`\`

        Second paragraph:
        \`\`\`shell
        echo "hello world"
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(
        dedent`
        First paragraph:

        \`\`\`shell
        echo "hello world"
        \`\`\`

        Second paragraph:

        \`\`\`shell
        echo "hello world"
        \`\`\`
      `,
      );
    });

    it("handles fenced code blocks inside quotes correctly", async () => {
      const md = dedent`
        > Code snippet inside quote:
        >
        > \`\`\`shell
        > npx -y mucho@latest install
        > \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips an image block with surrounding blank lines unchanged", async () => {
      const md = dedent`
        Text above.

        ![](https://example.com/img.png)

        Text below.
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips and adds blank lines around an image block when missing", async () => {
      const md = dedent`
        Text above.
        ![](https://example.com/img.png)
        Text below.
      `;

      const expected = dedent`
        Text above.

        ![](https://example.com/img.png)

        Text below.
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });

    it("keeps image inside blockquote as-is", async () => {
      const md = dedent`
        > ![](https://example.com/img.png)
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("leaves incomplete fences untouched", async () => {
      const md = "```js\nno close";
      const pulled = await loader.pull("en", md);
      expect(pulled).toBe(md);

      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    // Edge cases for image spacing

    it("adds blank line after image when only before exists", async () => {
      const md = dedent`
        Before.

        ![alt](https://example.com/i.png)
        After.
      `;

      const expected = dedent`
        Before.

        ![alt](https://example.com/i.png)

        After.
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });

    it("adds blank line before image when only after exists", async () => {
      const md = dedent`
        Before.
        ![alt](https://example.com/i.png)

        After.
      `;

      const expected = dedent`
        Before.

        ![alt](https://example.com/i.png)

        After.
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });

    it("inserts spacing between consecutive images", async () => {
      const md = dedent`
        ![](a.png)
        ![](b.png)
      `;

      const expected = dedent`
        ![](a.png)

        ![](b.png)
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });

    it("handles image inside JSX component - adds blank lines", async () => {
      const md = dedent`
        <Wrapper>
        ![](pic.png)
        </Wrapper>
      `;

      const expected = dedent`
        <Wrapper>

        ![](pic.png)

        </Wrapper>
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });
  });

  describe("inline code placeholder", () => {
    it("should replace inline code with placeholder on pull", async () => {
      const md = "This is some `inline()` code.";
      const pulled = await loader.pull("en", md);
      const hash = md5("`inline()`");
      const expected = `This is some ---INLINE-CODE-PLACEHOLDER-${hash}--- code.`;
      expect(pulled).toBe(expected);
    });

    it("should restore inline code from placeholder on push", async () => {
      const md = "Some `code` here.";
      const pulled = await loader.pull("en", md);
      const translated = pulled.replace("Some", "Algún");
      const pushed = await loader.push("es", translated);
      expect(pushed).toBe("Algún `code` here.");
    });

    it("round-trips multiple inline code snippets", async () => {
      const md = "Use `a` and `b` and `c`.";
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("handles identical inline snippets correctly", async () => {
      const md = "Repeat `x` and `x` again.";
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("retains custom inline code in target locale when it differs from source", async () => {
      const enMd = "Use `foo` function.";
      const ruMd = "Используйте `бар` функцию.";

      // Pull English source to establish originalInput in loader state
      await loader.pull("en", enMd);

      // Pull Russian content (with its own inline code value)
      const ruPulled = await loader.pull("ru", ruMd);
      // Simulate translator editing surrounding text but keeping placeholder intact
      const ruTranslated = ruPulled.replace("Используйте", "Примените");

      // Push back to Russian locale and ensure inline code is preserved
      const ruPushed = await loader.push("ru", ruTranslated);
      expect(ruPushed).toBe("Примените `бар` функцию.");
    });
  });

  describe("Image URLs with Parentheses", () => {
    it("should handle image URLs with parentheses", async () => {
      const md = dedent`
        Text above.

        ![](https://example.com/image(with)parentheses.jpg)

        Text below.
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("should handle image URLs with nested parentheses", async () => {
      const md = dedent`
        Text above.

        ![Alt text](https://example.com/image(with(nested)parentheses).jpg)

        Text below.
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("should handle image URLs with parentheses in blockquotes", async () => {
      const md = dedent`
        > ![Blockquote image](https://example.com/image(in)blockquote.jpg)
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("should handle image URLs with parentheses in JSX components", async () => {
      const md = dedent`
        <Component>
        ![Component image](https://example.com/image(in)component.jpg)
        </Component>
      `;

      const expected = dedent`
        <Component>

        ![Component image](https://example.com/image(in)component.jpg)

        </Component>
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });
  });

  describe("placeholder replacement bugs", () => {
    it("should not leave placeholders when content matches", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      const content = "Use the `getData()` function.";

      // Pull and then push the same content - should work correctly
      const pulled = await loader.pull("en", content);
      const translated = pulled.replace("Use", "Utilize");
      const pushed = await loader.push("en", translated);

      // Should not contain any placeholders
      expect(pushed).not.toMatch(/---INLINE-CODE-PLACEHOLDER-[0-9a-f]+---/);
      expect(pushed).not.toMatch(/---CODE-PLACEHOLDER-[0-9a-f]+---/);
      expect(pushed).toContain("`getData()`");
      expect(pushed).toContain("Utilize");
    });

    it("should replace all placeholders including those from different sources", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      // Simulate the exact scenario from the user's bug report
      const englishContent = "Use the `getData()` function.";
      const arabicContent = "استخدم `الحصول_على_البيانات()` الدالة.";

      // First pull English (required as default locale)
      await loader.pull("en", englishContent);

      // Pull Arabic content to create placeholders
      const arabicPulled = await loader.pull("ar", arabicContent);

      // Simulate translation: translator changes text but keeps placeholder
      const arabicTranslated = arabicPulled.replace("استخدم", "قم بتطبيق");

      // Push back - this should now work correctly with the fix
      const pushedResult = await loader.push("ar", arabicTranslated);

      // The fix: ALL placeholders should be replaced, including Arabic ones
      expect(pushedResult).not.toMatch(
        /---INLINE-CODE-PLACEHOLDER-[0-9a-f]+---/,
      );
      expect(pushedResult).not.toMatch(/---CODE-PLACEHOLDER-[0-9a-f]+---/);

      // The Arabic inline code should be preserved and translated text should be there
      expect(pushedResult).toContain("`الحصول_على_البيانات()`");
      expect(pushedResult).toContain("قم بتطبيق");
    });

    it("should replace placeholders even when pullInput state is overwritten", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      const englishContent = "Use the `getData()` function.";
      const arabicContent = "استخدم `الحصول_على_البيانات()` الدالة.";

      // First pull English (required as default locale)
      await loader.pull("en", englishContent);

      // Pull Arabic content to create placeholders
      const arabicPulled = await loader.pull("ar", arabicContent);

      // Simulate translation: translator changes text but keeps placeholder
      const arabicTranslated = arabicPulled.replace("استخدم", "قم بتطبيق");

      // Now pull English again, overwriting pullInput state
      // This simulates the real-world scenario where the loader state gets out of sync
      await loader.pull("en", englishContent);

      // Push the Arabic translation - should work despite state being overwritten
      const pushedResult = await loader.push("ar", arabicTranslated);

      // All placeholders should be replaced, even when not in current pullInput
      expect(pushedResult).not.toMatch(
        /---INLINE-CODE-PLACEHOLDER-[0-9a-f]+---/,
      );
      expect(pushedResult).not.toMatch(/---CODE-PLACEHOLDER-[0-9a-f]+---/);
      expect(pushedResult).toContain("`الحصول_على_البيانات()`");
      expect(pushedResult).toContain("قم بتطبيق");
    });
  });
});
