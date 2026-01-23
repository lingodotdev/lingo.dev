#!/usr/bin/env node

/**
 * Complete Pipeline: Scrape, Translate, and Export Metadata
 * This script combines scraping and translation into a single workflow
 */

import { scrapeMetadata } from './utils/scraper.js';
import { processMetadataTranslations, updateI18nFiles } from './utils/lingo-translate.js';
import fs from 'fs';
import path from 'path';

/**
 * Complete scrape and translate pipeline
 * @param {string} url - URL to scrape
 * @param {Array<string>} targetLanguages - Languages to translate to
 * @param {Object} options - Additional options
 */
async function runPipeline(url, targetLanguages, options = {}) {
  const startTime = Date.now();
  
  console.log('>> Starting metadata scraping and translation pipeline...\n');
  console.log(`>> URL: ${url}`);
  console.log(`>> Target Languages: ${targetLanguages.join(', ')}\n`);

  try {
    // Step 1: Scrape metadata
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 1: Scraping Metadata');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const metadata = await scrapeMetadata(url);
    console.log('[*] Metadata scraped successfully!\n');
    
    if (options.verbose) {
      console.log('Scraped metadata:');
      console.log(JSON.stringify(metadata, null, 2));
      console.log('');
    }

    // Step 2: Translate metadata
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: Translating Metadata');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const translations = await processMetadataTranslations(metadata, targetLanguages);
    console.log('\n[*] All translations completed!\n');

    // Step 3: Update i18n files (if not disabled)
    if (!options.skipI18nUpdate) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('STEP 3: Updating i18n Files');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      updateI18nFiles(translations);
      console.log('\n[*] i18n files updated!\n');
    }

    // Step 4: Save results
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 4: Saving Results');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const result = {
      url,
      original: metadata,
      translations,
      targetLanguages,
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime
    };

    // Save to output directory
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(outputDir, `metadata-${timestamp}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    
    console.log(`** Results saved to: ${outputFile}\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[*] PIPELINE COMPLETED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`* Total time: ${(Date.now() - startTime) / 1000}s`);
    console.log(`🌐 URL: ${url}`);
    console.log(`* Original language: ${metadata.lang || 'unknown'}`);
    console.log(`* Translations: ${targetLanguages.length} languages`);
    console.log(`* Output: ${outputFile}\n`);

    return result;
  } catch (error) {
    console.error('\n[ERROR] Pipeline failed:', error.message);
    console.error(error.stack);
    throw error;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  const options = {
    url: null,
    languages: [],
    verbose: false,
    skipI18nUpdate: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--skip-i18n') {
      options.skipI18nUpdate = true;
    } else if (arg === '--languages' || arg === '-l') {
      i++;
      options.languages = args[i].split(',').map(l => l.trim());
    } else if (!options.url) {
      options.url = arg;
    } else {
      options.languages.push(arg);
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
🌍 GlobSEO - Metadata Scraper & Translator

USAGE:
  node pipeline.js <url> [languages...] [options]

ARGUMENTS:
  url                    The URL to scrape metadata from

OPTIONS:
  -l, --languages <list> Comma-separated list of target languages
  -v, --verbose          Show detailed output
  --skip-i18n            Don't update i18n files in frontend
  -h, --help             Show this help message

EXAMPLES:
  # Scrape and translate to Spanish and French
  node pipeline.js https://example.com es fr

  # Use comma-separated languages
  node pipeline.js https://example.com -l es,fr,de

  # Verbose output
  node pipeline.js https://example.com es fr --verbose

  # Skip i18n file updates
  node pipeline.js https://example.com es --skip-i18n

OUTPUT:
  Results are saved to: ./output/metadata-<timestamp>.json
  i18n files updated in: ../frontend/i18n/
`);
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (!options.url) {
    console.error('[ERROR] Error: URL is required\n');
    showHelp();
    process.exit(1);
  }

  // Use default languages if none specified
  if (options.languages.length === 0) {
    options.languages = ['es', 'fr'];
    console.log(`[INFO] No languages specified, using defaults: ${options.languages.join(', ')}\n`);
  }

  try {
    await runPipeline(options.url, options.languages, options);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runPipeline };
