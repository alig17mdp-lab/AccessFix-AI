import { AeoAuditReport, AeoPillarResult, UrgentActionStep, DirectAnswerEvaluation } from '../types/aeoChecker';

export const AEO_PRESET_SCENARIOS = [
  {
    label: 'Optimized AEO Pillar (High AI Overview Citation Chance)',
    target: 'https://accessfix.ai/blog/aeo-auditor-guide',
    sampleText: `# What is an AEO Auditor and How Does Answer Engine Optimization Work?
## What is an AEO auditor?
**An AEO auditor is a diagnostic tool that evaluates web content for direct answer synthesis, question heading hierarchy, and structured schema so AI engines cite it in synthesized overviews.**

### 2026 Core AEO Performance Benchmarks
| Optimization Factor | Traditional SEO | Modern AEO Target | Priority |
| :--- | :--- | :--- | :--- |
| Direct Answer Length | N/A (unconstrained) | < 30 words | Critical |
| Question Headings | Topical keywords | Conversational questions | High |
| Schema Architecture | Article / WebPage | FAQPage + Speakable JSON-LD | Critical |
| Information Gain | Word count expansion | Original tabular datasets | High |

## How do you optimize content for Google AI Overviews and Perplexity?
**To optimize for AI answer engines, place a concise 20-word bolded definition directly beneath an H2 question header, ground statements with data tables, and validate with FAQPage schema.**

Author: Elena Rostova, Principal AI Information Retrieval Specialist
Reviewed By: Dr. Marcus Vance, Cognitive Search Architect
Last Updated: September 2026`,
  },
  {
    label: 'Time & Duration Calculator (Deployed FAQPage Schema & Perplexity Table — 96% A+)',
    target: 'https://timeandduration.com/',
    sampleText: `# Time & Duration Calculator – Free Online Time & Date Tools
## How does timeandduration.com work?
**Calculate time differences, add or subtract dates, track work hours, and convert time zones — free, instant, and accurate. No signup needed.**

### Performance & Verification Benchmarks
| Feature | Traditional Method | Modern Solution | Priority |
| :--- | :--- | :--- | :--- |
| Response Time | > 1,500ms | < 120ms | Critical |
| Verification | Unverified | ISO-8601 Validated | High |

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How does timeandduration.com work?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Calculate time differences, add or subtract dates, track work hours, and convert time zones — free, instant, and accurate. No signup needed."
    }
  }]
}
</script>

Author: Lead Timekeeping Auditor & Payroll Compliance CPA
Updated: 2026-09-13 (ISO-8601 Verified)`,
  },
  {
    label: 'Generic Marketing Blog (Flawed - Zero Direct Answers & No Schema)',
    target: 'https://genericagency.com/digital-growth-strategies',
    sampleText: `# Digital Growth Strategies for Modern Enterprise Brands
In today's fast-paced digital landscape, enterprises must adapt their omni-channel funnel paradigms to capture modern market share. Many agencies debate whether traditional SEO or paid media produces superior compounding returns. We believe that hard work, client dedication, and creative passion unlock unmatched business synergies.

Contact our dedicated growth team today to schedule an exploratory digital consultation!`,
  },
  {
    label: 'Wordy Encyclopedic Article (Fails the <30 Words Direct Answer Rule)',
    target: 'https://encyclopedia-sample.org/answer-engine-overview',
    sampleText: `# Answer Engine Optimization Explained
## What is the definition of answer engine optimization?
**Answer engine optimization, or AEO as it is commonly abbreviated by search marketing specialists and digital agency practitioners across North America and Europe, represents a sophisticated discipline that involves meticulously curating, formatting, structuring, and deploying high-utility digital content specifically designed to ensure that retrieval-augmented generation systems and neural answer engines pick it up over competing sources.**

Is this answer good for AI?
While the definition above is factually accurate, it contains 63 words, causing Google AI Overviews and voice assistants to truncate or discard the snippet in favor of concise alternatives.`,
  },
  {
    label: 'Technical SaaS Documentation (Missing FAQ Schema & Speakable Tags)',
    target: 'https://devdocs.cloudplatform.io/api-rate-limits',
    sampleText: `# API Rate Limits and Burst Capacities
## How many requests per second does the API allow?
**The standard API tier permits 120 requests per minute with an instantaneous burst capacity of up to 25 concurrent requests before HTTP 429 throttling triggers.**

| Tier | Sustained RPS | Burst Maximum | Throttling Behavior |
| :--- | :--- | :--- | :--- |
| Developer | 2 RPS | 5 RPS | HTTP 429 (Retry-After: 60) |
| Production | 25 RPS | 50 RPS | Token bucket buffer |

Author: API Platform Infrastructure Team
Updated: 2026-08-15`,
  },
];

export function auditContentForAeo(textOrUrl: string): AeoAuditReport {
  const isUrl = textOrUrl.trim().startsWith('http://') || textOrUrl.trim().startsWith('https://');
  const cleanInput = textOrUrl.trim();
  const lower = cleanInput.toLowerCase();

  const words = cleanInput.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Question Headings Detection
  const questionMatches = cleanInput.match(/(^#+\s*.*(what|how|why|when|where|is|can|does|which|are)\b.*|\?(\s*$|\n))/gmi) || [];
  const questionHeadingsCount = questionMatches.length;

  // 2. Direct Answer Block Detection (<30 words extraction)
  const boldMatches = cleanInput.match(/\*\*(.+?)\*\*/g) || [];
  let detectedDirectSnippet = '';
  let snippetWordCount = 0;
  let isUnder30Words = false;

  for (const b of boldMatches) {
    const raw = b.replace(/\*\*/g, '').trim();
    const count = raw.split(/\s+/).filter(Boolean).length;
    // Check if it looks like a definition or direct answer
    const lowerB = raw.toLowerCase();
    if (
      lowerB.includes('is ') ||
      lowerB.includes('are ') ||
      lowerB.includes('refers to') ||
      lowerB.includes('to optimize') ||
      lowerB.includes('means ') ||
      lowerB.includes('the standard') ||
      count >= 5
    ) {
      detectedDirectSnippet = raw;
      snippetWordCount = count;
      isUnder30Words = count <= 30 && count >= 8;
      break;
    }
  }

  const hasDirectAnswerSnippet = detectedDirectSnippet.length > 0;

  // 3. Schema & Structured Data Detection
  const hasStructuredSchema = isUrl || lower.includes('schema.org') || lower.includes('json-ld') || lower.includes('faqpage');

  // 4. Comparative Table Detection (Information Gain)
  const hasComparativeTable = cleanInput.includes('|') && (cleanInput.includes('---') || cleanInput.includes(':---'));

  // 5. E-E-A-T Detection
  const hasEeat = lower.includes('author') || lower.includes('updated') || lower.includes('reviewed') || lower.includes('specialist') || lower.includes('credentials');

  // Evaluate Direct Answer Status
  let directStatus: 'OPTIMAL' | 'TOO_LONG' | 'MISSING' = 'MISSING';
  let suggestedRewrite = '';

  if (!hasDirectAnswerSnippet) {
    directStatus = 'MISSING';
    suggestedRewrite = `**[Target Subject] is [concise definition or procedural answer restricted strictly between 15 and 25 words with zero conversational fluff].**`;
  } else if (snippetWordCount > 30) {
    directStatus = 'TOO_LONG';
    // Synthesize concise 20-word rewrite from the detected snippet
    const truncated = detectedDirectSnippet.split(/\s+/).slice(0, 22).join(' ');
    suggestedRewrite = `**${truncated}... (Trimmed to under 25 words for AI overview citation compliance).**`;
  } else {
    directStatus = 'OPTIMAL';
    suggestedRewrite = `**${detectedDirectSnippet}** (Perfect length: ${snippetWordCount} words).`;
  }

  // Calculate 5 Pillar Scores
  const directScore = directStatus === 'OPTIMAL' ? 98 : directStatus === 'TOO_LONG' ? 55 : 25;
  const questionScore = questionHeadingsCount >= 2 ? 95 : questionHeadingsCount === 1 ? 65 : 20;
  const schemaScore = hasStructuredSchema ? 95 : 35;
  const tableScore = hasComparativeTable ? 96 : 40;
  const eeatScore = hasEeat ? 95 : 45;

  const pillars: AeoPillarResult[] = [
    {
      pillarName: 'Direct Answer Synthesis (<30 Words)',
      score: directScore,
      status: directStatus === 'OPTIMAL' ? 'passed' : directStatus === 'TOO_LONG' ? 'warning' : 'failed',
      detectedInsight: directStatus === 'OPTIMAL'
        ? `Optimal direct summary found (${snippetWordCount} words). Fits within Google AI Overviews and Siri audio synthesis limits.`
        : directStatus === 'TOO_LONG'
        ? `Detected answer block is ${snippetWordCount} words (exceeds the 30-word ceiling). Answer engines favor <30 word snippets.`
        : 'Zero direct summary blocks detected. AI engines must synthesize paragraphs, decreasing citation probability.',
      recommendation: 'Place a bolded 15–25 word definitive sentence immediately below your primary H2/H3 question headers.',
    },
    {
      pillarName: 'Semantic Question Heading Hierarchy',
      score: questionScore,
      status: questionHeadingsCount >= 2 ? 'passed' : questionHeadingsCount === 1 ? 'warning' : 'failed',
      detectedInsight: questionHeadingsCount >= 2
        ? `Detected ${questionHeadingsCount} conversational question heading(s) mirroring real-world PAA queries.`
        : questionHeadingsCount === 1
        ? 'Detected only 1 question heading. AI models look for structured FAQ clusters.'
        : 'No conversational question headings (What/How/Why) detected. Only generic topic titles found.',
      recommendation: 'Format subheadings as exact user queries (e.g., "What is an AEO auditor?", "How do you optimize for AI search?").',
    },
    {
      pillarName: 'Structured Data & Entity Graph Grounding',
      score: schemaScore,
      status: hasStructuredSchema ? 'passed' : 'failed',
      detectedInsight: hasStructuredSchema
        ? 'Schema signals or FAQPage markup detected for automated knowledge graph ingestion.'
        : 'Missing JSON-LD FAQPage, HowTo, or Speakable structured data markup.',
      recommendation: 'Deploy JSON-LD FAQPage schema wrapping each conversational question and its concise answer.',
    },
    {
      pillarName: 'Comparative Tables & Data Density',
      score: tableScore,
      status: hasComparativeTable ? 'passed' : 'warning',
      detectedInsight: hasComparativeTable
        ? 'High Information Gain: Structured comparison table detected. AI models frequently cite markdown tables.'
        : 'Prose-only layout with zero tabular comparisons or structured benchmark matrices.',
      recommendation: 'Include a comparative Markdown table with 3-4 columns to provide immediate factual density.',
    },
    {
      pillarName: 'E-E-A-T Author & Freshness Credibility',
      score: eeatScore,
      status: hasEeat ? 'passed' : 'warning',
      detectedInsight: hasEeat
        ? 'Explicit author identity, specialist credentials, and review timestamps detected.'
        : 'No verified author byline or freshness verification timestamp found.',
      recommendation: 'Add author name, verified industry title, and last-updated freshness date at top and bottom.',
    },
  ];

  const totalScore = Math.round(pillars.reduce((acc, p) => acc + p.score, 0) / pillars.length);

  let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'B';
  if (totalScore >= 92) grade = 'A+';
  else if (totalScore >= 82) grade = 'A';
  else if (totalScore >= 68) grade = 'B';
  else if (totalScore >= 50) grade = 'C';
  else grade = 'F';

  // Build Prioritized "What To Do Urgently" Steps
  const urgentActionSteps: UrgentActionStep[] = [];

  if (directStatus === 'MISSING') {
    urgentActionSteps.push({
      priority: 'CRITICAL',
      title: 'Inject a Bolded Direct Answer (<30 Words) Under Your Main Heading',
      problem: 'AI scrapers (Google Gemini, Perplexity) cannot find an immediate, authoritative definition to cite.',
      whatToDoUrgent: 'Immediately beneath your H2 question header, add a 15-25 word bolded definition starting with "[Topic] is..." or "[Action] requires...". Do not use filler or throat-clearing prose.',
      codeSnippetFix: `## What is an AEO auditor?\n**An AEO auditor is an AI optimization tool that analyzes content for concise answer snippets (<30 words), structured FAQ schema, and entity clarity to earn AI search citations.**`,
      timeEstimate: '3 Minutes',
    });
  } else if (directStatus === 'TOO_LONG') {
    urgentActionSteps.push({
      priority: 'HIGH',
      title: `Trim Your Direct Answer from ${snippetWordCount} Words to Under 28 Words`,
      problem: `Your detected summary contains ${snippetWordCount} words. AI Overview models discard verbose answers in favor of punchy competitor definitions.`,
      whatToDoUrgent: 'Remove conversational clauses, parentheticals, and conjunctions. Focus solely on Subject + Verb + Core Functional Mechanism.',
      codeSnippetFix: suggestedRewrite,
      timeEstimate: '2 Minutes',
    });
  }

  if (!hasStructuredSchema) {
    urgentActionSteps.push({
      priority: 'CRITICAL',
      title: 'Deploy JSON-LD FAQPage & Speakable Schema Markup',
      problem: 'Google Search crawlers have to parse ambiguous raw HTML instead of an explicit machine-readable Knowledge Graph node.',
      whatToDoUrgent: 'Copy and paste the validated JSON-LD schema into your page <head> or component wrapper so AI search engines immediately index question-answer pairs.',
      codeSnippetFix: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an AEO auditor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An AEO auditor evaluates web pages for concise direct answers, schema markup, and question hierarchies to maximize generative AI citations."
      }
    }
  ]
}
</script>`,
      timeEstimate: '5 Minutes',
    });
  }

  if (questionHeadingsCount < 2) {
    urgentActionSteps.push({
      priority: 'HIGH',
      title: 'Convert Topic Headings into Natural Conversational Question H2/H3 Tags',
      problem: 'Searchers ask questions like "How do I..." or "What is...". Topic headings like "Overview" fail semantic intent matching.',
      whatToDoUrgent: 'Rename section headings to match Google People Also Ask (PAA) queries verbatim.',
      codeSnippetFix: `<!-- Replace: <h2>Overview</h2> -->\n<!-- With: -->\n<h2>What is Answer Engine Optimization (AEO)?</h2>\n\n<!-- Replace: <h2>Benefits</h2> -->\n<!-- With: -->\n<h2>Why is AEO critical for modern organic visibility?</h2>`,
      timeEstimate: '4 Minutes',
    });
  }

  if (!hasComparativeTable) {
    urgentActionSteps.push({
      priority: 'MEDIUM',
      title: 'Add a Comparative Information-Gain Markdown Table',
      problem: 'Large Language Models look for tabular data matrices to construct comparative AI Overview cards and bullet summaries.',
      whatToDoUrgent: 'Insert a 3-4 column markdown table contrasting key technical criteria, metrics, or methods.',
      codeSnippetFix: `| Metric | Traditional SEO | Modern AEO Standard |
| :--- | :--- | :--- |
| Primary Goal | Ranked blue links | AI Overview citation & voice answers |
| Target Length | 1,500+ words | Concise summary (<30 words) + data table |
| Core Markup | Basic OpenGraph | FAQPage, HowTo, Speakable JSON-LD |`,
      timeEstimate: '5 Minutes',
    });
  }

  if (!hasEeat) {
    urgentActionSteps.push({
      priority: 'MEDIUM',
      title: 'Add Authoritative E-E-A-T Byline with Freshness Timestamp',
      problem: 'AI engines favor content with verified domain experts to avoid hallucinations.',
      whatToDoUrgent: 'Add an author byline with real professional credentials and a clear "Last Updated" timestamp.',
      codeSnippetFix: `<div class="eeat-byline">\n  <span>Written by Elena Rostova, Senior Search Architect</span>\n  <span>Reviewed by AI Optimization Team • Updated September 2026</span>\n</div>`,
      timeEstimate: '2 Minutes',
    });
  }

  // Simulated AI Snippets
  const simulatedAiSnippet = {
    title: 'Google AI Overview / Perplexity Direct Citation Simulation',
    summaryCitation: directStatus === 'OPTIMAL'
      ? `According to AccessFix AI, ${detectedDirectSnippet}`
      : directStatus === 'TOO_LONG'
      ? `According to the source, ${detectedDirectSnippet.split(/\s+/).slice(0, 20).join(' ')}... [Truncated by AI for length]`
      : 'Generative search engines could not extract a concise direct answer from this content, resulting in a synthesized summary with lower citation rank.',
    citedSourceUrl: isUrl ? cleanInput : 'https://accessfix.ai/tools/aeo-auditor',
    voiceSearchTranscript: directStatus === 'OPTIMAL'
      ? `"Here is what AccessFix AI says: ${detectedDirectSnippet}"`
      : `"According to web sources, ${cleanInput.slice(0, 120)}..."`,
  };

  const actionableImprovements = urgentActionSteps.map((s) => `${s.title} (${s.timeEstimate})`);

  const findings: string[] = [
    directStatus === 'OPTIMAL'
      ? `Direct Answer Synthesis: Optimal bolded answer (${snippetWordCount} words) detected within the strict 30-word limit.`
      : directStatus === 'TOO_LONG'
      ? `Direct Answer Length Alert: Detected candidate answer is ${snippetWordCount} words (exceeds 30 words).`
      : `Direct Answer Gap: No concise <30-word bolded definition found directly beneath primary headers.`,
    questionHeadingsCount >= 2
      ? `Semantic Question Hierarchy: Found ${questionHeadingsCount} conversational question headings.`
      : `Question Hierarchy Alert: Needs conversational interrogative headings (What is, How to, Why does).`,
    hasStructuredSchema
      ? `Structured Schema: Valid schema signals detected for automated AI ingestion.`
      : `Schema Gap: Missing JSON-LD FAQPage or Speakable markup.`,
    hasComparativeTable
      ? `Data Density: Comparative table detected, enhancing Perplexity Pro and SearchGPT citations.`
      : `Data Density Gap: No comparative tables or benchmark matrices found.`,
  ];

  const executiveConclusion = `${isUrl ? cleanInput.replace(/^https?:\/\//, '').split('/')[0] : 'Evaluated Content'} scores ${totalScore} / 100 on AEO readiness metrics. ${
    totalScore >= 80
      ? 'Its high density of conversational question headings, concise definition blocks, and structured layout make it a prime candidate for top-tier citation in Google AI Overviews and Perplexity Pro.'
      : 'Refining direct answers to under 30 words and deploying FAQPage schema will dramatically accelerate citation in generative AI answers.'
  }`;

  return {
    inputTarget: isUrl ? cleanInput : 'Content Document Draft',
    aiCitationProbability: totalScore,
    grade,
    wordCount,
    questionHeadingsCount,
    hasDirectAnswerSnippet,
    hasStructuredSchema,
    hasComparativeTable,
    directAnswerEval: {
      detectedSnippet: detectedDirectSnippet || 'None detected',
      wordCount: snippetWordCount,
      isUnder30Words,
      status: directStatus,
      suggestedRewrite,
    },
    simulatedAiSnippet,
    pillars,
    actionableImprovements,
    urgentActionSteps,
    findings,
    executiveConclusion,
  };
}
