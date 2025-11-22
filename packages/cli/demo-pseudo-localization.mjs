/**
 * Pseudo-Localization Feature Demo
 * 
 * This script demonstrates how the pseudo-localization feature works
 * by showing the transformation of various English strings to their
 * pseudo-localized equivalents.
 */

// Import the pseudo-localization utility
import { pseudoLocalize, pseudoLocalizeObject } from "../build/cli.mjs";

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

// Demo 3: Character mapping reference
console.log("\n\n📋 DEMO 3: Character Mapping Reference");
console.log("─".repeat(76));

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const mapped = pseudoLocalize(alphabet.toLowerCase(), { addMarker: false }) + 
               pseudoLocalize(alphabet.toUpperCase(), { addMarker: false });

console.log("\n  Lowercase:");
console.log("    Original: a b c d e f g h i j k l m n o p q r s t u v w x y z");
console.log("    Pseudo:   " + pseudoLocalize("abcdefghijklmnopqrstuvwxyz", { addMarker: false }).split("").join(" "));

console.log("\n  Uppercase:");
console.log("    Original: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z");
console.log("    Pseudo:   " + pseudoLocalize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", { addMarker: false }).split("").join(" "));

// Demo 4: Real-world example
console.log("\n\n📋 DEMO 4: Real-World Example");
console.log("─".repeat(76));

const realWorld = {
  title: "Welcome to Our Store",
  description: "Find amazing products at great prices",
  buttons: {
    browse: "Browse Products",
    addCart: "Add to Cart",
    checkout: "Proceed to Checkout"
  },
  info: "Free shipping on orders over $50!"
};

console.log("\n  E-Commerce Page Content (Original):\n");
Object.entries(realWorld).forEach(([key, value]) => {
  if (typeof value === 'object') {
    console.log(`  ${key}:`);
    Object.entries(value).forEach(([k, v]) => {
      console.log(`    ${k}: "${v}"`);
    });
  } else {
    console.log(`  ${key}: "${value}"`);
  }
});

const realWorldPseudo = pseudoLocalizeObject(realWorld);
console.log("\n  E-Commerce Page Content (Pseudo-Localized):\n");
Object.entries(realWorldPseudo).forEach(([key, value]) => {
  if (typeof value === 'object') {
    console.log(`  ${key}:`);
    Object.entries(value).forEach(([k, v]) => {
      console.log(`    ${k}: "${v}"`);
    });
  } else {
    console.log(`  ${key}: "${value}"`);
  }
});

console.log("\n\n✨ KEY OBSERVATIONS:");
console.log("─".repeat(76));
console.log("  ✅ All characters are accented/replaced");
console.log("  ✅ Text is visibly longer (simulates language expansion)");
console.log("  ✅ ⚡ marker indicates pseudo-translation");
console.log("  ✅ Numbers and punctuation are preserved");
console.log("  ✅ Structure of objects/arrays is maintained");
console.log("\n  Use this to test:");
console.log("  • Text truncation and overflow");
console.log("  • Layout responsiveness");
console.log("  • Font support for special characters");
console.log("  • String concatenation issues");
console.log("\n");
