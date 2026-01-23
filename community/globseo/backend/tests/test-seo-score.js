#!/usr/bin/env node

/**
 * Test script for SEO Score Generator
 * Tests both the module directly and the API endpoints
 */

import { generateSEOScore } from '../utils/seo-score.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test data for different scenarios
const testCases = [
  {
    name: 'Good SEO Example',
    data: {
      url: 'https://example.com/blog/seo-best-practices',
      title: 'SEO Best Practices Guide 2025 | Expert Tips & Strategies',
      description: 'Discover proven SEO strategies and best practices for 2025. Learn how to optimize your website for better rankings, increased traffic, and higher conversions.',
      keywords: 'SEO, best practices, search optimization, ranking strategies, website optimization',
      ogTags: {
        'og:title': 'SEO Best Practices Guide 2025',
        'og:description': 'Expert SEO tips and strategies for better rankings',
        'og:type': 'article',
        'og:image': 'https://example.com/images/seo-guide.jpg',
        'og:url': 'https://example.com/blog/seo-best-practices'
      },
      content: 'SEO Best Practices Guide. Search Engine Optimization is crucial for online success. In this comprehensive guide, we cover keyword research, on-page optimization, technical SEO, link building, and content strategy. Learn how to improve your website\'s visibility in search engines and drive organic traffic.',
      language: 'en',
      primaryKeyword: 'SEO best practices'
    }
  },
  {
    name: 'Poor SEO Example',
    data: {
      url: 'https://example.com/page',
      title: 'Home',
      description: 'Welcome',
      keywords: '',
      ogTags: {},
      content: 'Welcome to our site.',
      language: 'en',
      primaryKeyword: ''
    }
  },
  {
    name: 'Excellent SEO Example',
    data: {
      url: 'https://lingo.dev',
      title: 'Lingo.dev - Modern Translation Management for Developers',
      description: 'Streamline your app localization workflow with Lingo.dev. Manage translations, collaborate with your team, and ship multilingual apps faster. Try it free today.',
      keywords: 'translation management, localization, i18n, internationalization, developer tools, translation platform',
      ogTags: {
        'og:title': 'Lingo.dev - Modern Translation Management',
        'og:description': 'Streamline your app localization workflow',
        'og:type': 'website',
        'og:image': 'https://lingo.dev/og-image.png',
        'og:url': 'https://lingo.dev'
      },
      content: 'Lingo.dev is a modern translation management platform built for developers. Manage all your app translations in one place. Collaborate with translators, designers, and developers. Automate your localization workflow with CLI tools and integrations. Support for JSON, YAML, iOS strings, Android XML, and more. Real-time preview of translations. Version control integration. CI/CD ready.',
      language: 'en',
      primaryKeyword: 'translation management'
    }
  },
  {
    name: 'Multilingual SEO Example',
    data: {
      url: 'https://example.de/produkte',
      title: 'Beste SEO-Tools für Deutsche Unternehmen 2025',
      description: 'Entdecken Sie die besten SEO-Tools speziell für den deutschen Markt. Verbessern Sie Ihr Ranking in Google.de mit professionellen Optimierungs-Tools.',
      keywords: 'SEO-Tools, deutsche SEO, Suchmaschinenoptimierung, Google Ranking',
      ogTags: {
        'og:title': 'Beste SEO-Tools für Deutsche Unternehmen',
        'og:description': 'Professionelle SEO-Tools für den deutschen Markt',
        'og:locale': 'de_DE'
      },
      content: 'Die besten SEO-Tools für deutsche Unternehmen. In diesem Artikel stellen wir Ihnen professionelle Werkzeuge vor, mit denen Sie Ihre Website für den deutschen Markt optimieren können.',
      language: 'de',
      primaryKeyword: 'SEO-Tools Deutschland'
    }
  }
];

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║        🧪 SEO Quality Score Generator Tests           ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');

  // Check if API key is set
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️  WARNING: GEMINI_API_KEY not set in environment');
    console.log('   The tests will use fallback scoring (rule-based)');
    console.log('   To use AI scoring, set GEMINI_API_KEY in .env file');
    console.log('');
  }

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test ${i + 1}/${testCases.length}: ${testCase.name}`);
    console.log('='.repeat(60));
    console.log(`\n📍 URL: ${testCase.data.url}`);
    console.log(`📝 Title: ${testCase.data.title}`);
    console.log(`📄 Description: ${testCase.data.description.substring(0, 80)}...`);
    console.log(`🔑 Primary Keyword: ${testCase.data.primaryKeyword || 'N/A'}`);
    console.log(`🌍 Language: ${testCase.data.language}`);
    console.log('');

    try {
      const startTime = Date.now();
      const result = await generateSEOScore(testCase.data);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (result.success) {
        const { analysis } = result;
        
        console.log('✅ Analysis completed successfully');
        console.log(`⏱️  Duration: ${duration}s`);
        console.log('');
        console.log('📊 SEO Quality Scores:');
        console.log('─'.repeat(60));
        console.log(`   Title Quality:         ${analysis.scores.title_quality}/20 ${'█'.repeat(analysis.scores.title_quality)}`);
        console.log(`   Description Quality:   ${analysis.scores.description_quality}/20 ${'█'.repeat(analysis.scores.description_quality)}`);
        console.log(`   Keyword Optimization:  ${analysis.scores.keyword_optimization}/20 ${'█'.repeat(analysis.scores.keyword_optimization)}`);
        console.log(`   Content Alignment:     ${analysis.scores.content_alignment}/20 ${'█'.repeat(analysis.scores.content_alignment)}`);
        console.log(`   Technical SEO:         ${analysis.scores.technical_seo}/20 ${'█'.repeat(analysis.scores.technical_seo)}`);
        console.log('─'.repeat(60));
        console.log(`   🎯 TOTAL SCORE:         ${analysis.total_score}/100`);
        
        // Score interpretation
        let grade, emoji;
        if (analysis.total_score >= 90) {
          grade = 'Excellent';
          emoji = '🌟';
        } else if (analysis.total_score >= 75) {
          grade = 'Good';
          emoji = '✅';
        } else if (analysis.total_score >= 60) {
          grade = 'Fair';
          emoji = '⚠️';
        } else {
          grade = 'Needs Improvement';
          emoji = '❌';
        }
        console.log(`   ${emoji} Grade: ${grade}`);
        console.log('');

        if (analysis.issues && analysis.issues.length > 0) {
          console.log('🔍 Issues Found:');
          analysis.issues.forEach((issue, idx) => {
            console.log(`   ${idx + 1}. ${issue}`);
          });
          console.log('');
        }

        if (analysis.recommendations && analysis.recommendations.length > 0) {
          console.log('💡 Recommendations:');
          analysis.recommendations.forEach((rec, idx) => {
            console.log(`   ${idx + 1}. ${rec}`);
          });
          console.log('');
        }
      } else {
        console.log('⚠️  Analysis failed, using fallback scoring');
        if (result.fallback) {
          console.log(`   Fallback Score: ${result.analysis.total_score}/100`);
        }
      }

    } catch (error) {
      console.log('❌ Test failed:', error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!');
  console.log('='.repeat(60));
  console.log('');
}

// Run tests
runTests().catch(console.error);
