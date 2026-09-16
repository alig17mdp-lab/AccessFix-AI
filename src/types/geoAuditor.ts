export interface GeoPillarResult {
  pillarName: string;
  score: number; // 0 - 100
  status: 'passed' | 'warning' | 'failed';
  detectedInsight: string;
  recommendation: string;
}

export interface LlmEngineScore {
  engine: 'Google Gemini' | 'OpenAI ChatGPT' | 'Anthropic Claude' | 'Perplexity Pro';
  icon: string;
  citabilityScore: number; // 0 - 100
  status: 'High Citability' | 'Moderate Citation' | 'Low/Uncited';
  sampleCitationSnippet: string;
  reason: string;
}

export interface GeoUrgentActionStep {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  problem: string;
  whatToDoUrgent: string;
  remediationCode?: string;
  remediationFileType?: 'robots.txt' | 'llms.txt' | 'schema.json' | 'markdown';
  timeToDeploy: string;
}

export interface GeoAuditReport {
  inputTarget: string;
  isUrl: boolean;
  overallCitabilityScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  analyzedAt: string;
  
  // High-level diagnostic flags
  hasLlmsTxt: boolean;
  hasEntityGraph: boolean;
  hasSameAsLinks: boolean;
  hasAiBotsAllowed: boolean;
  hasStructuredData: boolean;
  hasOriginalDataGain: boolean;
  brandMentionVolumeEstimate: 'High (Authoritative)' | 'Moderate (Emerging)' | 'Low (Unrecognized)';

  // Engine breakdowns
  llmEngines: LlmEngineScore[];
  
  // Core pillars
  pillars: GeoPillarResult[];

  // Urgent Steps
  urgentActionSteps: GeoUrgentActionStep[];

  // Generated templates for immediate download/copy
  generatedLlmsTxt: string;
  generatedEntitySchema: string;

  // Real-Time Audit Findings & Executive Conclusion (Screenshot 439 Alignment)
  findings?: string[];
  executiveConclusion?: string;
  liveDiagnostics?: {
    statusCode?: number;
    fetchedUrl?: string;
    robotsTxtStatus?: 'checked' | 'allowed' | 'blocked' | 'not_found';
    llmsTxtStatus?: 'checked' | 'detected' | 'not_found';
    schemasDetected?: string[];
    canonicalUrl?: string;
    bylinesFound?: string[];
    trustLinksFound?: string[];
    standardsFound?: string[];
    tablesCount?: number;
  };
}
