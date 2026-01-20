import { describe, it, expect } from "vitest";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import dedent from "dedent";
import { md5 } from "../../utils/md5";

const PLACEHOLDER_REGEX = /\{\/\* CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/g;

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
    const expected = `Paragraph with some code:\n\n{/* CODE_PLACEHOLDER_${hash} */}`;
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
      const expected = `This is some {/* INLINE_CODE_PLACEHOLDER_${hash} */} code.`;
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
    it("should handle special $ characters in code content correctly", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      // Code containing special $ characters that have special meaning in replaceAll
      const content = dedent`
        Text before.

        \`\`\`js
        const price = "$100";
        const template = "$\`text\`";
        const special = "$&$'$\`";
        \`\`\`

        Text after.
      `;

      // Pull and then push the same content
      const pulled = await loader.pull("en", content);
      const translated = pulled.replace("Text before", "Texto antes");
      const pushed = await loader.push("en", translated);

      // Should not contain any placeholders
      expect(pushed).not.toMatch(/\{\/\* CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/);

      // Should preserve all special $ characters exactly as they were
      expect(pushed).toContain('const price = "$100";');
      expect(pushed).toContain('const template = "$`text`";');
      expect(pushed).toContain('const special = "$&$\'$`";');
      expect(pushed).toContain("Texto antes");
    });

    it("should handle inline code with $ characters correctly", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      const content = "Use `$price` and `$&` and `$\`` in your code.";

      // Pull and then push the same content
      const pulled = await loader.pull("en", content);
      const translated = pulled.replace("Use", "Utilize");
      const pushed = await loader.push("en", translated);

      // Should not contain any placeholders
      expect(pushed).not.toMatch(/\{\/\* INLINE_CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/);

      // Should preserve all special $ characters
      expect(pushed).toContain("`$price`");
      expect(pushed).toContain("`$&`");
      expect(pushed).toContain("`$\``");
      expect(pushed).toContain("Utilize");
    });

    it("should not leave placeholders when content matches", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      const content = "Use the `getData()` function.";

      // Pull and then push the same content - should work correctly
      const pulled = await loader.pull("en", content);
      const translated = pulled.replace("Use", "Utilize");
      const pushed = await loader.push("en", translated);

      // Should not contain any placeholders
      expect(pushed).not.toMatch(/\{\/\* INLINE_CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/);
      expect(pushed).not.toMatch(/\{\/\* CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/);
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
        /\{\/\* INLINE_CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/,
      );
      expect(pushedResult).not.toMatch(/\{\/\* CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/);

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
        /\{\/\* INLINE_CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/,
      );
      expect(pushedResult).not.toMatch(/\{\/\* CODE_PLACEHOLDER_[0-9a-f]+\s*\*\/\}/);
      expect(pushedResult).toContain("`الحصول_على_البيانات()`");
      expect(pushedResult).toContain("قم بتطبيق");
    });
  });

  describe("raw code outside fences", () => {
    it("should handle raw JavaScript code outside fences", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      // Test case matching user's file structure - raw JS between JSX components
      const md = dedent`
        </Tabs>

        // Attach to button click
        document.getElementById('executeBtn')?.addEventListener('click', executeClientSideWorkflow);

        <Callout type="warning">
          Content here
        </Callout>
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("en", pulled);

      // Should round-trip correctly
      expect(pushed).toBe(md);
    });

    it("should handle mixed code blocks and raw code", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      const md = dedent`
        Here's a code block:

        \`\`\`typescript
        const x = 1;
        \`\`\`

        Now some raw code outside:
        // This is outside
        const y = 2;

        And another block:

        \`\`\`javascript
        const z = 3;
        \`\`\`
      `;

      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("en", pulled);

      // Should preserve raw code outside fences
      expect(pushed).toContain("// This is outside");
      expect(pushed).toContain("const y = 2;");
    });

    it("should handle code blocks with extra blank lines added by translation", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      // English source - no extra blank lines
      const enMd = dedent`
        <Tab value="npm">
          \`\`\`bash
          npm install
          \`\`\`
        </Tab>
      `;

      // Pull English to establish placeholders
      const enPulled = await loader.pull("en", enMd);

      // German translation with extra blank lines (simulating AI translation behavior)
      const deMd = dedent`
        <Tab value="npm">

          \`\`\`bash
          npm install
          \`\`\`

        </Tab>
      `;

      // Pull German version
      const dePulled = await loader.pull("de", deMd);

      // Push back - should restore code blocks correctly
      const dePushed = await loader.push("de", dePulled);

      // The code block should be present and not replaced with placeholder
      expect(dePushed).toContain("```bash");
      expect(dePushed).toContain("npm install");
      expect(dePushed).not.toMatch(/\{\/\* CODE_PLACEHOLDER_/);
    });

    it("should preserve double newlines around placeholders for section splitting", async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      // Test that placeholders maintain double newlines so section-split works correctly
      const md = dedent`
        Text before.

        \`\`\`typescript
        code1
        \`\`\`

        Text between.

        \`\`\`javascript
        code2
        \`\`\`

        Text after.
      `;

      const pulled = await loader.pull("en", md);

      // Verify placeholders are surrounded by double newlines for proper section splitting
      const placeholders = pulled.match(/\{\/\* CODE_PLACEHOLDER_[a-f0-9]+\s*\*\/\}/g);
      expect(placeholders).toHaveLength(2);

      // Check that each placeholder has double newlines around it
      for (const placeholder of placeholders!) {
        // Should have \n\n before (except at start) and \n\n after (except at end)
        const placeholderIndex = pulled.indexOf(placeholder);

        // Check for double newline after (unless at end)
        const afterPlaceholder = pulled.substring(
          placeholderIndex + placeholder.length,
          placeholderIndex + placeholder.length + 2,
        );
        if (placeholderIndex + placeholder.length < pulled.length - 2) {
          expect(afterPlaceholder).toBe("\n\n");
        }
      }

      // Ensure we can split on \n\n and get separate sections
      const sections = pulled.split("\n\n").filter(Boolean);
      expect(sections.length).toBeGreaterThanOrEqual(5); // Text + placeholder + text + placeholder + text
    });
  });
});

describe("adjacent code blocks bug", () => {
  it("should handle closing fence followed immediately by opening fence", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    // This reproduces the actual bug from the user's file
    const md = dedent`
      \`\`\`typescript
      function example() {
        return true;
      }
      \`\`\`

      \`\`\`typescript
      import { Something } from 'somewhere';
      \`\`\`
    `;

    const pulled = await loader.pull("en", md);

    console.log("PULLED CONTENT:");
    console.log(pulled);
    console.log("___");

    // The bug: placeholder is concatenated with "typescript" from next block
    const bugPattern = /\{\/\* CODE_PLACEHOLDER_[a-f0-9]+\s*\*\/\}typescript/;
    expect(pulled).not.toMatch(bugPattern);

    // Should have proper separation
    expect(pulled).toMatch(
      /\{\/\* CODE_PLACEHOLDER_[a-f0-9]+\s*\*\/\}\n\n\{\/\* CODE_PLACEHOLDER_[a-f0-9]+\s*\*\/\}/,
    );
  });
});

describe("$ special character handling in replacement functions", () => {
  it("should preserve $ characters in ensureTrailingFenceNewline", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    // Tests fix for lines 38, 68: replaceAll(match, () => replacement)
    // Code block with $ that would trigger special replacement behavior if not using function replacer
    const content = dedent`
      Some text
      \`\`\`js
      console.log('Current period cost: $' + amount);
      const template = \`Price: $\${price}\`;
      \`\`\`
      More text
    `;

    const pulled = await loader.pull("en", content);
    const pushed = await loader.push("en", pulled);

    // All $ characters should be preserved exactly
    expect(pushed).toContain("console.log('Current period cost: $' + amount);");
    expect(pushed).toContain("const template = `Price: $");
  });

  it("should preserve $ characters in ensureSurroundingImageNewlines", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    // Tests fix for line 38: replaceAll(match, () => replacement) in image handling
    // Image with $ in URL and alt text that would break with string replacer
    const content = dedent`
      Here is an image:
      ![Price: $100](https://api.example.com/chart?price=$500&currency=$USD)
      End of text
    `;

    const pulled = await loader.pull("en", content);
    const pushed = await loader.push("en", pulled);

    // All $ characters in URL and alt text should be preserved
    expect(pushed).toContain("![Price: $100]");
    expect(pushed).toContain("price=$500&currency=$USD");
  });
});

describe("placeholder format edge cases (regression)", () => {
  // Tests for edge cases that would fail with `---` or `___` placeholder formats
  // These tests pass with current `{/* */}` format and document why it's used

  it("should handle placeholder at content start (gray-matter edge case)", async () => {
    // Korean translation scenario: inline code moves to sentence start
    // Would fail with `---` format (gray-matter engine detection)
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const englishMdx = `Understanding the \`code\` directory.`;
    await loader.pull("en", englishMdx);

    const koreanMdx = `\`코드\` 디렉토리와 그 내용을 이해합니다.`;
    const pulled = await loader.pull("ko", koreanMdx);

    expect(pulled).toMatch(/^\{\/\* INLINE_CODE_PLACEHOLDER/);

    // Simulate frontmatter-split: matter.stringify with placeholder at start
    const matter = require('gray-matter');
    const mdxDocument = matter.stringify(pulled, { title: 'Test' });

    expect(mdxDocument).toContain('{/*');

    const restored = await loader.push("ko", pulled, koreanMdx, "en", koreanMdx);
    expect(restored).toBe(koreanMdx);
  });

  it("should preserve placeholder without Markdown emphasis parsing", async () => {
    // Would fail with `___` format (parsed as bold-italic)
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const mdContent = dedent`
      Paragraph with \`inline code\` in middle.

      More text with \`code\` here.
    `;

    const pulled = await loader.pull("en", mdContent);

    // Simulate Markdown parsing
    const { unified } = require('unified');
    const remarkParse = require('remark-parse').default;
    const remarkStringify = require('remark-stringify').default;

    const processor = unified().use(remarkParse).use(remarkStringify);
    const parsed = processor.stringify(processor.parse(pulled));

    // JSX comments get escaped by Markdown but structure is preserved
    // Underscores in placeholder names get escaped: INLINE\_CODE\_PLACEHOLDER
    expect(parsed).toMatch(/INLINE[_\\]*CODE[_\\]*PLACEHOLDER/);
    expect(parsed).not.toContain('***'); // Not parsed as bold-italic
    expect(parsed).not.toMatch(/___CODE.*___/); // Not using underscore format

    const restored = await loader.push("en", pulled, mdContent, "en", mdContent);
    expect(restored).toBe(mdContent);
  });

  it("should handle multiple placeholders at different positions", async () => {
    // Tests placeholders at start, middle, and after newlines
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const mdContent = dedent`
      \`start\` with code

      Middle has \`code\` too.

      \`another\` line starts with code.
    `;

    const pulled = await loader.pull("en", mdContent);
    const placeholders = pulled.match(/\{\/\* INLINE_CODE_PLACEHOLDER_[a-f0-9]+\s*\*\/\}/g);
    expect(placeholders).toHaveLength(3);

    const matter = require('gray-matter');
    const mdxDoc = matter.stringify(pulled, {
      title: 'Multiple Placeholders'
    });

    expect(mdxDoc).toContain('{/*');

    const restored = await loader.push("en", pulled, mdContent, "en", mdContent);
    expect(restored).toBe(mdContent);
  });

  it("should handle code block placeholder at document start", async () => {
    // Would fail with `---` format at document start
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const mdContent = dedent`
      \`\`\`js
      console.log("test");
      \`\`\`

      Text after code block.
    `;

    const pulled = await loader.pull("en", mdContent);
    expect(pulled).toMatch(/^\{\/\* CODE_PLACEHOLDER/);

    const matter = require('gray-matter');
    const mdxDoc = matter.stringify(pulled, { title: 'Code First' });

    expect(mdxDoc).toContain('title: Code First');
    expect(mdxDoc).toContain('{/*');

    const restored = await loader.push("en", pulled, mdContent, "en", mdContent);
    expect(restored).toBe(mdContent);
  });
});
