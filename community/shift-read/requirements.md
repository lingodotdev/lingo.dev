# Build Shift - Reading & Translation App

### App Purpose
A minimal web app that lets users paste article URLs, view them in clean reader mode, and translate to different languages.

---

## Design Requirements

### Homepage (`/`)
**Layout:**
- Centered design with generous whitespace
- Large "Shift" heading at top
- One-line tagline below: "Read any article in your language"
- URL input field (placeholder: "https://example.com/article")
- "Extract & Read" button
- Theme toggle in top-right corner

**Styling:**
- Clean, modern, minimal (like Firecrawl landing page)
- Input: rounded corners, subtle border, 56px height
- Button: accent color, full-width or beside input
- Large typography, comfortable spacing

### Reading Page (`/read/[url]`)
**Layout:**
- Sticky header with: app name, language selector, "Show Original" toggle, theme toggle
- Article header: title (large), author name, date, featured image
- Article content: markdown rendered with beautiful typography
- Max-width: 768px, centered

**Content Styling:**
- Use `@tailwindcss/typography` for prose styling
- Body text: 18-20px, line-height 1.7
- Blockquotes: left border, italic, indented
- Images: rounded corners, responsive, with captions
- Code blocks: syntax highlighting, dark background
- External links: open in new tab
- Generous spacing between all elements

---

## Core Features to Build

### 1. Homepage URL Input
**File:** `app/page.tsx`

**Requirements:**
- Input validates HTTPS URLs only
- Shows error for invalid URLs
- On submit: encode URL and navigate to `/read/[encoded-url]`
- Clean, centered layout matching design

---

### 2. Article Scraping with Firecrawl
**File:** `app/actions/scrape.ts`

**What Firecrawl Does:**
- Renders JavaScript pages (handles React/Vue sites)
- Extracts clean article content (removes ads, navigation, clutter)
- Returns markdown + metadata
- Auto-detects source language

**Implementation:**
```typescript
// Server action that:
1. Accepts URL from user
2. Calls Firecrawl API with:
   - formats: ['markdown']
   - onlyMainContent: true
   - waitFor: 1000ms
3. Returns:
   - markdown content
   - metadata: { title, author, publishedTime, ogImage, language }
4. Handles errors gracefully
```

**Error Handling:**
- Invalid URLs → show user-friendly message
- Scraping fails → retry option
- No content extracted → inform user
- Show loading indicator (2-5 seconds typical)

---

### 3. Reading Page
**File:** `app/read/[url]/page.tsx`

**Requirements:**
1. **On load:**
   - Decode URL from route parameter
   - Check localStorage for cached article
   - If cached: display instantly
   - If not: call scrape action, then cache result

2. **Display:**
   - Show article header (title, author, date, image)
   - Render markdown with custom components:
     - Images: Next.js Image component, responsive
     - Links: external links open in new tab
     - Code: inline and block with highlighting
   - Apply prose styling from Tailwind typography

3. **Loading states:**
   - Show spinner while scraping
   - Show progress during translation

4. **Error states:**
   - Failed scrape → error message + retry
   - Failed load → go home button

---

### 4. Translation with Lingo.dev
**File:** `app/actions/translate.ts`

**What Lingo.dev Does:**
- Translates markdown while preserving formatting
- Auto-detects source language if not provided
- Supports 50+ languages
- Fast, AI-powered translation

**Implementation:**
```typescript
// Server action that:
1. Accepts: markdown content, source language, target language
2. Calls Lingo.dev SDK:
   - Use sourceLocale from Firecrawl metadata (or null for auto-detect)
   - targetLocale from user selection
3. Returns translated markdown
4. Handles errors
```

**Supported Languages:**
- Spanish (es), French (fr), German (de)
- Japanese (ja), Chinese (zh), Arabic (ar)
- Hindi (hi), Portuguese (pt), Russian (ru)
- Korean (ko), Italian (it), Dutch (nl)

---

### 5. Language Selector
**File:** `components/LanguageSelector.tsx`

**Requirements:**
- Dropdown with language options
- Shows "Original" + 10-12 common languages
- Filters out source language from options
- On change: triggers translation
- Displays current selection

---

### 6. Translation Management

**In Reading Page:**
1. **State management:**
   - Keep original content separate from translated
   - Track current language selection
   - Toggle between original/translated view

2. **Caching:**
   - Store in localStorage per URL:
     - Article data (markdown, metadata)
     - Most recent translation only (replaces previous)
   - Cache structure:
     ```
     {
       article: { content, title, author, date, image, sourceLanguage },
       translation: { content, language },
       timestamp
     }
     ```

3. **User flow:**
   - User selects language → translate → cache translation
   - User selects different language → translate → replace cached translation
   - User toggles "Show Original" → display original (no API call)

---

### 7. Article Renderer
**File:** `components/ArticleRenderer.tsx`

**Requirements:**
- Use `react-markdown` with plugins:
  - `remark-gfm` (tables, strikethrough, task lists)
  - `rehype-highlight` (syntax highlighting)

- Custom components:
  - `img`: Next.js Image, responsive, rounded corners, captions
  - `a`: external links open in new tab with rel="noopener noreferrer"
  - `code`: inline code with background, block code with syntax highlighting

- Apply Tailwind prose classes:
  - `prose prose-lg dark:prose-invert max-w-none`
  - Custom prose modifiers for headings, links, quotes, code

---

### 8. localStorage Utilities
**File:** `lib/storage.ts`

**Functions needed:**
```
getFromStorage(url) → returns cached article data or null
saveToStorage(url, data) → saves article + translation
```

**Key format:** `shift_articles_[encoded-url]`

---

## Environment Variables

```env
FIRECRAWL_API_KEY=your_key
LINGODOTDEV_API_KEY=your_key
```

---

## Key Technical Details

### URL Routing
- Format: `/read/[encoded-url]`
- Encode on submit: `encodeURIComponent(url)`
- Decode in page: `decodeURIComponent(params.url)`

```

---

## TODO Checklist

### Phase 1: Homepage
- [ ] Create homepage layout component
- [ ] Add URL input with HTTPS validation
- [ ] Implement navigation to `/read/[url]` on submit
- [ ] Style according to design (centered, minimal)

### Phase 2: Firecrawl Integration
- [ ] Create scrape server action
- [ ] Call Firecrawl API with correct config
- [ ] Parse and return markdown + metadata
- [ ] Add error handling
- [ ] Test with Medium, Substack, blog URLs

### Phase 3: Reading Page
- [ ] Create `/read/[url]` page
- [ ] Implement URL decoding
- [ ] Add loading state
- [ ] Display article header (title, author, date, image)
- [ ] Render markdown content
- [ ] Implement localStorage caching
- [ ] Add error handling

### Phase 4: Markdown Rendering
- [ ] Setup react-markdown with plugins
- [ ] Add custom image component
- [ ] Add custom link component
- [ ] Add custom code component
- [ ] Apply Tailwind typography
- [ ] Test with various markdown elements

### Phase 5: Translation
- [ ] Create translate server action
- [ ] Setup Lingo.dev SDK
- [ ] Build language selector component
- [ ] Implement translation trigger
- [ ] Add loading state during translation
- [ ] Cache translated content
- [ ] Add "Show Original" toggle

### Phase 6: Polish
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Test dark mode on all pages
- [ ] Add smooth transitions
- [ ] Test with 10+ article URLs
- [ ] Test all language combinations
- [ ] Optimize performance

---

## Success Criteria

**Functionality:**
- Scrapes articles from Medium, Substack, personal blogs
- Translates content while preserving formatting
- Caches articles for instant re-access
- Toggles between original and translated seamlessly

**Design:**
- Clean, minimal UI
- Beautiful typography on reading page
- Responsive on all devices
- Dark/light mode working

**Performance:**
- Homepage loads instantly
- Cached articles load instantly
- New scrapes complete in 3-6 seconds
- Translations complete in 3-8 seconds

---

## Notes

- Focus on simplicity and clean code
- Use server actions for API calls (keeps keys secure)
- Prioritize reading experience (typography, spacing, formatting)
- Keep UI minimal - let content shine