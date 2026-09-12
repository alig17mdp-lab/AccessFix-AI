import {
  GscIndexationReport,
  UrlIndexationAudit,
  IndexationIssue,
  GscIndexStatus,
} from '../types/indexationFixer';

export const GSC_PRESET_SCENARIOS: { label: string; url: string; description: string }[] = [
  {
    label: 'How to Fix 404 Error in Google Search Console',
    url: 'https://mystore.com/catalog/discontinued-spring-collection',
    description: 'Broken link returning HTTP 404 or Soft 404 in Search Console Page Indexing Report.',
  },
  {
    label: 'Discovered – Currently Not Indexed (Orphan & Low Inlinks)',
    url: 'https://mystore.com/products/wireless-earbuds-pro-v2',
    description: 'Product page indexed in sitemap but starved of internal inlinks and unique copy.',
  },
  {
    label: 'Crawled – Currently Not Indexed (Thin Content & Low Entity Density)',
    url: 'https://saasplatform.io/features/cloud-sync-overview',
    description: 'Page crawled by Googlebot but discarded from index due to thin content and template boilerplates.',
  },
  {
    label: 'Duplicate / Canonical Mismatch Warning',
    url: 'https://brandagency.com/services/seo-consulting?ref=google_cpc',
    description: 'Parameter URL crawled without self-referencing canonical tag or clean normalization.',
  },
  {
    label: 'Page with Redirect (301 / Chained Redirection)',
    url: 'https://mystore.com/old-category-redirect',
    description: 'URL excluded under "Page with redirect" in GSC with un-updated internal links.',
  },
  {
    label: 'Healthy, Fully Optimized & GSC Indexed URL',
    url: 'https://accessfix.ai/blog/site-comparison-engine-guide',
    description: 'Pristine article with 1,000+ words, 12 internal inlinks, and self-canonical header.',
  },
];

export function auditUrlForIndexation(rawUrl: string): UrlIndexationAudit {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const urlLower = url.toLowerCase();
  const issues: IndexationIssue[] = [];
  const remediationPlan: string[] = [];

  let httpStatus = 200;
  let isSelfCanonical = true;
  let canonicalUrl = url;
  let internalInlinksCount = 8;
  let wordCount = 1150;
  let entityCount = 24;
  let robotsDirective = 'index, follow, max-snippet:-1, max-image-preview:large';
  let primaryStatus: GscIndexStatus = 'healthy_indexable';
  let statusLabel = 'Indexed & Fully Eligible';
  let estimatedCrawlTier: 'high' | 'medium' | 'starved' = 'high';

  // Deterministic simulation based on URL parameters or common problem patterns
  if (urlLower.includes('discontinued') || urlLower.includes('404') || urlLower.includes('not-found') || urlLower.includes('broken')) {
    primaryStatus = 'not_found_404';
    statusLabel = 'Not Found (404 Error in Search Console)';
    httpStatus = 404;
    internalInlinksCount = 3;
    wordCount = 65;
    entityCount = 1;
    estimatedCrawlTier = 'starved';

    issues.push({
      id: 'crit_http_404',
      title: 'HTTP 404 Not Found Status in Page Indexing Report',
      severity: 'critical',
      category: 'http_status',
      description: 'Googlebot encountered an HTTP 404 (Not Found) error when attempting to fetch this URL. The URL is still linked internally or submitted via an outdated sitemap.',
      technicalDetails: 'HTTP Status: 404 Not Found. Googlebot continues retrying 404 URLs if internal links point to them.',
      suggestedFix: 'Implement a 301 permanent redirect to a closely matching active product/category, or return an explicit HTTP 410 (Gone) header if permanently removed. Remove all internal links and purge from sitemap.',
      codeSnippet: `# Nginx 301 Permanent Redirect
location = /catalog/discontinued-spring-collection {
    return 301 /catalog/new-spring-collection;
}

# Or return HTTP 410 Gone to speed up de-indexing:
# location = /catalog/discontinued-spring-collection { return 410; }`,
    });

    remediationPlan.push('Check if an active equivalent page exists and deploy a 301 redirect.');
    remediationPlan.push('If permanently deleted with no replacement, configure server to return HTTP 410 Gone to expedite de-indexing.');
    remediationPlan.push('Scan internal links and remove references to this broken URL across site navigation.');
    remediationPlan.push('Remove URL from XML sitemap and resubmit sitemap in Google Search Console.');
  } else if (urlLower.includes('redirect') || urlLower.includes('301') || urlLower.includes('chained')) {
    primaryStatus = 'redirect_chain';
    statusLabel = 'Page with Redirect (301/302 Excluded in GSC)';
    httpStatus = 301;
    internalInlinksCount = 5;
    wordCount = 0;
    entityCount = 0;
    estimatedCrawlTier = 'medium';

    issues.push({
      id: 'warn_redirect_chain',
      title: 'Page Excluded Under "Page with redirect" in GSC',
      severity: 'warning',
      category: 'http_status',
      description: 'This URL redirects to another target. While redirects are normal, having internal links or XML sitemap entries pointing to redirected URLs wastes crawl budget and delays indexation.',
      technicalDetails: 'HTTP Status: 301 Moved Permanently. Destination must be the primary canonical URL.',
      suggestedFix: 'Update all internal links and XML sitemap URLs to point directly to the final destination URL, bypassing the redirect hop.',
      codeSnippet: `// Next.js direct link update
// Before: <Link href="/old-category-redirect">
// After:
<Link href="/catalog/main-category">View Category</Link>`,
    });

    remediationPlan.push('Update all internal anchor links to point directly to the destination URL.');
    remediationPlan.push('Ensure the XML sitemap lists only final destination URLs (200 OK), never redirected URLs.');
    remediationPlan.push('Verify redirect destination returns 200 OK with a self-referencing canonical tag.');
  } else if (urlLower.includes('earbuds') || urlLower.includes('discovered') || urlLower.includes('orphan')) {
    primaryStatus = 'discovered_not_indexed';
    statusLabel = 'Discovered – Currently Not Indexed';
    internalInlinksCount = 1;
    wordCount = 240;
    entityCount = 4;
    estimatedCrawlTier = 'starved';

    issues.push({
      id: 'crit_internal_inlinks',
      title: 'Severe Internal Link Starvation (Orphan Status)',
      severity: 'critical',
      category: 'internal_links',
      description: 'Googlebot discovered this URL via the sitemap, but detected fewer than 2 internal HTML links pointing to it from the root domain.',
      technicalDetails: 'Internal inlinks: 1. URLs with < 3 inlinks are queued with low crawl priority in Google Search Console.',
      suggestedFix: 'Add at least 3 to 5 contextual anchor links from authoritative category pages or relevant blog posts.',
      codeSnippet: `<a href="${url}">Explore our flagship wireless earbuds pro guide</a>`,
    });

    issues.push({
      id: 'warn_thin_content',
      title: 'Low Word Count & Thin Entity Density',
      severity: 'warning',
      category: 'content_depth',
      description: 'The page contains under 300 words of primary content, causing Googlebot to prioritize higher-value pages during indexing evaluation.',
      technicalDetails: 'Detected 240 words and only 4 semantic entities. Minimum threshold for indexation stability is 450 words.',
      suggestedFix: 'Expand original product descriptions, add customer FAQs, and integrate structured JSON-LD product schema.',
    });

    remediationPlan.push('Bridge internal link equity by adding anchor links from your navigation menu or homepage banner.');
    remediationPlan.push('Expand content body with 300+ words of unique descriptions and user FAQs.');
    remediationPlan.push('Ping Google Search Console URL Inspection API after publishing internal link updates.');
  } else if (urlLower.includes('sync-overview') || urlLower.includes('crawled') || urlLower.includes('thin')) {
    primaryStatus = 'crawled_not_indexed';
    statusLabel = 'Crawled – Currently Not Indexed';
    internalInlinksCount = 4;
    wordCount = 180;
    entityCount = 5;
    estimatedCrawlTier = 'medium';

    issues.push({
      id: 'crit_crawled_quality',
      title: 'Content Quality Gate Discard',
      severity: 'critical',
      category: 'content_depth',
      description: 'Googlebot successfully downloaded the HTML (200 OK) but discarded it from the active search index because it determined the page adds insufficient unique value compared to existing web pages.',
      technicalDetails: 'Page word count: 180 words. Template-to-content ratio is heavily skewed toward header and footer boilerplate.',
      suggestedFix: 'Re-write the page with comprehensive analytical data, step-by-step feature workflows, and original screenshots.',
    });

    issues.push({
      id: 'warn_schema_missing',
      title: 'Missing Structured Data & Entity Grounding',
      severity: 'warning',
      category: 'canonical',
      description: 'No JSON-LD WebApplication or Article schema detected. Structured data clarifies entity relationships to search algorithms.',
      technicalDetails: 'No schema.org microdata or JSON-LD blocks found in the HTML body.',
      suggestedFix: 'Inject JSON-LD schema defining the exact product features and software requirements.',
      codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Cloud Sync Feature",
  "operatingSystem": "All"
}
</script>`,
    });

    remediationPlan.push('Eliminate template bloat and add 500+ words of original feature documentation.');
    remediationPlan.push('Deploy validated JSON-LD schema with complete entity definitions.');
    remediationPlan.push('Request re-indexing via GSC URL Inspection console.');
  } else if (urlLower.includes('?ref=') || urlLower.includes('cpc') || urlLower.includes('param') || urlLower.includes('duplicate')) {
    primaryStatus = 'canonical_mismatch';
    statusLabel = 'Canonical Mismatch & Parameter Pollution';
    isSelfCanonical = false;
    canonicalUrl = url.split('?')[0];
    internalInlinksCount = 2;
    estimatedCrawlTier = 'medium';

    issues.push({
      id: 'crit_param_canonical',
      title: 'Missing Self-Referencing Canonical Tag on Parameter URL',
      severity: 'critical',
      category: 'canonical',
      description: 'This URL contains tracking query parameters (?ref=google_cpc) but lacks a self-referencing canonical tag pointing back to the clean master URL.',
      technicalDetails: `Request URL: ${url} | Inferred Master Canonical: ${canonicalUrl}`,
      suggestedFix: `Add an explicit rel="canonical" link in the <head> pointing strictly to the clean URL without parameters.`,
      codeSnippet: `<link rel="canonical" href="${canonicalUrl}" />`,
    });

    remediationPlan.push(`Ensure the canonical tag strictly references ${canonicalUrl}.`);
    remediationPlan.push('Configure Google Search Console URL Parameter settings or canonical headers.');
    remediationPlan.push('Ensure internal links never link to parameter versions.');
  } else {
    // Healthy indexable URL
    primaryStatus = 'healthy_indexable';
    statusLabel = 'Fully Indexed & High Priority';
    internalInlinksCount = 14;
    wordCount = 1250;
    entityCount = 28;
    estimatedCrawlTier = 'high';

    issues.push({
      id: 'info_healthy',
      title: 'Indexation Signals Optimal',
      severity: 'info',
      category: 'content_depth',
      description: 'This URL satisfies all major Google Search Console indexation criteria: clean 200 OK status, strong internal link equity, and comprehensive topical depth.',
      technicalDetails: 'Internal inlinks: 14 | Word count: 1,250 | Schema validated.',
      suggestedFix: 'Maintain fresh publication dates (<lastmod>) in your XML sitemap and continue building relevant inbound citations.',
    });

    remediationPlan.push('Maintain consistent internal linking from newly published blog posts.');
    remediationPlan.push('Monitor Search Console impressions for organic position growth.');
  }

  // Calculate indexability score
  let score = 100;
  issues.forEach((iss) => {
    if (iss.severity === 'critical') score -= 35;
    if (iss.severity === 'warning') score -= 15;
  });
  if (internalInlinksCount < 3) score -= 10;
  if (wordCount < 300) score -= 15;
  const indexabilityScore = Math.max(12, Math.min(100, score));

  return {
    url,
    indexabilityScore,
    primaryStatus,
    statusLabel,
    httpStatus,
    canonicalUrl,
    isSelfCanonical,
    internalInlinksCount,
    wordCount,
    entityCount,
    robotsDirective,
    estimatedCrawlTier,
    issues,
    remediationPlan,
  };
}

export function generateGscAuditReport(urls: string[]): GscIndexationReport {
  const cleanUrls = urls
    .map((u) => u.trim())
    .filter((u) => u.length > 3)
    .slice(0, 20); // Maximum 20 bulk URLs

  const results = cleanUrls.map(auditUrlForIndexation);

  let totalScore = 0;
  let criticalCount = 0;
  let warningCount = 0;
  let healthyCount = 0;
  let discoveredCount = 0;
  let crawledCount = 0;
  let notFoundCount = 0;

  results.forEach((r) => {
    totalScore += r.indexabilityScore;
    r.issues.forEach((iss) => {
      if (iss.severity === 'critical') criticalCount++;
      if (iss.severity === 'warning') warningCount++;
    });
    if (r.primaryStatus === 'healthy_indexable') healthyCount++;
    if (r.primaryStatus === 'discovered_not_indexed') discoveredCount++;
    if (r.primaryStatus === 'crawled_not_indexed') crawledCount++;
    if (r.primaryStatus === 'not_found_404') notFoundCount++;
  });

  const overallHealthScore = results.length > 0 ? Math.round(totalScore / results.length) : 100;

  const actionPlan: string[] = [];
  if (notFoundCount > 0) {
    actionPlan.push(`Fix ${notFoundCount} 404 (Not Found) error URLs: deploy 301 redirects to replacement pages or serve HTTP 410 Gone, and purge internal link references.`);
  }
  if (discoveredCount > 0) {
    actionPlan.push(`Resolve ${discoveredCount} 'Discovered – currently not indexed' URLs by linking them from top-level navigational hubs and high-authority articles.`);
  }
  if (crawledCount > 0) {
    actionPlan.push(`Expand content depth on ${crawledCount} 'Crawled – currently not indexed' pages with original data, user FAQs, and structured JSON-LD schemas.`);
  }
  if (criticalCount > 0) {
    actionPlan.push(`Fix ${criticalCount} critical canonical or status code errors before submitting manual re-crawl requests in Google Search Console.`);
  }
  if (actionPlan.length === 0) {
    actionPlan.push('All evaluated URLs show strong indexation signals. Maintain healthy sitemap freshness.');
  }

  return {
    timestamp: new Date().toISOString(),
    analyzedUrlsCount: results.length,
    overallHealthScore,
    results,
    summary: {
      criticalCount,
      warningCount,
      healthyCount,
      discoveredCount,
      crawledCount,
      notFoundCount,
    },
    recommendedActionPlan: actionPlan,
  };
}
