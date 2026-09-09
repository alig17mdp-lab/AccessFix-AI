export type SitemapInputMode = 'url' | 'upload' | 'preset' | 'paste';

export type SitemapIssueSeverity = 'critical' | 'warning' | 'notice' | 'info';

export type SitemapIssueCategory =
  | 'syntax_schema'
  | 'url_protocol'
  | 'lastmod_date'
  | 'changefreq'
  | 'priority'
  | 'size_limits'
  | 'search_console_compliance'
  | 'hreflang_extensions'
  | 'duplicate_urls';

export interface SitemapIssue {
  id: string;
  category: SitemapIssueCategory;
  severity: SitemapIssueSeverity;
  title: string;
  description: string;
  impact: string;
  affectedUrl?: string;
  line?: number;
  rawSnippet?: string;
  recommendation: string;
  autoFixed: boolean;
  fixedValue?: string;
}

export interface SitemapUrlEntry {
  id: string;
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  hasImages?: boolean;
  imageCount?: number;
  hasHreflang?: boolean;
  hreflangCount?: number;
  issues: SitemapIssue[];
  // Repaired / Normalized values
  cleanedLoc: string;
  cleanedLastmod?: string;
  cleanedChangefreq?: string;
  cleanedPriority?: string;
  isDuplicate?: boolean;
  protocolWarning?: boolean;
}

export interface SitemapAuditReport {
  source: string;
  sourceType: 'url' | 'upload' | 'preset' | 'paste';
  timestamp: string;
  isSitemapIndex: boolean;
  totalUrls: number;
  overallHealthScore: number; // 0 to 100
  gscReadinessStatus: 'ready' | 'needs_fixes' | 'critical_errors';
  gscReadinessMessage: string;
  stats: {
    criticalIssuesCount: number;
    warningsCount: number;
    noticesCount: number;
    autoFixedCount: number;
    httpsUrlCount: number;
    httpUrlCount: number;
    httpsUrlPercentage: number;
    validLastmodCount: number;
    validLastmodPercentage: number;
    avgPriority: number;
    fileSizeBytes: number;
    fileSizeFormatted: string;
    compressionSavingsEstimate: string;
    duplicateUrlsCount: number;
  };
  repairedStats: {
    totalUrlsOutput: number;
    removedDuplicates: number;
    protocolFixed: number;
    datesFormatted: number;
    prioritiesNormalized: number;
    changefreqNormalized: number;
    xmlEntitiesEscaped: number;
  };
  issues: SitemapIssue[];
  entries: SitemapUrlEntry[];
  originalXml: string;
  repairedXml: string;
}
