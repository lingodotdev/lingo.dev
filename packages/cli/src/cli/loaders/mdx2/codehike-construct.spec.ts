import { describe, it, expect } from "vitest";
import createMdxCodeHikeLoader from "./codehike-construct";
import dedent from "dedent";
import { md5 } from "../../utils/md5";

describe("MDX Code Hike Loader", () => {
  const loader = createMdxCodeHikeLoader();
  loader.setDefaultLocale("en");
  
  describe("CH components", () => {
    it("should replace CH.Code component with placeholder on pull", async () => {
      const md = dedent`
        # Title
        
        <CH.Code>
        \`\`\`js
        console.log("Hello");
        \`\`\`
        </CH.Code>
        
        Some text.
      `;
      
      const result = await loader.pull("en", md);
      expect(result.content).toMatch(/---CODEHIKE-COMPONENT-[0-9a-f]+---/);
      expect(result.content).not.toContain("<CH.Code>");
    });
    
    it("should restore CH.Code component from placeholder on push", async () => {
      const md = dedent`
        # Title
        
        <CH.Code>
        \`\`\`js
        console.log("Hello");
        \`\`\`
        </CH.Code>
        
        Some text.
      `;
      
      const pulled = await loader.pull("en", md);
      const translated = {
        ...pulled,
        content: pulled.content.replace("# Title", "# Título").replace("Some text", "Algún texto"),
      };
      
      const pushed = await loader.push("es", translated);
      
      const expected = dedent`
        # Título
        
        <CH.Code>
        \`\`\`js
        console.log("Hello");
        \`\`\`
        </CH.Code>
        
        Algún texto.
      `;
      
      expect(pushed).toBe(expected);
    });
    
    it("should handle CH.Section component", async () => {
      const md = dedent`
        <CH.Section>
        
        Some markdown content.
        
        \`\`\`js
        const x = 1;
        \`\`\`
        
        </CH.Section>
      `;
      
      const pulled = await loader.pull("en", md);
      const translated = {
        ...pulled,
        content: pulled.content.replace("Some markdown content", "Algún contenido markdown"),
      };
      
      const pushed = await loader.push("es", translated);
      
      expect(pushed).toContain("<CH.Section>");
      expect(pushed).toContain("Algún contenido markdown");
      expect(pushed).toContain("```js");
    });
  });
  
  describe("Code annotations", () => {
    it("should handle code block with focus annotation", async () => {
      const md = dedent`
        \`\`\`js {focus: 1-2}
        const x = 1;
        const y = 2;
        const z = 3;
        \`\`\`
      `;
      
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      
      expect(pushed).toBe(md);
    });
    
    it("should handle code block with multiple annotations", async () => {
      const md = dedent`
        \`\`\`js {focus: 1-2, mark: 3, withClass: {4: 'highlight'}}
        const x = 1;
        const y = 2;
        const z = 3;
        const a = 4;
        \`\`\`
      `;
      
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      
      expect(pushed).toBe(md);
    });
  });
  
  describe("Round-trip scenarios", () => {
    it("should handle mixed content correctly", async () => {
      const md = dedent`
        # Introduction
        
        <CH.Code>
        \`\`\`js
        function hello() {
          console.log("Hello");
        }
        \`\`\`
        </CH.Code>
        
        Regular paragraph with \`inline code\`.
        
        \`\`\`js {focus: 2}
        const a = 1;
        const b = 2;
        \`\`\`
      `;
      
      const pulled = await loader.pull("en", md);
      const translated = {
        ...pulled,
        content: pulled.content
          .replace("# Introduction", "# Introducción")
          .replace("Regular paragraph", "Párrafo normal"),
      };
      
      const pushed = await loader.push("es", translated);
      
      expect(pushed).toContain("# Introducción");
      expect(pushed).toContain("<CH.Code>");
      expect(pushed).toContain("function hello()");
      expect(pushed).toContain("Párrafo normal");
      expect(pushed).toContain("```js {focus: 2}");
    });
  });
});
