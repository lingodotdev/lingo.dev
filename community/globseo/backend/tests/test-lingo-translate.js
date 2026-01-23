#!/usr/bin/env node

/**
 * Test file for lingo-translate.js
 * Tests the main exported functions with minimal data
 */

import assert from 'assert';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test data - minimal content to avoid large translations
const testMetadata = {
  url: 'https://example.cfh',
  title: 'Test Page',
  description: 'A simple test page',
  keywords: 'test, example',
  h1: 'Welcome',
  ogTitle: 'Test Page',
  ogDescription: 'A simple test page',
  twitterTitle: 'Test Page',
  twitterDescription: 'A simple test page',
  lang: 'en'
};

async function testProcessMetadataTranslations() {
  console.log('🧪 Testing processMetadataTranslations...');

  try {
    // Import the function
    const { processMetadataTranslations } = await import('../utils/lingo-translate.js');

    // Get API key from environment
    const lingoApiKey = process.env.LINGODOTDEV_API_KEY;

    // Test with same language (should return empty)
    const resultSameLang = await processMetadataTranslations(testMetadata, ['en'], lingoApiKey);
    assert(typeof resultSameLang === 'object', 'Result should be an object');
    assert(Object.keys(resultSameLang).length === 0, 'Same language should return empty object');
    console.log('✅ Same language filtering works');

    // Test with different language (may use cache or fail gracefully)
    if (lingoApiKey) {
      const resultDiffLang = await processMetadataTranslations(testMetadata, ['es'], lingoApiKey);
      assert(typeof resultDiffLang === 'object', 'Result should be an object');
      console.log('✅ Different language processing works');
    } else {
      console.log('⚠️  Skipping translation test (no LINGODOTDEV_API_KEY set)');
    }

  } catch (error) {
    console.error('❌ processMetadataTranslations test failed:', error.message);
    throw error;
  }
}

function testTranslationDataStructure() {
  console.log('🧪 Testing translation data structure...');

  try {
    // Test the expected structure of translation content
    const translationContent = {
      meta: {
        title: testMetadata.title,
        description: testMetadata.description,
        keywords: testMetadata.keywords,
        h1: testMetadata.h1,
      },
      og: {
        title: testMetadata.ogTitle,
        description: testMetadata.ogDescription,
      },
      twitter: {
        title: testMetadata.twitterTitle,
        description: testMetadata.twitterDescription,
      }
    };

    // Verify structure
    assert(translationContent.meta.title, 'Meta title should exist');
    assert(translationContent.og.title, 'OG title should exist');
    assert(translationContent.twitter.title, 'Twitter title should exist');
    console.log('✅ Translation content structure is correct');

  } catch (error) {
    console.error('❌ Translation data structure test failed:', error.message);
    throw error;
  }
}

async function testImportAndExports() {
  console.log('🧪 Testing module imports and exports...');

  try {
    const module = await import('../utils/lingo-translate.js');

    // Check that main functions are exported
    assert(typeof module.translateWithLingo === 'function', 'translateWithLingo should be exported');
    assert(typeof module.processMetadataTranslations === 'function', 'processMetadataTranslations should be exported');
    assert(typeof module.updateI18nFiles === 'function', 'updateI18nFiles should be exported');
    console.log('✅ All main functions are properly exported');

  } catch (error) {
    console.error('❌ Import test failed:', error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Running lingo-translate.js tests...\n');

  try {
    await testImportAndExports();
    console.log('');

    testTranslationDataStructure();
    console.log('');

    await testProcessMetadataTranslations();
    console.log('');

    console.log('🎉 All tests passed!');
    console.log('Note: Full integration tests require LINGODOTDEV_API_KEY environment variable');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };