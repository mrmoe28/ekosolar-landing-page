# AI SEO Design — EKO Solar Pros

## Goal
Make the site discoverable by AI tools (ChatGPT, Perplexity, Google AI Overviews) and traditional search engines.

## Approach: Static AI SEO Layer (no SSR, no prerender)

### 1. index.html — Meta Tags + Structured Data
- Fix title (currently "Photography Portfolio")
- Add description, canonical URL, OG tags, Twitter cards
- JSON-LD: LocalBusiness, Service (5 services with pricing), FAQPage (7 FAQs), WebSite schema
- All in `<head>` so crawlers see it without JS execution

### 2. llms.txt + llms-full.txt (in public/)
- `llms.txt`: ~30 line summary — who, what, where, services, pricing
- `llms-full.txt`: ~150 line expanded version with FAQs, testimonials, contact

### 3. robots.txt + sitemap.xml (in public/)
- `robots.txt`: Allow all bots, explicitly allow GPTBot/ClaudeBot/PerplexityBot, reference sitemap
- `sitemap.xml`: Single homepage entry with lastmod

### 4. Semantic HTML Tweaks
- Verify `<h1>` in Hero section
- Add aria-labels to section elements where missing

### Domain
- Using placeholder YOURDOMAIN.com — find-and-replace when custom domain is ready
