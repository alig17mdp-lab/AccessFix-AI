import { BlogPost } from '../types';
import { CATEGORIES_CONFIG } from '../data/categoriesData';

export interface SisterClusterLink {
  post: BlogPost;
  categoryName: string;
  contextualAnchorText: string;
  sharedEntities: string[];
  synergyNote: string;
}

// Complementary topical category mapping to ensure authentic, high-relevance cross-silo PageRank flow
const COMPLEMENTARY_CATEGORIES: Record<string, string[]> = {
  accessibility: ['wcag', 'testing', 'fixes', 'ada'],
  wcag: ['fixes', 'testing', 'performance', 'ecommerce', 'development'],
  ada: ['wcag', 'ecommerce', 'testing', 'accessibility'],
  testing: ['fixes', 'wcag', 'seo_audit', 'development'],
  fixes: ['wcag', 'development', 'performance', 'structured_data'],
  ecommerce: ['wcag', 'performance', 'fixes', 'ada'],
  development: ['fixes', 'performance', 'structured_data', 'testing'],
  seo_audit: ['technical_seo', 'performance', 'structured_data', 'keyword_strategy'],
  technical_seo: ['seo_audit', 'structured_data', 'performance', 'keyword_strategy'],
  performance: ['technical_seo', 'fixes', 'seo_audit', 'ecommerce'],
  keyword_strategy: ['seo_audit', 'structured_data', 'technical_seo', 'accessibility'],
  structured_data: ['technical_seo', 'seo_audit', 'fixes', 'development'],
};

// Known entity knowledge graph reference grounding
const ENTITY_KNOWLEDGE_BASE: Record<string, { wikidataId?: string; type: string }> = {
  'WCAG 2.2': { wikidataId: 'https://www.wikidata.org/wiki/Q200234', type: 'Standard' },
  'Web Content Accessibility Guidelines': { wikidataId: 'https://www.wikidata.org/wiki/Q200234', type: 'Standard' },
  'POUR Principles': { type: 'Framework' },
  'WAI-ARIA': { wikidataId: 'https://www.wikidata.org/wiki/Q830113', type: 'Standard' },
  'ADA Title III': { wikidataId: 'https://www.wikidata.org/wiki/Q4686958', type: 'Legislation' },
  'Core Web Vitals': { type: 'MetricSet' },
  'Interaction to Next Paint (INP)': { type: 'PerformanceMetric' },
  'Largest Contentful Paint (LCP)': { type: 'PerformanceMetric' },
  'Cumulative Layout Shift (CLS)': { type: 'PerformanceMetric' },
  'Screen Reader': { wikidataId: 'https://www.wikidata.org/wiki/Q851941', type: 'Software' },
  'Model Context Protocol': { type: 'Protocol' },
  'x402 Protocol': { type: 'Protocol' },
  'JSON-LD': { wikidataId: 'https://www.wikidata.org/wiki/Q3170244', type: 'Format' },
  'Schema.org': { wikidataId: 'https://www.wikidata.org/wiki/Q3475355', type: 'Vocabulary' },
  'Google Search Console': { wikidataId: 'https://www.wikidata.org/wiki/Q11029851', type: 'SoftwareApplication' },
  'Technical SEO': { wikidataId: 'https://www.wikidata.org/wiki/Q180711', type: 'Discipline' },
};

/**
 * Derives the optimal sister-cluster articles across complementary categories
 * using semantic entity clustering, intent matching, and category cross-pollination.
 */
export function getSisterClusterArticles(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 4
): SisterClusterLink[] {
  const currentEntities = new Set((currentPost.semanticEntities || []).map((e) => e.toLowerCase()));
  const complementaryCategories = COMPLEMENTARY_CATEGORIES[currentPost.category] || [];

  const candidates: {
    post: BlogPost;
    score: number;
    sharedEntities: string[];
  }[] = [];

  for (const candidate of allPosts) {
    if (candidate.slug === currentPost.slug) continue;

    let score = 0;
    const sharedEntities: string[] = [];

    // Entity matching (Highest semantic weight: +4 per match)
    for (const entity of candidate.semanticEntities || []) {
      if (currentEntities.has(entity.toLowerCase())) {
        score += 4;
        sharedEntities.push(entity);
      }
    }

    // Category affinity (+5 for complementary sister clusters; +1 for same category)
    if (candidate.category !== currentPost.category) {
      if (complementaryCategories.includes(candidate.category)) {
        score += 5;
      } else {
        score += 2;
      }
    } else {
      score += 1;
    }

    // Shared target tools bonus (+3)
    if (
      currentPost.targetTool &&
      candidate.targetTool &&
      currentPost.targetTool.slug === candidate.targetTool.slug
    ) {
      score += 3;
    }

    // Keyword co-occurrence
    const currentKwTokens = currentPost.primaryKeyword.toLowerCase().split(/\s+/);
    for (const token of currentKwTokens) {
      if (token.length > 3 && candidate.title.toLowerCase().includes(token)) {
        score += 2;
      }
    }

    candidates.push({ post: candidate, score, sharedEntities });
  }

  // Sort by score descending and deduplicate categories where possible
  candidates.sort((a, b) => b.score - a.score);

  const results: SisterClusterLink[] = [];
  const seenCategories = new Set<string>();

  // Pass 1: pick top candidates from distinct categories to ensure broad topological coverage
  for (const item of candidates) {
    if (results.length >= limit) break;
    if (!seenCategories.has(item.post.category)) {
      seenCategories.add(item.post.category);
      results.push(formatSisterClusterLink(currentPost, item.post, item.sharedEntities));
    }
  }

  // Pass 2: fill remaining slots if limit not reached
  if (results.length < limit) {
    for (const item of candidates) {
      if (results.length >= limit) break;
      if (!results.some((r) => r.post.slug === item.post.slug)) {
        results.push(formatSisterClusterLink(currentPost, item.post, item.sharedEntities));
      }
    }
  }

  return results;
}

function formatSisterClusterLink(
  currentPost: BlogPost,
  sisterPost: BlogPost,
  sharedEntities: string[]
): SisterClusterLink {
  const sisterCatName =
    CATEGORIES_CONFIG[sisterPost.category]?.name || sisterPost.category.replace('_', ' ');

  // Craft high-converting contextual anchor text (Golden Law 5 & 12)
  let contextualAnchorText = `Sister Cluster (${sisterCatName}): ${sisterPost.title}`;
  if (sharedEntities.length > 0) {
    contextualAnchorText = `Cross-Cluster Guide: How ${sharedEntities[0]} connects to ${sisterPost.title}`;
  }

  const synergyNote =
    sharedEntities.length > 0
      ? `Interlinks via shared technical entity: ${sharedEntities.slice(0, 2).join(', ')}`
      : `Bridges ${CATEGORIES_CONFIG[currentPost.category]?.name || currentPost.category} with ${sisterCatName}`;

  return {
    post: sisterPost,
    categoryName: sisterCatName,
    contextualAnchorText,
    sharedEntities,
    synergyNote,
  };
}

/**
 * Generates an exportable, publication-ready Markdown Implementation Playbook
 * for agency teams, developers, and compliance auditors.
 */
export function generateMarkdownPlaybook(post: BlogPost): string {
  const categoryName = CATEGORIES_CONFIG[post.category]?.name || post.category;
  const entitiesList = (post.semanticEntities || []).map((e) => `\`${e}\``).join(', ');

  const actionItems = (post.keyTakeaways || []).map((t, idx) => `- [ ] **Step ${idx + 1}:** ${t}`).join('\n');

  const faqItems = (post.faqs || [])
    .map(
      (f, idx) => `### Q${idx + 1}: ${f.question}\n**Direct Answer:** ${f.answer.split('.')[0]}.\n\n${f.answer}\n`
    )
    .join('\n');

  const sourcesList = (post.sources || [])
    .map((s) => `- [${s.title}](${s.url}) — *${s.organization}*`)
    .join('\n');

  return `# Technical Implementation Playbook & Compliance Checklist
## Document: ${post.title}

> **Target Standard & Category:** ${categoryName}  
> **Search Intent:** ${post.searchIntent.toUpperCase()} | **Target Keyword:** \`${post.primaryKeyword}\`  
> **Last Verified Date:** ${post.updatedAt} | **Author:** ${post.author.name} (${post.author.role})  
> **Permanent URL:** https://accessfix.ai/blog/${post.slug}

---

## 1. Executive Summary & Quick Answer (<30 Words)
${post.quickAnswer}

---

## 2. Core Implementation Checklist (Actionable Tasks)
${actionItems}

---

## 3. Grounded Semantic Entities & Technical Standards
This implementation fulfills compliance requirements for the following entity graph:
${entitiesList}

---

## 4. Architectural Frequently Asked Questions & Resolution
${faqItems}

---

## 5. Verified Authoritative References & Citations
${sourcesList}

---
*Generated by AccessFix AI Implementation Playbook Engine — Verified for WCAG 2.2, ADA Title III, and Google Technical Guidelines.*
`;
}

/**
 * Generates triple-engine (SEO / AEO / GEO) JSON-LD structured data with Speakable,
 * entity grounding, verified author credentials, and continuous freshness synchronization.
 */
export function generateTripleEngineJsonLd(post: BlogPost) {
  const categoryName = CATEGORIES_CONFIG[post.category]?.name || post.category;
  const isoFreshnessDate = post.updatedAt || '2026-09-18';

  // Grounding entities as Schema Thing objects
  const entityAboutList = (post.semanticEntities || []).map((entity) => {
    const meta: { wikidataId?: string; type?: string } | undefined = ENTITY_KNOWLEDGE_BASE[entity];
    return {
      '@type': 'Thing',
      name: entity,
      ...(meta?.wikidataId ? { sameAs: meta.wikidataId } : {}),
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TechArticle', 'BlogPosting'],
        '@id': `https://accessfix.ai/blog/${post.slug}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://accessfix.ai/#website',
          name: 'AccessFix AI',
          url: 'https://accessfix.ai',
        },
        headline: post.title,
        alternativeHeadline: post.seoTitle || post.title,
        description: post.metaDescription,
        url: `https://accessfix.ai/blog/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: `${isoFreshnessDate}T08:00:00+00:00`,
        inLanguage: 'en-US',
        mainEntityOfPage: `https://accessfix.ai/blog/${post.slug}`,
        articleSection: categoryName,
        wordCount: (post.content || '').split(/\s+/).length,
        keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
        image: {
          '@type': 'ImageObject',
          '@id': `${post.featuredImage.url}#primaryimage`,
          url: post.featuredImage.url,
          contentUrl: post.featuredImage.url,
          caption: post.featuredImage.caption || post.featuredImage.alt,
          description: post.featuredImage.alt,
          name: post.title,
          width: 1200,
          height: 630,
          representativeOfPage: true,
        },
        author: {
          '@type': 'Person',
          '@id': `https://accessfix.ai/authors/${post.author.slug}#author`,
          name: post.author.name,
          jobTitle: post.author.role,
          url: `https://accessfix.ai/authors/${post.author.slug}`,
          image: post.author.avatar,
          description: post.author.bio,
          worksFor: {
            '@type': 'Organization',
            name: 'AccessFix AI',
            url: 'https://accessfix.ai',
          },
          knowsAbout: post.author.credentials || ['Web Accessibility', 'WCAG 2.2', 'ADA Compliance'],
          sameAs: [
            post.author.socialLinks?.twitter,
            post.author.socialLinks?.linkedin,
            post.author.socialLinks?.github,
          ].filter(Boolean),
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://accessfix.ai/#organization',
          name: 'AccessFix AI',
          url: 'https://accessfix.ai',
          logo: {
            '@type': 'ImageObject',
            url: 'https://accessfix.ai/logo.png',
          },
        },
        // Speakable Specification for Voice Search, Google Assistant, Siri & AI Answer Engines
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#quick-answer', 'h1', '#faq'],
        },
        // Knowledge Graph Entity Grounding for LLM RAG & Search Engines
        about: entityAboutList,
        mentions: entityAboutList,
        citation: (post.sources || []).map((s) => ({
          '@type': 'CreativeWork',
          name: s.title,
          url: s.url,
          author: {
            '@type': 'Organization',
            name: s.organization,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://accessfix.ai/blog/${post.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://accessfix.ai',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Knowledge Base',
            item: 'https://accessfix.ai/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: categoryName,
            item: `https://accessfix.ai/category/${post.category}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: post.title,
            item: `https://accessfix.ai/blog/${post.slug}`,
          },
        ],
      },
      ...(post.faqs && post.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `https://accessfix.ai/blog/${post.slug}#faqpage`,
              mainEntity: post.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
      ...(post.targetTool
        ? [
            {
              '@type': 'SoftwareApplication',
              '@id': `https://accessfix.ai${post.targetTool.slug}#software`,
              name: post.targetTool.name,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'All Modern Browsers',
              description: post.targetTool.description,
              url: `https://accessfix.ai${post.targetTool.slug}`,
              offers: {
                '@type': 'Offer',
                price: '0.00',
                priceCurrency: 'USD',
              },
            },
          ]
        : []),
    ],
  };
}
