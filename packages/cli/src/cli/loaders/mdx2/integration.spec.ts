import { describe, it, expect } from "vitest";
import { composeLoaders } from "../_utils";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import createMdxCodeHikeLoader from "./codehike-construct";
import createMdxFrontmatterSplitLoader from "./frontmatter-split";
import createMdxSectionsSplit2Loader from "./sections-split-2";
import createLocalizableMdxDocumentLoader from "./localizable-document";
import dedent from "dedent";

describe("MDX Integration Test with Code Hike", () => {
  describe("Code Hike loader in isolation", () => {
    const singleLoader = createMdxCodeHikeLoader();
    singleLoader.setDefaultLocale("en");
    
    it("should handle CH.Code component correctly", async () => {
      const md = dedent`
        # Introduction
        
        <CH.Code>
        \`\`\`js
        function hello() {
          console.log("Hello");
        }
        \`\`\`
        </CH.Code>
      `;
      
      const pulled = await singleLoader.pull("en", md);
      expect(pulled.content).not.toContain("<CH.Code>");
      
      const translated = {
        ...pulled,
        content: pulled.content.replace("Introduction", "Introducción")
      };
      
      const pushed = await singleLoader.push("es", translated);
      expect(pushed).toContain("# Introducción");
      expect(pushed).toContain("<CH.Code>");
      expect(pushed).toContain("function hello()");
    });
  });
  
  describe("Full loader chain", () => {
    const loader = composeLoaders(
      createMdxCodePlaceholderLoader(),
      createMdxCodeHikeLoader(),
      createMdxFrontmatterSplitLoader(),
      createMdxSectionsSplit2Loader(),
      createLocalizableMdxDocumentLoader()
    );
    
    loader.setDefaultLocale("en");
    
    it("should properly handle both regular code blocks and Code Hike constructs", async () => {
      const md = dedent`
        ---
        title: Code Hike Example
        ---
        
        # Introduction
        
        Regular code block:
        
        \`\`\`js
        console.log("Hello");
        \`\`\`
        
        Code Hike component:
        
        <CH.Code>
        \`\`\`js
        function hello() {
          console.log("Hello");
        }
        \`\`\`
        </CH.Code>
        
        Code with annotations:
        
        \`\`\`js {focus: 2}
        const a = 1;
        const b = 2;
        const c = 3;
        \`\`\`
      `;
      
      const pulled = await loader.pull("en", md);
      
      const translated = {
        ...pulled,
        meta: {
          ...pulled.meta,
          title: "Ejemplo de Code Hike"
        },
        content: { ...pulled.content }
      };
      
      for (const key in translated.content) {
        if (typeof translated.content[key] === 'string') {
          translated.content[key] = translated.content[key]
            .replace("Introduction", "Introducción")
            .replace("Regular code block", "Bloque de código regular")
            .replace("Code Hike component", "Componente de Code Hike")
            .replace("Code with annotations", "Código con anotaciones");
        }
      }
      
      const pushed = await loader.push("es", translated);
      
      expect(pushed).toContain("title: Ejemplo de Code Hike");
      expect(pushed).toContain("# Introducción");
      expect(pushed).toContain("Bloque de código regular:");
      expect(pushed).toContain("Componente de Code Hike:");
      expect(pushed).toContain("Código con anotaciones:");
      
      expect(pushed).toContain("console.log(\"Hello\");");
      
      expect(pushed).toContain("<CH.Code>");
      expect(pushed).toContain("function hello()");
      expect(pushed).toContain("console.log(\"Hello\")");
      
      expect(pushed).toContain("{focus: 2}");
      expect(pushed).toContain("const a = 1;");
      expect(pushed).toContain("const b = 2;");
    });
  });
});
