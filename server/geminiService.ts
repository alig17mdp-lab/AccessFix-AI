import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable not detected. AI will use deterministic fallback engine.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "placeholder_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface AiFixResult {
  plainEnglishSummary: string;
  businessImpact: string;
  contentFix?: string;
  developerFix: string;
  codeSnippet: {
    html?: string;
    react?: string;
    wordpress?: string;
    shopify?: string;
  };
}

/**
 * Generate an actionable, grounded AI fix for a specific accessibility violation
 */
export async function generateAiRemediation(params: {
  issueTitle: string;
  category: string;
  wcagCriteria: string;
  affectedElement: string;
  htmlSnippet?: string;
  url: string;
}): Promise<AiFixResult> {
  const { issueTitle, category, wcagCriteria, affectedElement, htmlSnippet, url } = params;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();
      const prompt = `You are a certified Web Accessibility Specialist (CPACC / WAS) and Senior Frontend Engineer.
Analyze this detected accessibility issue on ${url} and generate practical, production-ready remediation.

ISSUE DETAILS:
- Title: ${issueTitle}
- Category: ${category}
- WCAG Standard: ${wcagCriteria}
- Affected Element: ${affectedElement}
- HTML Snippet: ${htmlSnippet || "N/A"}

REQUIREMENTS:
1. Explain the problem clearly for a non-technical small business owner (Plain English, no jargon, under 3 sentences).
2. Detail the real-world business & customer impact (e.g. screen reader navigation blockage, keyboard traps, SEO drop, mobile usability). Do NOT make unsupported legal guarantees or claims of instant ADA immunity.
3. Provide exact, copy-pasteable HTML, React/JSX, and WordPress/Shopify code fixes.
4. If this is an image alt issue, generate a descriptive, contextual alt-text recommendation.

Respond ONLY with valid JSON matching this exact structure:
{
  "plainEnglishSummary": "...",
  "businessImpact": "...",
  "contentFix": "...",
  "developerFix": "...",
  "codeSnippet": {
    "html": "...",
    "react": "...",
    "wordpress": "...",
    "shopify": "..."
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          plainEnglishSummary: parsed.plainEnglishSummary || "This element lacks required accessibility attributes necessary for assistive technologies.",
          businessImpact: parsed.businessImpact || "Users relying on screen readers or keyboard navigation cannot properly interact with this element.",
          contentFix: parsed.contentFix || "Add meaningful descriptive text that explains the function or context.",
          developerFix: parsed.developerFix || "Ensure proper ARIA attributes or semantic HTML tags are applied.",
          codeSnippet: parsed.codeSnippet || {
            html: `<!-- Accessible Solution -->\n<div tabindex="0" role="button" aria-label="Perform action">Action</div>`,
          },
        };
      }
    } catch (err) {
      console.error("Gemini API call failed, falling back to heuristic engine:", err);
    }
  }

  // Grounded heuristic fallback engine
  return generateHeuristicFix(params);
}

/**
 * Grounded fallback generator when Gemini API key is absent or network is unreachable
 */
function generateHeuristicFix(params: {
  issueTitle: string;
  category: string;
  wcagCriteria: string;
  affectedElement: string;
  htmlSnippet?: string;
}): AiFixResult {
  const { issueTitle, category, affectedElement, htmlSnippet } = params;

  if (category === 'images' || issueTitle.toLowerCase().includes('alt')) {
    return {
      plainEnglishSummary: "This image is invisible to visitors who use screen readers because it lacks a descriptive alt attribute explaining what it shows.",
      businessImpact: "Visually impaired customers and search engine indexers miss crucial product details or graphical context, degrading user experience and image SEO.",
      contentFix: "Provide a 4 to 8 word phrase describing the subject and action in the image (e.g., 'Modern leather office chair in walnut brown').",
      developerFix: "Add an `alt` attribute directly to the `<img>` tag. If the image is purely decorative, use `alt=\"\"` with `aria-hidden=\"true\"`.",
      codeSnippet: {
        html: htmlSnippet 
          ? htmlSnippet.replace(/<img(?![^>]*\balt=)/i, '<img alt="Descriptive summary of image" ')
          : '<img src="photo.jpg" alt="High-contrast product photo showing item details" />',
        react: '<img src="/hero.jpg" alt="Accessible product preview" className="rounded-lg" />',
        wordpress: '<!-- In WordPress Media Library, populate the \'Alternative Text\' field before publishing -->',
        shopify: '{{ image | image_tag: alt: "Detailed product description for screen readers" }}',
      }
    };
  }

  if (category === 'headings' || issueTitle.toLowerCase().includes('heading')) {
    return {
      plainEnglishSummary: "The heading structure skips numerical levels or misses a primary H1, confusing automated page navigation tools.",
      businessImpact: "Screen reader users jump between headings to skim your page like a table of contents; broken hierarchy disorients visitors and harms SEO readability.",
      contentFix: "Ensure there is exactly one H1 per page reflecting the main topic, followed logically by H2 for sections and H3 for sub-sections.",
      developerFix: "Reorder heading tags sequentially without skipping levels for visual styling alone (use CSS utility classes for sizing instead).",
      codeSnippet: {
        html: `<!-- Proper Sequential Hierarchy -->\n<h1>Page Title</h1>\n<section>\n  <h2>Main Section Title</h2>\n  <p>Content...</p>\n  <h3>Sub-topic Detail</h3>\n</section>`,
        react: `<h1 className="text-3xl font-bold">Main Title</h1>\n<h2 className="text-xl font-semibold mt-4">Section Heading</h2>`,
      }
    };
  }

  if (category === 'forms' || issueTitle.toLowerCase().includes('label')) {
    return {
      plainEnglishSummary: "This form input has no connected text label, so voice-over software cannot announce what information the visitor needs to type.",
      businessImpact: "Leads to cart abandonment and form submission drop-offs when disabled users or autofill tools cannot verify input fields.",
      contentFix: "Add an explicit, visible `<label>` element containing clear instructions (e.g. 'Business Email Address').",
      developerFix: "Link the `<label for=\"field-id\">` attribute with the input's `id=\"field-id\"` or provide an explicit `aria-label`.",
      codeSnippet: {
        html: `<div class="form-group">\n  <label for="user-email">Work Email</label>\n  <input type="email" id="user-email" name="email" required autocomplete="email" />\n</div>`,
        react: `<div className="flex flex-col gap-1">\n  <label htmlFor="emailInput" className="text-sm font-medium">Work Email</label>\n  <input id="emailInput" type="email" aria-required="true" className="border p-2 rounded" />\n</div>`,
      }
    };
  }

  if (category === 'links' || category === 'buttons') {
    return {
      plainEnglishSummary: "This interactive button or link does not contain descriptive text or an accessible name.",
      businessImpact: "Visitors using speech control or screen readers cannot understand the action this element will trigger when clicked.",
      contentFix: "Replace vague copy like 'Click here' or standalone icons with clear action verbs like 'Download Quarterly Accessibility Report'.",
      developerFix: "Include text within the tag or provide an `aria-label` attribute on the element.",
      codeSnippet: {
        html: `<a href="/report.pdf" aria-label="Download Full 2026 Audit Report (PDF, 2MB)" class="btn">\n  <svg aria-hidden="true">...</svg>\n  <span>Download Report</span>\n</a>`,
        react: `<button aria-label="Close modal dialog" onClick={onClose} className="p-2">\n  <XIcon aria-hidden="true" className="w-5 h-5" />\n</button>`,
      }
    };
  }

  return {
    plainEnglishSummary: `This element does not comply with ${params.wcagCriteria}, potentially obstructing accessibility.`,
    businessImpact: "Degrades assistive technology support and risks lowering overall user satisfaction and site retention.",
    contentFix: "Review the contextual usage and apply standard accessible semantic structure.",
    developerFix: "Apply standard semantic HTML tags and verify high contrast and keyboard focus visibility.",
    codeSnippet: {
      html: `<!-- Remediated Markup -->\n<div role="region" aria-label="Content area" tabindex="0">\n  ${affectedElement}\n</div>`,
    }
  };
}

/**
 * Generate AI Alt Text from user image context or description
 */
export async function generateAltTextFromAi(context: string): Promise<{ altText: string; explanation: string }> {
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `You are an accessibility alt text specialist. 
Given this context or description about a web image: "${context}", generate a concise, highly accessible, screen-reader friendly alt text string (under 125 characters) following WCAG 1.1.1 rules.
Respond in JSON:
{
  "altText": "...",
  "explanation": "..."
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn("AI Alt Text generation error:", e);
    }
  }

  return {
    altText: `Descriptive illustration of ${context.slice(0, 60)} with high-contrast elements`,
    explanation: "Generated based on contextual keywords to provide screen reader users with clear functional understanding."
  };
}

/**
 * Generate High-Converting SEO Meta Titles & Descriptions with AI
 */
export async function generateMetaTagSuggestions(params: {
  pageTitle?: string;
  targetKeyword: string;
  domain: string;
  summaryText?: string;
}): Promise<{
  titles: { title: string; length: number; intent: string; ctrHook: string }[];
  descriptions: { description: string; length: number; callToAction: string }[];
}> {
  const { pageTitle, targetKeyword, domain, summaryText } = params;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();
      const prompt = `You are a Tier-1 SEO Architect and Conversion Copywriter.
Generate 4 optimized SEO Title tags (strictly 50-60 characters) and 3 Meta Descriptions (strictly 140-155 characters) for:
- Target Keyword: "${targetKeyword}"
- Domain/Brand: "${domain}"
- Current Title: "${pageTitle || 'N/A'}"
- Page Context: "${summaryText || 'Website service / guide page'}"

Ensure strict character count compliance to prevent Google SERP truncation. Use compelling action verbs and authentic value propositions.

Respond ONLY with valid JSON:
{
  "titles": [
    { "title": "50-60 char title", "length": 55, "intent": "commercial", "ctrHook": "Benefit explanation" }
  ],
  "descriptions": [
    { "description": "140-155 char meta description with clear CTA", "length": 150, "callToAction": "Action verb" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn("AI Meta tag generation error:", e);
    }
  }

  // Grounded Deterministic Fallback
  const cleanKw = targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1);
  return {
    titles: [
      {
        title: `${cleanKw}: Complete Guide & Free Audit | ${domain}`,
        length: `${cleanKw}: Complete Guide & Free Audit | ${domain}`.length,
        intent: 'informational',
        ctrHook: 'Educational authority + actionable tool',
      },
      {
        title: `Best ${cleanKw} Solutions & AI Fixes - ${domain}`,
        length: `Best ${cleanKw} Solutions & AI Fixes - ${domain}`.length,
        intent: 'commercial',
        ctrHook: 'Comparative solution seeker',
      },
      {
        title: `How to Fix ${cleanKw} in 2025 (Step-by-Step)`,
        length: `How to Fix ${cleanKw} in 2025 (Step-by-Step)`.length,
        intent: 'problem-solving',
        ctrHook: 'High click-through tutorial',
      },
    ],
    descriptions: [
      {
        description: `Learn how to optimize ${targetKeyword} with step-by-step developer guidelines, WCAG compliance rules, and automated fixes. Run a free scan today on ${domain}.`,
        length: 152,
        callToAction: 'Run a free scan today',
      },
      {
        description: `Discover the top strategies for ${targetKeyword}. Avoid common technical penalties and improve user experience with our complete guide on ${domain}.`,
        length: 148,
        callToAction: 'Explore the complete guide',
      },
    ],
  };
}

/**
 * Generate Structured Data (JSON-LD Schema) with AI
 */
export async function generateJsonLdSchema(params: {
  schemaType: 'Organization' | 'WebSite' | 'Article' | 'Product' | 'FAQPage' | 'LocalBusiness' | 'SoftwareApplication';
  entityName: string;
  url: string;
  description?: string;
  faqs?: { question: string; answer: string }[];
}): Promise<{ jsonLd: string; explanation: string; implementationInstructions: string }> {
  const { schemaType, entityName, url, description, faqs } = params;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();
      const prompt = `You are a Technical SEO Engineer.
Generate valid, standard Schema.org JSON-LD structured data for:
- Type: ${schemaType}
- Name: ${entityName}
- Canonical URL: ${url}
- Description: ${description || 'Comprehensive online service'}
${faqs && faqs.length > 0 ? `- FAQs: ${JSON.stringify(faqs)}` : ''}

Note: Schema structured data helps search engines understand entities and enables eligibility for rich results (it does NOT guarantee them).

Respond ONLY with valid JSON:
{
  "jsonLd": "<script type=\\"application/ld+json\\">...valid json-ld...</script>",
  "explanation": "...",
  "implementationInstructions": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn("AI Schema generation error:", e);
    }
  }

  // Fallback
  let schemaObj: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: entityName,
    url: url,
    description: description || `Official platform for ${entityName}`,
  };

  if (schemaType === 'FAQPage' && faqs && faqs.length > 0) {
    schemaObj.mainEntity = faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    }));
  }

  const jsonString = JSON.stringify(schemaObj, null, 2);
  return {
    jsonLd: `<script type="application/ld+json">\n${jsonString}\n</script>`,
    explanation: `Valid Schema.org ${schemaType} markup configured for search engine entity recognition.`,
    implementationInstructions: 'Place this script inside the <head> or at the bottom of the <body> on the target page.',
  };
}

/**
 * Generate Comprehensive AI Content Brief
 */
export async function generateContentBrief(params: {
  targetKeyword: string;
  domain: string;
  competitors?: string[];
}): Promise<any> {
  const { targetKeyword, domain } = params;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();
      const prompt = `You are a Senior SEO Content Strategist.
Generate a comprehensive, high-authority Content Brief for the target keyword: "${targetKeyword}" for the site "${domain}".

REQUIREMENTS:
1. Target Search Intent (Informational, Commercial, Transactional).
2. Recommended Word Count based on SERP competition.
3. 3 High-CTR SEO Title ideas (50-60 chars).
4. 2 Engaging Meta Descriptions (140-155 chars).
5. Comprehensive Outline with H2 and H3 headings and specific discussion points.
6. 4-6 Target Questions to Answer (People Also Ask / Answer Engine Optimization).
7. Required Semantic Entities & Keywords to include naturally.
8. Internal link recommendations back to AccessFix tools.
9. Recommended Call to Action.

Respond ONLY with valid JSON:
{
  "targetKeyword": "${targetKeyword}",
  "primaryIntent": "informational",
  "suggestedWordCount": 1400,
  "targetAudiencePersona": "Small business owners, developers, and compliance officers",
  "seoTitleSuggestions": ["..."],
  "metaDescriptionSuggestions": ["..."],
  "contentOutline": [
    {
      "heading": "H2 Heading",
      "level": 2,
      "keyPoints": ["...", "..."]
    }
  ],
  "targetQuestionsToAnswer": ["...", "..."],
  "requiredSemanticEntities": ["...", "..."],
  "internalLinkSuggestions": [
    { "anchor": "Accessibility Scanner", "suggestedUrl": "/scanner" }
  ],
  "callToActionRecommendation": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn("AI Content Brief generation error:", e);
    }
  }

  // Fallback Content Brief
  const cleanKw = targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1);
  return {
    targetKeyword,
    primaryIntent: 'informational',
    suggestedWordCount: 1250,
    targetAudiencePersona: 'SaaS founders, technical webmasters, and eCommerce store owners',
    seoTitleSuggestions: [
      `${cleanKw}: The Definitive 2025 Guide & Action Plan`,
      `How to Implement ${cleanKw} (Best Practices & Fixes)`,
      `${cleanKw} Explained: Compliance, SEO & Usability`,
    ],
    metaDescriptionSuggestions: [
      `Learn everything about ${targetKeyword}. Explore technical guidelines, common mistakes, and automated fix patterns on ${domain}.`,
      `Master ${targetKeyword} with our step-by-step developer checklist. Audit your site and boost compliance on ${domain}.`,
    ],
    contentOutline: [
      {
        heading: `1. What is ${cleanKw} and Why Does It Matter?`,
        level: 2,
        keyPoints: [
          'Clear definition in plain English without confusing jargon',
          'Business impact: user retention, legal compliance, and SEO benefits',
          'Real-world examples of good vs bad implementations',
        ],
      },
      {
        heading: `2. Key Technical Standards and Best Practices`,
        level: 2,
        keyPoints: [
          'Core WCAG / W3C specifications or Google guidelines',
          'Code implementation snippets for HTML, React, and WordPress',
          'Common pitfalls that trip up web developers',
        ],
      },
      {
        heading: `3. Step-by-Step Remediation Workflow`,
        level: 2,
        keyPoints: [
          'Automated audit phase using AccessFix AI',
          'Manual keyboard and screen reader verification',
          'Continuous regression monitoring',
        ],
      },
      {
        heading: `4. Frequently Asked Questions about ${cleanKw}`,
        level: 2,
        keyPoints: [
          'Concise direct answers optimized for search engine featured snippets',
          'Cost and timeline expectations for remediation',
        ],
      },
    ],
    targetQuestionsToAnswer: [
      `What are the most common errors related to ${targetKeyword}?`,
      `How does ${targetKeyword} affect search engine rankings?`,
      `Can automated tools detect 100% of ${targetKeyword} issues?`,
      `What is the difference between WCAG 2.1 Level A and AA for ${targetKeyword}?`,
    ],
    requiredSemanticEntities: [
      targetKeyword,
      'WCAG 2.1 AA',
      'user experience',
      'DOM hierarchy',
      'assistive technology',
      'search visibility',
      'Core Web Vitals',
    ],
    internalLinkSuggestions: [
      { anchor: 'Free Website Health Scanner', suggestedUrl: '/' },
      { anchor: 'Color Contrast Checker', suggestedUrl: '/tools/color-contrast-checker' },
      { anchor: 'AI Alt Text Generator', suggestedUrl: '/tools/alt-text-checker' },
    ],
    callToActionRecommendation: `Start with an instant automated scan of your website to identify ${targetKeyword} barriers in under 30 seconds.`,
  };
}

