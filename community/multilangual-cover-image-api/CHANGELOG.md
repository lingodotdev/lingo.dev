# Changelog

All notable changes to the Cover Image API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-28

### Added

- **10 layout options** for flexible text positioning:
  - `center` - Text centered in the middle
  - `top` - Text at the top center
  - `bottom` - Text at the bottom center
  - `left` - Text on the left side
  - `right` - Text on the right side
  - `top-left` - Text in the top-left corner
  - `top-right` - Text in the top-right corner
  - `bottom-left` - Text in the bottom-left corner
  - `bottom-right` - Text in the bottom-right corner
  - `split` - Text centered with vertical divider
- **Multi-language support** via Lingo.dev SDK with automatic translation
- **Subtitle support** for secondary text below main content
- **Theme presets** with light and dark modes
- **Custom colors** for background and text (hex format)
- **Custom dimensions** from 200x200 to 4000x4000 pixels
- **Custom font sizing** (12-200px) with automatic sizing based on text length
- **Font weight control** (300-900)
- **Adjustable padding** (0-300px)
- **Built-in caching** with automatic size management (1000 items max)
- **Rate limiting** (100 requests per minute per IP)
- **Gzip compression** for all responses
- **CORS support** for cross-origin requests
- **Health check endpoint** (`/health`) with server status and metrics
- **Documentation endpoint** (`/api/docs`) with complete API reference
- **Layouts endpoint** (`/api/layouts`) listing all available layouts
- **Comprehensive input validation** with detailed error messages
- **Modular architecture** with clean separation of concerns

### Improved

- **Code organization** - Refactored from monolithic 726-line file to modular architecture
- **Optimized SVG generation** with efficient text wrapping and positioning
- **Better text wrapping** for long content with intelligent line breaks
- **Translation fallback** - Gracefully handles translation errors by returning original text
- **Enhanced error responses** with structured JSON error messages
- **Improved documentation** with architecture guides and examples
- **Better configuration** with centralized constants and settings
- **Fixed graceful shutdown** - Properly handles SIGTERM signals

### Changed

- **Project structure** - Organized into `api/`, `services/`, `utils/`, `config/`, and `docs/` directories
- **Module system** - Using ES modules for better tree-shaking and modern JavaScript
- **Configuration files** - Enhanced `.gitignore`, `package.json`, and `.env.example`
- **README** - Comprehensive documentation with project structure and usage examples

### Technical Details

#### New Modules

- `config/constants.js` - Centralized configuration constants
- `utils/validation.js` - Input validation and sanitization utilities
- `utils/cache.js` - Cache management with automatic eviction
- `utils/rate-limiter.js` - Per-IP rate limiting
- `services/translation.js` - Lingo.dev translation service
- `services/svg-generator.js` - SVG image generation logic
- `docs/ARCHITECTURE.md` - Comprehensive architecture documentation

#### Performance

- **Caching strategy** - FIFO cache with 1000 item limit
- **Rate limiting** - 60-second window with 100 request limit per IP
- **Compression** - Automatic gzip compression for all responses
- **Client-side caching** - `Cache-Control` headers with 1-hour TTL

#### Dependencies

- `express` ^5.2.1 - Web framework
- `lingo.dev` ^0.125.1 - Translation SDK
- `cors` ^2.8.5 - CORS middleware
- `compression` ^1.8.1 - Response compression
- `dotenv` ^17.2.3 - Environment variable management

### Security

- **XML escaping** - All text content is properly escaped to prevent injection attacks
- **Input validation** - Comprehensive validation of all query parameters
- **Rate limiting** - Protection against API abuse
- **Error handling** - Safe error messages in production mode

### Documentation

- Added comprehensive README with usage examples
- Created ARCHITECTURE.md with system design documentation
- Enhanced inline code comments and JSDoc documentation
- Improved .env.example with helpful comments

---

## [1.0.0] - Initial Release

Initial version of the Cover Image API.
