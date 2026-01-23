import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { generateSEOScore } from './seo-score.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Extract readable content from the page
 * @param {Object} $ - Cheerio instance
 * @returns {string} - Extracted content
 */
function extractContent($) {
  // Remove script, style, and other non-content elements
  $('script, style, nav, footer, aside, iframe, noscript, link, meta').remove();
  
  // Get text from main content areas
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.main-content',
    '#content',
    '#main',
    'body'
  ];
  
  let content = '';
  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length) {
      content = element.text();
      break;
    }
  }
  
  // Clean up whitespace and return first 1000 characters to save memory
  return content
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 1000);
}

/**
 * Scrapes metadata from a given URL
 * @param {string} url - The URL to scrape
 * @param {Object} options - Scraping options
 * @param {boolean} options.includeContent - Include page content (default: true)
 * @returns {Promise<Object>} - Metadata object
 */
export async function scrapeMetadata(url, options = {}) {
  const { includeContent = true } = options;
  
  // Use lighter browser configuration to reduce memory usage
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one disables sandbox
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Set reasonable viewport and disable images to save memory
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.route('**/*', (route) => {
      const request = route.request();
      if (request.resourceType() === 'image' || request.resourceType() === 'media' || request.resourceType() === 'font') {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    // Set a reasonable timeout and memory limit
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    const html = await page.content();
    
    // Load HTML into cheerio for parsing
    const $ = cheerio.load(html);
    
    // Extract metadata
    const metadata = {
      url: url,
      title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      ogType: $('meta[property="og:type"]').attr('content') || '',
      ogUrl: $('meta[property="og:url"]').attr('content') || '',
      twitterCard: $('meta[name="twitter:card"]').attr('content') || '',
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
      twitterImage: $('meta[name="twitter:image"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
      robots: $('meta[name="robots"]').attr('content') || '',
      h1: $('h1').first().text() || '',
      h2: $('h2').first().text() || '',
      lang: $('html').attr('lang') || 'en',
      language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || 'en',
    };
    
    // Add page content if requested
    if (includeContent) {
      metadata.content = extractContent($);
    }

    // Heuristic language detection from content when html/lang is unreliable
    // Some sites (e.g., social platforms) may set <html lang="en"> but serve
    // localized content (Devanagari for Hindi, Han for Chinese, etc.). Use
    // quick script checks to adjust detected language so translations are
    // triggered correctly.
    try {
      const contentSample = (metadata.content || '').slice(0, 2000);
      function detectLangFromScript(text) {
        if (!text || text.trim().length === 0) return null;

        // Devanagari (Hindi, Marathi, Nepali)
        if (/[\u0900-\u097F]/.test(text)) return 'hi';

        // Han characters (Chinese)
        if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';

        // Cyrillic (Russian, Ukrainian, etc.)
        if (/[\u0400-\u04FF]/.test(text)) return 'ru';

        // Arabic
        if (/[\u0600-\u06FF]/.test(text)) return 'ar';

        // Devanagari fallback for Indic punctuation/spaces
        try {
          if (/\p{Script=Devanagari}/u.test(text)) return 'hi';
        } catch (e) {
          // ignore if environment doesn't support Unicode property escapes
        }

        return null;
      }

      const scriptLang = detectLangFromScript(contentSample);
      if (scriptLang && (!metadata.language || metadata.language === 'en' || (typeof metadata.language === 'string' && metadata.language.startsWith('en-')))) {
        metadata.language = scriptLang;
        metadata.lang = scriptLang;
        // Log a debug message so it's visible in the server logs
        console.log(`[lang-detect] Overriding detected language to: ${scriptLang} based on content script`);
      }
    } catch (e) {
      // Non-fatal - proceed with existing metadata.language
    }
    
    await browser.close();
    return metadata;
  } catch (error) {
    await browser.close();
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
}

/**
 * Scrape metadata and generate SEO quality score
 * @param {string} url - The URL to scrape and score
 * @param {Object} options - Options
 * @param {string} options.primaryKeyword - Primary keyword for SEO analysis
 * @returns {Promise<Object>} - Metadata and SEO score
 */
export async function scrapeAndScore(url, options = {}) {
  const { primaryKeyword = '' } = options;
  
  console.log(`* Scraping: ${url}`);
  
  // Step 1: Scrape metadata (with content)
  const metadata = await scrapeMetadata(url, { includeContent: true });
  console.log('[*] Metadata scraped');
  
  // Step 2: Generate SEO score
  console.log('* Generating SEO score...');
  const seoScoreResult = await generateSEOScore({
    url: metadata.url,
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    ogTags: {
      'og:title': metadata.ogTitle,
      'og:description': metadata.ogDescription,
      'og:image': metadata.ogImage,
      'og:type': metadata.ogType,
      'og:url': metadata.ogUrl
    },
    content: metadata.content,
    language: metadata.language,
    primaryKeyword
  });
  
  if (seoScoreResult.success) {
    console.log(`[*] SEO Score: ${seoScoreResult.analysis.total_score}/100`);
  }
  
  return {
    metadata,
    seoScore: seoScoreResult.analysis,
    timestamp: new Date().toISOString()
  };
}

// Command-line usage (script entrypoint)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const urlIndex = args.findIndex(arg => !arg.startsWith('--'));
  const url = args[urlIndex];
  
  const scoreMode = args.includes('--score') || args.includes('-s');
  const keywordIndex = args.findIndex(arg => arg === '--keyword' || arg === '-k');
  const primaryKeyword = keywordIndex !== -1 ? args[keywordIndex + 1] : '';
  
  if (!url) {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║           GlobSEO Metadata Scraper                    ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Usage:');
    console.log('  node scraper.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --score, -s              Generate SEO quality score');
    console.log('  --keyword, -k <keyword>  Primary keyword for SEO analysis');
    console.log('');
    console.log('Examples:');
    console.log('  node scraper.js https://example.com');
    console.log('  node scraper.js https://example.com --score');
    console.log('  node scraper.js https://example.com -s -k "example domain"');
    console.log('');
    process.exit(1);
  }
  
  const startTime = Date.now();
  
  if (scoreMode) {
    // Scrape and score mode
    scrapeAndScore(url, { primaryKeyword })
      .then(result => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log('');
        console.log('═'.repeat(60));
        console.log('[*] SEO QUALITY SCORE REPORT');
        console.log('═'.repeat(60));
        console.log('');
        console.log(`URL: ${result.metadata.url}`);
        console.log(`Title: ${result.metadata.title}`);
        console.log(`Description: ${result.metadata.description.substring(0, 100)}...`);
        console.log('');
        console.log('Scores:');
        console.log('─'.repeat(60));
        console.log(`  Title Quality:        ${result.seoScore.scores.title_quality}/20 ${'█'.repeat(result.seoScore.scores.title_quality)}`);
        console.log(`  Description Quality:  ${result.seoScore.scores.description_quality}/20 ${'█'.repeat(result.seoScore.scores.description_quality)}`);
        console.log(`  Keyword Optimization: ${result.seoScore.scores.keyword_optimization}/20 ${'█'.repeat(result.seoScore.scores.keyword_optimization)}`);
        console.log(`  Content Alignment:    ${result.seoScore.scores.content_alignment}/20 ${'█'.repeat(result.seoScore.scores.content_alignment)}`);
        console.log(`  Technical SEO:        ${result.seoScore.scores.technical_seo}/20 ${'█'.repeat(result.seoScore.scores.technical_seo)}`);
        console.log('─'.repeat(60));
        console.log(`  [*] TOTAL SCORE:        ${result.seoScore.total_score}/100`);
        
        // Grade
        let grade, emoji;
        if (result.seoScore.total_score >= 90) {
          grade = 'Excellent';
          emoji = '🌟';
        } else if (result.seoScore.total_score >= 75) {
          grade = 'Good';
          emoji = '✅';
        } else if (result.seoScore.total_score >= 60) {
          grade = 'Fair';
          emoji = '⚠️';
        } else {
          grade = 'Needs Improvement';
          emoji = '❌';
        }
        console.log(`  ${emoji} Grade: ${grade}`);
        console.log('');
        
        if (result.seoScore.issues && result.seoScore.issues.length > 0) {
          console.log('🔍 Issues:');
          result.seoScore.issues.forEach((issue, idx) => {
            console.log(`  ${idx + 1}. ${issue}`);
          });
          console.log('');
        }
        
        if (result.seoScore.recommendations && result.seoScore.recommendations.length > 0) {
          console.log('💡 Recommendations:');
          result.seoScore.recommendations.forEach((rec, idx) => {
            console.log(`  ${idx + 1}. ${rec}`);
          });
          console.log('');
        }
        
        console.log('═'.repeat(60));
        console.log(`[TIME] Completed in ${duration}s`);
        console.log('');
        console.log('Full JSON output:');
        console.log(JSON.stringify(result, null, 2));
      })
      .catch(error => {
        console.error('');
        console.error('[ERROR] Error:', error.message);
        console.error('');
        process.exit(1);
      });
  } else {
    // Standard scrape mode
    scrapeMetadata(url)
      .then(metadata => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log('');
        console.log('[OK] Metadata scraped successfully');
        console.log(`[TIME] Completed in ${duration}s`);
        console.log('');
        console.log(JSON.stringify(metadata, null, 2));
      })
      .catch(error => {
        console.error('');
        console.error('[ERROR] Error:', error.message);
        console.error('');
        process.exit(1);
      });
  }
}

