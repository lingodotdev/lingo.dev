import { describe, it, expect } from "vitest";
import createEjsLoader from "./ejs";

describe("EJS Loader", () => {
  const loader = createEjsLoader().setDefaultLocale("en");

  describe("pull", () => {
    it("should extract translatable text from simple EJS template", async () => {
      const input = `
        <h1>Welcome to our website</h1>
        <p>Hello <%= name %>, you have <%= messages.length %> messages.</p>
        <footer>© 2024 Our Company</footer>
      `;

      const result = await loader.pull("en", input);
      
      // Check that we have extracted some translatable content
      expect(Object.keys(result).length).toBeGreaterThan(0);
      
      // Check that the EJS variables are not included in the translatable text
      const allValues = Object.values(result).join(' ');
      expect(allValues).not.toContain('<%= name %>');
      expect(allValues).not.toContain('<%= messages.length %>');
      
      // Check that we have the main content
      expect(allValues).toContain('Welcome to our website');
      expect(allValues).toContain('Hello');
      expect(allValues).toContain('messages');
      expect(allValues).toContain('© 2024 Our Company');
    });

    it("should handle EJS templates with various tag types", async () => {
      const input = `
        <div>
          <h2>User Dashboard</h2>
          <% if (user.isAdmin) { %>
            <p>Admin Panel</p>
          <% } %>
          <%# This is a comment %>
          <p>Welcome back, <%- user.name %></p>
          <span>Last login: <%= formatDate(user.lastLogin) %></span>
        </div>
      `;

      const result = await loader.pull("en", input);
      
      expect(result).toHaveProperty("text_0");
      expect(result).toHaveProperty("text_1");
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it("should handle empty input", async () => {
      const result = await loader.pull("en", "");
      expect(result).toEqual({});
    });

    it("should handle input with only EJS tags", async () => {
      const input = "<%= variable %><% if (condition) { %><% } %>";
      const result = await loader.pull("en", input);
      expect(result).toEqual({});
    });

    it("should handle mixed content", async () => {
      const input = `
        Welcome <%= user.name %>!
        <% for (let i = 0; i < items.length; i++) { %>
          Item: <%= items[i].name %>
        <% } %>
        Thank you for visiting.
      `;

      const result = await loader.pull("en", input);
      expect(Object.keys(result).length).toBeGreaterThan(0);
      expect(Object.values(result).some(text => text.includes("Welcome"))).toBe(true);
      expect(Object.values(result).some(text => text.includes("Thank you"))).toBe(true);
    });
  });

  describe("push", () => {
    it("should reconstruct EJS template with translated content", async () => {
      const originalInput = `<h1>Welcome</h1><p>Hello <%= name %></p>`;

      // First pull to get the structure
      const pulled = await loader.pull("en", originalInput);
      
      // Static translated data object based on actual loader behavior
      const translated = {
        text_0: "Bienvenido",
        text_1: "Hola"
      };

      const result = await loader.push("es", translated);
      
      // Test against the expected reconstructed string
      const expectedOutput = `<h1>Bienvenido</h1><p>Hola <%= name %></p>`;
      
      expect(result).toBe(expectedOutput);
    });

    it("should handle complex EJS templates", async () => {
      const originalInput = `<h2>Dashboard</h2><% if (user) { %><p>Welcome</p><% } %>`;

      const pulled = await loader.pull("en", originalInput);
      
      // Static translated data object 
      const translated = {
        text_0: "Tablero",
        text_1: "Bienvenido"
      };

      const result = await loader.push("es", translated);
      
      // Test against the expected reconstructed string
      const expectedOutput = `<h2>Tablero</h2><% if (user) { %><p>Bienvenido</p><% } %>`;
      
      expect(result).toBe(expectedOutput);
    });

    it("should handle missing original input", async () => {
      const translated = {
        text_0: "Hello World",
        text_1: "This is a test"
      };

      const result = await loader.push("es", translated);
      
      expect(result).toContain("Hello World");
      expect(result).toContain("This is a test");
    });
  });

  describe("round trip", () => {
    it("should maintain EJS functionality after round trip", async () => {
      const originalInput = `
        <h1>Welcome <%= title %></h1>
        <% if (showMessage) { %>
          <p>Hello <%= user.name %>, you have <%= count %> new messages.</p>
        <% } %>
        <ul>
          <% items.forEach(function(item) { %>
            <li><%= item.name %> - $<%= item.price %></li>
          <% }); %>
        </ul>
        <footer>Contact us at info@company.com</footer>
      `;

      // Pull original content
      const pulled = await loader.pull("en", originalInput);
      
      // Push back without translation (should be identical)
      const reconstructed = await loader.push("en", pulled);
      
      // Verify EJS tags are preserved
      expect(reconstructed).toContain("<%= title %>");
      expect(reconstructed).toContain("<% if (showMessage) { %>");
      expect(reconstructed).toContain("<%= user.name %>");
      expect(reconstructed).toContain("<%= count %>");
      expect(reconstructed).toContain("<% items.forEach(function(item) { %>");
      expect(reconstructed).toContain("<%= item.name %>");
      expect(reconstructed).toContain("<%= item.price %>");
      expect(reconstructed).toContain("<% }); %>");
      expect(reconstructed).toContain("Contact us at info@company.com");
    });
  });
});
