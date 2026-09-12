export interface AeoPillarResult {
  pillarName: string;
  score: number; // 0 - 100
  status: 'passed' | 'warning' | 'failed';
  detectedInsight: string;
  recommendation: string;
}

export interface AeoAuditReport {
  inputTarget: string;
  aiCitationProbability: number; // 0 - 100%
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  wordCount: number;
  questionHeadingsCount: number;
  hasDirectAnswerSnippet: boolean;
  hasStructuredSchema: boolean;
  hasComparativeTable: boolean;
  simulatedAiSnippet: {
    title: string;
    summaryCitation: string;
    citedSourceUrl: string;
  };
  pillars: AeoPillarResult[];
  actionableImprovements: string[];
}
