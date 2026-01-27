import express from 'express';
import { LingoDotDevEngine } from 'lingo.dev/sdk';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Initialize the translation engine
const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// In-memory cache
const cache = new Map();
const MAX_CACHE_SIZE = 1000;

// Rate limiting tracking (simple in-memory, use Redis in production)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

/**
 * Simple rate limiter
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];

  // Filter out old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

/**
 * Generates a cache key from all parameters
 */
function generateCacheKey(params) {
  return JSON.stringify(params);
}

/**
 * Manages cache size
 */
function addToCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}

/**
 * Escapes XML entities to safely embed text in SVG
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates hex color
 */
function isValidHexColor(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Translates text using lingo.dev SDK
 */
async function translateText(text, targetLang = "en") {
  // Basic validation
  if (!text || typeof text !== "string") return "";
  if (!targetLang || targetLang === "en") return text;

  try {
    const result = await lingo.localizeText(text, {
      sourceLocale: "en",
      targetLocale: targetLang,
      fast: true, // optional (see below)
    });

    return result || text;
  } catch (error) {
    console.error(`Translation failed [${targetLang}]`, error);
    return text; // graceful fallback
  }
}

/**
 * Wraps text into multiple lines based on max width
 */
function wrapText(text, maxCharsPerLine = 40) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

/**
 * Generates SVG text elements with proper positioning
 */
function generateTextElements(config) {
  const {
    text,
    subtitle,
    x,
    y,
    fontSize,
    fontWeight,
    textAnchor,
    fill,
    fontFamily,
    maxWidth,
    lineHeight = 1.3,
  } = config;

  const lines = wrapText(text, Math.floor(maxWidth / (fontSize * 0.6)));
  const totalHeight = lines.length * fontSize * lineHeight;
  const startY = y - (totalHeight / 2) + fontSize / 2;

  let svgText = '';

  // Main text lines
  lines.forEach((line, index) => {
    const lineY = startY + (index * fontSize * lineHeight);
    svgText += `
  <text
    x="${x}"
    y="${lineY}"
    font-family="${fontFamily}"
    font-size="${fontSize}"
    font-weight="${fontWeight}"
    text-anchor="${textAnchor}"
    fill="${fill}"
  >${escapeXml(line)}</text>`;
  });

  // Subtitle
  if (subtitle) {
    const subtitleY = startY + (lines.length * fontSize * lineHeight) + fontSize * 0.8;
    const subtitleFontSize = fontSize * 0.5;
    svgText += `
  <text
    x="${x}"
    y="${subtitleY}"
    font-family="${fontFamily}"
    font-size="${subtitleFontSize}"
    font-weight="400"
    text-anchor="${textAnchor}"
    fill="${fill}"
    opacity="0.7"
  >${escapeXml(subtitle)}</text>`;
  }

  return svgText;
}

/**
 * Layout configurations
 */
const LAYOUTS = {
  center: {
    getPosition: (width, height) => ({
      x: width / 2,
      y: height / 2,
      textAnchor: 'middle',
      maxWidth: width * 0.8,
    }),
  },
  top: {
    getPosition: (width, height, padding) => ({
      x: width / 2,
      y: padding + 100,
      textAnchor: 'middle',
      maxWidth: width * 0.8,
    }),
  },
  bottom: {
    getPosition: (width, height, padding) => ({
      x: width / 2,
      y: height - padding - 100,
      textAnchor: 'middle',
      maxWidth: width * 0.8,
    }),
  },
  left: {
    getPosition: (width, height, padding) => ({
      x: padding + 80,
      y: height / 2,
      textAnchor: 'start',
      maxWidth: width * 0.6,
    }),
  },
  right: {
    getPosition: (width, height, padding) => ({
      x: width - padding - 80,
      y: height / 2,
      textAnchor: 'end',
      maxWidth: width * 0.6,
    }),
  },
  'top-left': {
    getPosition: (width, height, padding) => ({
      x: padding + 80,
      y: padding + 100,
      textAnchor: 'start',
      maxWidth: width * 0.6,
    }),
  },
  'top-right': {
    getPosition: (width, height, padding) => ({
      x: width - padding - 80,
      y: padding + 100,
      textAnchor: 'end',
      maxWidth: width * 0.6,
    }),
  },
  'bottom-left': {
    getPosition: (width, height, padding) => ({
      x: padding + 80,
      y: height - padding - 100,
      textAnchor: 'start',
      maxWidth: width * 0.6,
    }),
  },
  'bottom-right': {
    getPosition: (width, height, padding) => ({
      x: width - padding - 80,
      y: height - padding - 100,
      textAnchor: 'end',
      maxWidth: width * 0.6,
    }),
  },
  split: {
    getPosition: (width, height) => ({
      x: width / 2,
      y: height / 2,
      textAnchor: 'middle',
      maxWidth: width * 0.45,
      withDivider: true,
    }),
  },
};

/**
 * Generates an advanced SVG cover image
 */
function generateSvgCover(options) {
  const {
    text,
    subtitle = '',
    width = 1200,
    height = 630,
    bgColor = '#FFFFFF',
    textColor = '#000000',
    fontSize: customFontSize,
    fontWeight = '600',
    layout = 'center',
    padding = 60,
    fontFamily = "system-ui, -apple-system, 'Segoe UI', sans-serif",
  } = options;

  // Auto font sizing based on text length if not specified
  let fontSize = customFontSize;
  if (!fontSize) {
    if (text.length > 80) {
      fontSize = 36;
    } else if (text.length > 50) {
      fontSize = 44;
    } else {
      fontSize = 56;
    }
  }

  const layoutConfig = LAYOUTS[layout] || LAYOUTS.center;
  const position = layoutConfig.getPosition(width, height, padding);

  let decorativeElements = '';

  // Add divider for split layout
  if (position.withDivider) {
    decorativeElements = `
  <line
    x1="${width / 2}"
    y1="${padding}"
    x2="${width / 2}"
    y2="${height - padding}"
    stroke="${textColor}"
    stroke-width="2"
    opacity="0.2"
  />`;
  }

  const textElements = generateTextElements({
    text,
    subtitle,
    x: position.x,
    y: position.y,
    fontSize,
    fontWeight,
    textAnchor: position.textAnchor,
    fill: textColor,
    fontFamily,
    maxWidth: position.maxWidth,
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${decorativeElements}
  <!-- Text -->
  ${textElements}
</svg>`;
}

/**
 * Validates and sanitizes input parameters
 */
function validateParams(query) {
  const errors = [];
  const params = {};

  // Required: text
  if (!query.text || typeof query.text !== 'string' || query.text.trim() === '') {
    errors.push('Missing or invalid "text" parameter');
  } else {
    params.text = query.text.trim();
  }

  // Optional: subtitle
  if (query.subtitle && typeof query.subtitle === 'string') {
    params.subtitle = query.subtitle.trim();
  }

  // Optional: language
  params.lang = query.lang || 'en';

  // Optional: theme or custom colors
  if (query.theme === 'dark') {
    params.bgColor = '#000000';
    params.textColor = '#FFFFFF';
  } else {
    params.bgColor = '#FFFFFF';
    params.textColor = '#000000';
  }

  // Custom colors override theme
  if (query.bgColor) {
    if (isValidHexColor(query.bgColor)) {
      params.bgColor = query.bgColor;
    } else {
      errors.push('Invalid bgColor format (use hex: #000000)');
    }
  }

  if (query.textColor) {
    if (isValidHexColor(query.textColor)) {
      params.textColor = query.textColor;
    } else {
      errors.push('Invalid textColor format (use hex: #FFFFFF)');
    }
  }

  // Optional: dimensions
  params.width = parseInt(query.width) || 1200;
  params.height = parseInt(query.height) || 630;

  if (params.width < 200 || params.width > 4000) {
    errors.push('Width must be between 200 and 4000');
  }
  if (params.height < 200 || params.height > 4000) {
    errors.push('Height must be between 200 and 4000');
  }

  // Optional: fontSize
  if (query.fontSize) {
    params.fontSize = parseInt(query.fontSize);
    if (params.fontSize < 12 || params.fontSize > 200) {
      errors.push('fontSize must be between 12 and 200');
    }
  }

  // Optional: fontWeight
  const validWeights = ['300', '400', '500', '600', '700', '800', '900'];
  if (query.fontWeight && validWeights.includes(query.fontWeight)) {
    params.fontWeight = query.fontWeight;
  }

  // Optional: layout
  if (query.layout && LAYOUTS[query.layout]) {
    params.layout = query.layout;
  }

  // Optional: padding
  if (query.padding) {
    params.padding = parseInt(query.padding);
    if (params.padding < 0 || params.padding > 300) {
      errors.push('padding must be between 0 and 300');
    }
  }

  return { params, errors };
}

/**
 * Main API endpoint: GET /api/cover
 *
 * Query parameters:
 * - text (required): Main text to display
 * - subtitle (optional): Subtitle text
 * - lang (optional): Language code for translation (default: 'en')
 * - theme (optional): 'dark' or 'light' (default: 'light')
 * - bgColor (optional): Background color hex (e.g., '#000000')
 * - textColor (optional): Text color hex (e.g., '#FFFFFF')
 * - width (optional): Image width in pixels (default: 1200)
 * - height (optional): Image height in pixels (default: 630)
 * - fontSize (optional): Font size in pixels (default: auto-calculated)
 * - fontWeight (optional): Font weight 300-900 (default: '600')
 * - layout (optional): Layout type (default: 'center')
 *   Available: center, top, bottom, left, right, top-left, top-right, bottom-left, bottom-right, split
 * - padding (optional): Padding in pixels (default: 60)
 */
app.get('/api/cover', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;

  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
    });
  }

  // Validate parameters
  const { params, errors } = validateParams(req.query);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid parameters',
      details: errors,
    });
  }

  const cacheKey = generateCacheKey(params);

  // Check cache
  if (cache.has(cacheKey)) {
    const { svg, timestamp } = cache.get(cacheKey);

    if (NODE_ENV === 'development') {
      console.log(`Cache hit for: ${params.text.substring(0, 30)}...`);
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'HIT');
    return res.send(svg);
  }

  try {
    // Translate text if needed
    const translatedText = await translateText(params.text, params.lang);
    const translatedSubtitle = params.subtitle
      ? await translateText(params.subtitle, params.lang)
      : '';

    // Generate SVG
    const svg = generateSvgCover({
      ...params,
      text: translatedText,
      subtitle: translatedSubtitle,
    });

    // Store in cache
    addToCache(cacheKey, {
      svg,
      timestamp: new Date().toISOString(),
    });

    if (NODE_ENV === 'development') {
      console.log(`Generated new cover for: ${params.text.substring(0, 30)}...`);
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Cache', 'MISS');
    res.send(svg);
  } catch (error) {
    console.error('Error generating cover:', error);
    res.status(500).json({
      error: 'Failed to generate cover image',
      message: NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

/**
 * GET /api/layouts - List available layouts
 */
app.get('/api/layouts', (req, res) => {
  res.json({
    layouts: Object.keys(LAYOUTS),
    default: 'center',
  });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    cacheSize: cache.size,
    maxCacheSize: MAX_CACHE_SIZE,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Documentation endpoint
 */
app.get('/api/docs', (req, res) => {
  res.json({
    endpoint: '/api/cover',
    method: 'GET',
    description: 'Generate customizable cover images',
    parameters: {
      text: {
        type: 'string',
        required: true,
        description: 'Main text to display',
      },
      subtitle: {
        type: 'string',
        required: false,
        description: 'Subtitle text',
      },
      lang: {
        type: 'string',
        required: false,
        default: 'en',
        description: 'Language code for translation',
      },
      theme: {
        type: 'string',
        required: false,
        default: 'light',
        options: ['light', 'dark'],
        description: 'Color theme',
      },
      bgColor: {
        type: 'string',
        required: false,
        description: 'Background color (hex format, e.g., #000000)',
      },
      textColor: {
        type: 'string',
        required: false,
        description: 'Text color (hex format, e.g., #FFFFFF)',
      },
      width: {
        type: 'integer',
        required: false,
        default: 1200,
        min: 200,
        max: 4000,
        description: 'Image width in pixels',
      },
      height: {
        type: 'integer',
        required: false,
        default: 630,
        min: 200,
        max: 4000,
        description: 'Image height in pixels',
      },
      fontSize: {
        type: 'integer',
        required: false,
        min: 12,
        max: 200,
        description: 'Font size in pixels (auto-calculated if not provided)',
      },
      fontWeight: {
        type: 'string',
        required: false,
        default: '600',
        options: ['300', '400', '500', '600', '700', '800', '900'],
        description: 'Font weight',
      },
      layout: {
        type: 'string',
        required: false,
        default: 'center',
        options: Object.keys(LAYOUTS),
        description: 'Text layout position',
      },
      padding: {
        type: 'integer',
        required: false,
        default: 60,
        min: 0,
        max: 300,
        description: 'Padding in pixels',
      },
    },
    examples: [
      '/api/cover?text=Hello%20World',
      '/api/cover?text=Hello%20World&theme=dark',
      '/api/cover?text=Hello%20World&subtitle=A%20greeting&layout=top-left',
      '/api/cover?text=Hello&bgColor=%23FF5733&textColor=%23FFFFFF&fontSize=72',
      '/api/cover?text=Hello&layout=split&width=1920&height=1080',
    ],
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Cover Image API',
    version: '2.0.0',
    status: 'running',
    documentation: '/api/docs',
    layouts: '/api/layouts',
    health: '/health',
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
    documentation: '/api/docs',
  });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;

// /**
//  * Start the server
//  */
// app.listen(PORT, () => {
//   console.log(`
// ╔════════════════════════════════════════════════════════╗
// ║         Cover Image API v2.0.0                         ║
// ╚════════════════════════════════════════════════════════╝

// 🚀 Server running on: http://localhost:${PORT}
// 📚 Documentation:     http://localhost:${PORT}/api/docs
// 🎨 Available layouts: http://localhost:${PORT}/api/layouts
// ❤️  Health check:     http://localhost:${PORT}/health

// Environment: ${NODE_ENV}
// Cache size limit: ${MAX_CACHE_SIZE}
// Rate limit: ${RATE_LIMIT_MAX} requests per minute
//   `);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server');
//   server.close(() => {
//     console.log('HTTP server closed');
//     process.exit(0);
//   });
// });
