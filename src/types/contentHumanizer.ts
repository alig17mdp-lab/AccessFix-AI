export type HumanizerTab = 'content' | 'keywords';

export type HumanizerTone = 'natural' | 'executive' | 'conversational' | 'academic';

export type EeatStrictness = 'standard' | 'maximum';

export interface HumanizeContentRequest {
  text: string;
  tone: HumanizerTone;
  lockedKeywords: string[];
  eeatStrictness: EeatStrictness;
  readingLevel: 'standard' | 'simplified' | 'advanced';
}

export interface HumanizeContentResponse {
  originalText: string;
  humanizedText: string;
  originalWordCount: number;
  humanizedWordCount: number;
  aiDetectionProbability: number;
  humanScore: number;
  burstinessScore: number;
  perplexityScore: number;
  readingGradeLevel: string;
  clichesPurged: string[];
  preservedKeywords: string[];
  toneUsed: string;
  processingTimeMs: number;
}

export interface HumanizeKeywordItem {
  original: string;
  naturalQuery: string;
  conversationalVoiceQuery: string;
  commercialIntentQuery: string;
  painPointLongTail: string;
  searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  naturalScore: string;
  eeatValue: 'High' | 'Maximum';
  monthlyVolumeEst: number;
  keywordDifficulty: number;
  targetAudience: string;
}

export interface HumanizeKeywordsResponse {
  keywords: HumanizeKeywordItem[];
  totalProcessed: number;
  avgNaturalScore: string;
  processingTimeMs: number;
}
