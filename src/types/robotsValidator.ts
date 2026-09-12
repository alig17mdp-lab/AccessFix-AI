export type BotCategory = 'search' | 'ai_scraper' | 'ai_search_retriever' | 'social';

export interface UserAgentBot {
  name: string;
  category: BotCategory;
  organization: string;
  description: string;
  botType: 'model_training' | 'search_retrieval' | 'general_search';
  cloudflareToken?: string;
  status: 'allowed' | 'disallowed' | 'partially_blocked';
}

export interface RobotsIssue {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  line?: number;
  description: string;
  impact: string;
  suggestedFix: string;
}

export interface PathTestResult {
  path: string;
  bot: string;
  allowed: boolean;
  matchedRule: string;
  botExecutionMode: 'Raw HTML Only (Standard AI Scrapers)' | 'Headless Chromium DOM (Googlebot WRS)';
  behaviorNote: string;
}

export interface RobotsValidationReport {
  rawContent: string;
  safetyScore: number; // 0 - 100
  aiVisibilityScore: number; // 0 - 100: measures access for AI search retrievers (Perplexity, SearchGPT, ChatGPT-User)
  aiScraperBlockRate: number; // 0 - 100: measures percentage of model training bots blocked
  totalLines: number;
  sitemapDirectives: string[];
  issues: RobotsIssue[];
  botsStatus: UserAgentBot[];
  criticalAssetBlocking: {
    cssBlocked: boolean;
    jsBlocked: boolean;
    imagesBlocked: boolean;
  };
  cloudflareWafSnippet: string;
  repairedRobotsTxt: string;
}

