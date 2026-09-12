export type GscIndexStatus =
  | 'discovered_not_indexed'
  | 'crawled_not_indexed'
  | 'canonical_mismatch'
  | 'not_found_404'
  | 'soft_404'
  | 'redirect_chain'
  | 'blocked_by_robots'
  | 'healthy_indexable';

export type FixSeverity = 'critical' | 'warning' | 'info';

export interface IndexationIssue {
  id: string;
  title: string;
  severity: FixSeverity;
  category: 'canonical' | 'internal_links' | 'content_depth' | 'crawl_budget' | 'http_status';
  description: string;
  technicalDetails: string;
  suggestedFix: string;
  codeSnippet?: string;
}

export interface UrlIndexationAudit {
  url: string;
  indexabilityScore: number; // 0 - 100
  primaryStatus: GscIndexStatus;
  statusLabel: string;
  httpStatus: number;
  canonicalUrl: string;
  isSelfCanonical: boolean;
  internalInlinksCount: number;
  wordCount: number;
  entityCount: number;
  robotsDirective: string;
  estimatedCrawlTier: 'high' | 'medium' | 'starved';
  issues: IndexationIssue[];
  remediationPlan: string[];
}

export interface GscIndexationReport {
  timestamp: string;
  analyzedUrlsCount: number;
  overallHealthScore: number;
  results: UrlIndexationAudit[];
  summary: {
    criticalCount: number;
    warningCount: number;
    healthyCount: number;
    discoveredCount: number;
    crawledCount: number;
    notFoundCount?: number;
  };
  recommendedActionPlan: string[];
}
