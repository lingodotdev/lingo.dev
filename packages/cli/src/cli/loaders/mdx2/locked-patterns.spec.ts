import { describe, it, expect } from "vitest";
import createMdxLockedPatternsLoader from "./locked-patterns";
import dedent from "dedent";

describe("MDX Locked Patterns Loader", () => {
  describe("Basic functionality", () => {
    it("should do nothing when no patterns are provided", async () => {
      const loader = createMdxLockedPatternsLoader();
      loader.setDefaultLocale("en");
      
      const md = dedent`
        # Title
        
        Some content.
        
        !params
        
        !! parameter_name
        
        !type string
      `;
      
      const result = await loader.pull("en", md);
      
      const placeholderRegex = /---LOCKED-PATTERN-[0-9a-f]+---/g;
      const placeholders = result.match(placeholderRegex) || [];
      expect(placeholders.length).toBe(0); // No patterns should be replaced
      
      expect(result).toBe(md);
      
      const pushed = await loader.push("es", result);
      expect(pushed).toBe(md);
    });
    
    it("should preserve content matching patterns", async () => {
      const loader = createMdxLockedPatternsLoader([
        "!params",
        "!! [\\w_]+",
        "!type [\\w<>\\[\\]\"',]+"
      ]);
      loader.setDefaultLocale("en");
      
      const md = dedent`
        # Title
        
        Some content.
        
        !params
        
        !! parameter_name
        
        !type string
      `;
      
      const result = await loader.pull("en", md);
      
      const placeholderRegex = /---LOCKED-PATTERN-[0-9a-f]+---/g;
      const placeholders = result.match(placeholderRegex) || [];
      expect(placeholders.length).toBe(3); // Three patterns should be replaced
      
      const sanitizedContent = result
        .replace(placeholderRegex, "---PLACEHOLDER---");
      
      const expectedSanitized = dedent`
        # Title
        
        Some content.
        
        ---PLACEHOLDER---
        
        ---PLACEHOLDER---
        
        ---PLACEHOLDER---
      `;
      
      expect(sanitizedContent).toBe(expectedSanitized);
      
      const translated = result
        .replace("# Title", "# Título")
        .replace("Some content.", "Algún contenido.");
      
      const pushed = await loader.push("es", translated);
      
      const expectedPushed = dedent`
        # Título
        
        Algún contenido.
        
        !params
        
        !! parameter_name
        
        !type string
      `;
      
      expect(pushed).toBe(expectedPushed);
    });
  });
  
  describe("Real-world patterns", () => {
    it("should handle !hover syntax in code blocks", async () => {
      const loader = createMdxLockedPatternsLoader([
        "// !hover[\\s\\S]*?(?=\\n|$)",
        "// !hover\\([\\d:]+\\)[\\s\\S]*?(?=\\n|$)"
      ]);
      loader.setDefaultLocale("en");
      
      const md = dedent`
        \`\`\`js
        const x = 1;
        const pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
        \`\`\`
      `;
      
      const result = await loader.pull("en", md);
      
      const placeholderRegex = /---LOCKED-PATTERN-[0-9a-f]+---/g;
      const placeholders = result.match(placeholderRegex) || [];
      expect(placeholders.length).toBe(0); // No patterns should be replaced
      
      const pushed = await loader.push("es", result);
      
      expect(pushed).toBe(md);
    });
    
    it("should handle !! parameter headings", async () => {
      const loader = createMdxLockedPatternsLoader([
        "!! [\\w_]+"
      ]);
      loader.setDefaultLocale("en");
      
      const md = dedent`
        # Parameters
        
        !! pubkey
        
        The public key of the account to query.
        
        !! encoding
        
        Encoding format for the returned Account data.
      `;
      
      const result = await loader.pull("en", md);
      
      const placeholderRegex = /---LOCKED-PATTERN-[0-9a-f]+---/g;
      const placeholders = result.match(placeholderRegex) || [];
      expect(placeholders.length).toBe(2); // Two patterns should be replaced
      
      const sanitizedContent = result
        .replace(placeholderRegex, "---PLACEHOLDER---");
      
      const expectedSanitized = dedent`
        # Parameters
        
        ---PLACEHOLDER---
        
        The public key of the account to query.
        
        ---PLACEHOLDER---
        
        Encoding format for the returned Account data.
      `;
      
      expect(sanitizedContent).toBe(expectedSanitized);
      
      const translated = result
        .replace("# Parameters", "# Parámetros")
        .replace("The public key of the account to query.", "La clave pública de la cuenta a consultar.")
        .replace("Encoding format for the returned Account data.", "Formato de codificación para los datos de la cuenta devueltos.");
      
      const pushed = await loader.push("es", translated);
      
      const expectedPushed = dedent`
        # Parámetros
        
        !! pubkey
        
        La clave pública de la cuenta a consultar.
        
        !! encoding
        
        Formato de codificación para los datos de la cuenta devueltos.
      `;
      
      expect(pushed).toBe(expectedPushed);
    });
    
    it("should handle !type, !required, and !values declarations", async () => {
      const loader = createMdxLockedPatternsLoader([
        "!! [\\w_]+",
        "!type [\\w<>\\[\\]\"',]+",
        "!required",
        "!values [\\s\\S]*?(?=\\n\\n|$)"
      ]);
      loader.setDefaultLocale("en");
      
      const md = dedent`
        !! pubkey
        
        !type string
        !required
        
        The public key of the account to query.
        
        !! encoding
        
        !type string
        !values "base58" (default), "base64", "jsonParsed"
        
        Encoding format for the returned Account data.
      `;
      
      const result = await loader.pull("en", md);
      
      const placeholderRegex = /---LOCKED-PATTERN-[0-9a-f]+---/g;
      const placeholders = result.match(placeholderRegex) || [];
      expect(placeholders.length).toBe(6); // Six patterns should be replaced
      
      const sanitizedContent = result
        .replace(placeholderRegex, "---PLACEHOLDER---");
      
      const expectedSanitized = dedent`
        ---PLACEHOLDER---
        
        ---PLACEHOLDER---
        ---PLACEHOLDER---
        
        The public key of the account to query.
        
        ---PLACEHOLDER---
        
        ---PLACEHOLDER---
        ---PLACEHOLDER---
        
        Encoding format for the returned Account data.
      `;
      
      expect(sanitizedContent).toBe(expectedSanitized);
      
      const translated = result
        .replace("The public key of the account to query.", "La clave pública de la cuenta a consultar.")
        .replace("Encoding format for the returned Account data.", "Formato de codificación para los datos de la cuenta devueltos.");
      
      const pushed = await loader.push("es", translated);
      
      const expectedPushed = dedent`
        !! pubkey
        
        !type string
        !required
        
        La clave pública de la cuenta a consultar.
        
        !! encoding
        
        !type string
        !values "base58" (default), "base64", "jsonParsed"
        
        Formato de codificación para los datos de la cuenta devueltos.
      `;
      
      expect(pushed).toBe(expectedPushed);
    });
  });
});
