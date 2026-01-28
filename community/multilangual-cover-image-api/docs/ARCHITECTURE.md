# Architecture Documentation

## Overview

The Cover Image API is built with a modular architecture that separates concerns into distinct layers. This design makes the codebase maintainable, testable, and easy to understand for developers of all skill levels.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Request                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Express Middleware                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐      │
│  │   CORS   │  │   Gzip   │  │  JSON Parser     │      │
│  └──────────┘  └──────────┘  └──────────────────┘      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   API Routes Layer                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  /api/cover  │  /api/docs  │  /health  │  etc.  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Utils Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Validation  │  │ Rate Limiter │  │    Cache     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Services Layer                           │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  Translation Service │  │   SVG Generator      │    │
│  │   (Lingo.dev SDK)    │  │                      │    │
│  └──────────────────────┘  └──────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Response (SVG)                         │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. API Layer (`api/index.js`)

**Purpose**: Entry point and route definitions

**Responsibilities**:

- Express app initialization
- Middleware configuration
- Route definitions
- Request/response handling
- Error handling
- Server lifecycle management

**Key Features**:

- Clean, focused route handlers
- Minimal business logic
- Delegates to services and utils

### 2. Services Layer

#### Translation Service (`services/translation.js`)

**Purpose**: Handle text translation using Lingo.dev SDK

**Responsibilities**:

- Initialize Lingo.dev SDK
- Translate text to target languages
- Handle translation errors gracefully
- Support batch translations

**Key Methods**:

- `translate(text, targetLang)` - Translate single text
- `translateMultiple(texts, targetLang)` - Translate multiple texts

#### SVG Generator Service (`services/svg-generator.js`)

**Purpose**: Generate SVG cover images

**Responsibilities**:

- Text wrapping and positioning
- Layout calculations
- SVG element generation
- Font size optimization
- Decorative elements (dividers, etc.)

**Key Methods**:

- `generate(options)` - Generate complete SVG
- `wrapText(text, maxChars)` - Wrap text into lines
- `generateTextElements(config)` - Create text SVG elements
- `calculateFontSize(text, custom)` - Auto-size fonts

### 3. Utils Layer

#### Validation (`utils/validation.js`)

**Purpose**: Input validation and sanitization

**Responsibilities**:

- Validate request parameters
- Sanitize user input
- Escape XML special characters
- Validate hex colors

**Key Functions**:

- `validateParams(query)` - Validate all parameters
- `escapeXml(text)` - Escape XML entities
- `isValidHexColor(color)` - Validate color format

#### Cache Manager (`utils/cache.js`)

**Purpose**: In-memory caching with size management

**Responsibilities**:

- Store generated SVGs
- Automatic size management (FIFO)
- Cache key generation
- Cache hit/miss tracking

**Key Methods**:

- `get(key)` - Retrieve cached value
- `set(key, value)` - Store value with auto-eviction
- `has(key)` - Check if key exists
- `size()` - Get current cache size

#### Rate Limiter (`utils/rate-limiter.js`)

**Purpose**: Prevent API abuse

**Responsibilities**:

- Track requests per IP
- Enforce rate limits
- Clean up old request records

**Key Methods**:

- `checkLimit(ip)` - Check if request allowed
- `getCount(ip)` - Get current request count

### 4. Config Layer (`config/constants.js`)

**Purpose**: Centralize configuration

**Responsibilities**:

- Define all constants
- Layout configurations
- Validation rules
- Default values
- Theme presets

**Key Exports**:

- `CACHE_CONFIG` - Cache settings
- `RATE_LIMIT_CONFIG` - Rate limit settings
- `DEFAULT_IMAGE` - Default image settings
- `THEMES` - Theme presets
- `VALIDATION_RULES` - Validation constraints
- `LAYOUTS` - Layout configurations

## Data Flow

### Request Processing Flow

1. **Request Arrives**

   - Client sends GET request to `/api/cover?text=Hello&theme=dark`

2. **Middleware Processing**

   - CORS headers added
   - Response compressed (gzip)
   - JSON parsing enabled

3. **Rate Limiting**

   - Extract client IP
   - Check rate limit via `RateLimiter.checkLimit(ip)`
   - Return 429 if limit exceeded

4. **Validation**

   - Parse query parameters
   - Validate via `validateParams(query)`
   - Return 400 if validation fails

5. **Cache Check**

   - Generate cache key from params
   - Check `CacheManager.has(key)`
   - Return cached SVG if hit

6. **Translation** (if cache miss)

   - Translate text via `TranslationService.translate(text, lang)`
   - Translate subtitle if provided
   - Fallback to original on error

7. **SVG Generation**

   - Generate SVG via `SvgGenerator.generate(options)`
   - Apply layout, colors, fonts
   - Wrap text and position elements

8. **Caching**

   - Store generated SVG in cache
   - Auto-evict oldest if cache full

9. **Response**
   - Set appropriate headers
   - Send SVG to client

## Design Decisions

### Why Modular Architecture?

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Testability**: Isolated modules can be unit tested independently
3. **Maintainability**: Changes to one module don't affect others
4. **Readability**: Smaller files are easier to understand
5. **Reusability**: Utils and services can be reused across the project

### Why In-Memory Cache?

- **Simplicity**: No external dependencies for basic caching
- **Performance**: Fastest possible cache access
- **Development**: Easy to develop and test locally

**Production Note**: For multi-instance deployments, replace with Redis or similar distributed cache.

### Why Simple Rate Limiting?

- **Lightweight**: No external dependencies
- **Sufficient**: Adequate for single-instance deployments
- **Transparent**: Easy to understand and modify

**Production Note**: For production, use Redis-based rate limiting (e.g., `express-rate-limit` with Redis store).

### Why ES Modules?

- **Modern Standard**: ES modules are the JavaScript standard
- **Better Tree Shaking**: Improved bundle optimization
- **Cleaner Syntax**: Import/export syntax is cleaner than CommonJS
- **Future-Proof**: Better long-term support

## Performance Considerations

### Caching Strategy

- **Cache Key**: JSON stringified parameters ensure uniqueness
- **Size Limit**: 1000 items prevents memory bloat
- **Eviction**: FIFO (First In, First Out) for simplicity
- **TTL**: Client-side caching via `Cache-Control` header (1 hour)

### Rate Limiting

- **Window**: 60 seconds (1 minute)
- **Limit**: 100 requests per IP
- **Cleanup**: Automatic cleanup of old request records

### Response Optimization

- **Compression**: Gzip compression for all responses
- **SVG**: Vector format scales infinitely without quality loss
- **Minimal Processing**: Auto font-sizing reduces computation

## Security Considerations

### Input Validation

- **Required Fields**: Text parameter is mandatory
- **Type Checking**: All inputs validated for correct types
- **Range Validation**: Numeric values constrained to safe ranges
- **XML Escaping**: All text escaped to prevent injection

### Rate Limiting

- **Per-IP Limits**: Prevents single client from overwhelming server
- **Configurable**: Easy to adjust limits based on needs

### Error Handling

- **Graceful Degradation**: Translation failures fallback to original text
- **Safe Error Messages**: Production mode hides internal errors
- **Logging**: Errors logged for debugging

## Extensibility

### Adding New Layouts

1. Add layout configuration to `LAYOUTS` in `config/constants.js`
2. Define `getPosition()` function for the layout
3. Layout automatically available via API

### Adding New Features

1. **New Service**: Create in `services/` directory
2. **New Utility**: Create in `utils/` directory
3. **New Route**: Add to `api/index.js`
4. **Configuration**: Add constants to `config/constants.js`

### Adding Tests

The modular structure makes testing straightforward:

```javascript
// Example: Testing validation
import { validateParams } from "./utils/validation.js";

test("validates required text parameter", () => {
  const { errors } = validateParams({});
  expect(errors).toContain('Missing or invalid "text" parameter');
});
```

## Future Improvements

1. **Redis Integration**: For distributed caching and rate limiting
2. **Unit Tests**: Comprehensive test coverage
3. **Custom Fonts**: Support for web fonts
4. **Image Backgrounds**: Support for background images
5. **Gradients**: Advanced gradient backgrounds
6. **Analytics**: Track usage patterns
7. **API Versioning**: Support multiple API versions

## Conclusion

This architecture balances simplicity with scalability. It's easy for junior developers to understand while providing a solid foundation for production use. The modular design allows for easy testing, maintenance, and future enhancements.
