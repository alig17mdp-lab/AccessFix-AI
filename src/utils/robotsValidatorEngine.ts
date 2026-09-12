import {
  RobotsValidationReport,
  RobotsIssue,
  UserAgentBot,
  PathTestResult,
} from '../types/robotsValidator';

export const ROBOTS_PRESET_SCENARIOS = [
  {
    label: 'Modern AI Governance: Allow AI Search, Block Training Scrapers',
    description: 'Allows Googlebot, Bingbot, PerplexityBot, ChatGPT-User, and OAI-SearchBot while blocking GPTBot, ClaudeBot, and CCBot.',
    content: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Disallow: /cart/
Disallow: /internal/

# Block AI Model Training Scrapers (Prevent Uncompensated Model Training)
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

# Allow AI Real-Time Answer Retrievers & Search Engines (Preserve Citations)
User-agent: PerplexityBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Ensure Full Googlebot & Bingbot Rendering Access
Allow: /*.css$
Allow: /*.js$
Allow: /*.webp$

Sitemap: https://accessfix.ai/sitemap.xml`,
  },
  {
    label: 'Accidental CSS/JS Disallow (Critical SEO Danger)',
    description: 'Blocks Googlebot from rendering CSS and JavaScript assets, destroying mobile rendering and Core Web Vitals.',
    content: `User-agent: *
Disallow: /admin/
Disallow: /scripts/
Disallow: /*.js$
Disallow: /*.css$
Disallow: /cart/

Sitemap: https://myshopify-store.com/sitemap.xml`,
  },
  {
    label: 'Strict AI & Scraper Lockdown (Zero AI Ingestion)',
    description: 'Permits traditional search indexing but completely disallows all generative AI training crawlers and answer bots.',
    content: `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: *
Disallow: /admin/

Sitemap: https://myenterprise.org/sitemap.xml`,
  },
  {
    label: 'Standard Clean WordPress / E-Commerce Blueprint',
    description: 'Best practice baseline configuration for blogs and retail stores with zero rendering traps.',
    content: `User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/

Allow: /*.css$
Allow: /*.js$

Sitemap: https://mybrand.com/sitemap.xml`,
  },
];

export const MONITORED_BOTS: {
  name: string;
  category: 'search' | 'ai_scraper' | 'ai_search_retriever' | 'social';
  organization: string;
  description: string;
  botType: 'model_training' | 'search_retrieval' | 'general_search';
  cloudflareToken: string;
}[] = [
  {
    name: 'Googlebot',
    category: 'search',
    organization: 'Google',
    description: 'Primary web and mobile search indexing spider with full headless Chromium rendering',
    botType: 'general_search',
    cloudflareToken: 'Googlebot',
  },
  {
    name: 'Bingbot',
    category: 'search',
    organization: 'Microsoft',
    description: 'Bing search engine and Copilot generative answer retrieval web crawler',
    botType: 'general_search',
    cloudflareToken: 'Bingbot',
  },
  {
    name: 'DuckDuckBot',
    category: 'search',
    organization: 'DuckDuckGo',
    description: 'Privacy-focused search engine crawler respecting standard web directives',
    botType: 'general_search',
    cloudflareToken: 'DuckDuckBot',
  },
  {
    name: 'GPTBot',
    category: 'ai_scraper',
    organization: 'OpenAI',
    description: 'Training data collection crawler for OpenAI foundation models (ChatGPT / GPT-4o)',
    botType: 'model_training',
    cloudflareToken: 'GPTBot',
  },
  {
    name: 'ChatGPT-User',
    category: 'ai_search_retriever',
    organization: 'OpenAI',
    description: 'Real-time browsing agent fetching live links directly requested by ChatGPT users',
    botType: 'search_retrieval',
    cloudflareToken: 'ChatGPT-User',
  },
  {
    name: 'OAI-SearchBot',
    category: 'ai_search_retriever',
    organization: 'OpenAI',
    description: 'Web indexing crawler for SearchGPT and OpenAI search experiences (drives citations)',
    botType: 'search_retrieval',
    cloudflareToken: 'OAI-SearchBot',
  },
  {
    name: 'ClaudeBot',
    category: 'ai_scraper',
    organization: 'Anthropic',
    description: 'Automated web scraper collecting public data to train Anthropic Claude AI models',
    botType: 'model_training',
    cloudflareToken: 'ClaudeBot',
  },
  {
    name: 'Claude-Web',
    category: 'ai_search_retriever',
    organization: 'Anthropic',
    description: 'Real-time user retrieval crawler executing searches when Claude users ask for web info',
    botType: 'search_retrieval',
    cloudflareToken: 'Claude-Web',
  },
  {
    name: 'PerplexityBot',
    category: 'ai_search_retriever',
    organization: 'Perplexity AI',
    description: 'Conversational answer engine web indexer used to discover citations and source links',
    botType: 'search_retrieval',
    cloudflareToken: 'PerplexityBot',
  },
  {
    name: 'Google-Extended',
    category: 'ai_scraper',
    organization: 'Google',
    description: 'Specific token allowing publishers to opt out of Google Gemini and Vertex AI training',
    botType: 'model_training',
    cloudflareToken: 'Google-Extended',
  },
  {
    name: 'Bytespider',
    category: 'ai_scraper',
    organization: 'ByteDance',
    description: 'Aggressive web scraper gathering content for TikTok AI algorithms and Doubao models',
    botType: 'model_training',
    cloudflareToken: 'Bytespider',
  },
  {
    name: 'CCBot',
    category: 'ai_scraper',
    organization: 'Common Crawl',
    description: 'Open-access crawl corpus widely downloaded by tech firms for training foundation LLMs',
    botType: 'model_training',
    cloudflareToken: 'CCBot',
  },
  {
    name: 'Meta-ExternalAgent',
    category: 'ai_scraper',
    organization: 'Meta',
    description: 'Web crawler collecting multimodal training corpora for Meta Llama foundation models',
    botType: 'model_training',
    cloudflareToken: 'Meta-ExternalAgent',
  },
  {
    name: 'Amazonbot',
    category: 'ai_scraper',
    organization: 'Amazon',
    description: 'Web crawler gathering catalog insights and answer data for Alexa and Rufus AI',
    botType: 'model_training',
    cloudflareToken: 'Amazonbot',
  },
  {
    name: 'cohere-ai',
    category: 'ai_scraper',
    organization: 'Cohere',
    description: 'Web scraper indexing domain data for enterprise LLMs and RAG retrieval pipelines',
    botType: 'model_training',
    cloudflareToken: 'cohere-ai',
  },
  {
    name: 'Applebot-Extended',
    category: 'ai_scraper',
    organization: 'Apple',
    description: 'Specific crawler allowing publishers to govern data used for Apple Intelligence models',
    botType: 'model_training',
    cloudflareToken: 'Applebot-Extended',
  },
];

export function validateRobotsTxt(rawContent: string): RobotsValidationReport {
  const lines = rawContent.split('\n');
  const issues: RobotsIssue[] = [];
  const sitemapDirectives: string[] = [];

  let cssBlocked = false;
  let jsBlocked = false;
  let imagesBlocked = false;

  let hasUserAgent = false;
  let hasWildcardUserAgent = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const lineNum = index + 1;
    const lower = trimmed.toLowerCase();

    if (lower.startsWith('user-agent:')) {
      hasUserAgent = true;
      const uaVal = trimmed.substring(11).trim();
      if (uaVal === '*') {
        hasWildcardUserAgent = true;
      }
    }

    if (lower.startsWith('sitemap:')) {
      const sitemapUrl = trimmed.substring(8).trim();
      sitemapDirectives.push(sitemapUrl);
      if (!sitemapUrl.startsWith('http://') && !sitemapUrl.startsWith('https://')) {
        issues.push({
          id: `err_sitemap_abs_${lineNum}`,
          title: 'Relative Sitemap URL Detected',
          severity: 'critical',
          line: lineNum,
          description: `Line ${lineNum}: The Sitemap directive must specify an absolute URL starting with https://.`,
          impact: 'Search engines will ignore relative sitemap paths.',
          suggestedFix: `Change to an absolute HTTPS URL (e.g., Sitemap: https://yourdomain.com/sitemap.xml).`,
        });
      }
    }

    if (lower.startsWith('disallow:')) {
      const path = trimmed.substring(9).trim();
      if (path.includes('.css') || path.includes('/css/')) cssBlocked = true;
      if (path.includes('.js') || path.includes('/js/') || path.includes('/scripts/')) jsBlocked = true;
      if (path.includes('.jpg') || path.includes('.png') || path.includes('.webp') || path.includes('/images/')) imagesBlocked = true;

      if (path === '' && lines[index - 1]?.toLowerCase().includes('user-agent: *')) {
        // Disallow: (empty) means allow everything
      }

      if (path === '/') {
        issues.push({
          id: `warn_disallow_all_${lineNum}`,
          title: 'Complete Root Domain Disallow (Disallow: /)',
          severity: 'critical',
          line: lineNum,
          description: `Line ${lineNum}: "Disallow: /" blocks the entire website from being crawled.`,
          impact: 'Can cause immediate de-indexation of your entire site from Google.',
          suggestedFix: 'Only disallow specific private folders (e.g. /admin/, /cart/).',
        });
      }
    }

    if (lower.startsWith('crawl-delay:')) {
      issues.push({
        id: `info_crawl_delay_${lineNum}`,
        title: 'Crawl-Delay Directive Ignored by Googlebot',
        severity: 'info',
        line: lineNum,
        description: `Line ${lineNum}: Googlebot does not respect the Crawl-Delay directive (though Bingbot and Yandex do).`,
        impact: 'No negative impact on Google, but will not throttle Googlebot crawl rate.',
        suggestedFix: 'Configure crawl rate limits inside Google Search Console settings if needed.',
      });
    }
  });

  if (!hasUserAgent) {
    issues.push({
      id: 'crit_no_ua',
      title: 'Missing User-agent Directive',
      severity: 'critical',
      description: 'The robots.txt file must declare at least one "User-agent:" directive.',
      impact: 'Without User-agent, search bots cannot interpret permissions.',
      suggestedFix: 'Add "User-agent: *" at the top of your file.',
    });
  }

  if (sitemapDirectives.length === 0) {
    issues.push({
      id: 'warn_no_sitemap',
      title: 'No Sitemap Declaration Found',
      severity: 'warning',
      description: 'Your robots.txt does not declare the location of your XML sitemap.',
      impact: 'Search crawlers may miss newly published deep URLs.',
      suggestedFix: 'Append "Sitemap: https://yourdomain.com/sitemap.xml" at the bottom of the file.',
    });
  }

  if (cssBlocked || jsBlocked) {
    issues.push({
      id: 'crit_render_blocking',
      title: 'Critical Resource Block (CSS / JavaScript)',
      severity: 'critical',
      description: 'Your directives disallow CSS or JS files. Googlebot requires full access to stylesheets and scripts to render your site and evaluate mobile usability.',
      impact: 'Directly triggers mobile usability penalties and layout rendering failures in Google Search.',
      suggestedFix: 'Remove disallow rules targeting *.css, *.js, or asset folders.',
    });
  }

  // Calculate bot access statuses with RFC 9309 precedence
  const normalizedText = rawContent.replace(/\r\n/g, '\n');
  const lowerContent = normalizedText.toLowerCase();

  const botsStatus: UserAgentBot[] = MONITORED_BOTS.map((bot) => {
    const botNameLower = bot.name.toLowerCase();
    
    // Check if there is an explicit section for this bot
    const specificRegex = new RegExp(`user-agent:\\s*${botNameLower}\\b([^]*?)(?=user-agent:|$)`, 'i');
    const specificMatch = normalizedText.match(specificRegex);

    let status: 'allowed' | 'disallowed' | 'partially_blocked' = 'allowed';

    if (specificMatch) {
      const section = specificMatch[1].toLowerCase();
      if (section.includes('disallow: /') && !section.includes('disallow: /admin') && !section.includes('allow: /')) {
        status = 'disallowed';
      } else if (section.includes('disallow:')) {
        status = 'partially_blocked';
      } else if (section.includes('allow:')) {
        status = 'allowed';
      }
    } else {
      // Fallback to wildcard User-agent: *
      const wildcardRegex = /user-agent:\s*\*([^]*?)(?=user-agent:|$)/i;
      const wildcardMatch = normalizedText.match(wildcardRegex);
      if (wildcardMatch) {
        const section = wildcardMatch[1].toLowerCase();
        if (section.includes('disallow: /') && !section.includes('disallow: /admin') && !section.includes('allow: /')) {
          status = 'disallowed';
        } else if (section.includes('disallow:')) {
          status = 'partially_blocked';
        }
      }
    }

    return {
      ...bot,
      status,
    };
  });

  // Calculate overall safety score
  let score = 100;
  issues.forEach((iss) => {
    if (iss.severity === 'critical') score -= 30;
    if (iss.severity === 'warning') score -= 15;
    if (iss.severity === 'info') score -= 5;
  });
  const safetyScore = Math.max(10, Math.min(100, score));

  // Calculate AI Visibility Score (ability for AI search engines to cite your brand)
  const citationBots = botsStatus.filter((b) => b.category === 'ai_search_retriever' || b.name === 'Googlebot' || b.name === 'Bingbot');
  const allowedCitationCount = citationBots.filter((b) => b.status === 'allowed' || b.status === 'partially_blocked').length;
  const aiVisibilityScore = Math.round((allowedCitationCount / citationBots.length) * 100);

  // Calculate AI Scraper Block Rate (percentage of model training bots blocked)
  const trainingScrapers = botsStatus.filter((b) => b.category === 'ai_scraper');
  const blockedScraperCount = trainingScrapers.filter((b) => b.status === 'disallowed').length;
  const aiScraperBlockRate = Math.round((blockedScraperCount / trainingScrapers.length) * 100);

  // Generate dynamic Cloudflare WAF expression matching the user's current configuration
  const blockedBotTokens = botsStatus.filter((b) => b.status === 'disallowed').map((b) => `http.user_agent contains "${b.cloudflareToken || b.name}"`);
  const cloudflareWafSnippet = blockedBotTokens.length > 0
    ? `( ${blockedBotTokens.join(' or\n  ')} )`
    : `( http.user_agent contains "GPTBot" or\n  http.user_agent contains "ClaudeBot" or\n  http.user_agent contains "CCBot" or\n  http.user_agent contains "Bytespider" )`;

  // Generate clean repaired robots.txt
  let repaired = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /cart/\n\n# Ensure search engines can render CSS and JS assets\nAllow: /*.css$\nAllow: /*.js$\n\n# AI Training Crawler Governance\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\n# Keep AI Search Engines & Citation Retrievers Allowed\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\n`;
  if (sitemapDirectives.length > 0) {
    sitemapDirectives.forEach((s) => {
      repaired += `Sitemap: ${s.startsWith('http') ? s : `https://${s}`}\n`;
    });
  } else {
    repaired += `Sitemap: https://yourdomain.com/sitemap.xml\n`;
  }

  return {
    rawContent,
    safetyScore,
    aiVisibilityScore,
    aiScraperBlockRate,
    totalLines: lines.length,
    sitemapDirectives,
    issues,
    botsStatus,
    criticalAssetBlocking: {
      cssBlocked,
      jsBlocked,
      imagesBlocked,
    },
    cloudflareWafSnippet,
    repairedRobotsTxt: repaired,
  };
}

export function testPathAgainstRobots(path: string, bot: string, rawRobots: string): PathTestResult {
  const cleanPath = path.trim().startsWith('/') ? path.trim() : `/${path.trim()}`;
  const lowerPath = cleanPath.toLowerCase();
  const normalizedText = rawRobots.replace(/\r\n/g, '\n');

  // Determine bot execution profile
  const isGoogleOrBing = bot.toLowerCase().includes('googlebot') || bot.toLowerCase().includes('bingbot');
  const botExecutionMode = isGoogleOrBing
    ? 'Headless Chromium DOM (Googlebot WRS)'
    : 'Raw HTML Only (Standard AI Scrapers)';

  const behaviorNote = isGoogleOrBing
    ? 'Executes client-side JavaScript, web components, and dynamic API renders. Full layout & visual CSS calculated.'
    : 'Fetches raw server-delivered HTML without client-side JavaScript execution. Client-only rendered content will NOT be indexed.';

  // Check specific bot section first
  const specificRegex = new RegExp(`user-agent:\\s*${bot}\\b([^]*?)(?=user-agent:|$)`, 'i');
  const specificMatch = normalizedText.match(specificRegex);

  let allowed = true;
  let matchedRule = 'Default Allow: /';

  const sectionToCheck = specificMatch ? specificMatch[1] : (normalizedText.match(/user-agent:\s*\*([^]*?)(?=user-agent:|$)/i)?.[1] || '');

  const rules = sectionToCheck.split('\n');
  for (const line of rules) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('disallow:')) {
      const disallowPath = trimmed.substring(9).trim();
      if (disallowPath === '') continue;
      if (disallowPath === '/' && !lowerPath.includes('robots.txt')) {
        allowed = false;
        matchedRule = `Disallow: / (for ${specificMatch ? bot : 'wildcard *'})`;
        break;
      }
      if (lowerPath.startsWith(disallowPath.toLowerCase())) {
        allowed = false;
        matchedRule = `Disallow: ${disallowPath}`;
        break;
      }
      if (disallowPath.includes('*')) {
        const regexStr = disallowPath.replace(/\*/g, '.*').replace(/\$/g, '$');
        if (new RegExp(regexStr, 'i').test(cleanPath)) {
          allowed = false;
          matchedRule = `Disallow: ${disallowPath}`;
          break;
        }
      }
    } else if (lower.startsWith('allow:')) {
      const allowPath = trimmed.substring(6).trim();
      if (allowPath === '') continue;
      if (lowerPath.startsWith(allowPath.toLowerCase())) {
        allowed = true;
        matchedRule = `Allow: ${allowPath}`;
      }
    }
  }

  return {
    path: cleanPath,
    bot,
    allowed,
    matchedRule,
    botExecutionMode,
    behaviorNote,
  };
}

