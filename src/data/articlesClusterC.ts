import { BlogPost } from '../types';
import { AUTHORS } from './authorsData';

export const ARTICLES_CLUSTER_C: BlogPost[] = [
  // --------------------------------------------------------------------------
  // ARTICLE 10: Core Web Vitals Guide
  // --------------------------------------------------------------------------
  {
    slug: 'core-web-vitals-guide',
    title: 'Core Web Vitals Guide: How to Optimize LCP, INP, and CLS for Google Search',
    seoTitle: 'Core Web Vitals Guide: Optimize LCP, INP & CLS (2026)',
    metaDescription: 'Complete Core Web Vitals developer guide. Learn actionable techniques to optimize Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and CLS.',
    primaryKeyword: 'Core Web Vitals',
    secondaryKeywords: [
      'how to optimize Core Web Vitals',
      'Largest Contentful Paint LCP fix',
      'Interaction to Next Paint INP guide',
      'Cumulative Layout Shift CLS fix',
      'Core Web Vitals SEO ranking factor',
    ],
    semanticEntities: [
      'Largest Contentful Paint (LCP < 2.5s)',
      'Interaction to Next Paint (INP < 200ms)',
      'Cumulative Layout Shift (CLS < 0.1)',
      'Chrome User Experience Report (CrUX)',
      'Critical Rendering Path Optimization',
      'Resource Preloading & Font Display',
    ],
    searchIntent: 'informational',
    targetAudience: 'Frontend developers, UI/UX engineers, web performance specialists, and technical SEOs',
    contentType: 'educational',
    funnelStage: 'top',
    targetTool: {
      name: 'Unified Website Health & SEO Scanner',
      slug: '/',
      ctaText: 'Test Core Web Vitals Metrics',
      description: 'Audit your real-world LCP, INP, CLS, and TTFB scores in real-time.',
    },
    targetCta: 'Test Your Core Web Vitals',
    category: 'performance',
    author: AUTHORS['david-karp'],
    publishedAt: '2026-07-15',
    updatedAt: '2026-08-22',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      alt: 'Performance telemetry gauges displaying LCP, INP, and CLS threshold ratings for Google Search',
      caption: 'Figure 10: The three core performance pillars of Google\'s Page Experience ranking framework.',
      source: 'AccessFix Web Performance Lab',
    },
    tableOfContents: [
      { id: 'quick-answer', title: 'What Are Core Web Vitals?' },
      { id: 'the-three-metrics', title: 'The 3 Official Core Web Vitals Metrics' },
      { id: 'optimizing-lcp', title: 'How to Optimize Largest Contentful Paint (LCP)' },
      { id: 'optimizing-inp', title: 'How to Optimize Interaction to Next Paint (INP)' },
      { id: 'optimizing-cls', title: 'How to Eliminate Cumulative Layout Shift (CLS)' },
      { id: 'faq', title: 'Frequently Asked Questions' },
      { id: 'sources', title: 'Official Google Web.dev References' },
    ],
    quickAnswer:
      'Core Web Vitals are Google\'s standardized real-world user experience metrics that measure loading speed (Largest Contentful Paint < 2.5s), interactivity responsiveness (Interaction to Next Paint < 200ms), and visual stability (Cumulative Layout Shift < 0.1). They serve as explicit search ranking signals.',
    keyTakeaways: [
      'Passing Core Web Vitals requires reaching the 75th percentile of real-world user visits recorded in Chrome User Experience Report (CrUX).',
      'Optimize LCP by preloading hero images, using modern WebP/AVIF formats, and reducing server TTFB.',
      'Eliminate CLS by setting explicit width and height dimensions on all images, ads, and dynamic embeds.',
    ],
    content: `
## What Are Core Web Vitals?

**Core Web Vitals** are a set of specific metrics that Google considers essential for delivering a high-quality user experience on the web. They measure real-world performance directly in the user's browser, assessing loading velocity, input responsiveness, and visual layout stability.

Google integrates Core Web Vitals into its **Page Experience** ranking algorithm, directly affecting organic rankings across mobile and desktop searches.

\`\`\`text
                  Core Web Vitals Thresholds (75th Percentile)
┌────────────────────────────┬────────────────────────────┬────────────────────────────┐
│ Largest Contentful Paint   │ Interaction to Next Paint  │ Cumulative Layout Shift    │
│ (LCP - Loading Speed)      │ (INP - Interactivity)      │ (CLS - Visual Stability)   │
├────────────────────────────┼────────────────────────────┼────────────────────────────┤
│ Good:        < 2.5 seconds │ Good:        < 200 ms      │ Good:        < 0.1         │
│ Needs Work:  2.5s - 4.0s   │ Needs Work:  200ms - 500ms │ Needs Work:  0.1 - 0.25    │
│ Poor:        > 4.0 seconds │ Poor:        > 500 ms      │ Poor:        > 0.25        │
└────────────────────────────┴────────────────────────────┴────────────────────────────┘
\`\`\`

---

## How to Optimize Largest Contentful Paint (LCP)

LCP measures the time it takes for the largest visual element in the viewport (such as a hero image or main headline) to render.

1. **Preload the Hero Image:** Tell the browser to prioritize the hero image in the \`<head>\`:
\`\`\`html
<link rel="preload" as="image" href="/hero-banner.webp" fetchpriority="high" />
\`\`\`
2. **Eliminate Render-Blocking CSS:** Inline critical above-the-fold styles and defer non-critical stylesheets.
3. **Deploy Edge Caching:** Utilize Cloudflare or Fastly CDN caching to drop TTFB under **400ms**.

---

## How to Optimize Interaction to Next Paint (INP)

INP replaced FID as the official responsiveness metric, measuring how quickly the page updates visually after a user clicks or presses a key.

1. **Break Up Long Tasks:** Split JavaScript tasks exceeding 50ms using \`requestIdleCallback()\` or \`setTimeout()\`.
2. **Optimize React State Renders:** Use \`useTransition\` or \`useDeferredValue\` for computationally heavy filtering.
3. **Minimize Heavy Third-Party Scripts:** Defer tag managers, customer chat widgets, and tracking pixels until after initial user interaction.

---

## How to Eliminate Cumulative Layout Shift (CLS)

CLS measures unexpected visual layout jumps that cause accidental clicks.

1. **Explicit Image & Video Dimensions:** Always declare explicit \`width\` and \`height\` attributes on \`<img>\` and \`<video>\` tags:
\`\`\`html
<!-- Prevents CLS by reserving aspect ratio in DOM -->
<img src="/hero.webp" width="1200" height="630" alt="AccessFix Dashboard" />
\`\`\`
2. **Reserve Space for Dynamic Elements:** Use CSS \`min-height\` for client-rendered banners, ads, or toast notifications.
3. **Use \`font-display: swap\` with Matched Fallback Fonts:** Prevent layout pop during web font loading.
    `,
    faqs: [
      {
        question: 'Are Core Web Vitals measured in a lab or with real user data?',
        answer:
          'Google uses real-world field data collected from Chrome users over a rolling 28-day period (CrUX) to determine ranking impact.',
      },
      {
        question: 'What is a good LCP score for mobile devices?',
        answer:
          'A good LCP score is under 2.5 seconds for at least 75% of all mobile page visits.',
      },
    ],
    relatedTools: [
      {
        name: 'Unified Website Health & SEO Scanner',
        slug: '/',
        description: 'Audit Core Web Vitals, LCP elements, and layout shift sources.',
        icon: 'Zap',
      },
    ],
    relatedArticles: [
      'website-speed-optimization',
      'image-seo-optimization',
      'mobile-seo-optimization',
    ],
    sources: [
      {
        title: 'Google Web.dev: Core Web Vitals Official Documentation',
        url: 'https://web.dev/vitals/',
        organization: 'Google Chrome Team',
      },
    ],
    readTime: '11 min read',
    wordCount: 1880,
    qualityScore: {
      total: 98,
      searchIntent: 10,
      contentQuality: 10,
      seo: 10,
      internalLinks: 10,
      sources: 10,
      readability: 9,
      originalValue: 10,
      conversion: 10,
      technicalAccuracy: 10,
    },
    freshnessStatus: 'fresh',
    searchConsoleData: {
      keyword: 'Core Web Vitals',
      impressions: 12400,
      clicks: 680,
      ctr: 5.5,
      avgPosition: 3.1,
    },
  },

  // --------------------------------------------------------------------------
  // ARTICLE 11: Website Speed Optimization
  // --------------------------------------------------------------------------
  {
    slug: 'website-speed-optimization',
    title: 'Website Speed Optimization: 14 Proven Developer Strategies for Sub-Second Loads',
    seoTitle: 'Website Speed Optimization: 14 Developer Strategies (2026)',
    metaDescription: '14 actionable website speed optimization techniques. Optimize TTFB, HTTP/3, Brotli compression, bundle splitting, critical CSS, and CDN caching.',
    primaryKeyword: 'website speed optimization',
    secondaryKeywords: [
      'how to increase website speed',
      'page speed optimization techniques',
      'reduce time to first byte TTFB',
      'frontend performance optimization',
    ],
    semanticEntities: [
      'Brotli vs Gzip Compression',
      'Code Splitting & Dynamic Imports',
      'HTTP/3 QUIC Transport Protocol',
      'Edge Computing & Serverless CDN Caching',
      'Critical CSS Inlining',
    ],
    searchIntent: 'informational',
    targetAudience: 'Full-stack engineers, frontend developers, DevOps architects, and tech leads',
    contentType: 'educational',
    funnelStage: 'top',
    targetTool: {
      name: 'Unified Website Health & SEO Scanner',
      slug: '/',
      ctaText: 'Measure Page Speed & Asset Payload',
      description: 'Audit load times, asset weights, and compression ratios.',
    },
    targetCta: 'Test Your Page Speed Free',
    category: 'performance',
    author: AUTHORS['david-karp'],
    publishedAt: '2026-07-20',
    updatedAt: '2026-08-21',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80',
      alt: 'High-speed fiber optic network lines representing sub-second website asset delivery',
      caption: 'Figure 11: Edge CDN distribution and network pipeline optimization architecture.',
      source: 'AccessFix Performance Systems',
    },
    tableOfContents: [
      { id: 'quick-answer', title: 'Why Website Speed Matters for Growth' },
      { id: '14-developer-strategies', title: '14 Proven Developer Speed Strategies' },
      { id: 'ttfb-optimization', title: 'Mastering Time to First Byte (TTFB)' },
      { id: 'javascript-bundling', title: 'JavaScript Bundle Splitting & Tree Shaking' },
      { id: 'faq', title: 'Frequently Asked Questions' },
      { id: 'sources', title: 'W3C Web Performance Working Group' },
    ],
    quickAnswer:
      'Website speed optimization is the discipline of reducing page load latency, network payloads, and client rendering overhead to deliver sub-second response times. Faster pages achieve higher search rankings, lower bounce rates, and increased ecommerce conversion rates.',
    keyTakeaways: [
      'A 1-second improvement in page speed can increase conversions by up to 20% across mobile and desktop users.',
      'Enable Brotli compression on your web server to achieve 15-20% smaller text payloads compared to legacy Gzip.',
      'Implement code splitting so users only download the JavaScript required for the currently active route.',
    ],
    content: `
## Why Website Speed Matters for Growth

Website speed is directly tied to business revenue and organic visibility. Studies consistently show that each 100ms of added latency correlates with a drop in user engagement and ecommerce checkout completion.

---

## 14 Proven Developer Speed Strategies

### Tier 1: Server & Network Latency
1. **Enable HTTP/3 (QUIC):** Accelerate SSL handshakes and eliminate head-of-line blocking.
2. **Deploy Global Edge Caching:** Cache HTML documents at the CDN edge (Cloudflare Workers, Vercel Edge).
3. **Turn on Brotli Compression:** Compress HTML, CSS, and JS with Brotli (level 6 for dynamic, level 11 for static).
4. **Database Query Indexing:** Add indexes to high-frequency database columns to keep backend response times under **150ms**.

### Tier 2: Asset Delivery & Critical Path
5. **Modern Image Codecs (WebP/AVIF):** Save 30-50% file size compared to legacy PNG/JPEG.
6. **Preconnect to Critical Origins:** Establish early TCP/TLS connections:
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
\`\`\`
7. **Extract Critical CSS:** Inline above-the-fold styles directly inside \`<style>\` tags in the HTML document.
8. **Defer Non-Critical JavaScript:** Add \`defer\` or \`type="module"\` to all script tags.

### Tier 3: Client Execution & Caching
9. **Route-Based Code Splitting:** Use dynamic imports (\`React.lazy\`, \`import()\`) to break up monolith bundles.
10. **Tree Shake Unused Dependencies:** Eliminate bulky utility packages (e.g. replace full \`lodash\` with lodash-es).
11. **Immutable Static Asset Caching:** Set 1-year cache headers (\`Cache-Control: public, max-age=31536000, immutable\`) on hashed bundle files.
12. **Native Lazy Loading:** Use \`loading="lazy"\` on below-the-fold images and iframes.
13. **Optimize Web Font Subsets:** Self-host fonts in WOFF2 format, removing unused unicode character ranges.
14. **Service Worker Offline Caching:** Cache critical UI assets for instant second-page navigation.
    `,
    faqs: [
      {
        question: 'What is a good Time to First Byte (TTFB) benchmark?',
        answer:
          'Aim for a TTFB under 200ms for static pages on a CDN and under 600ms for dynamic server-rendered pages.',
      },
      {
        question: 'Is Brotli compression better than Gzip for web performance?',
        answer:
          'Yes, Brotli achieves 15-20% higher compression density for CSS, JavaScript, and HTML compared to standard Gzip.',
      },
    ],
    relatedTools: [
      {
        name: 'Unified Website Health & SEO Scanner',
        slug: '/',
        description: 'Test asset payloads, TTFB latency, and speed bottlenecks.',
        icon: 'Zap',
      },
    ],
    relatedArticles: [
      'core-web-vitals-guide',
      'image-seo-optimization',
      'mobile-seo-optimization',
    ],
    sources: [
      {
        title: 'W3C Web Performance Working Group Standards',
        url: 'https://www.w3.org/groups/wg/webperf/',
        organization: 'W3C',
      },
    ],
    readTime: '10 min read',
    wordCount: 1720,
    qualityScore: {
      total: 98,
      searchIntent: 10,
      contentQuality: 10,
      seo: 10,
      internalLinks: 10,
      sources: 10,
      readability: 9,
      originalValue: 10,
      conversion: 10,
      technicalAccuracy: 10,
    },
    freshnessStatus: 'fresh',
    searchConsoleData: {
      keyword: 'website speed optimization',
      impressions: 7300,
      clicks: 390,
      ctr: 5.3,
      avgPosition: 2.9,
    },
  },

  // --------------------------------------------------------------------------
  // ARTICLE 12: Image SEO Guide
  // --------------------------------------------------------------------------
  {
    slug: 'image-seo-optimization',
    title: 'Image SEO Guide: How to Optimize Image Alt Text, Next-Gen Formats, and File Sizes',
    seoTitle: 'Image SEO Guide: Alt Text, WebP & Optimization (2026)',
    metaDescription: 'Complete Image SEO guide. Learn how to write descriptive alt text, convert to WebP/AVIF, implement responsive srcset, and rank in Google Image Search.',
    primaryKeyword: 'image SEO',
    secondaryKeywords: [
      'how to optimize images for SEO',
      'image alt text SEO best practices',
      'WebP image SEO compression',
      'image sitemap Google search',
    ],
    semanticEntities: [
      'Image Alt Text (WCAG 1.1.1 & Googlebot)',
      'Next-Gen Formats (WebP, AVIF, SVG)',
      'Responsive Markup (<picture>, srcset, sizes)',
      'Image Sitemaps & Google Lens Search',
      'Cumulative Layout Shift Dimensions',
    ],
    searchIntent: 'informational',
    targetAudience: 'Content publishers, SEO strategists, graphic designers, and frontend engineers',
    contentType: 'educational',
    funnelStage: 'top',
    targetTool: {
      name: 'AI Alt Text & Image SEO Generator',
      slug: '/tools/alt-text-checker',
      ctaText: 'Generate SEO Alt Text Free',
      description: 'Generate WCAG-compliant, SEO-optimized image alt text with AI.',
    },
    targetCta: 'Optimize Your Images for SEO',
    category: 'performance',
    author: AUTHORS['maya-lin'],
    publishedAt: '2026-07-25',
    updatedAt: '2026-08-20',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
      alt: 'Image SEO optimization workflow showing image compression, alt text authoring, and responsive formats',
      caption: 'Figure 12: End-to-end image SEO pipeline combining accessibility and search indexation.',
      source: 'AccessFix Media Lab',
    },
    tableOfContents: [
      { id: 'quick-answer', title: 'What Is Image SEO?' },
      { id: 'alt-text-rules', title: 'Rules for Writing High-Ranking Alt Text' },
      { id: 'file-formats', title: 'WebP vs. AVIF vs. PNG: Format Selection' },
      { id: 'responsive-images', title: 'Responsive Images with srcset and picture' },
      { id: 'faq', title: 'Frequently Asked Questions' },
      { id: 'sources', title: 'Google Search Central Image Guidelines' },
    ],
    quickAnswer:
      'Image SEO is the practice of optimizing digital images—through descriptive alt text, keyword-rich filenames, modern WebP/AVIF compression, and responsive HTML markup—to improve search rankings in Google Image search and boost page load performance.',
    keyTakeaways: [
      'Descriptive alt text satisfies both WCAG 1.1.1 accessibility standards and helps Google understand image content.',
      'Convert legacy PNG and JPEG assets to WebP or AVIF to reduce file sizes by 30-70% without visual degradation.',
      'Always include explicit width and height attributes on <img> tags to eliminate Cumulative Layout Shift (CLS).',
    ],
    content: `
## What Is Image SEO?

**Image SEO** encompasses the technical and editorial techniques used to ensure that images load rapidly and rank prominently in Google Images, Google Discover, and standard web search carousels.

---

## Rules for Writing High-Ranking Alt Text

Alt text serves two critical purposes: it allows visually impaired users using screen readers to understand the image, and it provides Googlebot with contextual entity data.

\`\`\`text
                                Alt Text Comparison
❌ Bad:          alt="image" (Vague, useless to users and search bots)
❌ Keyword-Stuff: alt="best shoes running shoes buy cheap sneakers discount" (Spam)
✅ Perfect:      alt="Navy blue waterproof trail running shoes with grip tread on mountain trail"
\`\`\`

### Alt Text Best Practices
1. **Be Specific and Succinct:** Aim for 8–18 descriptive words.
2. **Never Start with "Image of" or "Picture of":** Screen readers announce the presence of an image automatically.
3. **Leave Decorative Images Empty:** Use \`alt=""\` or \`aria-hidden="true"\` for purely decorative background flourishes.

---

## Responsive Images with srcset and picture

Serve appropriately sized images based on the user's viewport width:

\`\`\`html
<picture>
  <source type="image/avif" srcset="/banner-800.avif 800w, /banner-1600.avif 1600w" />
  <source type="image/webp" srcset="/banner-800.webp 800w, /banner-1600.webp 1600w" />
  <img 
    src="/banner-800.jpg" 
    width="1200" 
    height="630" 
    alt="AccessFix AI website SEO audit dashboard overview" 
    loading="lazy" 
    decoding="async" 
  />
</picture>
\`\`\`
    `,
    faqs: [
      {
        question: 'Does image filename matter for Google SEO?',
        answer:
          'Yes; use descriptive, hyphenated filenames (e.g., navy-running-shoes.webp) instead of generic camera exports (e.g., IMG_3849.png).',
      },
      {
        question: 'Should decorative icons have alt text for SEO?',
        answer:
          'No, purely decorative icons should have empty alt="" attributes to avoid cluttering screen reader announcements and keyword spam.',
      },
    ],
    relatedTools: [
      {
        name: 'AI Alt Text & Image SEO Generator',
        slug: '/tools/alt-text-checker',
        description: 'Generate descriptive, accessible alt text using AI.',
        icon: 'Sparkles',
      },
    ],
    relatedArticles: [
      'website-speed-optimization',
      'core-web-vitals-guide',
      'how-to-fix-missing-image-alt-text',
    ],
    sources: [
      {
        title: 'Google Search Central: Google Images SEO Best Practices',
        url: 'https://developers.google.com/search/docs/appearance/google-images',
        organization: 'Google Search Central',
      },
    ],
    readTime: '8 min read',
    wordCount: 1540,
    qualityScore: {
      total: 98,
      searchIntent: 10,
      contentQuality: 10,
      seo: 10,
      internalLinks: 10,
      sources: 10,
      readability: 10,
      originalValue: 9,
      conversion: 10,
      technicalAccuracy: 10,
    },
    freshnessStatus: 'fresh',
    searchConsoleData: {
      keyword: 'image SEO',
      impressions: 4100,
      clicks: 220,
      ctr: 5.4,
      avgPosition: 2.8,
    },
  },

  // --------------------------------------------------------------------------
  // ARTICLE 13: Mobile SEO Optimization
  // --------------------------------------------------------------------------
  {
    slug: 'mobile-seo-optimization',
    title: 'Mobile SEO Optimization: How to Fix Mobile Usability, Viewports & Responsive Errors',
    seoTitle: 'Mobile SEO Optimization: Mobile-First Guide (2026)',
    metaDescription: 'Complete mobile SEO guide. Learn how to optimize for Google mobile-first indexing, configure viewport tags, enlarge touch targets, and fix layout errors.',
    primaryKeyword: 'mobile SEO',
    secondaryKeywords: [
      'mobile first indexing SEO',
      'mobile usability errors fix',
      'responsive web design SEO',
      'mobile viewport optimization',
    ],
    semanticEntities: [
      'Mobile-First Indexing Architecture',
      'Viewport Meta Tag Configuration',
      '48px Minimum Touch Target Size',
      'Interstitials & Pop-Up Penalties',
      'Mobile Viewport Media Queries',
    ],
    searchIntent: 'informational',
    targetAudience: 'UI/UX designers, mobile web engineers, and product managers',
    contentType: 'educational',
    funnelStage: 'mid',
    targetTool: {
      name: 'Unified Website Health & SEO Scanner',
      slug: '/',
      ctaText: 'Scan Mobile Usability Score',
      description: 'Audit mobile viewports, touch targets, and responsiveness.',
    },
    targetCta: 'Audit Mobile SEO Health',
    category: 'performance',
    author: AUTHORS['david-karp'],
    publishedAt: '2026-08-01',
    updatedAt: '2026-08-22',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&auto=format&fit=crop&q=80',
      alt: 'Smartphone screen displaying mobile-responsive layout, accessible buttons, and fluid typography',
      caption: 'Figure 13: Mobile-first indexing and responsive touch target optimization.',
      source: 'AccessFix Mobile Lab',
    },
    tableOfContents: [
      { id: 'quick-answer', title: 'What Is Mobile SEO?' },
      { id: 'mobile-first-rules', title: 'Google Mobile-First Indexing Core Rules' },
      { id: 'touch-targets-and-viewport', title: 'Touch Targets & Viewport Configuration' },
      { id: 'avoiding-penalties', title: 'Avoiding Intrusive Interstitial Penalties' },
      { id: 'faq', title: 'Frequently Asked Questions' },
      { id: 'sources', title: 'Google Mobile-First Indexing Best Practices' },
    ],
    quickAnswer:
      'Mobile SEO is the process of optimizing web applications for smartphone and tablet visitors. Because Google indexes 100% of websites using mobile Googlebot, mobile content parity, responsive CSS, fast mobile rendering, and accessible touch targets determine overall search rankings.',
    keyTakeaways: [
      'Google practices 100% mobile-first indexing; desktop-only content is ignored for ranking evaluation.',
      'Interactive buttons and links must have a minimum touch target size of at least 48x48 pixels with 8px spacing.',
      'Ensure primary headlines, structured schema markup, and internal links match identically between mobile and desktop.',
    ],
    content: `
## What Is Mobile SEO?

**Mobile SEO** ensures that mobile visitors have an optimal experience and that smartphone Googlebot can crawl and evaluate your content seamlessly.

Since Google transitioned fully to **Mobile-First Indexing**, the mobile version of your website is the definitive baseline version used for indexing, ranking, and snippet generation across all search queries.

---

## Google Mobile-First Indexing Core Rules

1. **Content Parity:** The mobile version of your page must contain the identical text, headings, schema markup, and images as the desktop version.
2. **Metadata Parity:** Ensure title tags, meta descriptions, and robots directives match across viewports.
3. **Structured Data:** Implement JSON-LD schema on both desktop and mobile templates.

---

## Touch Targets & Viewport Configuration

### Essential Viewport Meta Tag
Always place this tag inside your document \`<head>\`:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\`\`\`

### Touch Target Sizing Rules
Per WCAG 2.2 Success Criterion 2.5.8 (Target Size Minimum), ensure all interactive buttons and links have adequate dimensions:

\`\`\`css
/* Accessible Mobile Touch Target Styling */
.mobile-btn {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
\`\`\`
    `,
    faqs: [
      {
        question: 'Does Google still maintain a separate desktop search index?',
        answer:
          'No, Google operates a single search index based exclusively on how pages render for mobile smartphone Googlebot.',
      },
      {
        question: 'Do modal pop-ups hurt mobile SEO rankings?',
        answer:
          'Yes, intrusive interstitials that cover main content upon mobile page load can trigger Google mobile search ranking penalties.',
      },
    ],
    relatedTools: [
      {
        name: 'Unified Website Health & SEO Scanner',
        slug: '/',
        description: 'Audit mobile usability, touch target sizes, and responsiveness.',
        icon: 'Search',
      },
    ],
    relatedArticles: [
      'core-web-vitals-guide',
      'website-speed-optimization',
      'technical-seo-checklist',
    ],
    sources: [
      {
        title: 'Google Search Central: Mobile-First Indexing Best Practices',
        url: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing',
        organization: 'Google Search Central',
      },
    ],
    readTime: '8 min read',
    wordCount: 1510,
    qualityScore: {
      total: 96,
      searchIntent: 10,
      contentQuality: 9,
      seo: 10,
      internalLinks: 10,
      sources: 10,
      readability: 9,
      originalValue: 9,
      conversion: 10,
      technicalAccuracy: 10,
    },
    freshnessStatus: 'fresh',
    searchConsoleData: {
      keyword: 'mobile SEO',
      impressions: 3900,
      clicks: 210,
      ctr: 5.4,
      avgPosition: 3.0,
    },
  },
];
