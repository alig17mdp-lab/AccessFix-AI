export interface InternalPageNode {
  id: string;
  url: string;
  title: string;
  inlinkCount: number;
  outlinkCount: number;
  internalPageRank: number; // 1.0 - 10.0 scale
  crawlDepth: number; // 1 = Homepage, 2 = 1-click away, 3 = 2-clicks, 4+ = deep, 99 = orphan
  status: 'healthy' | 'orphan' | 'pagerank_leak' | 'underlinked';
  primaryAnchorSample: string[];
}

export interface LinkBridgeRecommendation {
  sourceUrl: string;
  sourcePageRank: number;
  targetUrl: string;
  recommendedAnchor: string;
  expectedEquityBoost: string;
}

export interface InternalLinkAuditReport {
  analyzedUrl: string;
  overallLinkingScore: number; // 0 - 100
  totalPagesAnalyzed: number;
  orphanPagesCount: number;
  deepPagesCount: number; // depth >= 4
  pageRankLeaksCount: number;
  nodes: InternalPageNode[];
  recommendations: LinkBridgeRecommendation[];
}
