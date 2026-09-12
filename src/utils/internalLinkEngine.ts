import {
  InternalLinkAuditReport,
  InternalPageNode,
  LinkBridgeRecommendation,
} from '../types/internalLinkAnalyzer';

export const LINK_PRESET_SCENARIOS = [
  {
    label: 'E-Commerce Store (Orphan Products & Leaking Footer)',
    domain: 'https://myshopify-store.com',
    description: 'High internal PageRank concentrated in /privacy-policy and /terms, leaving product catalog starved.',
  },
  {
    label: 'SaaS Platform (Hub-and-Spoke Pillar Structure)',
    domain: 'https://saascrm.com',
    description: 'Disciplined topic clusters with bidirectional links between pillar guides and feature landing pages.',
  },
  {
    label: 'Publishing Blog (Deep 5-Click Pagination Trap)',
    domain: 'https://techmagazine.org',
    description: 'Valuable legacy articles buried 5+ clicks deep in infinite paginated archives without topical silos.',
  },
];

export function analyzeInternalLinkGraph(domain: string): InternalLinkAuditReport {
  const cleanDomain = domain.replace(/\/+$/, '');
  const domainLower = cleanDomain.toLowerCase();

  let nodes: InternalPageNode[] = [];
  let recommendations: LinkBridgeRecommendation[] = [];

  if (domainLower.includes('shopify') || domainLower.includes('store') || domainLower.includes('ecommerce')) {
    // E-Commerce with orphan products
    nodes = [
      {
        id: 'p1',
        url: `${cleanDomain}/`,
        title: 'Homepage',
        inlinkCount: 42,
        outlinkCount: 38,
        internalPageRank: 9.8,
        crawlDepth: 1,
        status: 'healthy',
        primaryAnchorSample: ['Home', 'Brand Name', 'Logo'],
      },
      {
        id: 'p2',
        url: `${cleanDomain}/privacy-policy`,
        title: 'Privacy Policy & Terms',
        inlinkCount: 36,
        outlinkCount: 2,
        internalPageRank: 8.2,
        crawlDepth: 2,
        status: 'pagerank_leak',
        primaryAnchorSample: ['Privacy Policy', 'Terms of Service'],
      },
      {
        id: 'p3',
        url: `${cleanDomain}/collections/summer-sale`,
        title: 'Summer Sale Collection',
        inlinkCount: 14,
        outlinkCount: 24,
        internalPageRank: 6.4,
        crawlDepth: 2,
        status: 'healthy',
        primaryAnchorSample: ['Shop Summer Sale', 'Discounted Items'],
      },
      {
        id: 'p4',
        url: `${cleanDomain}/products/ergonomic-desk-chair`,
        title: 'Ergonomic Desk Chair Pro',
        inlinkCount: 1,
        outlinkCount: 6,
        internalPageRank: 2.1,
        crawlDepth: 4,
        status: 'underlinked',
        primaryAnchorSample: ['View item'],
      },
      {
        id: 'p5',
        url: `${cleanDomain}/products/wireless-charging-pad-v3`,
        title: 'Wireless Fast Charger Pad',
        inlinkCount: 0,
        outlinkCount: 4,
        internalPageRank: 1.1,
        crawlDepth: 99,
        status: 'orphan',
        primaryAnchorSample: [],
      },
    ];

    recommendations = [
      {
        sourceUrl: `${cleanDomain}/collections/summer-sale`,
        sourcePageRank: 6.4,
        targetUrl: `${cleanDomain}/products/wireless-charging-pad-v3`,
        recommendedAnchor: 'wireless fast charging pad',
        expectedEquityBoost: '+3.8 PageRank (Rescues from Orphan Status)',
      },
      {
        sourceUrl: `${cleanDomain}/`,
        sourcePageRank: 9.8,
        targetUrl: `${cleanDomain}/products/ergonomic-desk-chair`,
        recommendedAnchor: 'bestselling ergonomic desk chair',
        expectedEquityBoost: '+2.9 PageRank',
      },
    ];
  } else {
    // Standard SaaS or Healthy Hub
    nodes = [
      {
        id: 'p1',
        url: `${cleanDomain}/`,
        title: 'Platform Homepage',
        inlinkCount: 54,
        outlinkCount: 40,
        internalPageRank: 10.0,
        crawlDepth: 1,
        status: 'healthy',
        primaryAnchorSample: ['Home', 'Software', 'Logo'],
      },
      {
        id: 'p2',
        url: `${cleanDomain}/features`,
        title: 'Feature Tour & Capabilities',
        inlinkCount: 28,
        outlinkCount: 18,
        internalPageRank: 7.9,
        crawlDepth: 2,
        status: 'healthy',
        primaryAnchorSample: ['Features', 'Explore Platform'],
      },
      {
        id: 'p3',
        url: `${cleanDomain}/blog/seo-strategy-guide`,
        title: 'Complete SEO Strategy Guide (Pillar)',
        inlinkCount: 19,
        outlinkCount: 12,
        internalPageRank: 6.8,
        crawlDepth: 2,
        status: 'healthy',
        primaryAnchorSample: ['SEO strategy guide', 'Technical SEO tips'],
      },
      {
        id: 'p4',
        url: `${cleanDomain}/blog/keyword-density-mistakes`,
        title: '5 Common Keyword Density Mistakes',
        inlinkCount: 2,
        outlinkCount: 4,
        internalPageRank: 2.8,
        crawlDepth: 3,
        status: 'underlinked',
        primaryAnchorSample: ['read more', 'click here'],
      },
    ];

    recommendations = [
      {
        sourceUrl: `${cleanDomain}/blog/seo-strategy-guide`,
        sourcePageRank: 6.8,
        targetUrl: `${cleanDomain}/blog/keyword-density-mistakes`,
        recommendedAnchor: 'how to fix keyword density mistakes',
        expectedEquityBoost: '+2.4 PageRank',
      },
    ];
  }

  const orphanPagesCount = nodes.filter((n) => n.status === 'orphan').length;
  const deepPagesCount = nodes.filter((n) => n.crawlDepth >= 4 && n.crawlDepth < 90).length;
  const pageRankLeaksCount = nodes.filter((n) => n.status === 'pagerank_leak').length;

  let overallLinkingScore = 100;
  overallLinkingScore -= orphanPagesCount * 25;
  overallLinkingScore -= deepPagesCount * 12;
  overallLinkingScore -= pageRankLeaksCount * 15;
  overallLinkingScore = Math.max(20, Math.min(100, overallLinkingScore));

  return {
    analyzedUrl: cleanDomain,
    overallLinkingScore,
    totalPagesAnalyzed: nodes.length,
    orphanPagesCount,
    deepPagesCount,
    pageRankLeaksCount,
    nodes,
    recommendations,
  };
}
