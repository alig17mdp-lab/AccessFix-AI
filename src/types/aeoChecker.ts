export interface AeoPillarResult {
  pillarName: string;
  score: number; // 0 - 100
  status: 'passed' | 'warning' | 'failed';
  detectedInsight: string;
  recommendation: string;
}

export interface UrgentActionStep {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  problem: string;
  whatToDoUrgent: string;
  codeSnippetFix?: string;
  timeEstimate: string;
}

export interface DirectAnswerEvaluation {
  detectedSnippet: string;
  wordCount: number;
  isUnder30Words: boolean;
  status: 'OPTIMAL' | 'TOO_LONG' | 'MISSING';
  suggestedRewrite: string;
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
  directAnswerEval: DirectAnswerEvaluation;
  simulatedAiSnippet: {
    title: string;
    summaryCitation: string;
    citedSourceUrl: string;
    voiceSearchTranscript: string;
  };
  pillars: AeoPillarResult[];
  actionableImprovements: string[];
  urgentActionSteps: UrgentActionStep[];

  // Real-Time Audit Findings & Executive Conclusion
  findings?: string[];
  executiveConclusion?: string;
  liveDiagnostics?: {
    statusCode?: number;
    fetchedUrl?: string;
    faqSchemasFound?: number;
    totalHeadings?: number;
    questionHeadingsFound?: string[];
    directAnswerFound?: boolean;
    extractedWordCount?: number;
  };
}

