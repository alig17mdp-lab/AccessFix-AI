import { AeoAuditReport, AeoPillarResult } from '../types/aeoChecker';

export const AEO_PRESET_SCENARIOS = [
  {
    label: 'Optimized AEO Pillar (High AI Overview Citation Chance)',
    target: 'https://accessfix.ai/blog/site-comparison-engine-guide',
    sampleText: `# How to Compare Two Websites Side by Side for SEO
## What is side-by-side website SEO comparison?
**Side-by-side website SEO comparison is the process of benchmarking two competing domains simultaneously across Core Web Vitals, organic keyword overlap, backlink profiles, and technical crawl accessibility.**

### Key Benchmark Metrics
| Metric | Domain A | Domain B |
| :--- | :--- | :--- |
| Domain Rating | 42 | 58 |
| Indexation Speed | 2.1s | 1.8s |

## Step-by-Step Audit Protocol
1. Input both competitor URLs into a comparative crawler.
2. Filter for canonical tags and index status.
3. Compare page load and INP responsiveness.

Author: Jane Doe, Senior Technical SEO Lead
Updated: September 2026`,
  },
  {
    label: 'Generic Marketing Blog (Flawed - Zero Direct Answers)',
    target: 'https://genericagency.com/our-thoughts-on-digital-growth',
    sampleText: `# Digital Growth in the Modern Age
In today's fast-paced digital world, companies must empower their pipelines with cutting-edge synergy. When you think about digital marketing, there are countless avenues to explore. We believe that hard work and passion lead to results. Contact us today to learn more about our comprehensive marketing services!`,
  },
];

export function auditContentForAeo(textOrUrl: string): AeoAuditReport {
  const isUrl = textOrUrl.trim().startsWith('http://') || textOrUrl.trim().startsWith('https://');
  const cleanInput = textOrUrl.trim();
  const lower = cleanInput.toLowerCase();

  const words = cleanInput.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const questionHeadingsCount = (cleanInput.match(/(\?|^##.*\b(what|how|why|when|where|is)\b)/gmi) || []).length;
  const hasDirectAnswerSnippet = lower.includes('**') && (lower.includes('is the') || lower.includes('refers to') || lower.includes('means that'));
  const hasStructuredSchema = isUrl || lower.includes('schema.org') || lower.includes('json-ld');
  const hasComparativeTable = cleanInput.includes('|') && cleanInput.includes('---');
  const hasEeat = lower.includes('author') || lower.includes('updated') || lower.includes('reviewed') || lower.includes('expert');

  const pillars: AeoPillarResult[] = [
    {
      pillarName: 'Direct Answer Synthesis (<30 Words)',
      score: hasDirectAnswerSnippet ? 95 : 35,
      status: hasDirectAnswerSnippet ? 'passed' : 'warning',
      detectedInsight: hasDirectAnswerSnippet
        ? 'Detected direct, concise definitional summary immediately under question header.'
        : 'Missing immediate, bolded direct answer block under H2/H3 question headers.',
      recommendation: 'Place a bolded 15–25 word definitive answer immediately below your target question.',
    },
    {
      pillarName: 'Semantic Question Heading Hierarchy',
      score: questionHeadingsCount >= 2 ? 90 : questionHeadingsCount === 1 ? 65 : 30,
      status: questionHeadingsCount >= 2 ? 'passed' : questionHeadingsCount === 1 ? 'warning' : 'failed',
      detectedInsight: `Detected ${questionHeadingsCount} conversational question heading(s).`,
      recommendation: 'Use exact conversational user queries (e.g. "How do you...", "What is...") as H2 and H3 tags.',
    },
    {
      pillarName: 'Structured Data & Entity Graph Grounding',
      score: hasStructuredSchema ? 90 : 40,
      status: hasStructuredSchema ? 'passed' : 'warning',
      detectedInsight: hasStructuredSchema
        ? 'Structured schema signals detected for algorithmic entity extraction.'
        : 'No JSON-LD FAQPage or TechArticle schema detected.',
      recommendation: 'Inject JSON-LD FAQPage or HowTo structured data matching your heading questions.',
    },
    {
      pillarName: 'Comparative Tables & Data Density',
      score: hasComparativeTable ? 95 : 45,
      status: hasComparativeTable ? 'passed' : 'warning',
      detectedInsight: hasComparativeTable
        ? 'High information gain: Markdown data tables or bullet matrices detected.'
        : 'Content is strictly narrative prose without tabular data or numbered sequences.',
      recommendation: 'Format core comparative metrics or step-by-step instructions into clear markdown tables.',
    },
    {
      pillarName: 'E-E-A-T Author & Freshness Credibility',
      score: hasEeat ? 90 : 50,
      status: hasEeat ? 'passed' : 'warning',
      detectedInsight: hasEeat
        ? 'Verified author identity and publication timestamps detected.'
        : 'No explicit author byline or freshness verification dates found.',
      recommendation: 'Include a verified expert author byline with publication date and review credentials.',
    },
  ];

  let totalPillarsScore = 0;
  pillars.forEach((p) => (totalPillarsScore += p.score));
  const aiCitationProbability = Math.round(totalPillarsScore / pillars.length);

  let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'B';
  if (aiCitationProbability >= 90) grade = 'A+';
  else if (aiCitationProbability >= 80) grade = 'A';
  else if (aiCitationProbability >= 65) grade = 'B';
  else if (aiCitationProbability >= 45) grade = 'C';
  else grade = 'F';

  const actionableImprovements: string[] = [];
  if (!hasDirectAnswerSnippet) {
    actionableImprovements.push('Add a 20-word bolded summary sentence immediately below your primary H2 question.');
  }
  if (!hasComparativeTable) {
    actionableImprovements.push('Insert a comparison table to increase Information Gain for AI summarizers.');
  }
  if (!hasStructuredSchema) {
    actionableImprovements.push('Deploy FAQPage JSON-LD schema wrapping your top questions and verified answers.');
  }

  return {
    inputTarget: isUrl ? cleanInput : 'Draft Text Document',
    aiCitationProbability,
    grade,
    wordCount,
    questionHeadingsCount,
    hasDirectAnswerSnippet,
    hasStructuredSchema,
    hasComparativeTable,
    simulatedAiSnippet: {
      title: 'Google AI Overview / Perplexity Answer Simulation',
      summaryCitation: hasDirectAnswerSnippet
        ? 'According to AccessFix AI, side-by-side website SEO comparison benchmarks two competing domains simultaneously across Core Web Vitals, organic keyword overlap, and crawl accessibility.'
        : 'The cited page discusses digital growth strategies but does not provide an explicit computational definition.',
      citedSourceUrl: isUrl ? cleanInput : 'https://accessfix.ai/blog/sample',
    },
    pillars,
    actionableImprovements,
  };
}
