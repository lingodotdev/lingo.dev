
// Read and execute the utility directly
import { pseudoLocalize, pseudoLocalizeObject } from "./src/utils/pseudo-localize.ts";

console.log("\n");
console.log("╔════════════════════════════════════════════════════════════════════════════╗");
console.log("║                                                                            ║");
console.log("║           🎭 PSEUDO-LOCALIZATION FEATURE DEMO                             ║");
console.log("║                                                                            ║");
console.log("╚════════════════════════════════════════════════════════════════════════════╝");
console.log("\n");

// Demo 1: Simple strings
console.log("📋 DEMO 1: Simple String Transformation");
console.log("─".repeat(76));

const examples = [
  "Submit",
  "Welcome back!",
  "Cancel",
  "Login",
  "Sign Up"
];

examples.forEach(str => {
  const pseudo = pseudoLocalize(str);
  console.log(`  Original:  "${str}"`);
  console.log(`  Pseudo:    "${pseudo}"`);
  console.log();
});

// Demo 2: Object with nested data
console.log("\n📋 DEMO 2: Object Pseudo-Localization");
console.log("─".repeat(76));

const messages = {
  ui: {
    buttons: {
      submit: "Submit",
      cancel: "Cancel"
    },
    labels: {
      email: "Email Address",
      password: "Password"
    }
  },
  messages: {
    welcome: "Welcome!",
    error: "An error occurred"
  }
};

console.log("\n  Original Object:");
console.log("  " + JSON.stringify(messages, null, 2).split("\n").join("\n  "));

const pseudo_messages = pseudoLocalizeObject(messages);
console.log("\n  Pseudo-Localized Object:");
console.log("  " + JSON.stringify(pseudo_messages, null, 2).split("\n").join("\n  "));

// Demo 3: Character mapping
console.log("\n\n📋 DEMO 3: Character Mapping");
console.log("─".repeat(76));

console.log("\n  Lowercase (a-z):");
const lowerStr = "abcdefghijklmnopqrstuvwxyz";
const lowerPseudo = pseudoLocalize(lowerStr, { addMarker: false });
console.log("    " + lowerStr);
console.log("    " + lowerPseudo);

console.log("\n  Uppercase (A-Z):");
const upperStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const upperPseudo = pseudoLocalize(upperStr, { addMarker: false });
console.log("    " + upperStr);
console.log("    " + upperPseudo);

console.log("\n  With numbers and punctuation:");
const mixed = "Hello 123 World!";
const mixedPseudo = pseudoLocalize(mixed);
console.log("    " + mixed);
console.log("    " + mixedPseudo);

// Demo 4: Real-world example
console.log("\n\n📋 DEMO 4: Real-World E-Commerce Example");
console.log("─".repeat(76));

const ecommerce = {
  title: "Welcome to Our Store",
  description: "Find amazing products at great prices",
  price: "Free shipping on orders over $50!",
  buttons: {
    browse: "Browse Products",
    addCart: "Add to Cart",
    checkout: "Proceed to Checkout"
  }
};

console.log("\n  ORIGINAL:\n");
console.log("    Title:       " + ecommerce.title);
console.log("    Description: " + ecommerce.description);
console.log("    Price Info:  " + ecommerce.price);
console.log("    Buttons:");
console.log("      - " + ecommerce.buttons.browse);
console.log("      - " + ecommerce.buttons.addCart);
console.log("      - " + ecommerce.buttons.checkout);

const ecommercePseudo = pseudoLocalizeObject(ecommerce);
console.log("\n  PSEUDO-LOCALIZED:\n");
console.log("    Title:       " + ecommercePseudo.title);
console.log("    Description: " + ecommercePseudo.description);
console.log("    Price Info:  " + ecommercePseudo.price);
console.log("    Buttons:");
console.log("      - " + ecommercePseudo.buttons.browse);
console.log("      - " + ecommercePseudo.buttons.addCart);
console.log("      - " + ecommercePseudo.buttons.checkout);

console.log("\n\n✨ WHAT YOU'RE SEEING:");
console.log("─".repeat(76));
console.log("  ✅ All characters replaced with accented versions");
console.log("  ✅ ⚡ marker at the end of each string (pseudo indicator)");
console.log("  ✅ Text noticeably longer (simulates language expansion)");
console.log("  ✅ Numbers and punctuation preserved");
console.log("  ✅ Nested object structure maintained");

console.log("\n\n🎯 USE CASES:");
console.log("─".repeat(76));
console.log("  • Detect truncated text in UI elements");
console.log("  • Find layout overflow issues");
console.log("  • Test font support for accented characters");
console.log("  • Verify responsive design with longer text");
console.log("  • Catch hardcoded strings that should be translatable");

console.log("\n\n🚀 READY TO TEST WITH CLI?");
console.log("─".repeat(76));
console.log("  Run: pnpx lingo.dev run --pseudo");
console.log("  This will pseudo-localize all your i18n strings");
console.log("\n");
