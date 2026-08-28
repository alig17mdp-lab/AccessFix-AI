import { ArticleCategory } from '../types';

export interface CategoryInfo {
  slug: ArticleCategory;
  name: string;
  seoTitle: string;
  metaDescription: string;
  headline: string;
  description: string;
  iconName: string;
  popularTopics: string[];
}

export const CATEGORIES_CONFIG: Record<ArticleCategory, CategoryInfo> = {
  accessibility: {
    slug: 'accessibility',
    name: 'Accessibility Fundamentals',
    seoTitle: 'Web Accessibility Guides & Best Practices | AccessFix AI',
    metaDescription: 'Learn foundational digital accessibility principles. Understand POUR, inclusive UX design, and universal accessibility standards for modern web applications.',
    headline: 'Web Accessibility Foundations & Best Practices',
    description: 'Foundational concepts, universal design principles, and strategic engineering frameworks to make digital applications accessible to all users.',
    iconName: 'ShieldCheck',
    popularTopics: ['POUR Principles', 'Assistive Technology', 'Inclusive UX', 'Universal Design'],
  },
  wcag: {
    slug: 'wcag',
    name: 'WCAG 2.1 & 2.2 Standards',
    seoTitle: 'WCAG 2.1 & 2.2 Compliance Guides & Checklists | AccessFix AI',
    metaDescription: 'Comprehensive WCAG 2.1 and WCAG 2.2 Level A, AA, and AAA checklists, technical breakdowns, and success criteria explained for developers.',
    headline: 'Web Content Accessibility Guidelines (WCAG) Standards',
    description: 'Deep technical breakdowns of W3C WCAG 2.1 and 2.2 success criteria, Level A/AA requirements, and practical compliance rules.',
    iconName: 'FileCheck',
    popularTopics: ['WCAG 2.2 Checklist', 'Level AA Requirements', 'Target Size 2.5.8', 'Focus Visibility'],
  },
  ada: {
    slug: 'ada',
    name: 'ADA & Legal Compliance',
    seoTitle: 'ADA Website Compliance & Legal Guidelines | AccessFix AI',
    metaDescription: 'Understand ADA Title III website compliance requirements, US DOJ regulations, legal lawsuit risk mitigation, and court precedents.',
    headline: 'ADA Title III & Digital Accessibility Law',
    description: 'Legal requirements, Department of Justice rulings, Title III court precedents, and risk mitigation strategies for business website owners.',
    iconName: 'Scale',
    popularTopics: ['ADA Title III', 'DOJ Regulations', 'Lawsuit Prevention', 'Demand Letter Defense'],
  },
  testing: {
    slug: 'testing',
    name: 'Accessibility Testing & Audits',
    seoTitle: 'Website Accessibility Testing & Audit Guides | AccessFix AI',
    metaDescription: 'Learn how to test websites for accessibility with automated scanners, manual keyboard navigation, and screen reader verification tools.',
    headline: 'Accessibility Testing & Auditing Methodologies',
    description: 'Hands-on testing tutorials, automated diagnostic scanning workflows, manual keyboard checklists, and screen reader testing guides.',
    iconName: 'CheckCircle2',
    popularTopics: ['Automated Scanners', 'Keyboard Testing', 'Screen Readers (NVDA/VoiceOver)', 'CI/CD Audits'],
  },
  fixes: {
    slug: 'fixes',
    name: 'Code Fixes & Remediation',
    seoTitle: 'Accessibility Code Fixes & Remediation Guides | AccessFix AI',
    metaDescription: 'Step-by-step developer code fixes for missing alt text, poor color contrast, missing form labels, and focus traps in HTML, CSS, and React.',
    headline: 'Accessibility Code Fixes & Remediation',
    description: 'Direct, copy-pasteable developer code solutions for color contrast, alt text, ARIA attributes, semantic HTML, and accessible components.',
    iconName: 'Code',
    popularTopics: ['Color Contrast Fixes', 'Image Alt Text', 'Form Labels', 'Accessible Modals'],
  },
  ecommerce: {
    slug: 'ecommerce',
    name: 'Ecommerce Accessibility',
    seoTitle: 'Ecommerce Accessibility & ADA Store Compliance | AccessFix AI',
    metaDescription: 'Guides for Shopify, WooCommerce, and ecommerce compliance. Fix cart drawers, product variant swatches, checkout funnels, and filters.',
    headline: 'Ecommerce Store Accessibility & ADA Compliance',
    description: 'Specialized optimization guides for online retailers, covering Shopify themes, WooCommerce, accessible drawer carts, and checkout flows.',
    iconName: 'ShoppingBag',
    popularTopics: ['Shopify Accessibility', 'Cart Drawer Traps', 'Product Swatches', 'Accessible Checkout'],
  },
  development: {
    slug: 'development',
    name: 'Developer & Design Systems',
    seoTitle: 'Accessible Web Development & Design Systems | AccessFix AI',
    metaDescription: 'Engineering accessible component libraries, ARIA design patterns, keyboard kinematics, and automated CI/CD accessibility testing.',
    headline: 'Accessible Engineering & Design Systems',
    description: 'Advanced technical architectural guides for front-end engineers, component library authors, and design system creators.',
    iconName: 'Terminal',
    popularTopics: ['Accessible Design Tokens', 'ARIA Patterns', 'Focus Management', 'CI/CD Testing'],
  },
  seo_audit: {
    slug: 'seo_audit',
    name: 'SEO Website Health',
    seoTitle: 'Website SEO Audits, Health & Architecture Guides | AccessFix AI',
    metaDescription: 'Practical guides to website SEO auditing, on-page optimization, diagnostic checks, and automated health scanning.',
    headline: 'SEO Website Health & Audit Architecture',
    description: 'In-depth diagnostic frameworks, on-page checklists, and automated SEO health scanning strategies to maximize search visibility.',
    iconName: 'Search',
    popularTopics: ['Website SEO Audit', 'On-Page SEO Checklist', 'Technical Health Scans', 'SEO Score Remediation'],
  },
  technical_seo: {
    slug: 'technical_seo',
    name: 'Technical SEO',
    seoTitle: 'Technical SEO Guides: Canonical URLs, Robots.txt & Sitemaps | AccessFix AI',
    metaDescription: 'Master technical SEO fundamentals: canonical tags, robots.txt directives, XML sitemaps, redirect chains, and broken link resolution.',
    headline: 'Technical SEO & Crawlability Architecture',
    description: 'Core infrastructure guides covering crawl budget, indexation control, canonicalization, redirect graphs, and HTTP error fixes.',
    iconName: 'Code2',
    popularTopics: ['Canonical URLs', 'Robots.txt Rules', 'XML Sitemaps', 'Broken Link Fixes', 'Redirect Chains'],
  },
  performance: {
    slug: 'performance',
    name: 'Website Performance',
    seoTitle: 'Core Web Vitals & Website Speed Optimization | AccessFix AI',
    metaDescription: 'Optimize Core Web Vitals (LCP, INP, CLS), page speed, image delivery, and mobile responsiveness for better rankings and conversions.',
    headline: 'Core Web Vitals & Web Performance',
    description: 'Engineering workflows to reduce Largest Contentful Paint (LCP), prevent layout shifts (CLS), minimize INP, and accelerate TTFB.',
    iconName: 'Zap',
    popularTopics: ['Core Web Vitals', 'Page Speed Optimization', 'Image SEO & WebP', 'Mobile SEO & Usability'],
  },
  keyword_strategy: {
    slug: 'keyword_strategy',
    name: 'Keywords & Content',
    seoTitle: 'Keyword Research, Clustering & Content Briefs | AccessFix AI',
    metaDescription: 'Strategic keyword research methods: finding low-competition search queries, keyword clustering, content gap analysis, and content briefs.',
    headline: 'Keyword Strategy & Content Architecture',
    description: 'Data-driven content strategy guides detailing topic clustering, low-competition commercial keywords, gap identification, and editorial briefs.',
    iconName: 'Globe',
    popularTopics: ['Low-Competition Keywords', 'Keyword Clustering', 'Content Gap Analysis', 'SEO Content Briefs'],
  },
  structured_data: {
    slug: 'structured_data',
    name: 'Structured Data & SERP',
    seoTitle: 'Schema Markup, JSON-LD & SERP Optimization | AccessFix AI',
    metaDescription: 'Implement JSON-LD Schema markup, internal linking architecture, rich snippets, and SERP click-through rate (CTR) optimization.',
    headline: 'Structured Data, Schema & SERP Enhancement',
    description: 'Technical tutorials for JSON-LD schema deployment, internal PageRank flow, SERP snippet CTR tuning, and rich result verification.',
    iconName: 'Layers',
    popularTopics: ['JSON-LD Schema', 'Internal Linking Architecture', 'SERP CTR Optimization', 'Rich Snippet Tuning'],
  },
};
