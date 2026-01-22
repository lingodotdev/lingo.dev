import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Interface for Pull Request content
 */
interface PRContent {
    title: string;
    description: string;
    comment: {
        review: string;
    };
}

/**
 * Interface for localized content structure
 */
interface LocalizedContent {
    pr: PRContent;
    pr_updated: PRContent;
}

/**
 * Loads localized content for a specific locale
 * @param locale - The locale code (e.g., 'en', 'es', 'fr', 'de')
 * @returns Parsed localized content
 */
export function loadLocale(locale: string): LocalizedContent {
    const localePath = join(__dirname, '..', 'locales', `${locale}.json`);
    const content = readFileSync(localePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Displays a Pull Request in a specific language
 * @param locale - The locale code
 * @param version - 'original' or 'updated'
 */
export function displayPR(locale: string, version: 'original' | 'updated' = 'original'): void {
    const content = loadLocale(locale);
    const pr = version === 'original' ? content.pr : content.pr_updated;

    const languageNames: Record<string, string> = {
        en: 'English',
        es: 'Spanish (Español)',
        fr: 'French (Français)',
        de: 'German (Deutsch)'
    };

    console.log(`\n${'='.repeat(80)}`);
    console.log(`Language: ${languageNames[locale] || locale.toUpperCase()}`);
    console.log(`Version: ${version === 'original' ? 'Original' : 'Updated'}`);
    console.log(`${'='.repeat(80)}\n`);

    console.log(`📋 TITLE:`);
    console.log(`   ${pr.title}\n`);

    console.log(`📝 DESCRIPTION:`);
    console.log(`   ${pr.description}\n`);

    console.log(`💬 REVIEW COMMENT:`);
    console.log(`   ${pr.comment.review}\n`);
}

/**
 * Gets available locales
 */
export function getAvailableLocales(): string[] {
    return ['en', 'es', 'fr', 'de'];
}
