export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'passed';

export type IssueCategory = 
  | 'images'
  | 'headings'
  | 'links'
  | 'buttons'
  | 'forms'
  | 'color'
  | 'structure'
  | 'keyboard'
  | 'aria'
  | 'tables';

export type IssueStatus = 'open' | 'in_progress' | 'fixed' | 'ignored';

export interface AccessibilityIssue {
  id: string;
  title: string;
  category: IssueCategory;
  severity: SeverityLevel;
  wcagCriteria: string; // e.g. "WCAG 2.1 - 1.1.1 Non-text Content (Level A)"
  wcagLevel: 'A' | 'AA' | 'AAA';
  affectedUrl: string;
  affectedElement: string;
  selector?: string;
  htmlSnippet?: string;
  explanation: string;
  whyItMatters: string;
  recommendedFix: string;
  technicalFix: {
    html?: string;
    css?: string;
    react?: string;
    wordpress?: string;
    shopify?: string;
  };
  aiSuggestion?: {
    plainEnglishSummary?: string;
    businessImpact?: string;
    contentFix?: string;
    developerFix?: string;
  };
  status: IssueStatus;
  detectedAt: string;
}

export interface ScanSummary {
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  passedCount: number;
  score: number; // 0 to 100
  wcagBreakdown: {
    levelA: { total: number; passed: number };
    levelAA: { total: number; passed: number };
    levelAAA: { total: number; passed: number };
  };
  categoryBreakdown: Record<IssueCategory, { total: number; passed: number }>;
}

export interface ScanResult {
  id: string;
  targetUrl: string;
  scannedAt: string;
  durationMs: number;
  isSample?: boolean;
  score: number;
  summary: ScanSummary;
  executiveSummary: string;
  issues: AccessibilityIssue[];
  pageMetadata: {
    title?: string;
    language?: string;
    hasViewport?: boolean;
    totalElements?: number;
    totalImages?: number;
    totalHeadings?: number;
    totalLinks?: number;
    totalForms?: number;
  };
}

export interface MonitoredWebsite {
  id: string;
  url: string;
  name?: string;
  domain?: string;
  platform?: 'wordpress' | 'shopify' | 'wix' | 'webflow' | 'custom';
  monitoringFrequency?: 'daily' | 'weekly' | 'monthly';
  scanFrequency?: 'daily' | 'weekly' | 'monthly';
  lastScanDate?: string;
  lastScannedAt?: string;
  lastScore?: number;
  lastScanScore?: number;
  previousScore?: number;
  criticalIssuesCount?: number;
  highIssuesCount?: number;
  status?: 'healthy' | 'warning' | 'critical';
  autoAlertsEnabled?: boolean;
  alertEmail?: string;
  clientId?: string;
  lastScanResult?: ScanResult;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  role: 'user' | 'agency_admin' | 'super_admin' | 'admin';
  plan: 'free' | 'pro' | 'agency';
  scansUsedThisMonth?: number;
  scansThisMonth?: number;
  scansLimit?: number;
  websitesCount?: number;
  websitesLimit?: number;
  createdAt: string;
  avatarUrl?: string;
}

export interface AgencyClient {
  id: string;
  name: string;
  company: string;
  email: string;
  websitesCount: number;
  averageScore: number;
  activeIssues: number;
  createdDate: string;
  notes?: string;
}

export interface MonitoringAlert {
  id: string;
  websiteId: string;
  websiteUrl: string;
  date: string;
  type: 'score_drop' | 'new_critical_issue' | 'fixed_issue' | 'scheduled_digest';
  title: string;
  description: string;
  scoreChange?: number;
  read: boolean;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'agency';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  tagline: string;
  badge?: string;
  features: string[];
  limits: {
    scansPerMonth: number | 'Unlimited';
    monitoredWebsites: number;
    aiFixesPerMonth: number | 'Unlimited';
    whiteLabelReports: boolean;
    scheduledMonitoring: 'None' | 'Weekly/Monthly' | 'Daily/Weekly/Monthly';
    teamMembers: number;
  };
  ctaText: string;
  popular?: boolean;
}

// -------------------------------------------------------------
// ARTICLE & CONTENT ARCHITECTURE TYPES
// -------------------------------------------------------------

export type ArticleCategory =
  | 'accessibility'
  | 'wcag'
  | 'ada'
  | 'testing'
  | 'fixes'
  | 'ecommerce'
  | 'development'
  | 'seo_audit'
  | 'technical_seo'
  | 'performance'
  | 'keyword_strategy'
  | 'structured_data';

export type ContentWorkflowStatus =
  | 'idea'
  | 'researching'
  | 'brief_ready'
  | 'draft'
  | 'review'
  | 'published'
  | 'needs_update';

export type ContentCluster =
  | 'seo_health'
  | 'technical_seo'
  | 'performance'
  | 'keywords_content'
  | 'structured_data_serp';

export interface ArticleOpportunity {
  id: string;
  slug: string;
  title: string;
  titleOptions: [string, string, string];
  selectedTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  targetCountry: 'United States' | 'Canada' | 'United Kingdom' | 'Australia' | 'Global English';
  topicCluster: ContentCluster;
  clusterLabel: string;
  toolToPromote: {
    name: string;
    slug: string;
    ctaText: string;
    actionUrl: string;
  };
  keywordDataSource: string;
  searchVolumeVerified?: number | null;
  searchVolumeDisplay: string;
  difficultyVerified?: number | null;
  difficultyDisplay: string;
  cpcUsd?: number | null;
  cpcDisplay: string;
  trend: 'rising' | 'stable' | 'declining';
  opportunityScore: number; // 0-100 AccessFix Opportunity Score
  opportunityScoreBreakdown: {
    searchDemandWeight: number; // /25
    commercialIntentWeight: number; // /25
    toolSynergyWeight: number; // /25
    lowSerpFrictionWeight: number; // /25
    explanation: string;
  };
  businessValue: 'Very High' | 'High' | 'Medium';
  priority: 'P1 - Immediate' | 'P2 - High' | 'P3 - Core';
  status: ContentWorkflowStatus;
  userProblem: string;
  contentBriefSummary: string;
  targetPersona: string;
  publishedArticleSlug?: string;
}

export type ArticleContentType =
  | 'educational'           // Top-of-funnel traffic
  | 'problem_solution'      // Search traffic + tool conversion
  | 'testing_guide'         // High commercial intent
  | 'checklist'             // Evergreen SEO + backlinks
  | 'platform_content'      // Long-tail platform traffic
  | 'commercial_comparison'; // Bottom/mid-funnel traffic

export type SearchIntent =
  | 'informational'
  | 'commercial'
  | 'transactional'
  | 'navigational';

export type FunnelStage = 'top' | 'mid' | 'bottom';

export interface AuthorProfile {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  credentials?: string[];
  articlesCount?: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface ArticleSource {
  title: string;
  url: string;
  organization: string; // e.g. "W3C", "US Department of Justice", "ADA.gov"
}

export interface ArticleQualityScore {
  total: number; // /100
  searchIntent: number; // /10
  contentQuality: number; // /10
  seo: number; // /10
  internalLinks: number; // /10
  sources: number; // /10
  readability: number; // /10
  originalValue: number; // /10
  conversion: number; // /10
  technicalAccuracy: number; // /10
}

export interface SearchConsoleMetric {
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  isQuickWin?: boolean; // Position 11.0 to 20.0 with high impressions
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  semanticEntities: string[];
  searchIntent: SearchIntent;
  targetAudience: string;
  contentType: ArticleContentType;
  funnelStage: FunnelStage;
  targetTool: {
    name: string;
    slug: string;
    ctaText: string;
    description: string;
  };
  targetCta: string;
  category: ArticleCategory;
  author: AuthorProfile;
  publishedAt: string;
  updatedAt: string;
  featuredImage: {
    url: string;
    alt: string;
    caption?: string;
    source?: string;
  };
  tableOfContents: { id: string; title: string; level?: number }[];
  quickAnswer: string; // 40-60 word concise direct answer for featured snippets
  keyTakeaways: string[];
  content: string; // Markdown article body
  faqs: { question: string; answer: string }[];
  relatedTools: {
    name: string;
    slug: string;
    description: string;
    icon: string;
  }[];
  relatedArticles: string[]; // Slugs of related articles
  pillarSlug?: string; // If this article belongs to a pillar topic
  sources: ArticleSource[];
  readTime: string;
  wordCount: number;
  qualityScore: ArticleQualityScore;
  freshnessStatus: 'fresh' | 'review' | 'update';
  searchConsoleData?: SearchConsoleMetric;
}

export interface SeoValidationCheck {
  id: string;
  label: string;
  category: 'seo' | 'intent' | 'quality' | 'technical';
  passed: boolean;
  message: string;
}

export interface KeywordRecord {
  keyword: string;
  primaryUrl: string;
  articleTitle: string;
  searchIntent: SearchIntent;
  status: 'published' | 'draft' | 'planned';
}

export interface SeoPageData {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  category: 'core' | 'tools' | 'platforms' | 'audiences';
  targetKeywords: string[];
  wcagRelevance: string;
  overviewContent: string;
  keyFeatures: { title: string; description: string; iconName: string }[];
  commonFailures: { title: string; impact: string; fix: string }[];
  faqs: { question: string; answer: string }[];
  canonicalUrl: string;
}

// -------------------------------------------------------------
// UNIFIED WEBSITE HEALTH & GROWTH PLATFORM TYPES
// -------------------------------------------------------------

export type HealthPillar = 'accessibility' | 'seo' | 'technicalSeo' | 'performance' | 'content';

export type ActionImpact = 'high' | 'medium' | 'low';
export type ActionEffort = 'low' | 'medium' | 'high';

export interface PriorityActionItem {
  id: string;
  pillar: HealthPillar;
  category: string;
  title: string;
  impact: ActionImpact;
  effort: ActionEffort;
  isQuickWin: boolean; // High Impact + Low Effort
  scoreBoostEstimate: number; // e.g. +4 points
  explanation: string;
  businessConsequence: string;
  recommendedAction: string;
  affectedUrl?: string;
  affectedElement?: string;
  codeSnippetFix?: string;
  actionUrl?: string; // Link to tool or guide
}

export interface SeoAuditCheck {
  id: string;
  title: string;
  category: 'meta' | 'headings' | 'indexability' | 'links' | 'images' | 'schema' | 'urls';
  status: 'passed' | 'warning' | 'critical' | 'opportunity';
  scoreImpact: number;
  value?: string | number | null;
  expected?: string;
  details: string;
  recommendation: string;
  codeSnippet?: string;
}

export interface SeoAuditResult {
  score: number; // 0 to 100
  title: {
    text: string;
    length: number;
    status: 'good' | 'too_short' | 'too_long' | 'missing';
    recommended: string;
  };
  metaDescription: {
    text: string;
    length: number;
    status: 'good' | 'too_short' | 'too_long' | 'missing';
    recommended: string;
  };
  canonicalUrl: {
    found: string | null;
    isSelfReferencing: boolean;
    status: 'valid' | 'missing' | 'mismatched';
  };
  robotsMeta: {
    content: string | null;
    isIndexable: boolean;
    isFollowable: boolean;
  };
  headings: {
    h1Count: number;
    h1List: string[];
    h2Count: number;
    h3Count: number;
    hierarchyValid: boolean;
  };
  openGraph: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasImage: boolean;
    hasUrl: boolean;
    hasType: boolean;
    title?: string;
    description?: string;
    image?: string;
  };
  schema: {
    detectedTypes: string[];
    hasJsonLd: boolean;
    hasMicrodata: boolean;
    schemas: any[];
  };
  images: {
    total: number;
    missingAlt: number;
    largeImages: number;
  };
  links: {
    internalCount: number;
    externalCount: number;
    noFollowCount: number;
    genericAnchorsCount: number;
    genericAnchors: string[];
  };
  checks: SeoAuditCheck[];
  summary: {
    passed: number;
    warnings: number;
    critical: number;
    opportunities: number;
  };
}

export interface TechnicalSeoAuditResult {
  score: number;
  robotsTxt: {
    found: boolean;
    url: string;
    status: 'valid' | 'missing' | 'blocking_all';
    disallowedPaths: string[];
    sitemapUrls: string[];
    rawSnippet?: string;
  };
  sitemapXml: {
    found: boolean;
    url: string;
    status: 'valid' | 'missing' | 'error';
    urlCount: number;
    lastModDate?: string;
  };
  httpProtocol: {
    isHttps: boolean;
    statusCode: number;
    redirectCount: number;
    hasMixedContent: boolean;
    ttfbMs: number;
  };
  brokenLinks: {
    checkedCount: number;
    brokenCount: number;
    links: { url: string; anchorText: string; statusCode: number; statusText: string }[];
  };
  checks: SeoAuditCheck[];
}

export interface PerformanceAuditResult {
  score: number; // 0 to 100
  metrics: {
    lcp: { valueMs: number; rating: 'good' | 'needs_improvement' | 'poor'; label: string };
    cls: { value: number; rating: 'good' | 'needs_improvement' | 'poor'; label: string };
    inp: { valueMs: number; rating: 'good' | 'needs_improvement' | 'poor'; label: string };
    ttfb: { valueMs: number; rating: 'good' | 'needs_improvement' | 'poor'; label: string };
    fcp: { valueMs: number; rating: 'good' | 'needs_improvement' | 'poor'; label: string };
  };
  pageWeight: {
    totalSizeKb: number;
    htmlSizeKb: number;
    cssSizeKb: number;
    jsSizeKb: number;
    imageSizeKb: number;
    totalRequests: number;
  };
  opportunities: {
    title: string;
    estimatedSavingsMs: number;
    estimatedSavingsKb?: number;
    description: string;
    fixGuide: string;
  }[];
}

export interface ContentAuditResult {
  score: number;
  wordCount: number;
  estimatedReadTimeMin: number;
  fleschKincaidReadingEase: number;
  readingGradeLevel: string;
  headingDensityScore: number;
  detectedTopicEntities: string[];
  topKeywords: { keyword: string; count: number; density: number }[];
  thinContentRisk: boolean;
  duplicateContentRisk: boolean;
  contentRecommendations: string[];
}

export interface UnifiedHealthScan {
  id: string;
  targetUrl: string;
  domain: string;
  scannedAt: string;
  durationMs: number;
  isSample?: boolean;
  overallScore: number; // 0 to 100 weighted average
  pillarScores: {
    accessibility: { score: number; critical: number; passed: number; total: number };
    seo: { score: number; critical: number; warnings: number; passed: number; total: number };
    technicalSeo: { score: number; critical: number; warnings: number; passed: number };
    performance: { score: number; lcpMs: number; cls: number; ttfbMs: number };
    content: { score: number; wordCount: number; readingGrade: string };
  };
  executiveSummary: string;
  topPriorityActions: PriorityActionItem[];
  accessibilityScan: ScanResult;
  seoAudit: SeoAuditResult;
  technicalSeoAudit: TechnicalSeoAuditResult;
  performanceAudit: PerformanceAuditResult;
  contentAudit: ContentAuditResult;
}

// -------------------------------------------------------------
// KEYWORD & SERP INTELLIGENCE TYPES
// -------------------------------------------------------------

export interface KeywordMetricData {
  keyword: string;
  searchVolume: number;
  difficulty: number; // 0 to 100
  cpcUsd: number;
  intent: SearchIntent;
  trend: 'rising' | 'stable' | 'declining';
  serpFeatures: string[];
  relevanceScore?: number;
}

export interface KeywordClusterData {
  id: string;
  clusterName: string;
  primaryPillarKeyword: string;
  totalSearchVolume: number;
  averageDifficulty: number;
  suggestedPageType: 'pillar_page' | 'sub_article' | 'tool_page' | 'comparison';
  subKeywords: { keyword: string; volume: number; difficulty: number; intent: SearchIntent }[];
  searchIntent: SearchIntent;
  targetAudience: string;
  contentOutlineRecommendation: string[];
}

export interface ContentGapItem {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  targetDomainRanking: number | null; // null if not ranking in top 100
  competitorDomainRanking: number;
  opportunityScore: number; // 0 to 100
  recommendedContentFormat: string;
}

export interface ContentBriefData {
  targetKeyword: string;
  primaryIntent: SearchIntent;
  suggestedWordCount: number;
  seoTitleSuggestions: string[];
  metaDescriptionSuggestions: string[];
  contentOutline: { heading: string; level: number; keyPoints: string[] }[];
  targetQuestionsToAnswer: string[];
  requiredSemanticEntities: string[];
  internalLinkSuggestions: { anchor: string; suggestedUrl: string }[];
  callToActionRecommendation: string;
  targetAudiencePersona: string;
}

// -------------------------------------------------------------
// DATA PROVIDER ABSTRACTION INTERFACES
// -------------------------------------------------------------

export interface KeywordDataProvider {
  name: string;
  getKeywordMetrics: (keywords: string[]) => Promise<KeywordMetricData[]>;
  getKeywordOpportunities: (seed: string, country?: string) => Promise<KeywordMetricData[]>;
  getLowCompetitionKeywords: (seed: string, maxDifficulty?: number) => Promise<KeywordMetricData[]>;
}

export interface SERPDataProvider {
  name: string;
  getSerpOverview: (keyword: string) => Promise<{ title: string; url: string; snippet: string; position: number }[]>;
  getSerpFeatures: (keyword: string) => Promise<string[]>;
}

export interface PerformanceProvider {
  name: string;
  auditUrl: (url: string) => Promise<PerformanceAuditResult>;
}

// -------------------------------------------------------------
// SITE COMPARISON & COMPETITIVE INTELLIGENCE TYPES
// -------------------------------------------------------------

export interface SiteComparisonRequest {
  yourUrl: string;
  competitorUrl: string;
  country?: string;
  language?: string;
  industry?: string;
  comparisonDepth?: 'standard' | 'deep';
}

export interface SiteDiagnosticProfile {
  url: string;
  domain: string;
  scannedAt: string;
  ttfbMs: number;
  statusCode: number;
  isHttps: boolean;
  pageTitle: string;
  metaDescription: string;
  h1: string[];
  h2Count: number;
  h3Count: number;
  canonicalUrl: string | null;
  isCanonicalSelfReferencing: boolean;
  robotsDirectives: string | null;
  hasSitemapDetected: boolean;
  sitemapUrl?: string;
  hasRobotsTxt: boolean;
  hasOpenGraph: boolean;
  openGraphData?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  detectedSchemas: string[];
  totalImages: number;
  missingAltImages: number;
  totalInternalLinks: number;
  totalExternalLinks: number;
  brokenLinksDetected: number;
  wordCount: number;
  estimatedReadTime: number;
  readingGradeLevel: string;
  topEntitiesDetected: string[];
  accessibilityScore: number;
  criticalA11yIssuesCount: number;
  highA11yIssuesCount: number;
  performanceScore: number;
  lcpMs: number;
  clsScore: number;
  pageWeightKb: number;
  scores: {
    seo: number;
    technicalSeo: number;
    accessibility: number;
    performance: number;
    content: number;
    internalLinking: number;
    overall: number;
  };
}

export interface ScorecardCategory {
  category: string;
  yourScore: number;
  competitorScore: number;
  gap: number; // positive = your site leads, negative = competitor leads
  winner: 'your_site' | 'competitor' | 'tie';
  analysis: string;
  dataSource: 'crawled_audit' | 'third_party_metric' | 'ai_derived';
}

export interface KeywordComparisonItem {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpcUsd: number;
  intent: SearchIntent;
  competitorPosition: number | null; // e.g. 4 (null if not in top 100)
  yourPosition: number | null; // e.g. 38 (null if not in top 100)
  opportunity: 'High' | 'Medium' | 'Low';
  dataSource: 'third_party_estimated' | 'user_search_console' | 'crawled_correlation';
}

export interface CompetitorWinningKeyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpcUsd: number;
  intent: SearchIntent;
  competitorPosition: number;
  yourPosition: number | null;
  opportunityScore: number; // 0-100
  opportunityScoreExplanation: string;
  commercialValue: 'Very High' | 'High' | 'Moderate';
  recommendedAction: string;
}

export interface DiscoveredKeywordItem {
  id: string;
  keyword: string;
  monthlySearchVolume: number;
  competitorRank: number; // 1 to 10 on competitor site
  yourRank: number | null; // null: completely not included / not ranking on site 1
  keywordDifficulty: number; // 0-100
  cpcUsd: number;
  searchIntent: SearchIntent;
  estimatedCompetitorMonthlyVisits: number;
  opportunityLevel: 'Ultra High' | 'High' | 'Medium';
  opportunityScore: number; // 0-100
  recommendedContentType: string; // e.g. "Interactive Web Tool / Calculator", "Pillar Guide", "Comparison Matrix"
  recommendedSlug: string;
  strategicRationale: string;
}

export interface QuickWinOpportunity {
  id: string;
  keyword: string;
  currentPosition: number; // e.g. 11-20
  competitorPosition: number; // e.g. 3-8
  searchVolume: number;
  difficulty: number;
  targetPageUrl: string;
  actionableStep: string;
  estimatedEffort: 'Low' | 'Medium';
}

export interface ContentGapItemDetailed {
  id: string;
  topic: string;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  estimatedMonthlyDemand: number;
  competitorUrl: string;
  recommendedYourUrl: string;
  contentType: 'Pillar Guide' | 'Tool Landing Page' | 'Comparison Page' | 'Problem-Solution Guide' | 'FAQ / Use-Case';
  priority: 'Critical' | 'High' | 'Medium';
  whyItMatters: string;
}

export interface CompetitorContentStrengthData {
  discoveredRelevantPagesCount: number;
  topicCoverageScore: number; // /100
  pillarPagesCount: number;
  supportingArticlesCount: number;
  freshnessRating: 'Fresh (Active updates)' | 'Moderate' | 'Stale';
  internalLinkingDepthScore: number; // /100
  depthAndExamplesRating: 'Comprehensive with Code & Data' | 'Average' | 'Thin';
  faqCount: number;
  commercialLandingPagesCount: number;
  toolPagesCount: number;
  summaryAnalysis: string;
}

export interface SiteWeaknessItem {
  id: string;
  rank: number;
  title: string;
  problem: string;
  evidence: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  whyItMatters: string;
  recommendedAction: string;
  pillar: HealthPillar;
}

export interface GrowthActionItem {
  id: string;
  rank: number;
  title: string;
  priority: 'Critical' | 'High' | 'Medium';
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  relevanceScore: number; // /100
  rankScore: number; // Impact x Opp x Effort x Relevance
  category: 'Content Gap' | 'Technical SEO' | 'On-Page SEO' | 'Accessibility' | 'Internal Linking' | 'Performance';
  description: string;
  whyItMatters: string;
  recommendedAction: string;
  relatedUrl?: string;
  relatedToolOrKeyword?: string;
  actionRoute?: string;
}

export interface CompetitorStrengthArea {
  area: string;
  competitorScore: number;
  yourScore: number;
  gap: number;
  whyCompetitorIsStronger: string;
  howToBridgeGap: string;
}

export interface WinningPatternItem {
  id: string;
  title: string;
  pattern: string;
  competitorEvidence: string;
  strategicTakeaway: string;
  howToImproveNotCopy: string;
}

export interface ContentStrategyGeneratorItem {
  id: string;
  recommendedPage: string;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  suggestedTitle: string;
  suggestedUrl: string;
  supportingKeywords: string[];
  recommendedOutline: string[];
  internalLinks: { sourceAnchor: string; targetUrl: string }[];
  callToAction: string;
  targetAudience: string;
  estimatedWords: number;
}

export interface KeywordClusterComparisonItem {
  id: string;
  clusterName: string;
  totalSearchVolume: number;
  competitorCoverage: 'Strong' | 'Moderate' | 'Weak';
  yourCoverage: 'Strong' | 'Moderate' | 'Weak';
  subKeywords: { keyword: string; volume: number; competitorRank?: number; yourRank?: number }[];
  recommendation: string;
}

export interface InternalLinkOpportunityItem {
  id: string;
  sourceUrl: string;
  destinationUrl: string;
  suggestedAnchor: string;
  rationale: string;
  priority: 'High' | 'Medium';
}

export interface OnPageComparisonItem {
  element: string;
  yourValue: string | number;
  competitorValue: string | number;
  status: 'advantage' | 'gap' | 'parity';
  analysis: string;
  recommendation: string;
}

export interface SerpInsightItem {
  query: string;
  competitorRankingPage: string;
  searchIntent: SearchIntent;
  pageType: string;
  serpFeatures: string[];
  contentFormat: string;
  whatGoogleRewards: string;
  potentialGapToExploit: string;
}

export interface SiteAdvantageItem {
  id: string;
  area: string;
  yourValue: string;
  competitorValue: string;
  advantageDescription: string;
  howToLeverage: string;
}

export interface CompetitorWeaknessOpportunity {
  id: string;
  weaknessTitle: string;
  evidence: string;
  severity: 'High' | 'Medium' | 'Low';
  exploitStrategy: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  priority: 'Critical' | 'High' | 'Medium';
  expectedEffort: 'Low' | 'Medium' | 'High';
  responsibleArea: string;
  relatedUrl: string;
  relatedKeywordOrTool: string;
  actionSummary: string;
}

export interface ActionRoadmapPlan {
  first30Days: RoadmapItem[];
  days31To60: RoadmapItem[];
  days61To90: RoadmapItem[];
}

export interface ExecutiveComparisonSummary {
  yourOverallScore: number;
  competitorOverallScore: number;
  biggestAdvantage: string;
  biggestGap: string;
  biggestOpportunity: string;
  recommendedFirstAction: string;
  dataSourceDisclaimer: string;
}

export interface SiteComparisonResult {
  id: string;
  comparedAt: string;
  durationMs: number;
  request: SiteComparisonRequest;
  yourSite: SiteDiagnosticProfile;
  competitorSite: SiteDiagnosticProfile;
  executiveSummary: ExecutiveComparisonSummary;
  scorecard: ScorecardCategory[];
  top15Actions: GrowthActionItem[];
  siteWeaknesses: SiteWeaknessItem[];
  yourAdvantages: SiteAdvantageItem[];
  competitorWeaknesses: CompetitorWeaknessOpportunity[];
  competitorStrengthAreas: CompetitorStrengthArea[];
  winningPatterns: WinningPatternItem[];
  keywordComparison: KeywordComparisonItem[];
  winningKeywords: CompetitorWinningKeyword[];
  discoveredKeywords: DiscoveredKeywordItem[];
  quickWins: QuickWinOpportunity[];
  contentGaps: ContentGapItemDetailed[];
  competitorContentStrength: CompetitorContentStrengthData;
  contentStrategies: ContentStrategyGeneratorItem[];
  keywordClusters: KeywordClusterComparisonItem[];
  internalLinkOpportunities: InternalLinkOpportunityItem[];
  onPageComparison: OnPageComparisonItem[];
  serpInsights: SerpInsightItem[];
  actionRoadmap: ActionRoadmapPlan;
  dataSources: {
    crawledData: string;
    keywordData: string;
    serpData: string;
    accessibilityData: string;
    aiEngine: string;
  };
}



