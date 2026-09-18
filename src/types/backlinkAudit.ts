export type LinkAttribute = 'dofollow' | 'nofollow' | 'ugc' | 'sponsored';

export type AnchorCategory =
  | 'branded'
  | 'exact_match'
  | 'partial_match'
  | 'generic'
  | 'naked_url'
  | 'toxic_spam';

export type PenaltyRiskLevel = 'LOW_RISK' | 'MODERATE_MONITOR' | 'CRITICAL_SPAM_PENALTY';

export interface BacklinkItem {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  sourceTitle?: string;
  contextSnippet?: string;
  targetUrl: string;
  targetSnippetBadge?: string;
  anchorText: string;
  anchorCategory: AnchorCategory;
  domainRating: number; // 0-100
  urlRating?: number; // 0-100
  pageAuthority: number; // 0-100
  linkAttribute: LinkAttribute;
  firstSeen: string;
  lastCrawled: string;
  spamScore: number; // 0-100%
  toxicFlags: string[];
  isToxic: boolean;
  isSuspicious: boolean;
  ipSubnet: string;
  country: string;
  selectedForDisavow: boolean;
}

export interface ToxicCluster {
  category: string;
  count: number;
  description: string;
  riskSeverity: 'critical' | 'high' | 'medium';
  examples: string[];
}

export interface BacklinkAuditReport {
  domain: string;
  normalizedUrl: string;
  timestamp: string;
  crawlDurationMs: number;
  totalBacklinks: number;
  totalReferringDomains: number;
  domainRating: number;
  overallSpamScore: number;
  toxicBacklinksCount: number;
  toxicDomainsCount: number;
  suspiciousBacklinksCount: number;
  cleanBacklinksCount: number;
  dofollowRatio: number;
  anchorDistribution: {
    branded: number;
    exactMatch: number;
    generic: number;
    nakedUrl: number;
    toxic: number;
  };
  tldDistribution: { [tld: string]: number };
  cClassSubnetDiversityScore: number; // 0-100
  penaltyRiskScore: number; // 0-100
  penaltyStatus: PenaltyRiskLevel;
  toxicClusters: ToxicCluster[];
  backlinks: BacklinkItem[];
}
