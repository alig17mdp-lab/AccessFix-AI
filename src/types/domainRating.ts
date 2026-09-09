export interface BacklinkItem {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  sourceDr: number;
  sourceDa: number;
  isDofollow: boolean;
  linkType: 'editorial' | 'guest_post' | 'directory' | 'resource_page' | 'forum' | 'comment';
  firstSeenDate: string;
  trafficEstimate: number;
  spamScore: number;
}

export interface RankingKeywordItem {
  id: string;
  keyword: string;
  rank: number;
  previousRank: number;
  searchVolume: number;
  keywordDifficulty: number; // 0-100
  cpc: number; // in USD
  intent: 'informational' | 'transactional' | 'commercial' | 'navigational';
  trafficShare: number; // monthly estimated clicks
  rankingUrl: string;
  serpFeatures: string[];
}

export interface CompetitorDomainItem {
  domain: string;
  domainRating: number;
  domainAuthority: number;
  commonKeywords: number;
  totalKeywords: number;
  organicTraffic: number;
  totalBacklinks: number;
  referringDomains: number;
  overlapPercent: number;
  authorityGap: number; // your DR - competitor DR
}

export interface SuggestedBacklinkSite {
  id: string;
  targetDomain: string;
  targetPageUrl: string;
  pageTitle: string;
  targetDr: number;
  targetDa: number;
  strategyCategory: 'guest_post' | 'resource_page' | 'broken_link' | 'digital_pr' | 'expert_roundup';
  relevanceNiche: string;
  outreachDifficulty: 'low' | 'medium' | 'high';
  expectedAuthorityLift: string;
  contactMethod: string;
  suggestedPitchAngle: string;
  competitorBacklinkCount: number; // How many competitors already have a link here
}

export interface AnchorDistributionItem {
  anchorCategory: 'branded' | 'exact_match' | 'partial_match' | 'naked_url' | 'generic';
  percentage: number;
  count: number;
  status: 'optimal' | 'moderate_risk' | 'penalty_risk';
  description: string;
}

export interface HistoricalDrDataPoint {
  month: string;
  dr: number;
  da: number;
  referringDomains: number;
  totalBacklinks: number;
  organicTraffic: number;
}

export interface DomainRatingReport {
  domain: string;
  rootDomain: string;
  analyzedAt: string;
  domainRating: number; // 0-100 (Ahrefs standard)
  domainAuthority: number; // 0-100 (Moz standard)
  urlRating: number; // 0-100
  spamScore: number; // 0-100%
  totalBacklinks: number;
  liveBacklinks: number;
  lostBacklinks: number;
  referringDomains: number;
  referringIps: number;
  cClassSubnets: number;
  dofollowCount: number;
  nofollowCount: number;
  dofollowPercent: number;
  nofollowPercent: number;
  eduGovLinksCount: number;
  organicKeywordsCount: number;
  keywordsInTop3: number;
  keywordsInTop10: number;
  keywordsInTop20: number;
  keywordsInTop50: number;
  keywordsInTop100: number;
  monthlyOrganicTraffic: number;
  organicTrafficValueUsd: number;
  anchorDistribution: AnchorDistributionItem[];
  linkAuthorityTiers: {
    tier: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  verifiedBacklinks: BacklinkItem[];
  topRankingKeywords: RankingKeywordItem[];
  competitors: CompetitorDomainItem[];
  suggestedBacklinkSites: SuggestedBacklinkSite[];
  historicalTrend: HistoricalDrDataPoint[];
  expertRecommendations: {
    priority: 'urgent' | 'high' | 'medium';
    category: 'Link Velocity' | 'Anchor Profile' | 'Content Expansion' | 'Disavow Audit' | 'Competitor Gap';
    title: string;
    description: string;
    actionStep: string;
    estimatedDrLift: string;
  }[];
}
