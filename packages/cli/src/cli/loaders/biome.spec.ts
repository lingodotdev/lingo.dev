import { describe, expect, it } from "vitest";
import createBiomeLoader from "./biome";
import dedent from "dedent";

describe("biome loader", () => {
  it("should format JavaScript content", async () => {
    const input = dedent`
      function   foo(  )  {
        console.log(  "hello world"   );
      }
    `;

    const loader = createBiomeLoader({ 
      parser: "js", 
      bucketPathPattern: "/test/[locale]/test.js" 
    });
    
    loader.setDefaultLocale("en");
    
    const result = await loader.pull("en", input);
    
    expect(result).not.toBe(input);
    expect(result).toContain("function foo()");
    expect(result).toContain('console.log("hello world")');
  });

  it("should format TypeScript content", async () => {
    const input = dedent`
      function   foo(  x  :  string  )  :  void  {
        console.log(  x   );
      }
    `;

    const loader = createBiomeLoader({ 
      parser: "ts", 
      bucketPathPattern: "/test/[locale]/test.ts" 
    });
    
    loader.setDefaultLocale("en");
    
    const result = await loader.pull("en", input);
    
    expect(result).not.toBe(input);
    expect(result).toContain("function foo(x: string): void");
  });

  it("should format JSON content", async () => {
    const input = dedent`
      {  "foo"  :  "bar",
      "baz":      [   1,  2,    3 ]  }
    `;

    const loader = createBiomeLoader({ 
      parser: "json", 
      bucketPathPattern: "/test/[locale]/test.json" 
    });
    
    loader.setDefaultLocale("en");
    
    const result = await loader.pull("en", input);
    
    expect(result).not.toBe(input);
    expect(result).toContain('"foo": "bar"');
  });

  it("should not format when stage is push and operation is pull", async () => {
    const input = dedent`
      function   foo(  )  {
        console.log(  "hello world"   );
      }
    `;

    const loader = createBiomeLoader({ 
      parser: "js", 
      bucketPathPattern: "/test/[locale]/test.js",
      stage: "push"
    });
    
    loader.setDefaultLocale("en");
    
    const result = await loader.pull("en", input);
    
    expect(result).toBe(input);
  });

  it("should not format when stage is pull and operation is push", async () => {
    const input = dedent`
      function   foo(  )  {
        console.log(  "hello world"   );
      }
    `;

    const loader = createBiomeLoader({ 
      parser: "js", 
      bucketPathPattern: "/test/[locale]/test.js",
      stage: "pull"
    });
    
    loader.setDefaultLocale("en");
    
    await loader.pull("en", input);
    const result = await loader.push("en", input);
    
    expect(result).toBe(input);
  });

  it("should handle empty input", async () => {
    const input = "";

    const loader = createBiomeLoader({ 
      parser: "js", 
      bucketPathPattern: "/test/[locale]/test.js" 
    });
    
    loader.setDefaultLocale("en");
    
    const result = await loader.pull("en", input);
    
    expect(result).toBe(input);
  });
});
