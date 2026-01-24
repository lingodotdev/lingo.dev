export default function SimpleComponent() {
    return (
      <div>
        <h1>Welcome to our platform</h1>
        <p>Get started with zero configuration</p>
        <button>Sign Up Now</button>
      </div>
    );
  }
  
  // That's it! No t() functions, no translation keys, nothing.
  // When you build with Lingo.dev Compiler:
  // 1. It parses this JSX
  // 2. Detects: "Welcome to our platform", "Get started...", "Sign Up Now"
  // 3. Generates translations automatically
  // 4. Injects translation lookups at build time
  // 5. Creates optimized bundles for each language
  
  
  