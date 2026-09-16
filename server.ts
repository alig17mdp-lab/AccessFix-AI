import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { executeAccessibilityScan, generateDomainTailoredScan, validateAndSanitizeUrl } from './server/scannerEngine.ts';
import { executeUnifiedHealthScan } from './server/healthEngine.ts';
import { executeSiteComparison } from './server/comparisonEngine.ts';
import {
  generateAiRemediation,
  generateAltTextFromAi,
  generateMetaTagSuggestions,
  generateJsonLdSchema,
  generateContentBrief,
} from './server/geminiService.ts';
import {
  humanizeContentWithAi,
  humanizeKeywordsEngine,
} from './server/contentHumanizerEngine.ts';
import { DefaultKeywordProvider, DefaultSerpProvider } from './server/providers.ts';
import { storage } from './server/storage.ts';
import { executeLiveGeoAudit } from './server/geoAuditorServerEngine.ts';
import { executeLiveAeoAudit } from './server/aeoAuditorServerEngine.ts';

const keywordProvider = new DefaultKeywordProvider();
const serpProvider = new DefaultSerpProvider();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic middleware
  app.use(express.json({ limit: '5mb' }));

  // Request logging for monitoring
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // =================== API ROUTES =================== //

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'operational',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Unified Multi-Pillar Health & Growth Scan (Accessibility + SEO + Tech SEO + Performance + Content)
  app.post('/api/health-scan', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'Website URL is required.' });
      }

      const result = await executeUnifiedHealthScan(url);

      // Save scan to persistence
      storage.saveScan(result.accessibilityScan);

      // Update user scans
      const user = storage.getUser();
      user.scansUsedThisMonth += 1;

      return res.json(result);
    } catch (err: any) {
      console.error('Unified health scan error:', err);
      return res.status(500).json({
        error: err.message || 'An unexpected error occurred during the multi-pillar health scan.',
      });
    }
  });

  // Content Humanization API (Strict 2,000 words maximum capacity)
  app.post('/api/humanize-content', async (req: Request, res: Response) => {
    try {
      const { text, tone, lockedKeywords, eeatStrictness, readingLevel } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text content is required for humanization.' });
      }

      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > 2000) {
        return res.status(400).json({
          error: `Word limit exceeded. Content Humanizer allows a maximum of 2,000 words per scan. You submitted ${wordCount.toLocaleString()} words.`,
          wordCount,
          maxWords: 2000,
        });
      }

      const result = await humanizeContentWithAi(text, {
        tone: tone || 'natural',
        lockedKeywords: Array.isArray(lockedKeywords) ? lockedKeywords : [],
        eeatStrictness: eeatStrictness || 'maximum',
        readingLevel: readingLevel || 'standard',
      });

      return res.json(result);
    } catch (err: any) {
      console.error('Content humanization error:', err);
      return res.status(500).json({
        error: err.message || 'An unexpected error occurred while humanizing content.',
      });
    }
  });

  // Keywords Humanization API (10/10 Dynamic & Natural Conversational Queries)
  app.post('/api/humanize-keywords', async (req: Request, res: Response) => {
    try {
      const { keywords } = req.body;
      if (!keywords || (Array.isArray(keywords) && keywords.length === 0)) {
        return res.status(400).json({ error: 'Keywords input is required.' });
      }

      const result = await humanizeKeywordsEngine(keywords);
      return res.json(result);
    } catch (err: any) {
      console.error('Keyword humanization error:', err);
      return res.status(500).json({
        error: err.message || 'An unexpected error occurred while humanizing keywords.',
      });
    }
  });

  // Keyword Opportunities API
  app.post('/api/tools/keywords/opportunities', async (req: Request, res: Response) => {
    try {
      const { seed, country } = req.body;
      if (!seed || typeof seed !== 'string') {
        return res.status(400).json({ error: 'Seed keyword topic is required.' });
      }
      const data = await keywordProvider.getKeywordOpportunities(seed, country || 'US');
      return res.json({ provider: keywordProvider.name, data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch keyword opportunities.' });
    }
  });

  // Low Competition Keyword Finder API
  app.post('/api/tools/keywords/low-competition', async (req: Request, res: Response) => {
    try {
      const { seed, maxDifficulty } = req.body;
      if (!seed) {
        return res.status(400).json({ error: 'Seed keyword is required.' });
      }
      const data = await keywordProvider.getLowCompetitionKeywords(seed, maxDifficulty || 35);
      return res.json({ provider: keywordProvider.name, data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch low-competition keywords.' });
    }
  });

  // SERP Inspector API
  app.post('/api/tools/serp-overview', async (req: Request, res: Response) => {
    try {
      const { keyword } = req.body;
      if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required.' });
      }
      const results = await serpProvider.getSerpOverview(keyword);
      const features = await serpProvider.getSerpFeatures(keyword);
      return res.json({ keyword, results, features, provider: serpProvider.name });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to inspect SERP data.' });
    }
  });

  // AI Meta Tag Generator & Optimizer
  app.post('/api/tools/meta/suggest', async (req: Request, res: Response) => {
    try {
      const { targetKeyword, domain, pageTitle, summaryText } = req.body;
      if (!targetKeyword || !domain) {
        return res.status(400).json({ error: 'Target keyword and domain are required.' });
      }
      const suggestions = await generateMetaTagSuggestions({ targetKeyword, domain, pageTitle, summaryText });
      return res.json(suggestions);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to generate meta suggestions.' });
    }
  });

  // JSON-LD Schema Generator
  app.post('/api/tools/schema/generate', async (req: Request, res: Response) => {
    try {
      const { schemaType, entityName, url, description, faqs } = req.body;
      if (!schemaType || !entityName || !url) {
        return res.status(400).json({ error: 'Schema type, entity name, and URL are required.' });
      }
      const schemaData = await generateJsonLdSchema({ schemaType, entityName, url, description, faqs });
      return res.json(schemaData);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to generate schema markup.' });
    }
  });

  // AI Content Brief Generator
  app.post('/api/tools/content/brief', async (req: Request, res: Response) => {
    try {
      const { targetKeyword, domain, competitors } = req.body;
      if (!targetKeyword || !domain) {
        return res.status(400).json({ error: 'Target keyword and domain are required.' });
      }
      const brief = await generateContentBrief({ targetKeyword, domain, competitors });
      return res.json(brief);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to generate AI content brief.' });
    }
  });

  // SITE COMPARISON & COMPETITIVE INTELLIGENCE ENGINE
  app.post('/api/tools/site-comparison', async (req: Request, res: Response) => {
    try {
      const { yourUrl, competitorUrl, country, language, industry, comparisonDepth } = req.body;
      if (!yourUrl || !competitorUrl) {
        return res.status(400).json({ error: 'Both Your Site URL and Competitor Site URL are required.' });
      }

      const validYour = validateAndSanitizeUrl(yourUrl);
      if (!validYour.isValid || !validYour.sanitizedUrl) {
        return res.status(400).json({ error: `Your Site URL is invalid: ${validYour.error}` });
      }

      const validComp = validateAndSanitizeUrl(competitorUrl);
      if (!validComp.isValid || !validComp.sanitizedUrl) {
        return res.status(400).json({ error: `Competitor Site URL is invalid: ${validComp.error}` });
      }

      const comparisonResult = await executeSiteComparison({
        yourUrl: validYour.sanitizedUrl,
        competitorUrl: validComp.sanitizedUrl,
        country: country || 'US',
        language: language || 'en',
        industry: industry || 'Technology / SaaS / Ecommerce',
        comparisonDepth: comparisonDepth || 'deep',
      });

      // Save comparison report for sharing and history
      storage.saveComparison(comparisonResult);

      // Increment user quota count
      const user = storage.getUser();
      user.scansUsedThisMonth += 1;

      return res.json(comparisonResult);
    } catch (err: any) {
      console.error('Site comparison error:', err);
      return res.status(500).json({
        error: err.message || 'An unexpected error occurred while running the site comparison.',
      });
    }
  });

  // Get saved comparison report by ID
  app.get('/api/tools/site-comparison/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const comparison = storage.getComparison(id);
    if (!comparison) {
      return res.status(404).json({ error: 'Comparison report not found.' });
    }
    return res.json(comparison);
  });

  // REAL-TIME GEO (Generative Engine Optimization) LIVE AUDIT API
  app.post('/api/tools/geo-audit', async (req: Request, res: Response) => {
    try {
      const { url, rawContent } = req.body;
      const target = (url || rawContent || '').trim();
      if (!target) {
        return res.status(400).json({ error: 'Target URL or domain is required.' });
      }
      const report = await executeLiveGeoAudit(target);
      return res.json(report);
    } catch (err: any) {
      console.error('GEO audit error:', err);
      return res.status(500).json({ error: err.message || 'Failed to complete real-time GEO audit.' });
    }
  });

  // REAL-TIME AEO (Answer Engine Optimization) LIVE AUDIT API
  app.post('/api/tools/aeo-audit', async (req: Request, res: Response) => {
    try {
      const { url, content } = req.body;
      const target = (url || content || '').trim();
      if (!target) {
        return res.status(400).json({ error: 'Target URL or content is required.' });
      }
      const report = await executeLiveAeoAudit({ url, content });
      return res.json(report);
    } catch (err: any) {
      console.error('AEO audit error:', err);
      return res.status(500).json({ error: err.message || 'Failed to complete real-time AEO audit.' });
    }
  });

  // DOMAIN RATING & AUTHORITY CHECKER API
  app.post('/api/tools/domain-rating', async (req: Request, res: Response) => {
    try {
      const { domain } = req.body;
      if (!domain) {
        return res.status(400).json({ error: 'Domain name is required.' });
      }

      let cleanDomain = String(domain).trim().toLowerCase();
      cleanDomain = cleanDomain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split('?')[0];

      return res.json({
        success: true,
        domain: cleanDomain,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Domain rating API error:', err);
      return res.status(500).json({ error: err.message || 'Failed to analyze domain rating.' });
    }
  });

  // SITEMAP AUDITOR & FETCHER API
  app.post('/api/tools/fetch-sitemap', async (req: Request, res: Response) => {
    try {
      let { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Sitemap URL is required.' });
      }

      url = url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // If user typed domain without path, suggest /sitemap.xml
      try {
        const parsed = new URL(url);
        if (parsed.pathname === '/' || parsed.pathname === '') {
          parsed.pathname = '/sitemap.xml';
          url = parsed.toString();
        }
      } catch {
        return res.status(400).json({ error: 'Invalid URL format provided.' });
      }

      console.log(`[SitemapAuditor] Fetching sitemap from: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      try {
        const fetchRes = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AccessFix-SitemapAuditor/2.0; +https://accessfix.ai)',
            'Accept': 'application/xml, text/xml, application/xhtml+xml, text/html;q=0.9, */*;q=0.8',
          },
          redirect: 'follow',
        });

        clearTimeout(timeoutId);

        if (!fetchRes.ok) {
          return res.status(fetchRes.status).json({
            error: `Failed to fetch sitemap: HTTP ${fetchRes.status} (${fetchRes.statusText}) from ${url}`,
          });
        }

        const text = await fetchRes.text();
        if (!text || text.trim().length === 0) {
          return res.status(400).json({ error: 'The retrieved sitemap content was empty.' });
        }

        // Check if response is an HTML page (like Cloudflare or 404 page disguised)
        if (text.includes('<!DOCTYPE html') && !text.includes('<urlset') && !text.includes('<sitemapindex')) {
          return res.status(400).json({
            error: `The endpoint returned an HTML document rather than an XML sitemap. Verify that ${url} points directly to an XML file.`,
            rawSnippet: text.slice(0, 300),
          });
        }

        return res.json({
          success: true,
          url,
          xml: text,
          byteLength: Buffer.byteLength(text, 'utf8'),
        });
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
          return res.status(504).json({ error: `Connection timed out while fetching ${url} (exceeded 9 seconds).` });
        }
        return res.status(502).json({ error: `Could not connect to ${url}: ${fetchErr.message}` });
      }
    } catch (err: any) {
      console.error('Fetch sitemap error:', err);
      return res.status(500).json({ error: err.message || 'An unexpected error occurred while retrieving sitemap.' });
    }
  });


  // Run live or simulated accessibility scan
  app.post('/api/scan', async (req: Request, res: Response) => {
    try {
      const { url, demoMode } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'Website URL is required.' });
      }

      const validation = validateAndSanitizeUrl(url);
      if (!validation.isValid || !validation.sanitizedUrl) {
        return res.status(400).json({ error: validation.error || 'Invalid URL supplied.' });
      }

      const sanitizedUrl = validation.sanitizedUrl;
      let scanResult;

      if (demoMode) {
        scanResult = generateDomainTailoredScan(sanitizedUrl, Date.now());
      } else {
        scanResult = await executeAccessibilityScan(sanitizedUrl);
      }

      // Save scan to persistence layer
      storage.saveScan(scanResult);

      // Increment user scans count
      const user = storage.getUser();
      user.scansUsedThisMonth += 1;

      return res.json(scanResult);
    } catch (err: any) {
      console.error('Scan execution error:', err);
      return res.status(500).json({
        error: err.message || 'An unexpected error occurred while scanning the target website.',
      });
    }
  });

  // Get instant sample report for demo exploration
  app.post('/api/scan/sample', (req: Request, res: Response) => {
    const sampleUrl = req.body?.url || 'https://acme-modernstore.example.com';
    const scanResult = generateDomainTailoredScan(sampleUrl, Date.now() - 1450);
    storage.saveScan(scanResult);
    res.json(scanResult);
  });

  // Get specific scan by ID
  app.get('/api/scans/:id', (req: Request, res: Response) => {
    const scan = storage.getScan(req.params.id);
    if (!scan) {
      return res.status(404).json({ error: 'Scan report not found.' });
    }
    return res.json(scan);
  });

  // Update issue resolution status (open | in_progress | fixed | ignored)
  app.patch('/api/scans/:scanId/issues/:issueId', (req: Request, res: Response) => {
    const { scanId, issueId } = req.params;
    const { status } = req.body;
    if (!['open', 'in_progress', 'fixed', 'ignored'].includes(status)) {
      return res.status(400).json({ error: 'Invalid issue status.' });
    }

    const success = storage.updateIssueStatus(scanId, issueId, status);
    if (!success) {
      return res.status(404).json({ error: 'Scan or issue could not be found.' });
    }

    return res.json({ success: true, scanId, issueId, status });
  });

  // Generate grounded AI remediation via Gemini 3.7
  app.post('/api/ai/fix', async (req: Request, res: Response) => {
    try {
      const { issueTitle, category, wcagCriteria, affectedElement, htmlSnippet, url } = req.body;
      if (!issueTitle || !category) {
        return res.status(400).json({ error: 'Missing issue metadata for AI generation.' });
      }

      const remediation = await generateAiRemediation({
        issueTitle,
        category,
        wcagCriteria: wcagCriteria || 'WCAG 2.1 AA',
        affectedElement: affectedElement || 'Element',
        htmlSnippet,
        url: url || 'https://example.com',
      });

      return res.json(remediation);
    } catch (err: any) {
      console.error('AI remediation error:', err);
      return res.status(500).json({ error: 'Failed to generate AI remediation snippet.' });
    }
  });

  // Generate accessible Alt Text for image context
  app.post('/api/ai/alt-text', async (req: Request, res: Response) => {
    try {
      const { context } = req.body;
      if (!context || typeof context !== 'string') {
        return res.status(400).json({ error: 'Image description or context is required.' });
      }

      const result = await generateAltTextFromAi(context);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to generate alt text.' });
    }
  });

  // Current authenticated user profile
  app.get('/api/user', (req: Request, res: Response) => {
    const user = storage.getUser();
    res.json(user);
  });

  // Upgrade or change subscription plan
  app.patch('/api/user/plan', (req: Request, res: Response) => {
    const { plan } = req.body;
    if (!['free', 'pro', 'agency'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid subscription plan level.' });
    }
    const updated = storage.updateUserPlan('usr_demo_accessfix', plan);
    res.json(updated);
  });

  // Monitored websites endpoints
  app.get('/api/websites', (req: Request, res: Response) => {
    res.json(storage.getWebsites());
  });

  app.post('/api/websites', (req: Request, res: Response) => {
    const { url, name, platform, monitoringFrequency, alertEmail } = req.body;
    if (!url || !name) {
      return res.status(400).json({ error: 'Website URL and Name are required.' });
    }

    const validation = validateAndSanitizeUrl(url);
    if (!validation.isValid || !validation.sanitizedUrl) {
      return res.status(400).json({ error: validation.error || 'Invalid URL supplied.' });
    }

    const newSite = storage.addWebsite({
      url: validation.sanitizedUrl,
      name: name.trim(),
      platform: platform || 'custom',
      monitoringFrequency: monitoringFrequency || 'weekly',
      autoAlertsEnabled: true,
      alertEmail: alertEmail || 'admin@example.com',
    });

    const user = storage.getUser();
    user.websitesCount = storage.getWebsites().length;

    res.status(201).json(newSite);
  });

  app.delete('/api/websites/:id', (req: Request, res: Response) => {
    const deleted = storage.removeWebsite(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Monitored website not found.' });
    }
    const user = storage.getUser();
    user.websitesCount = storage.getWebsites().length;
    res.json({ success: true, id: req.params.id });
  });

  // Monitoring alerts endpoints
  app.get('/api/alerts', (req: Request, res: Response) => {
    res.json(storage.getAlerts());
  });

  app.patch('/api/alerts/:id/read', (req: Request, res: Response) => {
    storage.markAlertRead(req.params.id);
    res.json({ success: true });
  });

  // Agency clients endpoints
  app.get('/api/agency/clients', (req: Request, res: Response) => {
    res.json(storage.getClients());
  });

  app.post('/api/agency/clients', (req: Request, res: Response) => {
    const { name, company, email, notes } = req.body;
    if (!name || !company || !email) {
      return res.status(400).json({ error: 'Name, company, and email are required.' });
    }
    const client = storage.addClient({ name, company, email, notes });
    res.status(201).json(client);
  });

  // Centralized Pricing Plans API
  app.get('/api/billing/plans', (req: Request, res: Response) => {
    res.json(storage.getPricingPlans());
  });

  // Simulated Stripe Checkout endpoint
  app.post('/api/billing/create-checkout', (req: Request, res: Response) => {
    const { planId, billingInterval } = req.body;
    if (!['pro', 'agency'].includes(planId)) {
      return res.status(400).json({ error: 'Valid paid plan ID required.' });
    }

    // In production this initializes a Stripe Checkout Session
    const mockSession = {
      sessionId: `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      checkoutUrl: `/dashboard?upgraded=true&plan=${planId}`,
      planId,
      billingInterval: billingInterval || 'monthly',
      amount: planId === 'agency' ? (billingInterval === 'yearly' ? 119000 : 11900) : (billingInterval === 'yearly' ? 29000 : 2900),
      currency: 'usd',
    };

    // Update user plan in mock store
    storage.updateUserPlan('usr_demo_accessfix', planId);

    res.json(mockSession);
  });

  // Contact form submission with spam protection & validation
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, company, website, issue, message, honeypot } = req.body;

    // Honeypot spam check
    if (honeypot) {
      return res.json({ success: true, message: 'Message received.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    console.log(`[Contact Submission] From: ${name} (${email}) Company: ${company || 'N/A'} Subject: ${issue || 'General'}`);

    return res.json({
      success: true,
      ticketId: `TICK_${Date.now().toString().slice(-6)}`,
      estimatedResponseTime: 'Under 2 hours during US business hours',
      message: 'Thank you for reaching out to AccessFix AI. An accessibility specialist will respond shortly.',
    });
  });

  // =================== VITE MIDDLEWARE SETUP =================== //

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AccessFix AI Server operational at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup exception:', err);
  process.exit(1);
});
