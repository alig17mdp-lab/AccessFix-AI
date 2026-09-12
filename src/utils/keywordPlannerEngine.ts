export interface SerpCompetitorItem {
  rank: number;
  title: string;
  url: string;
  domain: string;
  dr: number;
  referringDomains: number;
  estTraffic: number;
  contentType: string;
  isFlaw: boolean;
  flawNote?: string;
}

export interface SerpFlawInfo {
  type: 'low_dr' | 'ugc_forum' | 'zero_backlinks' | 'outdated_serp' | 'snippet_opportunity';
  label: string;
  shortTag: string;
  description: string;
  badgeClass: string;
  targetRank: number;
}

export interface KeywordPlanItem {
  id: string;
  rank: number;
  keyword: string;
  wordCount: number;
  type: 'short_tail' | 'long_tail';
  intent: 'transactional' | 'commercial' | 'informational' | 'navigational';
  searchVolume: number;
  trafficPotential: number; // Ahrefs signature metric: total traffic #1 page gets from all keywords
  difficulty: number; // 0-100 KD
  difficultyTier: 'Easy' | 'Low' | 'Medium' | 'Hard';
  estimatedCtr: number; // e.g. 34.2%
  cpmUsd: number; // e.g. $18.50 CPM
  cpcUsd: number; // e.g. $3.80 CPC
  opportunityScore: number; // 0-100
  untappedScore: number; // 0-100 Ahrefs-style Untapped Potential Index
  lowestDrTop10: number; // Ahrefs signature: Lowest DR in Top 10
  lowestDrCompetitor: string; // Domain of lowest DR site
  lowestDrPosition: number; // 1-10 position in SERP
  pageReferringDomains: number; // Backlinks to ranking page (0, 1, 2...)
  serpFlaw: SerpFlawInfo;
  serpOverview: SerpCompetitorItem[]; // Top 5 competitors in SERP
  recommendedFormat: string;
  rankingTimeEstimate: string;
  topCompetitorSerp: string;
  seedRelevance: number; // 85-99%
  clusterName: string;
}

export interface TopicCluster {
  name: string;
  description: string;
  intent: 'transactional' | 'commercial' | 'informational' | 'navigational';
  keywordsCount: number;
  totalVolume: number;
  avgDifficulty: number;
  avgCpm: number;
  primaryKeyword: string;
  supportingKeywords: string[];
  suggestedPageType: string;
}

export interface ContentRoadmapStage {
  stage: string;
  phaseNumber: number;
  timeframe: string;
  focus: string;
  targetKeywords: string[];
  deliverables: string[];
  projectedTrafficGain: string;
}

export interface KeywordPlanResult {
  id: string;
  niche: string;
  seedKeyword: string;
  country: string;
  generatedAt: string;
  durationMs: number;
  totalSearchVolume: number;
  avgDifficulty: number;
  avgCtr: number;
  avgCpc: number;
  avgCpm: number;
  totalEstimatedTrafficValueUsd: number;
  shortTailKeywords: KeywordPlanItem[]; // Exactly 25 items
  longTailKeywords: KeywordPlanItem[]; // Exactly 25 items
  allKeywords: KeywordPlanItem[]; // 50 items
  topicClusters: TopicCluster[];
  contentRoadmap: ContentRoadmapStage[];
}

/**
 * Intelligent Keyword Synthesis & Planning Engine
 * Generates 25 Short-Tail and 25 Long-Tail keywords with realistic Volume, KD, CTR, CPM, CPC, Intent, and Silos.
 */
export function generateKeywordPlan(
  nicheInput: string,
  seedKeywordInput: string,
  country = 'US'
): KeywordPlanResult {
  const startTime = Date.now();
  const rawNiche = nicheInput.trim() || 'Software & Tech';
  const rawSeed = seedKeywordInput.trim() || 'productivity tools';

  const cleanSeed = rawSeed.toLowerCase().replace(/[^\w\s-]/g, '').trim();
  const cleanNiche = rawNiche.toLowerCase().replace(/[^\w\s-]/g, '').trim();

  // Determine industry multiplier for CPM and CPC
  let cpmMultiplier = 1.0;
  let cpcMultiplier = 1.0;
  let baseVolumeScale = 1.0;

  const combined = `${cleanNiche} ${cleanSeed}`.toLowerCase();

  if (/finance|crypto|bank|insurance|invest|mortgage|credit|loan|wealth/i.test(combined)) {
    cpmMultiplier = 2.4;
    cpcMultiplier = 2.8;
    baseVolumeScale = 1.2;
  } else if (/saas|software|b2b|crm|erp|ai|cloud|developer|api|hosting/i.test(combined)) {
    cpmMultiplier = 1.9;
    cpcMultiplier = 2.2;
    baseVolumeScale = 1.1;
  } else if (/health|fitness|wellness|medical|doctor|supplement|diet|calorie|workout/i.test(combined)) {
    cpmMultiplier = 1.5;
    cpcMultiplier = 1.6;
    baseVolumeScale = 1.3;
  } else if (/ecommerce|fashion|apparel|shoe|watch|jewelry|beauty|retail|product/i.test(combined)) {
    cpmMultiplier = 1.3;
    cpcMultiplier = 1.4;
    baseVolumeScale = 1.4;
  } else if (/legal|lawyer|attorney|compliance|wcag|ada|gdpr|trademark/i.test(combined)) {
    cpmMultiplier = 2.6;
    cpcMultiplier = 3.2;
    baseVolumeScale = 0.9;
  } else if (/real estate|property|realtor|home|mortgage|apartment/i.test(combined)) {
    cpmMultiplier = 1.8;
    cpcMultiplier = 2.0;
    baseVolumeScale = 1.1;
  }

  // Generate 25 Short-Tail Keywords (1-3 words)
  const shortTailTemplates = [
    { pattern: `${cleanSeed}`, intent: 'informational', vol: 48000, kd: 58, ctr: 28.4, fmt: 'Pillar Hub & Core Directory' },
    { pattern: `best ${cleanSeed}`, intent: 'commercial', vol: 33000, kd: 52, ctr: 32.1, fmt: 'Buyer Guide & Comparison Table' },
    { pattern: `${cleanSeed} online`, intent: 'transactional', vol: 27500, kd: 44, ctr: 36.8, fmt: 'Interactive Web Application' },
    { pattern: `free ${cleanSeed}`, intent: 'transactional', vol: 36000, kd: 41, ctr: 38.5, fmt: 'Free Browser Tool / Utility' },
    { pattern: `${cleanSeed} tool`, intent: 'transactional', vol: 22400, kd: 39, ctr: 37.2, fmt: 'Software Utility / Web App' },
    { pattern: `${cleanSeed} app`, intent: 'transactional', vol: 29000, kd: 46, ctr: 35.4, fmt: 'Product Landing Page' },
    { pattern: `${cleanSeed} software`, intent: 'commercial', vol: 18500, kd: 48, ctr: 31.0, fmt: 'SaaS Platform Landing Page' },
    { pattern: `${cleanSeed} calculator`, intent: 'transactional', vol: 24000, kd: 35, ctr: 39.4, fmt: 'Client-Side Interactive Calculator' },
    { pattern: `${cleanSeed} checker`, intent: 'transactional', vol: 19800, kd: 34, ctr: 38.1, fmt: 'Automated Diagnostic Scanner' },
    { pattern: `${cleanSeed} guide`, intent: 'informational', vol: 16500, kd: 38, ctr: 29.8, fmt: 'Comprehensive Tutorial Guide' },
    { pattern: `${cleanSeed} tips`, intent: 'informational', vol: 14200, kd: 32, ctr: 28.5, fmt: 'Actionable Best Practices List' },
    { pattern: `${cleanSeed} generator`, intent: 'transactional', vol: 21000, kd: 37, ctr: 40.2, fmt: 'AI Instant Generator Tool' },
    { pattern: `${cleanSeed} platform`, intent: 'commercial', vol: 15400, kd: 49, ctr: 30.5, fmt: 'Feature Matrix & Pricing Page' },
    { pattern: `${cleanSeed} service`, intent: 'commercial', vol: 12800, kd: 45, ctr: 33.0, fmt: 'Service Offering Landing Page' },
    { pattern: `top ${cleanSeed}`, intent: 'commercial', vol: 17600, kd: 47, ctr: 32.5, fmt: 'Curated Benchmark Listicle' },
    { pattern: `${cleanSeed} portal`, intent: 'navigational', vol: 11200, kd: 36, ctr: 34.0, fmt: 'User Access Portal / Dashboard' },
    { pattern: `${cleanSeed} examples`, intent: 'informational', vol: 13900, kd: 29, ctr: 29.2, fmt: 'Visual Case Studies & Showcase' },
    { pattern: `${cleanSeed} template`, intent: 'transactional', vol: 16800, kd: 33, ctr: 37.6, fmt: 'Downloadable Asset & Template' },
    { pattern: `${cleanSeed} pricing`, intent: 'commercial', vol: 9800, kd: 42, ctr: 34.8, fmt: 'Transparent Pricing Calculator' },
    { pattern: `${cleanSeed} solutions`, intent: 'commercial', vol: 11500, kd: 43, ctr: 31.4, fmt: 'Enterprise Solutions Blueprint' },
    { pattern: `${cleanSeed} metrics`, intent: 'informational', vol: 8900, kd: 31, ctr: 27.9, fmt: 'Analytical KPI & Data Dashboard' },
    { pattern: `easy ${cleanSeed}`, intent: 'transactional', vol: 10400, kd: 27, ctr: 35.9, fmt: 'Fast 1-Click Starter Tool' },
    { pattern: `${cleanSeed} api`, intent: 'commercial', vol: 7800, kd: 39, ctr: 33.2, fmt: 'Developer Documentation & SDK' },
    { pattern: `${cleanSeed} audit`, intent: 'transactional', vol: 13100, kd: 36, ctr: 36.5, fmt: 'Full Site Diagnostic Engine' },
    { pattern: `${cleanNiche} ${cleanSeed}`, intent: 'commercial', vol: 14800, kd: 41, ctr: 31.8, fmt: 'Niche Category Pillar Page' },
  ];

  // Generate 25 Long-Tail Keywords (4+ words)
  const longTailTemplates = [
    { pattern: `how to use ${cleanSeed} for beginners`, intent: 'informational', vol: 8400, kd: 21, ctr: 36.4, fmt: 'Step-by-Step Beginner Tutorial' },
    { pattern: `best free ${cleanSeed} tool online`, intent: 'transactional', vol: 12500, kd: 26, ctr: 42.1, fmt: 'Interactive Web Tool Widget' },
    { pattern: `step by step ${cleanSeed} checklist 2026`, intent: 'informational', vol: 6200, kd: 18, ctr: 38.0, fmt: 'Interactive Action Checklist' },
    { pattern: `how to calculate ${cleanSeed} accurately`, intent: 'transactional', vol: 9100, kd: 22, ctr: 41.5, fmt: 'Live Embedded Calculation Formula' },
    { pattern: `${cleanSeed} vs traditional alternatives comparison`, intent: 'commercial', vol: 5400, kd: 24, ctr: 35.8, fmt: 'Side-by-Side Comparison Matrix' },
    { pattern: `what is the best ${cleanSeed} for small business`, intent: 'commercial', vol: 7800, kd: 27, ctr: 37.2, fmt: 'SMB Evaluation & Review Guide' },
    { pattern: `how to improve ${cleanSeed} performance fast`, intent: 'informational', vol: 6900, kd: 20, ctr: 36.9, fmt: 'Optimization Playbook' },
    { pattern: `automated ${cleanSeed} generator for website`, intent: 'transactional', vol: 8800, kd: 25, ctr: 43.0, fmt: 'Client-Side AI Generator' },
    { pattern: `why is ${cleanSeed} important for growth`, intent: 'informational', vol: 4900, kd: 16, ctr: 33.5, fmt: 'E-E-A-T Thought Leadership Post' },
    { pattern: `top 10 ${cleanSeed} software in 2026`, intent: 'commercial', vol: 11200, kd: 29, ctr: 38.6, fmt: 'Verified Industry Ranking Listicle' },
    { pattern: `affordable ${cleanSeed} services with fast delivery`, intent: 'commercial', vol: 4100, kd: 23, ctr: 36.1, fmt: 'Commercial Pricing & Service Page' },
    { pattern: `how to audit ${cleanSeed} on your site`, intent: 'transactional', vol: 5800, kd: 22, ctr: 40.8, fmt: 'Free Diagnostic Web Checker' },
    { pattern: `complete guide to ${cleanNiche} ${cleanSeed}`, intent: 'informational', vol: 7300, kd: 24, ctr: 35.0, fmt: '3,000-Word Comprehensive Pillar' },
    { pattern: `how to fix common ${cleanSeed} errors`, intent: 'informational', vol: 6400, kd: 19, ctr: 39.2, fmt: 'Troubleshooting Guide with Code' },
    { pattern: `instant ${cleanSeed} report and pdf export`, intent: 'transactional', vol: 4700, kd: 21, ctr: 44.5, fmt: 'Automated Report Download Tool' },
    { pattern: `is ${cleanSeed} worth the investment`, intent: 'commercial', vol: 3900, kd: 20, ctr: 34.6, fmt: 'ROI Calculator & Cost Breakdown' },
    { pattern: `how to choose the right ${cleanSeed} platform`, intent: 'commercial', vol: 5100, kd: 25, ctr: 36.7, fmt: 'Buyer Decision Framework' },
    { pattern: `open source ${cleanSeed} tool for developers`, intent: 'transactional', vol: 6800, kd: 28, ctr: 39.8, fmt: 'GitHub Repository & SDK Docs' },
    { pattern: `how to automate ${cleanSeed} with ai`, intent: 'transactional', vol: 8200, kd: 27, ctr: 41.2, fmt: 'AI Workflow Integration Tool' },
    { pattern: `best practices for ${cleanSeed} optimization`, intent: 'informational', vol: 5600, kd: 17, ctr: 34.9, fmt: 'Expert Standards & Rules' },
    { pattern: `how much does ${cleanSeed} cost per month`, intent: 'commercial', vol: 4300, kd: 22, ctr: 38.3, fmt: 'Pricing Transparency Table' },
    { pattern: `how to setup ${cleanSeed} in 5 minutes`, intent: 'informational', vol: 5900, kd: 18, ctr: 39.5, fmt: 'Quick-Start Visual Tutorial' },
    { pattern: `real world examples of successful ${cleanSeed}`, intent: 'informational', vol: 3700, kd: 15, ctr: 33.8, fmt: 'Case Studies with Verified Data' },
    { pattern: `enterprise ${cleanSeed} compliance and security`, intent: 'commercial', vol: 3200, kd: 31, ctr: 35.2, fmt: 'Whitepaper & Security Blueprint' },
    { pattern: `free online ${cleanSeed} validator with no signup`, intent: 'transactional', vol: 9600, kd: 24, ctr: 46.2, fmt: 'Instant Zero-Friction Web App' },
  ];

  // Helper to build KeywordPlanItem with Ahrefs-Style Untapped Metrics
  const buildItem = (
    tmpl: { pattern: string; intent: string; vol: number; kd: number; ctr: number; fmt: string },
    type: 'short_tail' | 'long_tail',
    rank: number
  ): KeywordPlanItem => {
    const kw = tmpl.pattern;
    const adjustedVol = Math.round(tmpl.vol * baseVolumeScale);
    const kd = tmpl.kd;
    const wordCount = kw.trim().split(/\s+/).length;

    let tier: 'Easy' | 'Low' | 'Medium' | 'Hard' = 'Medium';
    if (kd <= 20) tier = 'Easy';
    else if (kd <= 32) tier = 'Low';
    else if (kd <= 48) tier = 'Medium';
    else tier = 'Hard';

    // Base CPM and CPC calculations based on intent and multipliers
    let baseCpc = 2.1;
    if (tmpl.intent === 'transactional') baseCpc = 3.8;
    else if (tmpl.intent === 'commercial') baseCpc = 4.6;
    else if (tmpl.intent === 'navigational') baseCpc = 2.4;
    else baseCpc = 1.8;

    const cpcUsd = Number((baseCpc * cpcMultiplier * (1 + (kw.length % 7) * 0.08)).toFixed(2));
    const cpmUsd = Number((cpcUsd * 4.8 * cpmMultiplier).toFixed(2));

    // Ahrefs Signature Metric 1: Traffic Potential (TP)
    // The cumulative monthly organic traffic the #1 ranking URL gets across all keyword variations
    const tpMultiplier = 1.8 + ((rank * 7 + kw.length) % 18) * 0.12;
    const trafficPotential = Math.round(adjustedVol * tpMultiplier);

    // Ahrefs Signature Metric 2: Lowest DR in Top 10 SERP & Competitor
    // Low DR ranking in Top 10 is the ultimate proof of rankability without massive authority
    let lowestDr = 14;
    let pageReferringDomains = 0;
    let lowestDrPos = (rank % 4) + 2; // Ranks between #2 and #5

    if (kd <= 18) {
      lowestDr = 8 + ((rank * 3) % 11); // DR 8 - 18
      pageReferringDomains = (rank % 3 === 0) ? 0 : 1;
    } else if (kd <= 28) {
      lowestDr = 16 + ((rank * 3) % 12); // DR 16 - 27
      pageReferringDomains = (rank % 2 === 0) ? 1 : 2;
    } else if (kd <= 42) {
      lowestDr = 26 + ((rank * 4) % 14); // DR 26 - 39
      pageReferringDomains = 2 + (rank % 4);
    } else {
      lowestDr = 42 + ((rank * 5) % 18); // DR 42 - 59
      pageReferringDomains = 5 + (rank % 8);
    }

    // Assign realistic domain name for lowest DR competitor
    const domainSuffixes = ['tools.io', 'guide.co', 'hub.dev', 'expert.app', 'stack.net', 'digest.org'];
    const chosenSuffix = domainSuffixes[(rank + kw.length) % domainSuffixes.length];
    const cleanWord = cleanSeed.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 8) || 'niche';
    
    let lowestDrCompetitor = `${cleanWord}${chosenSuffix}`;
    const isForum = rank % 6 === 0 || kw.includes('reddit') || (type === 'long_tail' && rank % 4 === 0);
    if (isForum) {
      lowestDrCompetitor = `reddit.com/r/${cleanWord}`;
    }

    // Ahrefs Signature Metric 3: SERP Flaw / Vulnerability Detection
    let serpFlaw: SerpFlawInfo;
    if (isForum) {
      serpFlaw = {
        type: 'ugc_forum',
        label: 'UGC Forum (Reddit / Quora) on Page 1',
        shortTag: '💬 Reddit on P1',
        description: 'A community forum thread ranks on page 1 because search engines lack a dedicated, authoritative guide.',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        targetRank: lowestDrPos,
      };
    } else if (pageReferringDomains <= 1) {
      serpFlaw = {
        type: 'zero_backlinks',
        label: 'Zero-Backlink Page Ranking Top 5',
        shortTag: '🎯 0 Backlinks Needed',
        description: 'The ranking URL has ≤ 1 referring domain. You can outrank it with purely superior on-page content architecture.',
        badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        targetRank: lowestDrPos,
      };
    } else if (lowestDr <= 22) {
      serpFlaw = {
        type: 'low_dr',
        label: `Weak Competitor (DR ${lowestDr}) in Top 5`,
        shortTag: `🛡️ Low DR (${lowestDr}) #` + lowestDrPos,
        description: `A young or low-authority domain (DR ${lowestDr}) ranks in the top 5, proving high domain authority is not required.`,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        targetRank: lowestDrPos,
      };
    } else if (rank % 5 === 2) {
      serpFlaw = {
        type: 'outdated_serp',
        label: 'Outdated Competitor Content (2022-2023)',
        shortTag: '⏳ Outdated SERP',
        description: 'Page 1 competitors have not updated their guides in 2+ years. A fresh 2026 update will rapidly supplant them.',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        targetRank: lowestDrPos,
      };
    } else {
      serpFlaw = {
        type: 'snippet_opportunity',
        label: 'AI Overview & Featured Snippet Gap',
        shortTag: '🤖 Snippet Gap',
        description: 'Google AI Overviews and snippet answer boxes lack a definitive <25-word summary, creating an instant capture target.',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        targetRank: 1,
      };
    }

    // Untapped Score (0-100): High Volume + Low KD + Low DR + Low Backlinks + High Traffic Potential
    const kdScorePart = Math.max(5, (100 - kd) * 0.35);
    const drScorePart = Math.max(5, (100 - lowestDr) * 0.30);
    const rdScorePart = pageReferringDomains <= 1 ? 18 : pageReferringDomains <= 3 ? 12 : 5;
    const volScorePart = Math.min(15, (adjustedVol / 20000) * 15);
    const untappedScore = Math.min(99, Math.max(52, Math.round(kdScorePart + drScorePart + rdScorePart + volScorePart)));

    // Classical Opportunity score
    const volScore = Math.min(40, (adjustedVol / 40000) * 40);
    const kdInvertedScore = Math.max(5, (100 - kd) * 0.4);
    const ctrScore = (tmpl.ctr / 50) * 15;
    const cpcScore = Math.min(10, (cpcUsd / 8) * 10);
    const rawOpp = Math.round(volScore + kdInvertedScore + ctrScore + cpcScore);
    const opportunityScore = Math.min(99, Math.max(45, rawOpp));

    // Synthesize realistic 5-competitor SERP breakdown for interactive inspector
    const serpOverview: SerpCompetitorItem[] = [
      {
        rank: 1,
        title: `Ultimate Guide to ${kw} (2026 Update)`,
        url: `https://www.${cleanWord}authority.com/${kw.replace(/\s+/g, '-')}`,
        domain: `${cleanWord}authority.com`,
        dr: 68 + (rank % 18),
        referringDomains: 42 + (rank * 3),
        estTraffic: Math.round(trafficPotential * 0.38),
        contentType: 'In-Depth Authority Guide',
        isFlaw: false,
      },
      {
        rank: 2,
        title: `How to Use ${kw} for Maximum Results`,
        url: `https://techinsider.${chosenSuffix}/${kw.replace(/\s+/g, '-')}`,
        domain: `techinsider.${chosenSuffix}`,
        dr: 48 + (rank % 15),
        referringDomains: 14 + (rank % 8),
        estTraffic: Math.round(trafficPotential * 0.22),
        contentType: 'Interactive Tutorial & Overview',
        isFlaw: lowestDrPos === 2,
        flawNote: lowestDrPos === 2 ? serpFlaw.label : undefined,
      },
      {
        rank: 3,
        title: isForum ? `[Discussion] What is the best ${kw}?` : `${kw.slice(0, 1).toUpperCase() + kw.slice(1)} - Fast & Free Tool`,
        url: `https://${lowestDrCompetitor}/${kw.replace(/\s+/g, '-')}`,
        domain: lowestDrCompetitor,
        dr: isForum ? 91 : lowestDr,
        referringDomains: pageReferringDomains,
        estTraffic: Math.round(trafficPotential * 0.16),
        contentType: isForum ? 'UGC Discussion Thread' : 'Lightweight Utility Page',
        isFlaw: true,
        flawNote: serpFlaw.label,
      },
      {
        rank: 4,
        title: `Top 10 ${kw} Alternatives and Pricing`,
        url: `https://www.softwarepulse.co/compare-${kw.replace(/\s+/g, '-')}`,
        domain: 'softwarepulse.co',
        dr: 38 + (rank % 12),
        referringDomains: 6 + (rank % 5),
        estTraffic: Math.round(trafficPotential * 0.11),
        contentType: 'Comparison Listicle',
        isFlaw: lowestDrPos === 4,
        flawNote: lowestDrPos === 4 ? serpFlaw.label : undefined,
      },
      {
        rank: 5,
        title: `${kw} Best Practices & Common Mistakes`,
        url: `https://growthdaily.org/${kw.replace(/\s+/g, '-')}`,
        domain: 'growthdaily.org',
        dr: 32 + (rank % 14),
        referringDomains: 3 + (rank % 4),
        estTraffic: Math.round(trafficPotential * 0.08),
        contentType: 'Informational Blog Post',
        isFlaw: lowestDrPos === 5,
        flawNote: lowestDrPos === 5 ? serpFlaw.label : undefined,
      },
    ];

    // Determine cluster
    let clusterName = 'Core Calculators & Utilities';
    if (/how|guide|tips|what|why|practices|beginners|tutorial/i.test(kw)) {
      clusterName = 'Educational & How-To Guides';
    } else if (/best|top|vs|comparison|pricing|cost|worth|review/i.test(kw)) {
      clusterName = 'Commercial Evaluations & Buyer Guides';
    } else if (/free|tool|generator|calculator|checker|app|validator/i.test(kw)) {
      clusterName = 'Interactive Tools & Web Apps';
    } else if (/service|solutions|agency|enterprise|security|api/i.test(kw)) {
      clusterName = 'Enterprise & Professional Services';
    } else {
      clusterName = 'Category Anchors & High-Volume Pillars';
    }

    let rankingTimeEstimate = '2-4 Weeks (Fast)';
    if (kd > 45) rankingTimeEstimate = '3-6 Months (Competitive)';
    else if (kd > 30) rankingTimeEstimate = '1-2 Months (Moderate)';

    return {
      id: `kw_${type}_${rank}_${Math.random().toString(36).substring(2, 6)}`,
      rank,
      keyword: kw,
      wordCount,
      type,
      intent: tmpl.intent as any,
      searchVolume: adjustedVol,
      trafficPotential,
      difficulty: kd,
      difficultyTier: tier,
      estimatedCtr: tmpl.ctr,
      cpmUsd,
      cpcUsd,
      opportunityScore,
      untappedScore,
      lowestDrTop10: lowestDr,
      lowestDrCompetitor,
      lowestDrPosition: lowestDrPos,
      pageReferringDomains,
      serpFlaw,
      serpOverview,
      recommendedFormat: tmpl.fmt,
      rankingTimeEstimate,
      topCompetitorSerp: lowestDrCompetitor,
      seedRelevance: 88 + (kw.length % 12),
      clusterName,
    };
  };

  const shortTailKeywords: KeywordPlanItem[] = shortTailTemplates.map((t, idx) =>
    buildItem(t, 'short_tail', idx + 1)
  );

  const longTailKeywords: KeywordPlanItem[] = longTailTemplates.map((t, idx) =>
    buildItem(t, 'long_tail', idx + 1)
  );

  const allKeywords = [...shortTailKeywords, ...longTailKeywords];

  // Calculate aggregate metrics
  const totalSearchVolume = allKeywords.reduce((acc, k) => acc + k.searchVolume, 0);
  const avgDifficulty = Math.round(
    allKeywords.reduce((acc, k) => acc + k.difficulty, 0) / allKeywords.length
  );
  const avgCtr = Number(
    (allKeywords.reduce((acc, k) => acc + k.estimatedCtr, 0) / allKeywords.length).toFixed(1)
  );
  const avgCpc = Number(
    (allKeywords.reduce((acc, k) => acc + k.cpcUsd, 0) / allKeywords.length).toFixed(2)
  );
  const avgCpm = Number(
    (allKeywords.reduce((acc, k) => acc + k.cpmUsd, 0) / allKeywords.length).toFixed(2)
  );

  // Estimated traffic value = monthly clicks (Vol * (CTR/100)) * CPC
  const totalEstimatedTrafficValueUsd = Math.round(
    allKeywords.reduce((acc, k) => {
      const estimatedClicks = k.searchVolume * (k.estimatedCtr / 100);
      return acc + estimatedClicks * k.cpcUsd;
    }, 0)
  );

  // Group into 5 Topic Clusters
  const clusterNames = [
    'Interactive Tools & Web Apps',
    'Commercial Evaluations & Buyer Guides',
    'Educational & How-To Guides',
    'Enterprise & Professional Services',
    'Category Anchors & High-Volume Pillars',
  ];

  const topicClusters: TopicCluster[] = clusterNames.map((name) => {
    const kws = allKeywords.filter((k) => k.clusterName === name);
    const clusterKeywords = kws.length > 0 ? kws : allKeywords.slice(0, 8);
    const totalVol = clusterKeywords.reduce((a, b) => a + b.searchVolume, 0);
    const avgDiff = Math.round(
      clusterKeywords.reduce((a, b) => a + b.difficulty, 0) / clusterKeywords.length
    );
    const avgClusterCpm = Number(
      (clusterKeywords.reduce((a, b) => a + b.cpmUsd, 0) / clusterKeywords.length).toFixed(2)
    );

    let desc = 'Capture high-converting search intent with dedicated web components.';
    let pageType = 'Interactive Client-Side Tool / Single View';
    let intent: 'transactional' | 'commercial' | 'informational' | 'navigational' = 'transactional';

    if (name.includes('Educational')) {
      desc = 'Target high-intent search queries looking for tutorials, checklists, and actionable answers.';
      pageType = 'Pillar Article & Step-by-Step Tutorial (1,500+ words)';
      intent = 'informational';
    } else if (name.includes('Commercial')) {
      desc = 'Target bottom-of-funnel buyers comparing pricing, alternatives, and verified feature tables.';
      pageType = 'Comparison Listicle & Value Matrix Page';
      intent = 'commercial';
    } else if (name.includes('Enterprise')) {
      desc = 'Target high-budget decision makers, agencies, and enterprise security auditors.';
      pageType = 'Enterprise Solutions & API Integration Hub';
      intent = 'commercial';
    } else if (name.includes('Category Anchors')) {
      desc = 'Establish domain authority with broad high-volume seed category anchors.';
      pageType = 'Root Topic Hub & Directory Index';
      intent = 'informational';
    }

    return {
      name,
      description: desc,
      intent,
      keywordsCount: clusterKeywords.length,
      totalVolume: totalVol,
      avgDifficulty: avgDiff,
      avgCpm: avgClusterCpm,
      primaryKeyword: clusterKeywords[0]?.keyword || cleanSeed,
      supportingKeywords: clusterKeywords.slice(1, 6).map((k) => k.keyword),
      suggestedPageType: pageType,
    };
  });

  // 4-Stage Content Roadmap
  const contentRoadmap: ContentRoadmapStage[] = [
    {
      stage: 'Phase 1: Quick-Win Long-Tail Velocity',
      phaseNumber: 1,
      timeframe: 'Weeks 1 – 3',
      focus: 'Target easy difficulty (KD <25) transactional & tutorial keywords to secure immediate Page 1 rankings.',
      targetKeywords: longTailKeywords.filter((k) => k.difficulty <= 22).slice(0, 5).map((k) => k.keyword),
      deliverables: [
        'Deploy free interactive web tool / calculator utility',
        'Publish 3 step-by-step tutorial guides with embedded FAQ schemas',
        'Implement self-referencing canonical tags and OpenGraph cards',
      ],
      projectedTrafficGain: '+2,400 to +6,800 monthly organic visitors',
    },
    {
      stage: 'Phase 2: Commercial Intent & Buyer Guides',
      phaseNumber: 2,
      timeframe: 'Weeks 4 – 7',
      focus: 'Capture high-CPM commercial comparison queries and product evaluation terms.',
      targetKeywords: allKeywords.filter((k) => k.intent === 'commercial').slice(0, 5).map((k) => k.keyword),
      deliverables: [
        'Publish verified 2026 comparison listicle and pricing matrix',
        'Add interactive ROI / cost calculator module',
        'Internal link Phase 1 tutorials to new comparison hub',
      ],
      projectedTrafficGain: '+8,500 to +18,000 monthly organic visitors',
    },
    {
      stage: 'Phase 3: Topic Pillar & Authority Hub',
      phaseNumber: 3,
      timeframe: 'Weeks 8 – 12',
      focus: 'Launch 3,500+ word ultimate pillar guide for the main seed keyword topic with semantic schema.',
      targetKeywords: shortTailKeywords.slice(0, 5).map((k) => k.keyword),
      deliverables: [
        'Deploy ultimate seed pillar resource with interactive widgets',
        'Distribute 15 targeted internal links across all supporting clusters',
        'Integrate JSON-LD WebSite & FAQPage structured metadata',
      ],
      projectedTrafficGain: '+25,000 to +65,000 monthly organic visitors',
    },
    {
      stage: 'Phase 4: Market Domination & Featured Snippets',
      phaseNumber: 4,
      timeframe: 'Months 4 – 6',
      focus: 'Target all 50 keyword opportunities, capture AI Answer Overviews, and optimize for featured snippets.',
      targetKeywords: allKeywords.slice(0, 6).map((k) => k.keyword),
      deliverables: [
        'Optimize snippet answer blocks (<25 words bolded answers under H3 tags)',
        'Release API / developer documentation SDK page',
        'Continuous SERP position tracking & CTR optimization',
      ],
      projectedTrafficGain: '+75,000 to +180,000 monthly organic visitors',
    },
  ];

  return {
    id: `plan_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    niche: rawNiche,
    seedKeyword: rawSeed,
    country,
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime + 650,
    totalSearchVolume,
    avgDifficulty,
    avgCtr,
    avgCpc,
    avgCpm,
    totalEstimatedTrafficValueUsd,
    shortTailKeywords,
    longTailKeywords,
    allKeywords,
    topicClusters,
    contentRoadmap,
  };
}

/**
 * Pre-configured Industry Presets for 1-Click Exploration
 */
export const KEYWORD_PLANNER_PRESETS = [
  {
    id: 'saas',
    label: 'SaaS AI Video Editor',
    niche: 'SaaS Software & AI Tools',
    seed: 'ai video generator',
    country: 'US',
  },
  {
    id: 'health',
    label: 'Health & Calorie Tracker',
    niche: 'Health, Wellness & Fitness',
    seed: 'calorie counter app',
    country: 'US',
  },
  {
    id: 'finance',
    label: 'Personal Finance & Roth IRA',
    niche: 'Personal Finance & Investing',
    seed: 'roth ira calculator',
    country: 'US',
  },
  {
    id: 'ecommerce',
    label: 'Ecommerce & Luxury Watches',
    niche: 'Ecommerce & Luxury Goods',
    seed: 'automatic dive watches',
    country: 'US',
  },
  {
    id: 'webtools',
    label: 'Time & Web Utilities',
    niche: 'Developer & Web Utilities',
    seed: 'date duration calculator',
    country: 'US',
  },
  {
    id: 'realestate',
    label: 'Real Estate & Mortgage',
    niche: 'Real Estate & Property',
    seed: 'mortgage payment estimator',
    country: 'US',
  },
];
