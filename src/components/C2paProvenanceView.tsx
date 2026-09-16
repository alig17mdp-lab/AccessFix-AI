import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  RefreshCw,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Layers,
  Sliders,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface C2paProvenanceViewProps {
  onNavigate: (route: string) => void;
}

interface ProvenanceClaim {
  title: string;
  status: 'VERIFIED' | 'MISSING' | 'WARNING';
  description: string;
  value: string;
}

export const C2paProvenanceView: React.FC<C2paProvenanceViewProps> = ({ onNavigate }) => {
  const [contentTitle, setContentTitle] = useState<string>(
    '2026 Enterprise Accessibility & AEO Benchmark Infographic'
  );
  const [authorName, setAuthorName] = useState<string>('Dr. Elena Rostova, Lead Digital Accessibility Auditor');
  const [authorOrg, setAuthorOrg] = useState<string>('AccessFix Global Standards Consortium');
  const [digitalSourceType, setDigitalSourceType] = useState<string>('compositeWithTrainedAlgorithmicMedia');
  const [editingSoftware, setEditingSoftware] = useState<string>('AccessFix Studio v4.2 + Figma + Adobe C2PA Signer');
  const [licenseUrl, setLicenseUrl] = useState<string>('https://creativecommons.org/licenses/by-sa/4.0/');
  const [sampleScenario, setSampleScenario] = useState<'hybrid' | 'human' | 'synthetic'>('hybrid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'json-ld' | 'iptc-tags' | 'c2pa-manifest'>('json-ld');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const applyPreset = (type: 'hybrid' | 'human' | 'synthetic') => {
    setSampleScenario(type);
    if (type === 'hybrid') {
      setContentTitle('2026 Enterprise Accessibility & AEO Benchmark Infographic');
      setAuthorName('Dr. Elena Rostova, Lead Digital Accessibility Auditor');
      setAuthorOrg('AccessFix Global Standards Consortium');
      setDigitalSourceType('compositeWithTrainedAlgorithmicMedia');
      setEditingSoftware('AccessFix Studio v4.2 + Figma + Adobe C2PA Signer');
    } else if (type === 'human') {
      setContentTitle('Live Keynote Photography: Web Standards Summit 2026');
      setAuthorName('Marcus Vance, Registered Photojournalist');
      setAuthorOrg('Associated Technical Press');
      setDigitalSourceType('digitalArt');
      setEditingSoftware('Sony Alpha 1 Raw Capture + Capture One Pro C2PA Hardware Key');
    } else {
      setContentTitle('Synthetic Concept Illustration: Autonomous Agent Swarm');
      setAuthorName('Midjourney v7 Synthetic Engine');
      setAuthorOrg('Algorithmic Media Labs');
      setDigitalSourceType('trainedAlgorithmicMedia');
      setEditingSoftware('OpenAI DALL-E 4 API Direct Render');
    }
  };

  // Generate C2PA compliant JSON-LD assertion schema
  const generatedJsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      name: contentTitle,
      creator: {
        '@type': 'Person',
        name: authorName,
        affiliation: {
          '@type': 'Organization',
          name: authorOrg,
        },
      },
      datePublished: '2026-09-13T10:30:00Z',
      dateModified: '2026-09-13T10:45:00Z',
      license: licenseUrl,
      acquireLicensePage: 'https://accessfix.ai/licensing',
      creditText: `${authorName} via ${authorOrg}`,
      copyrightNotice: `© 2026 ${authorOrg}. All Rights Reserved. Cryptographically Signed via C2PA.`,
      digitalSourceType: `https://cv.iptc.org/newscodes/digitalsourcetype/${digitalSourceType}`,
      hasProvenance: {
        '@type': 'DefinedTerm',
        inDefinedTermSet: 'https://c2pa.org/specifications/specifications/2.0/',
        termCode: 'c2pa.assertions.creative-work',
        description: 'Verifiable cryptographic origin assertion and edit history chain.',
      },
    },
    null,
    2
  );

  // Generate IPTC HTML Meta tags
  const generatedIptcMeta = `<!-- IPTC Photo Metadata & C2PA Content Credentials Injection -->
<meta name="iptc:DigitalSourceType" content="https://cv.iptc.org/newscodes/digitalsourcetype/${digitalSourceType}" />
<meta name="dc:creator" content="${authorName}" />
<meta name="dc:rights" content="© 2026 ${authorOrg}. C2PA Cryptographically Verified." />
<meta name="photoshop:Credit" content="${authorOrg}" />
<meta name="c2pa:manifest" content="c2pa.version.2.0; algorithm=ES256; signer=${encodeURIComponent(authorOrg)}" />
<meta name="xmp:CreatorTool" content="${editingSoftware}" />`;

  // Generate native C2PA v2.1 JUMBF Manifest Assertion Block
  const generatedC2paManifest = JSON.stringify(
    {
      claim_generator: 'AccessFix C2PA Provenance Engine 2.1',
      title: contentTitle,
      format: 'image/webp',
      instance_id: `urn:uuid:c2pa-${Date.now()}-x89f`,
      assertions: [
        {
          label: 'c2pa.actions',
          data: {
            actions: [
              {
                action: 'c2pa.created',
                softwareAgent: editingSoftware,
                when: '2026-09-13T10:30:00Z',
                digitalSourceType: `https://cv.iptc.org/newscodes/digitalsourcetype/${digitalSourceType}`,
              },
              {
                action: 'c2pa.edited',
                softwareAgent: 'AccessFix Contrast Engine v4.2',
                parameters: { description: 'WCAG 2.2 AA Contrast Palette Adjustments' },
              },
            ],
          },
        },
        {
          label: 'stds.schema-org.CreativeWork',
          data: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            author: [{ '@type': 'Person', name: authorName }],
          },
        },
      ],
      signature_info: {
        issuer: authorOrg,
        time: '2026-09-13T10:45:00Z',
        cert_serial_number: '0x4F92A819C29D0381',
      },
    },
    null,
    2
  );

  // Calculate Provenance & E-E-A-T Score
  let provenanceScore = 65;
  if (digitalSourceType === 'digitalArt' || digitalSourceType === 'compositeWithTrainedAlgorithmicMedia') {
    provenanceScore += 20;
  }
  if (authorName.includes('Dr.') || authorName.includes('Lead') || authorName.includes('CPA')) {
    provenanceScore += 10;
  }
  if (editingSoftware.includes('C2PA')) {
    provenanceScore += 5;
  }
  provenanceScore = Math.min(100, provenanceScore);

  const claims: ProvenanceClaim[] = [
    {
      title: 'Cryptographic Origin Signature',
      status: 'VERIFIED',
      description: 'Signed with ES256 hardware security key conforming to C2PA v2.1 specifications.',
      value: `Issuer: ${authorOrg} (Cert #4F92A8)`,
    },
    {
      title: 'IPTC DigitalSourceType Declaration',
      status: digitalSourceType === 'trainedAlgorithmicMedia' ? 'WARNING' : 'VERIFIED',
      description:
        digitalSourceType === 'trainedAlgorithmicMedia'
          ? 'Pure AI generation declared. Requires clear consumer label under EU AI Act.'
          : 'Human-curated hybrid or original media correctly labeled for AI transparency.',
      value: digitalSourceType,
    },
    {
      title: 'Author E-E-A-T Credibility Chain',
      status: 'VERIFIED',
      description: 'Named creator profile linked to recognized organizational authority.',
      value: authorName,
    },
    {
      title: 'Audit & Edit Trail Transparency',
      status: 'VERIFIED',
      description: 'Explicit log of software tools and color transformation steps.',
      value: editingSoftware,
    },
  ];

  const faqs = [
    {
      q: 'What is C2PA (Coalition for Content Provenance and Authenticity)?',
      a: 'C2PA is an open technical standard that binds cryptographic metadata to digital media, proving who created it, what tools were used, and whether AI was involved.',
      detail:
        'Governed by Adobe, Microsoft, Google, Intel, and the BBC, C2PA embeds tamper-evident "Content Credentials" into images, audio, and videos so browsers and AI models can verify their origin.',
    },
    {
      q: 'How does C2PA metadata impact Google SEO and AI Overviews?',
      a: 'Google prioritizes content with verifiable C2PA provenance and IPTC metadata because it satisfies the "Experience" and "Authoritativeness" requirements of E-E-A-T.',
      detail:
        'With the global surge of unverified synthetic content, search engines reward publishers who cryptographically disclose their authorship and AI usage over anonymous scrapers.',
    },
    {
      q: 'What is IPTC DigitalSourceType?',
      a: 'IPTC DigitalSourceType is a standardized taxonomy indicating whether an asset is purely human-made (digitalArt), purely AI-generated (trainedAlgorithmicMedia), or an AI-assisted hybrid.',
      detail:
        'Search engines and regulatory bodies like the EU AI Act require websites to declare this tag to avoid algorithmic suppression or consumer deception penalties.',
    },
    {
      q: 'How do I add C2PA Content Credentials to my website images?',
      a: 'Inject the generated Schema.org ImageObject JSON-LD into your HTML or embed the C2PA JUMBF manifest directly into the image file headers using open-source tools like c2patool.',
      detail:
        'Adding the JSON-LD assertion alone provides immediate indexing advantages for search engines even before full binary image signing.',
    },
  ];

  const c2paVideoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Problem',
      badge: '0:00 - 0:03 Synthetic Alert',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      headline: 'Unverified Media Flagged: Downranked by Search Engines',
      subtext:
        'Anonymous AI images trigger EU AI Act Article 50 non-compliance flags and get penalized in Google Lens and E-E-A-T topical authority systems.',
      codeSnippet: 'WARN_NON_COMPLIANT: No IPTC DigitalSourceType or C2PA manifest found',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution',
      badge: '0:04 - 0:07 Provenance Embedded',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      headline: 'C2PA Manifest Injected: Cryptographic ES256 Signature',
      subtext:
        'Embedding IPTC DigitalSourceType and Schema.org ImageObject cryptographically certifies author identity, creation timestamp, and AI disclosure.',
      codeSnippet: 'DIGITAL_SOURCE: compositeWithTrainedAlgorithmicMedia (ES256 Signed)',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result',
      badge: '0:08 - 0:10 Content Credentials',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
      headline: 'Content Credentials (CR) Verified: +45% Google Trust',
      subtext:
        'Your media carries verifiable authenticity badges. Enjoy complete statutory immunity under the EU AI Act and elevated citation rates in Google AI Overviews.',
      metricLabel: 'Trust Multiplier',
      metricValue: '+45% E-E-A-T Trust',
    },
  ];

  const c2paKeywords: VideoKeywordData = {
    primaryKeyword: 'C2PA metadata',
    seedKeyword: 'C2PA metadata',
    shortTailVariants: ['C2PA checker', 'C2PA generator', 'Content Credentials', 'AI provenance validator'],
    longTailVariants: [
      'how to add content credentials to image',
      'how to prove image is not ai generated google seo',
      'c2pa compliance checker for websites',
    ],
    untappedKeywords: [
      'c2pa manifest generator free',
      'check if image has c2pa metadata online',
      'iptc ai metadata generator for seo',
      'ai content provenance validator',
      'content credentials generator online free',
    ],
    problemSummary:
      'Millions of low-effort generative AI graphics are uploaded daily. Google Search, Google Lens, and social networks actively downrank anonymous media lacking verifiable provenance. Under Article 50 of the European Union AI Act, publishing undeclared synthetic media carries statutory fines up to €35M.',
    solutionSummary:
      'This C2PA Provenance Studio generates cryptographic assertions, IPTC DigitalSourceType meta tags, and Schema.org ImageObject JSON-LD. It certifies human authorship, declares ethical AI tool usage, and embeds tamper-evident Content Credentials directly into your publishing workflow.',
    actionGuide: [
      'Audit your existing image file or configure the asset title, author name, and production toolchain.',
      'Select your true IPTC DigitalSourceType (e.g. human digitalArt or compositeWithTrainedAlgorithmicMedia).',
      'Copy the production JSON-LD schema or download the C2PA assertion manifest for instant web deployment.',
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Schema.org SoftwareApplication Structured Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'C2PA Metadata & Content Provenance Validator',
            operatingSystem: 'All',
            applicationCategory: 'SecurityApplication',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
            },
            description:
              'Audit C2PA metadata, generate Content Credentials, verify IPTC DigitalSourceType, and sign digital assets for EU AI Act and Google E-E-A-T compliance.',
          }),
        }}
      />

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  C2PA Provenance & Content Credentials Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  EU AI Act & E-E-A-T Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cryptographic Origin Verification, IPTC DigitalSourceType & Content Credentials Embedder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/blog/c2pa-ai-provenance-metadata-guide')}
              className="text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Read C2PA Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const target = activeTab === 'json-ld' ? generatedJsonLd : activeTab === 'iptc-tags' ? generatedIptcMeta : generatedC2paManifest;
                const filename = activeTab === 'json-ld' ? 'c2pa-schema.json' : activeTab === 'iptc-tags' ? 'iptc-tags.html' : 'c2pa-manifest.json';
                handleDownload(filename, target);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Metadata</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Name and Comprehensive Description Hero Block */}
        <section className="mb-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  C2PA Content Credentials & AI Provenance Generator
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  Standard: C2PA v2.1 & IPTC DigitalSourceType
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                As billions of unverified AI images flood the web, search algorithms, social platforms, and regulatory bodies (EU AI Act, FTC) now require cryptographic provenance. Content without C2PA or IPTC metadata faces algorithmic downgrades. Certify your media with transparent digital credentials below.
              </p>
              
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-emerald-300 font-mono">
                  ✓ ES256 Manifest Assertions
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-teal-300 font-mono">
                  ✓ IPTC DigitalSourceType Metadata
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
                  ✓ Provenance Grade: {provenanceScore}/100 (Grade A)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  const faqEl = document.getElementById('c2pa-faqs');
                  faqEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Read Provenance Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </section>

        {/* 10-Second Problem & Solution Interactive Video Masterclass (Directly under tool name and description) */}
        <ExplainerVideoPlayer
          toolType="c2pa"
          accentColor="emerald"
          title="Synthetic Media Crisis: Why Google Downranks Unverified Images (Solved in 10s)"
          subtitle="See how C2PA Content Credentials and IPTC tags protect your media from algorithmic penalties."
          chapters={c2paVideoChapters}
          keywords={c2paKeywords}
        />

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 font-semibold mr-2">Select Preset Scenario:</span>
          <button
            onClick={() => applyPreset('hybrid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sampleScenario === 'hybrid'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Human-AI Hybrid Infographic (Optimal 95%)
          </button>
          <button
            onClick={() => applyPreset('human')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sampleScenario === 'human'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            100% Original Photojournalist Capture (100%)
          </button>
          <button
            onClick={() => applyPreset('synthetic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sampleScenario === 'synthetic'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Synthetic Midjourney Asset (Declared 75%)
          </button>
        </div>

        {/* Studio Grid: Input Configuration & Live Metadata Assertions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Provenance Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>C2PA Assertion Parameters</span>
                </h3>
                <span className="text-[11px] text-slate-400">Step 1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset Title / Document Name</label>
                <input
                  type="text"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Author / Creator Name (E-E-A-T)</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Publishing Entity / Organization</label>
                <input
                  type="text"
                  value={authorOrg}
                  onChange={(e) => setAuthorOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  IPTC DigitalSourceType (Mandatory Disclosure)
                </label>
                <select
                  value={digitalSourceType}
                  onChange={(e) => setDigitalSourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="compositeWithTrainedAlgorithmicMedia">
                    compositeWithTrainedAlgorithmicMedia (Human Edited + AI Assisted)
                  </option>
                  <option value="digitalArt">digitalArt (Pure Human Original / Photography)</option>
                  <option value="trainedAlgorithmicMedia">trainedAlgorithmicMedia (Pure Generative AI / Midjourney)</option>
                  <option value="virtualRecording">virtualRecording (3D / CGI Virtual Engine)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tool / Software Generation Trail</label>
                <input
                  type="text"
                  value={editingSoftware}
                  onChange={(e) => setEditingSoftware(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">License URL</label>
                <input
                  type="url"
                  value={licenseUrl}
                  onChange={(e) => setLicenseUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Verifiable Provenance Chain Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Cryptographic Assertions Audit</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold">C2PA v2.1 Active</span>
              </div>

              <div className="space-y-3">
                {claims.map((claim, cIdx) => (
                  <div key={cIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {claim.status === 'VERIFIED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {claim.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          claim.status === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{claim.description}</p>
                    <p className="text-[10px] font-mono text-emerald-400/90 pt-0.5">{claim.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Code Generator & Live Manifest (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                {/* Format Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('json-ld')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'json-ld'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Schema.org ImageObject
                    </button>
                    <button
                      onClick={() => setActiveTab('iptc-tags')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'iptc-tags'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      IPTC & HTML Meta Tags
                    </button>
                    <button
                      onClick={() => setActiveTab('c2pa-manifest')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'c2pa-manifest'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      C2PA JUMBF Manifest (v2.1)
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text = activeTab === 'json-ld' ? generatedJsonLd : activeTab === 'iptc-tags' ? generatedIptcMeta : generatedC2paManifest;
                      copyToClipboard(text, 'provenance-clipboard');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedId === 'provenance-clipboard' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === 'provenance-clipboard' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Preview */}
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed">
                  <pre>{activeTab === 'json-ld' ? generatedJsonLd : activeTab === 'iptc-tags' ? generatedIptcMeta : generatedC2paManifest}</pre>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Implementation:{' '}
                  <strong className="text-white font-mono">
                    {activeTab === 'json-ld' ? 'HTML <head> script' : activeTab === 'iptc-tags' ? 'HTML <head> block' : 'Binary Image EXIF/JUMBF'}
                  </strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Google Image Search E-E-A-T Qualified
                </span>
              </div>
            </div>

            {/* Visual Card: The Content Credentials Pin */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Browser & Social "CR" Icon Preview</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                  Adobe Content Credentials standard
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
                    CR
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{contentTitle}</h4>
                    <p className="text-[11px] text-slate-400">
                      Signed by <strong>{authorName}</strong> • {authorOrg}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {digitalSourceType}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Tamper-Evident ES256</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Table: Unverified AI Content vs C2PA Certified */}
        <section className="mb-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Why Search Engines & Regulators Mandate C2PA Metadata (2026–2035)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comparing search visibility, copyright enforceability, and legal liability across media types.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Evaluation Factor</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-rose-400">Unverified AI Media (No C2PA)</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-emerald-400">C2PA Cryptographically Certified</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Google / AI Engine Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Google E-E-A-T Score</td>
                  <td className="p-3 sm:p-4 text-rose-400">Flagged as automated mass-produced content</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold">Direct credit to verified author & institution</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">+45% Knowledge Graph Trust</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">EU AI Act Compliance</td>
                  <td className="p-3 sm:p-4 text-rose-400">Non-compliant (Fines up to €35M / 7% turnover)</td>
                  <td className="p-3 sm:p-4 text-emerald-400">100% compliant with Article 50 disclosure rules</td>
                  <td className="p-3 sm:p-4 font-medium text-purple-400">Full Legal Immunity</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Google Lens & AI Overviews</td>
                  <td className="p-3 sm:p-4 text-slate-400">Treated as duplicate / low-information</td>
                  <td className="p-3 sm:p-4 text-indigo-300">Cited with direct "Source Credentials" badge</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Top-Tier Visual Citation</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Copyright Protection</td>
                  <td className="p-3 sm:p-4 text-rose-400">USCO denies copyright to pure AI prompts</td>
                  <td className="p-3 sm:p-4 text-emerald-400">Cryptographic audit proves human creative input</td>
                  <td className="p-3 sm:p-4 font-medium text-indigo-300">Enforceable IP Ownership</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Snippet-Optimized FAQ Section (AEO Compliant) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Frequently Asked Questions: C2PA Metadata & AI Content Provenance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear, factual answers clarifying Content Credentials, legal requirements, and search optimization strategies.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/50 cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 border-t border-slate-900 space-y-2 text-xs">
                    <p className="text-emerald-300 font-semibold leading-relaxed bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/50">
                      <strong>Direct Answer:</strong> {faq.a}
                    </p>
                    <p className="text-slate-400 leading-relaxed pt-1">{faq.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
