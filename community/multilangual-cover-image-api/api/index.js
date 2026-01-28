/**
 * Cover Image API
 *
 * A production-ready API for generating beautiful, customizable cover images
 * with multi-language support and advanced layout options.
 *
 * Main features:
 * - 10 layout options (center, corners, sides, split)
 * - Light/dark themes with custom colors
 * - Multi-language translation via Lingo.dev
 * - Automatic font sizing and text wrapping
 * - Built-in caching and rate limiting
 */

import express from "express";
import cors from "cors";
import compression from "compression";
import "dotenv/config";

// Import services and utilities
import { TranslationService } from "../services/translation.js";
import { SvgGenerator } from "../services/svg-generator.js";
import { CacheManager } from "../utils/cache.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { validateParams } from "../utils/validation.js";
import { LAYOUTS } from "../config/constants.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Configure middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Initialize services
const translationService = new TranslationService(
  process.env.LINGODOTDEV_API_KEY,
);
const svgGenerator = new SvgGenerator();
const cache = new CacheManager();
const rateLimiter = new RateLimiter();

/**
 * Main API endpoint: GET /api/cover
 *
 * Generates a customizable SVG cover image
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
 * - padding (optional): Padding in pixels (default: 60)
 */
app.get("/api/cover", async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;

  // Check rate limit
  if (!rateLimiter.checkLimit(clientIp)) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
    });
  }

  // Validate parameters
  const { params, errors } = validateParams(req.query);

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Invalid parameters",
      details: errors,
    });
  }

  // Generate cache key
  const cacheKey = cache.generateKey(params);

  // Check cache
  if (cache.has(cacheKey)) {
    const { svg } = cache.get(cacheKey);

    if (NODE_ENV === "development") {
      console.log(`✓ Cache hit: ${params.text.substring(0, 30)}...`);
    }

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Cache", "HIT");
    return res.send(svg);
  }

  try {
    // Translate text if needed
    const translatedText = await translationService.translate(
      params.text,
      params.lang,
    );
    const translatedSubtitle = params.subtitle
      ? await translationService.translate(params.subtitle, params.lang)
      : "";

    // Generate SVG
    const svg = svgGenerator.generate({
      ...params,
      text: translatedText,
      subtitle: translatedSubtitle,
    });

    // Store in cache
    cache.set(cacheKey, {
      svg,
      timestamp: new Date().toISOString(),
    });

    if (NODE_ENV === "development") {
      console.log(`✓ Generated: ${params.text.substring(0, 30)}...`);
    }

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Cache", "MISS");
    res.send(svg);
  } catch (error) {
    console.error("Error generating cover:", error);
    res.status(500).json({
      error: "Failed to generate cover image",
      message:
        NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
});

/**
 * GET /api/layouts
 *
 * Returns list of available layout options
 */
app.get("/api/layouts", (req, res) => {
  res.json({
    layouts: Object.keys(LAYOUTS),
    default: "center",
    descriptions: {
      center: "Text centered in the middle",
      top: "Text at the top center",
      bottom: "Text at the bottom center",
      left: "Text on the left side",
      right: "Text on the right side",
      "top-left": "Text in the top-left corner",
      "top-right": "Text in the top-right corner",
      "bottom-left": "Text in the bottom-left corner",
      "bottom-right": "Text in the bottom-right corner",
      split: "Text centered with vertical divider",
    },
  });
});

/**
 * GET /health
 *
 * Health check endpoint for monitoring
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: NODE_ENV,
    cacheSize: cache.size(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/docs
 *
 * Returns API documentation in JSON format
 */
app.get("/api/docs", (req, res) => {
  res.json({
    endpoint: "/api/cover",
    method: "GET",
    description:
      "Generate customizable cover images with multi-language support",
    parameters: {
      text: {
        type: "string",
        required: true,
        description: "Main text to display",
      },
      subtitle: {
        type: "string",
        required: false,
        description: "Subtitle text",
      },
      lang: {
        type: "string",
        required: false,
        default: "en",
        description: "Language code for translation (ISO 639-1)",
      },
      theme: {
        type: "string",
        required: false,
        default: "light",
        options: ["light", "dark"],
        description: "Color theme",
      },
      bgColor: {
        type: "string",
        required: false,
        description: "Background color (hex format, e.g., #000000)",
      },
      textColor: {
        type: "string",
        required: false,
        description: "Text color (hex format, e.g., #FFFFFF)",
      },
      width: {
        type: "integer",
        required: false,
        default: 1200,
        min: 200,
        max: 4000,
        description: "Image width in pixels",
      },
      height: {
        type: "integer",
        required: false,
        default: 630,
        min: 200,
        max: 4000,
        description: "Image height in pixels",
      },
      fontSize: {
        type: "integer",
        required: false,
        min: 12,
        max: 200,
        description: "Font size in pixels (auto-calculated if not provided)",
      },
      fontWeight: {
        type: "string",
        required: false,
        default: "600",
        options: ["300", "400", "500", "600", "700", "800", "900"],
        description: "Font weight",
      },
      layout: {
        type: "string",
        required: false,
        default: "center",
        options: Object.keys(LAYOUTS),
        description: "Text layout position",
      },
      padding: {
        type: "integer",
        required: false,
        default: 60,
        min: 0,
        max: 300,
        description: "Padding in pixels",
      },
    },
    examples: [
      "/api/cover?text=Hello%20World",
      "/api/cover?text=Hello%20World&theme=dark",
      "/api/cover?text=Welcome&subtitle=To%20my%20website&layout=top-left",
      "/api/cover?text=Hello&bgColor=%23FF5733&textColor=%23FFFFFF&fontSize=72",
      "/api/cover?text=Product%20Launch&layout=split&width=1920&height=1080",
    ],
  });
});

/**
 * GET /
 *
 * Root endpoint with API information
 */
app.get("/", (req, res) => {
  res.json({
    name: "Cover Image API",
    version: "2.0.0",
    status: "running",
    endpoints: {
      documentation: "/api/docs",
      layouts: "/api/layouts",
      health: "/health",
      generate: "/api/cover",
    },
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
    documentation: "/api/docs",
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         Cover Image API v2.0.0                         ║
╚════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
📚 Documentation:     http://localhost:${PORT}/api/docs
🎨 Available layouts: http://localhost:${PORT}/api/layouts
❤️  Health check:     http://localhost:${PORT}/health

Environment: ${NODE_ENV}
  `);
});

/**
 * Graceful shutdown handler
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
