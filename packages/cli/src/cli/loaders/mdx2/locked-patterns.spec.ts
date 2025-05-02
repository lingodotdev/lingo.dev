import { describe, it, expect } from "vitest";
import createMdxLockedPatternsLoader from "./locked-patterns";
import dedent from "dedent";

describe("MDX Locked Patterns Loader", () => {
  describe("Basic functionality", () => {
    it("should preserve content matching patterns", async () => {
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
      
      expect(result.content).toContain("# Title");
      expect(result.content).toContain("Some content.");
      expect(result.content).not.toContain("!params");
      expect(result.content).not.toContain("!! parameter_name");
      expect(result.content).not.toContain("!type string");
      expect(result.content).toMatch(/---LOCKED-PATTERN-[0-9a-f]+---/);
      
      const translated = {
        ...result,
        content: result.content
          .replace("# Title", "# Título")
          .replace("Some content.", "Algún contenido.")
      };
      
      const pushed = await loader.push("es", translated);
      
      expect(pushed).toContain("# Título");
      expect(pushed).toContain("Algún contenido.");
      expect(pushed).toContain("!params");
      expect(pushed).toContain("!! parameter_name");
      expect(pushed).toContain("!type string");
    });
  });
  
  describe("Real-world patterns", () => {
    it("should handle !hover syntax in code blocks", async () => {
      const loader = createMdxLockedPatternsLoader();
      loader.setDefaultLocale("en");
      
      const md = dedent`
        \`\`\`js
        const x = 1;
        const pubkey = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";
        \`\`\`
      `;
      
      const result = await loader.pull("en", md);
      
      expect(result.content).toContain("const x = 1;");
      expect(result.content).not.toContain("// !hover pubkey");
      expect(result.content).toMatch(/---LOCKED-PATTERN-[0-9a-f]+---/);
      
      const pushed = await loader.push("es", result);
      
      expect(pushed).toContain("const x = 1;");
      expect(pushed).toContain("// !hover pubkey");
    });
    
    it("should handle !! parameter headings", async () => {
      const loader = createMdxLockedPatternsLoader();
      loader.setDefaultLocale("en");
      
      const md = dedent`
        # Parameters
        
        !! pubkey
        
        The public key of the account to query.
        
        !! encoding
        
        Encoding format for the returned Account data.
      `;
      
      const result = await loader.pull("en", md);
      
      expect(result.content).toContain("# Parameters");
      expect(result.content).not.toContain("!! pubkey");
      expect(result.content).not.toContain("!! encoding");
      expect(result.content).toContain("The public key of the account to query.");
      expect(result.content).toContain("Encoding format for the returned Account data.");
      
      const translated = {
        ...result,
        content: result.content
          .replace("# Parameters", "# Parámetros")
          .replace("The public key of the account to query.", "La clave pública de la cuenta a consultar.")
          .replace("Encoding format for the returned Account data.", "Formato de codificación para los datos de la cuenta devueltos.")
      };
      
      const pushed = await loader.push("es", translated);
      
      expect(pushed).toContain("# Parámetros");
      expect(pushed).toContain("!! pubkey");
      expect(pushed).toContain("!! encoding");
      expect(pushed).toContain("La clave pública de la cuenta a consultar.");
      expect(pushed).toContain("Formato de codificación para los datos de la cuenta devueltos.");
    });
    
    it("should handle !type, !required, and !values declarations", async () => {
      const loader = createMdxLockedPatternsLoader();
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
      
      expect(result.content).toContain("!! pubkey");
      expect(result.content).not.toContain("!type string");
      expect(result.content).not.toContain("!required");
      expect(result.content).toContain("The public key of the account to query.");
      expect(result.content).toContain("!! encoding");
      expect(result.content).not.toContain('!values "base58" (default), "base64", "jsonParsed"');
      
      const translated = {
        ...result,
        content: result.content
          .replace("The public key of the account to query.", "La clave pública de la cuenta a consultar.")
          .replace("Encoding format for the returned Account data.", "Formato de codificación para los datos de la cuenta devueltos.")
      };
      
      const pushed = await loader.push("es", translated);
      
      expect(pushed).toContain("!! pubkey");
      expect(pushed).toContain("!type string");
      expect(pushed).toContain("!required");
      expect(pushed).toContain("La clave pública de la cuenta a consultar.");
      expect(pushed).toContain("!! encoding");
      expect(pushed).toContain('!values "base58" (default), "base64", "jsonParsed"');
      expect(pushed).toContain("Formato de codificación para los datos de la cuenta devueltos.");
    });
  });
});
