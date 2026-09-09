import {
  SitemapAuditReport,
  SitemapIssue,
  SitemapIssueCategory,
  SitemapIssueSeverity,
  SitemapUrlEntry,
} from '../types/sitemapAuditor';

// Valid W3C changefreq tokens strictly recognized by search engines
const VALID_CHANGEFREQS = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]);

// Helper to sanitize XML entities in URLs
export function escapeXmlEntities(str: string): string {
  return str
    .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Helper to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// W3C Date validation and parsing
export function parseAndNormalizeDate(rawDate: string | undefined): {
  isValid: boolean;
  normalizedDate: string;
  issueDescription?: string;
} {
  if (!rawDate || !rawDate.trim()) {
    const today = new Date().toISOString().split('T')[0];
    return { isValid: false, normalizedDate: today, issueDescription: 'Missing <lastmod> date.' };
  }

  const trimmed = rawDate.trim();

  // Standard W3C YYYY-MM-DD
  const ymdRegex = /^\d{4}-\d{2}-\d{2}$/;
  // ISO 8601 YYYY-MM-DDTHH:MM:SS+00:00 or Z
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

  if (ymdRegex.test(trimmed) || isoRegex.test(trimmed)) {
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      // Check for future dates
      const now = new Date();
      if (parsed.getTime() > now.getTime() + 86400000 * 2) {
        return {
          isValid: false,
          normalizedDate: now.toISOString().split('T')[0],
          issueDescription: `Future timestamp detected (${trimmed}). Search engines penalize falsified future lastmod tags.`,
        };
      }
      return { isValid: true, normalizedDate: trimmed.split('T')[0] };
    }
  }

  // Attempt recovery from common non-standard formats: MM/DD/YYYY or DD-MM-YYYY or unix timestamp
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const isoDate = parsed.toISOString().split('T')[0];
    return {
      isValid: false,
      normalizedDate: isoDate,
      issueDescription: `Date '${trimmed}' is not in W3C Datetime format. Converted to valid ISO format '${isoDate}'.`,
    };
  }

  const today = new Date().toISOString().split('T')[0];
  return {
    isValid: false,
    normalizedDate: today,
    issueDescription: `Unparseable date string '${trimmed}'. Replaced with current timestamp '${today}'.`,
  };
}

// Hierarchical priority calculator based on URL depth
export function calculateNormalizedPriority(url: string, index: number): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, '');
    if (!pathname || pathname === '') {
      return '1.0'; // Root homepage
    }
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) {
      return '0.8'; // Top-level landing pages / categories
    }
    if (segments.length === 2) {
      return '0.6'; // Sub-categories / deep guides / blog posts
    }
    return '0.4'; // Deep utility / pagination / nested records
  } catch {
    return index === 0 ? '1.0' : '0.6';
  }
}

// Master Audit Engine
export function auditSitemapXml(
  xmlContent: string,
  sourceName: string = 'Uploaded / Fetched Sitemap',
  sourceType: 'url' | 'upload' | 'preset' | 'paste' = 'url'
): SitemapAuditReport {
  const issues: SitemapIssue[] = [];
  const entries: SitemapUrlEntry[] = [];
  const seenLocs = new Set<string>();

  const trimmedXml = xmlContent.trim();
  const fileSizeBytes = new Blob([trimmedXml]).size;

  let isSitemapIndex = false;
  let hasXmlDeclaration = false;
  let hasCorrectNamespace = false;

  // 1. XML Declaration Check
  if (/^<\?xml\s+version=["']1\.0["']/i.test(trimmedXml)) {
    hasXmlDeclaration = true;
  } else {
    issues.push({
      id: 'issue-no-xml-decl',
      category: 'syntax_schema',
      severity: 'warning',
      title: 'Missing Standard XML Declaration',
      description: 'The sitemap file does not begin with the mandatory standard <?xml version="1.0" encoding="UTF-8"?> header.',
      impact: 'XML parsers and search engine robots may fail to determine the document encoding, risking character truncation.',
      recommendation: 'Prepend <?xml version="1.0" encoding="UTF-8"?> to the very first line of the document with zero leading whitespace.',
      autoFixed: true,
      fixedValue: '<?xml version="1.0" encoding="UTF-8"?>',
    });
  }

  // 2. Namespace Check
  if (trimmedXml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    hasCorrectNamespace = true;
  } else if (trimmedXml.includes('sitemaps.org/schemas/sitemap/0.9')) {
    hasCorrectNamespace = true;
  } else {
    issues.push({
      id: 'issue-missing-namespace',
      category: 'syntax_schema',
      severity: 'critical',
      title: 'Invalid or Missing Sitemaps.org XML Namespace',
      description: 'The root XML element is missing the required xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" attribute.',
      impact: 'Google Search Console will reject this file with the error "Invalid XML tag or missing namespace".',
      recommendation: 'Declare xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" on the root <urlset> or <sitemapindex> element.',
      autoFixed: true,
      fixedValue: 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    });
  }

  // 3. Sitemap Index vs Urlset Detection
  if (trimmedXml.includes('<sitemapindex') || trimmedXml.includes('</sitemapindex>')) {
    isSitemapIndex = true;
  }

  // 4. File Size & Limits
  if (fileSizeBytes > 50 * 1024 * 1024) {
    issues.push({
      id: 'issue-filesize-limit',
      category: 'size_limits',
      severity: 'critical',
      title: 'Sitemap Exceeds 50MB Uncompressed Limit',
      description: `File size is ${formatBytes(fileSizeBytes)}, which exceeds Google's strict 50MB uncompressed ceiling.`,
      impact: 'Search engines will abort crawling and reject the sitemap entirely in Search Console.',
      recommendation: 'Split the URLs across multiple child sitemaps and reference them inside a parent <sitemapindex> file.',
      autoFixed: false,
    });
  }

  // 5. Parse Document using DOMParser with Regex Fallback
  let parsedDoc: Document | null = null;
  let domParseError: string | null = null;

  try {
    const parser = new DOMParser();
    parsedDoc = parser.parseFromString(trimmedXml, 'text/xml');
    const parserErrorNode = parsedDoc.querySelector('parsererror');
    if (parserErrorNode) {
      domParseError = parserErrorNode.textContent || 'XML parsing error';
      issues.push({
        id: 'issue-xml-parser-error',
        category: 'syntax_schema',
        severity: 'critical',
        title: 'XML Syntax Malformation Detected',
        description: `Browser DOM parser reported syntax error: ${domParseError.split('\n')[0].slice(0, 180)}`,
        impact: 'Googlebot and Bingbot cannot build the URL index if the XML document contains syntax violations.',
        recommendation: 'Fix unescaped ampersands (&amp;), unmatched closing tags, or stray characters.',
        autoFixed: true,
      });
    }
  } catch (err: any) {
    domParseError = err.message || 'Parser failed';
  }

  // Extract URLs either via DOM or Regex fallback
  let rawUrls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
    imagesCount?: number;
    hreflangCount?: number;
  }> = [];

  if (parsedDoc && !domParseError) {
    const urlElements = parsedDoc.querySelectorAll(isSitemapIndex ? 'sitemap' : 'url');
    urlElements.forEach((el) => {
      const loc = el.querySelector('loc')?.textContent?.trim() || '';
      const lastmod = el.querySelector('lastmod')?.textContent?.trim();
      const changefreq = el.querySelector('changefreq')?.textContent?.trim();
      const priority = el.querySelector('priority')?.textContent?.trim();
      const imagesCount = el.querySelectorAll('image\\:image, image').length;
      const hreflangCount = el.querySelectorAll('xhtml\\:link, link[rel="alternate"]').length;

      if (loc) {
        rawUrls.push({
          loc,
          lastmod,
          changefreq,
          priority,
          imagesCount,
          hreflangCount,
        });
      }
    });
  }

  // Fallback: If DOMParser failed or found zero items, extract via regex
  if (rawUrls.length === 0) {
    const tagPattern = isSitemapIndex ? /<sitemap[\s\S]*?<\/sitemap>/gi : /<url[\s\S]*?<\/url>/gi;
    const matches: string[] = trimmedXml.match(tagPattern) || [];

    matches.forEach((block: string) => {
      const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/i);
      const lastmodMatch = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i);
      const changefreqMatch = block.match(/<changefreq>([\s\S]*?)<\/changefreq>/i);
      const priorityMatch = block.match(/<priority>([\s\S]*?)<\/priority>/i);

      if (locMatch && locMatch[1]) {
        rawUrls.push({
          loc: locMatch[1].trim(),
          lastmod: lastmodMatch ? lastmodMatch[1].trim() : undefined,
          changefreq: changefreqMatch ? changefreqMatch[1].trim() : undefined,
          priority: priorityMatch ? priorityMatch[1].trim() : undefined,
          imagesCount: (block.match(/<image:image/gi) || []).length,
          hreflangCount: (block.match(/rel="alternate"/gi) || []).length,
        });
      }
    });
  }

  // Check 50,000 URL limit
  if (rawUrls.length > 50000) {
    issues.push({
      id: 'issue-url-count-limit',
      category: 'size_limits',
      severity: 'critical',
      title: 'URL Limit Exceeded (> 50,000 URLs)',
      description: `Contains ${rawUrls.length.toLocaleString()} URLs, exceeding the 50,000 ceiling per sitemap.`,
      impact: 'Google Search Console will only read up to the first 50,000 URLs and ignore the remainder.',
      recommendation: 'Segment the URLs into smaller batches (e.g., 20,000 to 40,000 each) in a Sitemap Index file.',
      autoFixed: false,
    });
  }

  if (rawUrls.length === 0) {
    issues.push({
      id: 'issue-empty-sitemap',
      category: 'syntax_schema',
      severity: 'critical',
      title: 'Zero URL Entries Identified',
      description: 'The file contains no readable <url><loc>...</loc></url> or <sitemap><loc>...</loc></sitemap> nodes.',
      impact: 'CRAWL FAILURE: Google Search Console will report "Sitemap contains no URLs".',
      recommendation: 'Ensure your sitemap generation script outputs valid <url> blocks enclosing absolute URLs.',
      autoFixed: false,
    });
  }

  // Analyze each URL entry
  let httpCount = 0;
  let httpsCount = 0;
  let validLastmodCount = 0;
  let duplicateCount = 0;
  let totalPrioritySum = 0;
  let hasOverOptimizedPriority = false;
  let uniformPriority1Count = 0;

  // Track stats for repairs
  let repairedProtocolFixed = 0;
  let repairedDatesFormatted = 0;
  let repairedPrioritiesNormalized = 0;
  let repairedChangefreqNormalized = 0;
  let repairedDuplicatesRemoved = 0;
  let repairedEntitiesEscaped = 0;

  rawUrls.forEach((raw, idx) => {
    const entryIssues: SitemapIssue[] = [];
    const rawLoc = raw.loc;
    let cleanedLoc = rawLoc;

    // Check entity escaping in original loc
    if (rawLoc.includes('&') && !rawLoc.includes('&amp;')) {
      repairedEntitiesEscaped++;
      cleanedLoc = escapeXmlEntities(cleanedLoc);
      const issue: SitemapIssue = {
        id: `issue-unescaped-entity-${idx}`,
        category: 'syntax_schema',
        severity: 'critical',
        title: 'Unescaped Ampersand in URL',
        description: `URL contains bare '&' character: '${rawLoc.slice(0, 70)}...'`,
        impact: 'XML parsing crash: XML 1.0 requires ampersands in attributes and element content to be encoded as &amp;.',
        affectedUrl: rawLoc,
        recommendation: 'Replace bare "&" with "&amp;" in all XML query strings.',
        autoFixed: true,
        fixedValue: cleanedLoc,
      };
      entryIssues.push(issue);
      if (!issues.some((i) => i.id === 'issue-unescaped-entity-global')) {
        issues.push({
          ...issue,
          id: 'issue-unescaped-entity-global',
          title: 'Unescaped Ampersands in XML URLs',
          description: 'One or more URLs in the sitemap contain unescaped & characters instead of &amp;.',
        });
      }
    }

    // Check URL validity and protocol
    let parsedUrl: URL | null = null;
    let isRelative = false;
    let hasFragment = false;
    let isHttp = false;

    if (!rawLoc.startsWith('http://') && !rawLoc.startsWith('https://')) {
      isRelative = true;
      cleanedLoc = `https://${rawLoc.replace(/^\/+/, '')}`;
      entryIssues.push({
        id: `issue-relative-url-${idx}`,
        category: 'url_protocol',
        severity: 'critical',
        title: 'Relative URL in Sitemap',
        description: `Entry '${rawLoc}' is a relative path. Sitemaps mandate fully-qualified absolute URLs.`,
        impact: 'Google Search Console ignores all relative paths during indexing.',
        affectedUrl: rawLoc,
        recommendation: 'Provide absolute URLs starting with https://.',
        autoFixed: true,
        fixedValue: cleanedLoc,
      });
    } else {
      try {
        parsedUrl = new URL(rawLoc);
        if (parsedUrl.protocol === 'http:') {
          isHttp = true;
          httpCount++;
          // Auto fix to https
          cleanedLoc = cleanedLoc.replace(/^http:\/\//i, 'https://');
          repairedProtocolFixed++;
          entryIssues.push({
            id: `issue-http-protocol-${idx}`,
            category: 'url_protocol',
            severity: 'warning',
            title: 'Insecure HTTP Protocol URL',
            description: `URL uses insecure http:// protocol: '${rawLoc}'`,
            impact: 'Google prioritizes HTTPS. Including HTTP URLs may trigger redirect loops or split link equity signals.',
            affectedUrl: rawLoc,
            recommendation: 'Migrate sitemap URLs to secure https:// endpoints.',
            autoFixed: true,
            fixedValue: cleanedLoc,
          });
        } else if (parsedUrl.protocol === 'https:') {
          httpsCount++;
        }

        // Check for URL fragments #
        if (rawLoc.includes('#')) {
          hasFragment = true;
          cleanedLoc = cleanedLoc.split('#')[0];
          entryIssues.push({
            id: `issue-url-fragment-${idx}`,
            category: 'url_protocol',
            severity: 'critical',
            title: 'URL Contains Anchor Fragment (#)',
            description: `URL contains a hash fragment: '${rawLoc}'`,
            impact: 'Search crawlers do not index fragments in sitemaps; Google explicitly rejects fragment URLs in sitemaps.',
            affectedUrl: rawLoc,
            recommendation: 'Remove anchor fragments (e.g. #section) from sitemap URLs.',
            autoFixed: true,
            fixedValue: cleanedLoc,
          });
        }
      } catch {
        entryIssues.push({
          id: `issue-malformed-url-${idx}`,
          category: 'url_protocol',
          severity: 'critical',
          title: 'Malformed URL Syntax',
          description: `String '${rawLoc}' is not a valid RFC-compliant URL.`,
          impact: 'Crawlers will skip this entry with a 400 bad request or parse exception.',
          affectedUrl: rawLoc,
          recommendation: 'Ensure all URLs have valid domain names and URL-encoded query parameters.',
          autoFixed: false,
        });
      }
    }

    // Check Duplicates
    const normalizedLocForDedup = cleanedLoc.toLowerCase().replace(/\/+$/, '');
    let isDuplicate = false;
    if (seenLocs.has(normalizedLocForDedup)) {
      isDuplicate = true;
      duplicateCount++;
      repairedDuplicatesRemoved++;
      entryIssues.push({
        id: `issue-duplicate-url-${idx}`,
        category: 'duplicate_urls',
        severity: 'warning',
        title: 'Duplicate URL in Sitemap',
        description: `URL '${cleanedLoc}' appears more than once in the sitemap file.`,
        impact: 'Redundant crawl budget waste and conflicting lastmod signals in Search Console.',
        affectedUrl: cleanedLoc,
        recommendation: 'Deduplicate sitemap entries so each canonical URL is declared exactly once.',
        autoFixed: true,
      });
    } else {
      seenLocs.add(normalizedLocForDedup);
    }

    // Check lastmod
    const dateAudit = parseAndNormalizeDate(raw.lastmod);
    let cleanedLastmod = dateAudit.normalizedDate;
    if (dateAudit.isValid) {
      validLastmodCount++;
    } else {
      repairedDatesFormatted++;
      entryIssues.push({
        id: `issue-invalid-date-${idx}`,
        category: 'lastmod_date',
        severity: 'warning',
        title: 'Non-Standard or Missing <lastmod> Date',
        description: dateAudit.issueDescription || 'Invalid date format.',
        impact: 'Search engines rely on W3C dates to decide when to re-crawl cached content.',
        affectedUrl: cleanedLoc,
        recommendation: 'Format dates strictly as YYYY-MM-DD (e.g. 2026-09-09).',
        autoFixed: true,
        fixedValue: cleanedLastmod,
      });
    }

    // Check changefreq
    let cleanedChangefreq = raw.changefreq?.toLowerCase().trim();
    if (raw.changefreq) {
      if (!VALID_CHANGEFREQS.has(cleanedChangefreq || '')) {
        repairedChangefreqNormalized++;
        cleanedChangefreq = 'weekly';
        entryIssues.push({
          id: `issue-invalid-changefreq-${idx}`,
          category: 'changefreq',
          severity: 'notice',
          title: 'Invalid <changefreq> Value',
          description: `<changefreq>${raw.changefreq}</changefreq> is not recognized. Recognized: always, hourly, daily, weekly, monthly, yearly, never.`,
          impact: 'Search crawlers ignore invalid changefreq values; Google largely computes crawl frequencies dynamically.',
          affectedUrl: cleanedLoc,
          recommendation: 'Use valid lowercase change frequency tokens or omit the tag.',
          autoFixed: true,
          fixedValue: 'weekly',
        });
      }
    } else {
      cleanedChangefreq = idx === 0 ? 'daily' : 'weekly';
    }

    // Check priority
    let cleanedPriority = raw.priority?.trim();
    if (raw.priority) {
      const numPriority = parseFloat(raw.priority);
      if (isNaN(numPriority) || numPriority < 0.0 || numPriority > 1.0) {
        repairedPrioritiesNormalized++;
        cleanedPriority = calculateNormalizedPriority(cleanedLoc, idx);
        entryIssues.push({
          id: `issue-invalid-priority-${idx}`,
          category: 'priority',
          severity: 'warning',
          title: 'Priority Out of Allowed Range (0.0 to 1.0)',
          description: `<priority>${raw.priority}</priority> violates the sitemap specification (must be a float between 0.0 and 1.0).`,
          impact: 'Invalid priority tags cause validation warnings in Search Console.',
          affectedUrl: cleanedLoc,
          recommendation: 'Set priority between 0.0 and 1.0 based on structural depth.',
          autoFixed: true,
          fixedValue: cleanedPriority,
        });
      } else {
        totalPrioritySum += numPriority;
        if (numPriority === 1.0) {
          uniformPriority1Count++;
        }
      }
    } else {
      cleanedPriority = calculateNormalizedPriority(cleanedLoc, idx);
    }

    // Record Entry
    entries.push({
      id: `entry-${idx}`,
      loc: rawLoc,
      lastmod: raw.lastmod,
      changefreq: raw.changefreq,
      priority: raw.priority,
      hasImages: (raw.imagesCount || 0) > 0,
      imageCount: raw.imagesCount || 0,
      hasHreflang: (raw.hreflangCount || 0) > 0,
      hreflangCount: raw.hreflangCount || 0,
      issues: entryIssues,
      cleanedLoc,
      cleanedLastmod,
      cleanedChangefreq,
      cleanedPriority,
      isDuplicate,
      protocolWarning: isHttp,
    });
  });

  // Check for uniform over-optimized priority across the sitemap
  if (rawUrls.length > 5 && uniformPriority1Count / rawUrls.length > 0.8) {
    hasOverOptimizedPriority = true;
    issues.push({
      id: 'issue-priority-over-optimized',
      category: 'priority',
      severity: 'notice',
      title: 'Uniform Priority Dilution (Over 80% set to 1.0)',
      description: `${uniformPriority1Count} out of ${rawUrls.length} URLs have <priority>1.0</priority>. When all pages claim top priority, the priority signal becomes meaningless.`,
      impact: 'Search engines ignore the priority tag completely if there is no relative differentiation.',
      recommendation: 'Reserve 1.0 strictly for the homepage, 0.8 for primary hubs, 0.6 for articles/products, and 0.4 for utility pages.',
      autoFixed: true,
    });
  }

  // Consolidate global issues if not already in list
  if (httpCount > 0 && !issues.some((i) => i.id === 'issue-http-protocol-global')) {
    issues.push({
      id: 'issue-http-protocol-global',
      category: 'url_protocol',
      severity: 'warning',
      title: `${httpCount} Insecure HTTP URLs Found in Sitemap`,
      description: `Found ${httpCount} URLs using unencrypted http://. Google strongly recommends serving 100% HTTPS endpoints.`,
      impact: 'Crawl inefficiencies, mixed content alerts, and link equity dilution.',
      recommendation: 'Upgrade all URLs to https:// to ensure clean canonical indexing.',
      autoFixed: true,
    });
  }

  if (duplicateCount > 0 && !issues.some((i) => i.id === 'issue-duplicate-urls-global')) {
    issues.push({
      id: 'issue-duplicate-urls-global',
      category: 'duplicate_urls',
      severity: 'warning',
      title: `${duplicateCount} Duplicate URLs Detected`,
      description: `Found ${duplicateCount} instances where the same URL is repeated inside the sitemap.`,
      impact: 'Wasted crawl budget and ambiguity regarding canonical signals.',
      recommendation: 'Enforce unique canonical URLs in the sitemap output.',
      autoFixed: true,
    });
  }

  // Calculate Overall Health Score
  let score = 100;
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningsCount = issues.filter((i) => i.severity === 'warning').length;
  const noticesCount = issues.filter((i) => i.severity === 'notice').length;

  score -= criticalCount * 22;
  score -= warningsCount * 7;
  score -= noticesCount * 3;
  if (score < 10) score = 10;
  if (rawUrls.length === 0) score = 0;

  // GSC Readiness Status
  let gscReadinessStatus: 'ready' | 'needs_fixes' | 'critical_errors' = 'ready';
  let gscReadinessMessage = '100% Google Search Console Ready: Valid schema, canonical URLs, and W3C dates.';

  if (criticalCount > 0) {
    gscReadinessStatus = 'critical_errors';
    gscReadinessMessage = `CRITICAL ERRORS DETECTED: Google Search Console will reject this sitemap (${criticalCount} blocker${criticalCount > 1 ? 's' : ''}). Download the repaired version below.`;
  } else if (warningsCount > 0) {
    gscReadinessStatus = 'needs_fixes';
    gscReadinessMessage = `OPTIMIZATION RECOMMENDED: Search Console will parse the sitemap, but ${warningsCount} warning${warningsCount > 1 ? 's' : ''} dilute your crawl budget.`;
  }

  // Build the 100% GSC Compliant Repaired XML
  const hasImagesAnywhere = entries.some((e) => e.hasImages);
  const hasHreflangAnywhere = entries.some((e) => e.hasHreflang);

  let xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xmlHeader += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;
  if (hasImagesAnywhere) {
    xmlHeader += `\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`;
  }
  if (hasHreflangAnywhere) {
    xmlHeader += `\n        xmlns:xhtml="http://www.w3.org/1999/xhtml"`;
  }
  xmlHeader += `>\n`;

  const dedupedCleanEntries: SitemapUrlEntry[] = [];
  const emittedLocs = new Set<string>();

  entries.forEach((e) => {
    const key = e.cleanedLoc.toLowerCase().replace(/\/+$/, '');
    if (!emittedLocs.has(key)) {
      emittedLocs.add(key);
      dedupedCleanEntries.push(e);
    }
  });

  const urlBlocks = dedupedCleanEntries.map((e, idx) => {
    const priority = hasOverOptimizedPriority
      ? calculateNormalizedPriority(e.cleanedLoc, idx)
      : e.cleanedPriority || calculateNormalizedPriority(e.cleanedLoc, idx);

    let block = `  <url>\n`;
    block += `    <loc>${escapeXmlEntities(e.cleanedLoc)}</loc>\n`;
    if (e.cleanedLastmod) {
      block += `    <lastmod>${e.cleanedLastmod}</lastmod>\n`;
    }
    if (e.cleanedChangefreq) {
      block += `    <changefreq>${e.cleanedChangefreq}</changefreq>\n`;
    }
    block += `    <priority>${priority}</priority>\n`;
    block += `  </url>`;
    return block;
  });

  const repairedXml = `${xmlHeader}${urlBlocks.join('\n')}\n</urlset>`;

  const totalUrlsCount = rawUrls.length;
  const httpsPercentage = totalUrlsCount > 0 ? Math.round((httpsCount / totalUrlsCount) * 100) : 0;
  const validLastmodPercentage = totalUrlsCount > 0 ? Math.round((validLastmodCount / totalUrlsCount) * 100) : 0;
  const avgPriority = totalUrlsCount > 0 ? parseFloat((totalPrioritySum / totalUrlsCount).toFixed(2)) : 0.8;

  // Auto-fixed count
  const autoFixedCount =
    repairedProtocolFixed +
    repairedDatesFormatted +
    repairedDuplicatesRemoved +
    repairedEntitiesEscaped +
    (hasXmlDeclaration ? 0 : 1) +
    (hasCorrectNamespace ? 0 : 1);

  return {
    source: sourceName,
    sourceType,
    timestamp: new Date().toISOString(),
    isSitemapIndex,
    totalUrls: totalUrlsCount,
    overallHealthScore: score,
    gscReadinessStatus,
    gscReadinessMessage,
    stats: {
      criticalIssuesCount: criticalCount,
      warningsCount,
      noticesCount,
      autoFixedCount,
      httpsUrlCount: httpsCount,
      httpUrlCount: httpCount,
      httpsUrlPercentage: httpsPercentage,
      validLastmodCount,
      validLastmodPercentage,
      avgPriority,
      fileSizeBytes,
      fileSizeFormatted: formatBytes(fileSizeBytes),
      compressionSavingsEstimate: formatBytes(Math.round(fileSizeBytes * 0.72)),
      duplicateUrlsCount: duplicateCount,
    },
    repairedStats: {
      totalUrlsOutput: dedupedCleanEntries.length,
      removedDuplicates: repairedDuplicatesRemoved,
      protocolFixed: repairedProtocolFixed,
      datesFormatted: repairedDatesFormatted,
      prioritiesNormalized: repairedPrioritiesNormalized + (hasOverOptimizedPriority ? dedupedCleanEntries.length : 0),
      changefreqNormalized: repairedChangefreqNormalized,
      xmlEntitiesEscaped: repairedEntitiesEscaped,
    },
    issues,
    entries,
    originalXml: trimmedXml,
    repairedXml,
  };
}

// Preset Sitemaps for instant 1-click live testing
export const SITEMAP_PRESETS = [
  {
    id: 'ecommerce-with-flaws',
    label: 'E-Commerce Store (7 Flaws: Mixed HTTP, Bad Dates, Duplicates)',
    domain: 'https://myshopify-store.com/sitemap.xml',
    description: 'Typical production shop sitemap with insecure HTTP URLs, non-standard dates (MM/DD/YYYY), unescaped query ampersands, duplicate links, and uniform 1.0 priorities.',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myshopify-store.com/</loc>
    <lastmod>2026-09-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://myshopify-store.com/collections/summer-apparel</loc>
    <lastmod>08/15/2026</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myshopify-store.com/products/linen-shirt?color=blue&size=medium</loc>
    <lastmod>2026-08-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myshopify-store.com/products/linen-shirt</loc>
    <lastmod>2026-08-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myshopify-store.com/products/linen-shirt</loc>
    <lastmod>2026-08-22</lastmod>
    <changefreq>DAILY</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://myshopify-store.com/pages/about-us#team</loc>
    <lastmod>2027-12-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.5</priority>
  </url>
  <url>
    <loc>https://myshopify-store.com/blog/sustainable-fashion-trends-2026</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>/cart</loc>
    <changefreq>never</changefreq>
    <priority>0.1</priority>
  </url>
</urlset>`,
  },
  {
    id: 'saas-with-broken-namespace',
    label: 'SaaS Platform (Missing XML Namespace & Relative URLs)',
    domain: 'https://cloudflow-app.io/sitemap.xml',
    description: 'Malformed XML sitemap missing standard sitemaps.org namespace, with relative URLs and missing lastmod timestamps that cause Search Console parser rejections.',
    xml: `<urlset>
  <url>
    <loc>https://cloudflow-app.io/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cloudflow-app.io/features/automated-workflows</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cloudflow-app.io/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://cloudflow-app.io/docs/quickstart-guide</loc>
    <lastmod>Jan 15 2026</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cloudflow-app.io/integrations?category=crm&sort=popular</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>/privacy-policy</loc>
    <priority>0.3</priority>
  </url>
</urlset>`,
  },
  {
    id: 'clean-high-grade-publisher',
    label: 'Clean Media Publisher (98% Health Benchmark)',
    domain: 'https://technews-daily.org/sitemap.xml',
    description: 'Fully optimized sitemap adhering to strict Google Search Console standards with valid W3C dates, hierarchical priorities, and HTTPS URLs.',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://technews-daily.org/</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://technews-daily.org/category/artificial-intelligence</loc>
    <lastmod>2026-09-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://technews-daily.org/category/web-development</loc>
    <lastmod>2026-09-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://technews-daily.org/ai-breakthroughs-autumn-2026</loc>
    <lastmod>2026-09-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://technews-daily.org/nextjs-vs-vite-deep-dive</loc>
    <lastmod>2026-09-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`,
  },
];
