# Cover Image API v2.0 🎨

A production-ready API for generating beautiful, customizable cover images with multi-language support and advanced layout options.
submission for community app/tool development!

## Features ✨

- **9 Layout Options**: Center, top, bottom, left, right, corners, and split layouts
- **Theme Support**: Light/dark themes with custom color control
- **Multi-language**: Automatic translation via Lingo.dev
- **Subtitle Support**: Add secondary text below main content
- **Responsive Sizing**: Auto font-sizing based on text length
- **Custom Dimensions**: Any size from 200x200 to 4000x4000
- **Production Ready**: Built-in caching, rate limiting, compression, CORS
- **Type Safety**: Full input validation and error handling

## Quick Start 🚀

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Add your Lingo.dev API key (for translations)

```bash
cp .env.example .env
```

### Run

```bash
# Development
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation 📚

### Main Endpoint

```
GET /api/cover
```

### Parameters

| Parameter    | Type    | Required | Default  | Description               |
| ------------ | ------- | -------- | -------- | ------------------------- |
| `text`       | string  | ✅ Yes   | -        | Main text to display      |
| `subtitle`   | string  | ❌ No    | -        | Subtitle text             |
| `lang`       | string  | ❌ No    | `en`     | Language code (ISO 639-1) |
| `theme`      | string  | ❌ No    | `light`  | `light` or `dark`         |
| `bgColor`    | string  | ❌ No    | -        | Background color (hex)    |
| `textColor`  | string  | ❌ No    | -        | Text color (hex)          |
| `width`      | integer | ❌ No    | `1200`   | Width (200-4000)          |
| `height`     | integer | ❌ No    | `630`    | Height (200-4000)         |
| `fontSize`   | integer | ❌ No    | auto     | Font size (12-200)        |
| `fontWeight` | string  | ❌ No    | `600`    | Font weight (300-900)     |
| `layout`     | string  | ❌ No    | `center` | Layout type (see below)   |
| `padding`    | integer | ❌ No    | `60`     | Padding (0-300)           |

### Available Layouts

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

## Usage Examples 💡

### Basic Usage

```bash
# Simple cover with default settings
GET /api/cover?text=Hello%20World

# Dark theme
GET /api/cover?text=Hello%20World&theme=dark

# With subtitle
GET /api/cover?text=Welcome&subtitle=To%20my%20website
```

### Advanced Layouts

```bash
# Top-left corner layout
GET /api/cover?text=Blog%20Post&layout=top-left

# Split layout with dark theme
GET /api/cover?text=Product%20Launch&layout=split&theme=dark

# Bottom right with custom colors
GET /api/cover?text=Coming%20Soon&layout=bottom-right&bgColor=%23FF5733&textColor=%23FFFFFF
```

### Custom Styling

```bash
# Custom dimensions (Instagram post)
GET /api/cover?text=Follow%20Us&width=1080&height=1080

# Large font with custom weight
GET /api/cover?text=SALE&fontSize=120&fontWeight=900

# Custom brand colors
GET /api/cover?text=Brand%20Name&bgColor=%2300ff00&textColor=%23000000
```

### Multi-language

```bash
# Spanish
GET /api/cover?text=Hello%20World&lang=es

# French with subtitle
GET /api/cover?text=Welcome&subtitle=Enjoy%20your%20stay&lang=fr

# Japanese
GET /api/cover?text=Hello&lang=ja
```

### Complex Example

```bash
GET /api/cover?text=Product%20Launch%202024&subtitle=Join%20us%20for%20the%20reveal&layout=top-left&theme=dark&width=1920&height=1080&fontSize=72&fontWeight=700&padding=120
```

## Other Endpoints 📍

### Documentation

```bash
GET /api/docs
# Returns full API documentation in JSON format
```

### Available Layouts

```bash
GET /api/layouts
# Returns list of all available layouts
```

### Health Check

```bash
GET /health
# Returns server status, cache size, and uptime
```

## HTML Integration Examples 🌐

### Open Graph Meta Tags

```html
<meta
  property="og:image"
  content="https://your-api.com/api/cover?text=My%20Blog%20Post&theme=dark"
/>
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta
  name="twitter:image"
  content="https://your-api.com/api/cover?text=Check%20this%20out&layout=split"
/>
```

### Embedded Image

```html
<img
  src="https://your-api.com/api/cover?text=Welcome&subtitle=to%20our%20site&layout=center"
  alt="Cover Image"
  width="1200"
  height="630"
/>
```

## Production Deployment 🏭

### Environment Variables

```bash
PORT=3001
LINGODOTDEV_API_KEY=your_production_key
```

### Performance Considerations

- **Caching**: Built-in memory cache (1000 items max)
- **Rate Limiting**: 100 requests per minute per IP
- **Compression**: Gzip enabled for all responses
- **CORS**: Enabled for cross-origin requests

### Scaling Tips

1. **Use Redis** for distributed caching in multi-instance deployments
2. **CDN**: Cache responses at edge locations
3. **Load Balancer**: Distribute traffic across multiple instances
4. **Monitoring**: Add APM tools (New Relic, DataDog, etc.)

## Response Headers 📋

```
Content-Type: image/svg+xml
Cache-Control: public, max-age=3600
X-Cache: HIT|MISS
```

## Error Handling ⚠️

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Invalid parameters (with details)
- `429` - Rate limit exceeded
- `500` - Server error

Example error response:

```json
{
  "error": "Invalid parameters",
  "details": [
    "Missing or invalid \"text\" parameter",
    "Width must be between 200 and 4000"
  ]
}
```

## Rate Limiting 🚦

- **Limit**: 100 requests per minute per IP
- **Window**: 60 seconds
- **Response**: `429 Too Many Requests` when exceeded

For production, consider implementing Redis-based rate limiting for better scalability.

## Best Practices 💡

1. **URL Encoding**: Always encode text parameters

   ```javascript
   const text = encodeURIComponent("Hello, World!");
   const url = `/api/cover?text=${text}`;
   ```

2. **Caching**: Images are cached for 1 hour - identical requests return cached versions

3. **Color Formats**: Use hex colors with # symbol (URL encode as `%23`)

   ```bash
   ?bgColor=%23000000&textColor=%23FFFFFF
   ```

4. **Text Length**: Keep text concise for best results
   - Short text (< 30 chars): Use larger layouts
   - Medium text (30-80 chars): Works with all layouts
   - Long text (> 80 chars): Avoid corner layouts

## Advanced Use Cases 🎯

### Dynamic Blog Covers

```javascript
// Generate cover for each blog post
app.get("/blog/:slug", async (req, res) => {
  const post = await getPost(req.params.slug);
  const coverUrl = `https://api.example.com/api/cover?text=${encodeURIComponent(
    post.title,
  )}&subtitle=${encodeURIComponent(post.category)}&layout=top-left&theme=dark`;

  res.render("blog-post", { post, coverUrl });
});
```

### Social Media Automation

```javascript
// Generate covers for social posts
const generateSocialCover = (text, platform) => {
  const dimensions = {
    twitter: { width: 1200, height: 675 },
    instagram: { width: 1080, height: 1080 },
    facebook: { width: 1200, height: 630 },
  };

  const { width, height } = dimensions[platform];
  return `/api/cover?text=${encodeURIComponent(
    text,
  )}&width=${width}&height=${height}&theme=dark`;
};
```

### E-commerce Product Cards

```javascript
// Generate product announcement covers
const productCover = (product) => {
  return `/api/cover?text=${encodeURIComponent(
    product.name,
  )}&subtitle=${encodeURIComponent(
    `$${product.price}`,
  )}&layout=split&bgColor=%23${product.brandColor}`;
};
```

## Testing 🧪

Test the API with curl:

```bash
# Basic test
curl "http://localhost:3001/api/cover?text=Test" > test.svg

# Test with all parameters
curl "http://localhost:3001/api/cover?text=Hello&subtitle=World&theme=dark&layout=split&fontSize=72" > advanced.svg

# Test health endpoint
curl http://localhost:3001/health
```

## Troubleshooting 🔧

### Translation not working

- Verify `LINGODOTDEV_API_KEY` is set in `.env`
- Check API key has sufficient quota
- Falls back to original text on error

### Rate limit too restrictive

- Modify `RATE_LIMIT_MAX` in the code
- Implement Redis-based rate limiting for production

### Font rendering issues

- System fonts are used by default
- SVG fonts are limited - consider using web fonts in future versions

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

MIT License - feel free to use in your projects.

## Support 💬

For issues or questions, please open an issue on the repository.

---

**Made with ❤️ for developers who need beautiful cover images**
