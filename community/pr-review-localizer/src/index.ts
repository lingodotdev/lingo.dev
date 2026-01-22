import { displayPR, getAvailableLocales } from './pr-content.js';

/**
 * PR Review Localizer Demo
 * 
 * This demo shows how Lingo.dev enables version-controlled, automated localization
 * for GitHub Pull Request content across multiple languages.
 */

console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                         PR REVIEW LOCALIZER DEMO                              ║');
console.log('║                    Powered by Lingo.dev Localization                          ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

console.log('This demo demonstrates how Lingo.dev automatically localizes GitHub Pull Request');
console.log('content into multiple languages, keeping translations in sync with source changes.\n');

// Display original PR in all languages
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('                    SCENARIO 1: Original Pull Request');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const locales = getAvailableLocales();

for (const locale of locales) {
    displayPR(locale, 'original');
}

// Display updated PR in all languages
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('                SCENARIO 2: Updated Pull Request (Content Evolution)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nThe PR has been updated with OAuth2 support and RBAC.');
console.log('Notice how Lingo.dev automatically updates ALL translations! 🚀\n');

for (const locale of locales) {
    displayPR(locale, 'updated');
}

console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                              KEY TAKEAWAYS                                    ║');
console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
console.log('║  ✓ English source file (en.json) is the single source of truth               ║');
console.log('║  ✓ Lingo.dev automatically generates translations (es, fr, de)               ║');
console.log('║  ✓ When en.json changes, Lingo.dev updates all translations                  ║');
console.log('║  ✓ All localized files are version-controlled in Git                         ║');
console.log('║  ✓ Zero manual translation maintenance required                              ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

console.log('🌍 This enables global development teams to collaborate in their native language!');
console.log('🔄 Powered by Lingo.dev - Automated, version-controlled localization.\n');
