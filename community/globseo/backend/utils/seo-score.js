#!/usr/bin/env node

/**
 * SEO Quality Score Generator
 * Uses Gemini AI to analyze and score SEO quality
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { log, colors } from './logger.js';

/**
 * Generate SEO quality score using Gemini AI
 * @param {Object} params - SEO analysis parameters
 * @param {string} params.url - Page URL
 * @param {string} params.title - Title tag
 * @param {string} params.description - Meta description
 * @param {string} params.keywords - Keywords
 * @param {Object} params.ogTags - Open Graph tags
 * @param {string} params.content - Page content (extracted)
 * @param {string} params.language - Primary language
 * @param {string} [params.primaryKeyword] - Primary keyword (optional)
 * @param {string} [params.geminiApiKey] - Gemini API key (optional, falls back to env)
 * @returns {Promise<Object>} SEO score analysis
 */
export async function generateSEOScore({
  url,
  title,
  description,
  keywords,
  ogTags = {},
  content,
  language,
  primaryKeyword = '',
  geminiApiKey
}) {
  try {
    // Use provided API key or fall back to environment variable
    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;

    // Validate API key
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required. Please provide it in the request or set the environment variable.');
    }

    // Initialize Gemini AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Prepare the prompt with user's exact specifications
    const prompt = `You are an expert SEO auditor with 10+ years of experience in search optimization,
metadata evaluation, keyword strategy, and multilingual SEO.

Your task is to evaluate the SEO quality of a webpage based on its metadata and
page content. Score multiple SEO dimensions and return a unified SEO score.

Evaluate the following inputs:

PAGE URL:
${url}

TITLE TAG:
${title || 'N/A'}

META DESCRIPTION:
${description || 'N/A'}

KEYWORDS:
${keywords || 'N/A'}

OG TAGS:
${JSON.stringify(ogTags, null, 2)}

PAGE CONTENT (EXTRACTED):
${content ? content.substring(0, 2000) : 'N/A'}

PRIMARY LANGUAGE:
${language || 'en'}

PRIMARY KEYWORD (optional):
${primaryKeyword || 'N/A'}

-------------------------------------------------------------
SCORING CRITERIA (Very Important):
Score each category from 0 to 20.
Total SEO Score = sum of all categories (max 100).

1. Title Quality (0–20)
- Length between 30–60 characters
- Contains primary keyword (if provided)
- Click-through rate potential (compelling wording)
- Not keyword-stuffed
- Unique and descriptive

2. Description Quality (0–20)
- Length between 70–160 characters
- Clear summary of page
- Contains relevant keywords
- Engaging and natural
- No spam/keyword stuffing

3. Keyword Optimization (0–20)
- Keyword appears naturally in title/description
- Semantic/LSI keyword usage
- Keywords align with the content
- No over-optimization

4. Content Alignment (0–20)
- Title matches the actual page content
- Description accurately reflects content
- OG tags consistent with metadata
- H1/H2 alignment (if detectable from content)

5. Technical SEO Elements (0–20)
- Presence of OG tags
- Presence of canonical tag (if provided)
- Correct language usage (matches content language)
- Metadata completeness (title, desc, image, etc.)
- No major SEO violations

-------------------------------------------------------------
RETURN FORMAT (VERY IMPORTANT):
Respond ONLY in valid JSON. No explanation.

{
  "scores": {
    "title_quality": <0-20>,
    "description_quality": <0-20>,
    "keyword_optimization": <0-20>,
    "content_alignment": <0-20>,
    "technical_seo": <0-20>
  },
  "total_score": <0-100>,
  "issues": [
    "List of specific issues found",
    "One per item",
    "Clear and actionable"
  ],
  "recommendations": [
    "SEO improvement suggestion 1",
    "SEO improvement suggestion 2",
    "With focus on ranking + CTR"
  ],
  "smart_rewrites": {
    "title_variations": [
      "Improved title version 1 (50-60 chars, SEO optimized)",
      "Improved title version 2 (alternative approach)",
      "Improved title version 3 (different angle)"
    ],
    "description_variations": [
      "Improved meta description 1 (120-155 chars, compelling)",
      "Improved meta description 2 (alternative hook)",
      "Improved meta description 3 (different benefits focus)"
    ]
  }
}

IMPORTANT FOR SMART REWRITES:
- Title variations must be 50-60 characters for optimal SEO
- Description variations must be 120-155 characters
- Make them more compelling and click-worthy than the original
- Include the primary keyword naturally if provided
- Each variation should offer a different angle or benefit
- Use action words and emotional triggers
- Avoid keyword stuffing, keep it natural and engaging
`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent scoring
        topP: 0.8,
        topK: 40,
      }
    });

    log.info('Analyzing SEO quality with Gemini AI...');

    // Generate content with timeout
    const resultPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API request timeout after 30 seconds')), 30000);
    });

    const result = await Promise.race([resultPromise, timeoutPromise]);
    const response = await result.response;
    const text = response.text();

    log.success('SEO analysis complete');

    // Parse JSON response
    // Remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(jsonText);

    // Validate the response structure
    if (!analysis.scores || !analysis.total_score) {
      throw new Error('Invalid response format from Gemini AI');
    }

    return {
      success: true,
      analysis,
      metadata: {
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString(),
        url
      }
    };

  } catch (error) {
    console.error('SEO Score Generation Error:', error);
    
    // Provide specific error messages for API key and authentication issues
    if (error.message?.includes('API_KEY') || error.message?.includes('unauthorized') || error.message?.includes('invalid') || error.message?.includes('authentication')) {
      throw new Error('Invalid Gemini API key. Please check your API key and try again.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('billing') || error.message?.includes('exceeded')) {
      throw new Error('Gemini API quota exceeded or billing issue. Please check your Google Cloud billing account.');
    }
    
    if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      throw new Error('Network error while connecting to Gemini API. Please try again later.');
    }
    
    // Return a fallback response if AI fails
    if (error.message.includes('GEMINI_API_KEY')) {
      throw error; // Re-throw API key errors
    }

    return {
      success: false,
      error: error.message,
      fallback: true,
      analysis: generateFallbackScore({ url, title, description, keywords, ogTags })
    };
  }
}

/**
 * Generate a basic fallback score when AI is unavailable
 * @param {Object} params - Basic metadata
 * @returns {Object} Basic SEO score
 */
function generateFallbackScore({ url, title, description, keywords, ogTags }) {
  const scores = {
    title_quality: 0,
    description_quality: 0,
    keyword_optimization: 0,
    content_alignment: 0,
    technical_seo: 0
  };

  const issues = [];
  const recommendations = [];

  // Title Quality (0-20)
  if (title) {
    const titleLength = title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      scores.title_quality = 15;
    } else if (titleLength > 0 && titleLength < 30) {
      scores.title_quality = 8;
      issues.push('Title is too short (should be 30-60 characters)');
      recommendations.push('Expand your title to include more descriptive keywords');
    } else if (titleLength > 60) {
      scores.title_quality = 10;
      issues.push('Title is too long (should be 30-60 characters)');
      recommendations.push('Shorten your title to avoid truncation in search results');
    }
  } else {
    issues.push('Missing title tag');
    recommendations.push('Add a compelling title tag to improve search visibility');
  }

  // Description Quality (0-20)
  if (description) {
    const descLength = description.length;
    if (descLength >= 70 && descLength <= 160) {
      scores.description_quality = 15;
    } else if (descLength > 0 && descLength < 70) {
      scores.description_quality = 8;
      issues.push('Meta description is too short (should be 70-160 characters)');
      recommendations.push('Expand your meta description with more details');
    } else if (descLength > 160) {
      scores.description_quality = 10;
      issues.push('Meta description is too long (should be 70-160 characters)');
      recommendations.push('Shorten your meta description to avoid truncation');
    }
  } else {
    issues.push('Missing meta description');
    recommendations.push('Add a meta description to improve click-through rates');
  }

  // Keyword Optimization (0-20)
  if (keywords && keywords.length > 0) {
    scores.keyword_optimization = 12;
  } else {
    scores.keyword_optimization = 5;
    recommendations.push('Consider adding relevant keywords to improve targeting');
  }

  // Technical SEO (0-20)
  let techScore = 10; // Base score
  if (ogTags && Object.keys(ogTags).length > 0) {
    techScore += 5;
  } else {
    issues.push('Missing Open Graph tags');
    recommendations.push('Add OG tags to improve social media sharing');
  }
  scores.technical_seo = techScore;

  // Content Alignment (estimate)
  scores.content_alignment = 10; // Default estimate

  const total_score = Object.values(scores).reduce((sum, score) => sum + score, 0);

  return {
    scores,
    total_score,
    issues,
    recommendations,
    smart_rewrites: {
      title_variations: [],
      description_variations: []
    }
  };
}

/**
 * Usage example
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const testData = {
    url: 'https://example.com',
    title: 'Example Domain - A Perfect Example Website',
    description: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
    keywords: 'example, domain, documentation',
    ogTags: {
      'og:title': 'Example Domain',
      'og:description': 'Example website for documentation',
      'og:type': 'website'
    },
    content: 'Example Domain. This domain is for use in illustrative examples in documents.',
    language: 'en',
    primaryKeyword: 'example domain'
  };

  log.info('Testing SEO Score Generator...\n');
  
  const result = await generateSEOScore(testData);
  console.log('\n[*] SEO Quality Score Results:');
  console.log(JSON.stringify(result, null, 2));
}

export default generateSEOScore;
