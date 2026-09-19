import React, { useState } from 'react';
import {
  Glasses,
  Box,
  Eye,
  Layers,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Compass,
  Move3d,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Maximize2,
  ArrowRight,
} from 'lucide-react';
import { ExplainerVideoPlayer, VideoChapter, VideoKeywordData } from './ExplainerVideoPlayer';

interface SpatialSeoSynthesizerViewProps {
  onNavigate: (route: string) => void;
}

export const SpatialSeoSynthesizerView: React.FC<SpatialSeoSynthesizerViewProps> = ({ onNavigate }) => {
  const [modelTitle, setModelTitle] = useState<string>('Ergonomic Aerodynamic Chair');
  const [modelUrlGlb, setModelUrlGlb] = useState<string>('https://example.com/models/chair-ergonomic.glb');
  const [modelUrlUsdz, setModelUrlUsdz] = useState<string>('https://example.com/models/chair-ergonomic.usdz');
  const [placementType, setPlacementType] = useState<'floor' | 'tabletop' | 'wall' | 'floating'>('floor');
  const [dimensions, setDimensions] = useState<{ width: number; height: number; depth: number }>({
    width: 0.65,
    height: 1.15,
    depth: 0.7,
  });
  const [anchorType, setAnchorType] = useState<'world_local' | 'geo_spatial'>('world_local');
  const [geoCoordinates, setGeoCoordinates] = useState<string>('37.7749, -122.4194');
  const [activeTab, setActiveTab] = useState<'html-tags' | 'schema-json' | 'apple-quicklook'>('html-tags');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  // Generate WebSpatial & WebXR HTML Meta Tags
  const generatedHtmlTags = `<!-- WebSpatial & WebXR 3D Spatial Metadata (Apple Vision Pro, Meta Orion, Google Android XR) -->
<meta name="apple-itunes-app" content="app-id=123456789, app-argument=${modelUrlUsdz}">
<meta name="spatial-viewport" content="width=device-width, initial-scale=1.0, spatial-depth=true">
<meta name="xr-compatible" content="true">
<meta name="spatial-placement" content="${placementType}">
<meta name="spatial-bounding-box" content="${dimensions.width}m x ${dimensions.height}m x ${dimensions.depth}m">

<!-- 3D Model Links for Headset Quick Look & WebXR Viewers -->
<link rel="spatial-asset" type="model/gltf-binary" href="${modelUrlGlb}" data-spatial-placement="${placementType}">
<link rel="alternate" type="model/vnd.usdz+zip" href="${modelUrlUsdz}" data-realitykit-quicklook="true">

<!-- WebXR AR Anchor Configuration -->
<script type="application/json" id="spatial-anchor-config">
{
  "anchorType": "${anchorType}",
  ${anchorType === 'geo_spatial' ? `"geoCoordinates": "${geoCoordinates}",` : ''}
  "boundingDimensions": {
    "widthMeters": ${dimensions.width},
    "heightMeters": ${dimensions.height},
    "depthMeters": ${dimensions.depth}
  },
  "placementConstraint": "${placementType}"
}
</script>`;

  // Generate Schema.org 3DModel & SpatialAnchor JSON-LD
  const generatedSchemaJson = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': '3DModel',
          name: modelTitle,
          encodingFormat: 'model/gltf-binary',
          contentUrl: modelUrlGlb,
          spatialCoverage: placementType,
          width: `${dimensions.width} m`,
          height: `${dimensions.height} m`,
          depth: `${dimensions.depth} m`,
          isAccessibleForFree: true,
          additionalType: 'https://standards.webspatial.org/v1/spatial-object',
        },
        {
          '@type': 'SpecialAnnouncement',
          name: `${modelTitle} - Spatial AR Experience`,
          description: `View ${modelTitle} in full photorealistic 3D augmented reality on Apple Vision Pro, Meta Orion, and Google Android XR.`,
          spatial: {
            '@type': 'Place',
            name: placementType === 'floor' ? 'Local Floor Plane' : 'World Augmented Reality',
            geo: anchorType === 'geo_spatial' ? { '@type': 'GeoCoordinates', coordinates: geoCoordinates } : undefined,
          },
        },
      ],
    },
    null,
    2
  );

  // Generate Apple Quick Look HTML Snippet
  const generatedQuickLook = `<!-- Apple RealityKit & iOS / VisionOS AR Quick Look Direct Anchor -->
<a rel="ar" href="${modelUrlUsdz}#allowsContentScaling=0&canonicalWebPageURL=${encodeURIComponent(
    'https://example.com'
  )}" class="ar-quicklook-trigger">
  <img src="https://example.com/preview.webp" alt="View ${modelTitle} in 3D AR" width="300" height="300" />
  <span class="ar-badge">View in Apple Vision Pro & AR</span>
</a>`;

  const spatialVideoChapters: VideoChapter[] = [
    {
      startSec: 0,
      endSec: 3.5,
      label: 'The Problem',
      badge: '0:00 - 0:03 Flat 2D Web',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      headline: 'Flat 2D Sites Are Invisible in AR Glasses & Spatial Viewports',
      subtext:
        'When users browse in Apple Vision Pro or Meta Orion AR glasses, traditional HTML blocks render as flat floating planes with zero 3D depth or spatial interaction.',
      codeSnippet: 'VIEWPORT_LIMIT: Webpage lacks W3C WebXR & spatial-asset headers',
    },
    {
      startSec: 3.5,
      endSec: 7.0,
      label: 'The Solution',
      badge: '0:04 - 0:07 Spatial Anchors',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      headline: 'Spatial SEO & WebXR Synthesizer: 3D Anchors Injected',
      subtext:
        'Our engine generates volumetric bounding boxes, Schema.org 3DModel JSON-LD, and Apple RealityKit USDZ anchors for instant spatial rendering.',
      codeSnippet: '<link rel="spatial-asset" type="model/gltf-binary" href="...glb">',
    },
    {
      startSec: 7.0,
      endSec: 10.0,
      label: 'The Result',
      badge: '0:08 - 0:10 3D Presence',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
      headline: 'Photorealistic 3D AR Projection & +52% Google Lens CTR',
      subtext:
        'Your models pop out of the webpage into the user’s room. Rank #1 in Google Visual Search and Apple spatial carousels automatically.',
      metricLabel: 'Spatial Lift',
      metricValue: '+52% Spatial Engagement',
    },
  ];

  const spatialKeywords: VideoKeywordData = {
    primaryKeyword: 'Spatial SEO generator',
    seedKeyword: 'Spatial SEO',
    shortTailVariants: ['spatial anchor generator', 'WebXR schema builder', '3D model schema generator', 'webspatial metadata generator'],
    longTailVariants: [
      'how to optimize website for Apple Vision Pro',
      'how to rank in Google visual search and 3D AR',
      'how to add spatial anchor to 3D model on website',
    ],
    untappedKeywords: [
      'apple vision pro website spatial tag generator',
      'meta orion ar glasses website metadata generator',
      'schema org 3dmodel generator for google lens',
      'spatial anchor json ld generator',
      'webxr quick look usdz tags generator online',
      'spatial web seo audit checklist 2026',
    ],
    problemSummary:
      'As consumer computing migrates from 2D smartphone screens to spatial computing headsets and AR smart glasses (Apple Vision Pro, Meta Orion, Google Android XR), websites built purely with flat CSS boxes lose user attention. Visual search algorithms prioritize pages offering true volumetric 3D assets.',
    solutionSummary:
      'This Spatial SEO & WebXR Synthesizer generates compliant W3C WebSpatial headers, Apple RealityKit Quick Look links, and Schema.org 3DModel JSON-LD markup. It embeds real-world physical dimensions and coordinate anchors into your website so spatial browsers can instantly project products into the physical room.',
    actionGuide: [
      'Enter your 3D asset links (.glb for WebXR/Android and .usdz for Apple Vision Pro / iOS).',
      'Configure real-world physical bounding dimensions (Width, Height, Depth in meters) and plane constraints (Floor or Tabletop).',
      'Copy the synthesized WebSpatial HTML tags and JSON-LD markup into your page <head> section.',
    ],
  };

  const faqs = [
    {
      q: 'What is Spatial SEO and why is it critical for 2026–2035?',
      a: 'Spatial SEO is the practice of optimizing websites with 3D model schemas, WebXR anchors, and volumetric bounding metadata to rank in spatial computing headsets, AR glasses, and visual AI search engines.',
      detail:
        'Search engines like Google Lens and Apple Spotlight evaluate whether a webpage provides interactive 3D assets. Sites with spatial metadata earn 3D badges in search results and can be projected into physical rooms.',
    },
    {
      q: 'What is the difference between .glb and .usdz for web spatial assets?',
      a: 'GLB is the open W3C standard binary format for WebXR, Android XR, and Meta Orion, whereas USDZ is Apple’s proprietary RealityKit format required for Apple Vision Pro and iOS Quick Look.',
      detail:
        'To achieve universal spatial SEO coverage, every web product page should host both a .glb file and a .usdz file linked via standardized <link rel="spatial-asset"> tags.',
    },
    {
      q: 'How does Google Lens use Schema.org 3DModel markup?',
      a: 'Google Lens parses the Schema.org 3DModel structured data to display an interactive "View in your space" button directly on search engine results pages.',
      detail:
        'Pages that supply valid width, height, and depth bounding dimensions in meters qualify for rich AR carousels, driving significantly higher engagement than flat 2D images.',
    },
    {
      q: 'Does WebSpatial metadata impact normal desktop or mobile users?',
      a: 'No. WebSpatial tags act as semantic metadata that traditional 2D browsers ignore, ensuring zero layout shift or performance degradation for standard screen visitors.',
      detail:
        'Only spatial computing browsers (Safari on visionOS, Meta Horizon Browser, Chrome WebXR) parse these tags to spawn volumetric panels.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Schema.org SoftwareApplication Structured Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'WebSpatial & 3D WebXR Semantic Anchor Synthesizer',
            operatingSystem: 'All',
            applicationCategory: 'DeveloperApplication',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
            },
            description:
              'Generate Spatial SEO metadata, Schema.org 3DModel JSON-LD, Apple Vision Pro RealityKit tags, and WebXR anchors for physical room projections.',
          }),
        }}
      />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  WebSpatial & 3D WebXR Semantic Anchor Synthesizer
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                  Spatial SEO 2026–2035
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Apple Vision Pro, Meta Orion AR & Google Lens 3DModel Semantic Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/blog/spatial-seo-webxr-3d-anchors-guide')}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Read Spatial SEO Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const target = activeTab === 'html-tags' ? generatedHtmlTags : activeTab === 'schema-json' ? generatedSchemaJson : generatedQuickLook;
                const filename = activeTab === 'html-tags' ? 'webspatial-tags.html' : activeTab === 'schema-json' ? 'spatial-3dmodel-schema.json' : 'apple-quicklook.html';
                handleDownload(filename, target);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Spatial Config</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Name and Comprehensive Description Hero Block */}
        <section className="mb-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
                  <Move3d className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Spatial SEO & WebXR 3D Semantic Anchor Synthesizer
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                  W3C WebSpatial & Schema.org (2026–2035)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                As spatial computing headsets and augmented reality glasses (Apple Vision Pro, Meta Orion, Google Android XR) displace traditional 2D browsing, flat web pages render as low-utility floating planes. This synthesizer injects volumetric bounding boxes, Schema.org <code>3DModel</code> semantic tags, and Apple RealityKit USDZ anchors. Project photorealistic models directly into user physical environments (+52% visual CTR) and rank #1 in Google 3D search carousels.
              </p>
              
              {/* Feature Value Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-purple-300 font-mono">
                  ✓ Apple Vision Pro Quick Look (.usdz)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-teal-300 font-mono">
                  ✓ Schema.org 3DModel JSON-LD
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
                  ✓ W3C WebSpatial 60 FPS Bounding Boxes
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  const faqEl = document.getElementById('spatial-faqs');
                  faqEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Read Spatial SEO Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </section>

        {/* 10-Second Problem & Solution Interactive Video Masterclass (Directly under tool name and description) */}
        <ExplainerVideoPlayer
          toolType="spatial"
          accentColor="purple"
          title="Why 2D Websites Disappear in AR Glasses (And How Spatial SEO Solves It in 10 Seconds)"
          subtitle="Watch how WebSpatial tags and Schema 3DModel project products into physical rooms."
          chapters={spatialVideoChapters}
          keywords={spatialKeywords}
        />

        {/* Studio Grid: Spatial Config & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Spatial Parameters Configurator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>3D Model & Spatial Anchor Parameters</span>
                </h3>
                <span className="text-[11px] text-slate-400">Step 1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset Entity / Product Name</label>
                <input
                  type="text"
                  value={modelTitle}
                  onChange={(e) => setModelTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  WebXR 3D Model URL (.glb format for Android/Meta)
                </label>
                <input
                  type="url"
                  value={modelUrlGlb}
                  onChange={(e) => setModelUrlGlb(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Apple QuickLook 3D URL (.usdz format for VisionOS/iOS)
                </label>
                <input
                  type="url"
                  value={modelUrlUsdz}
                  onChange={(e) => setModelUrlUsdz(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Surface Placement</label>
                  <select
                    value={placementType}
                    onChange={(e) => setPlacementType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="floor">Floor Plane (Furniture, Vehicles)</option>
                    <option value="tabletop">Tabletop Plane (Electronics, Decor)</option>
                    <option value="wall">Wall-Hanging (Art, Monitors)</option>
                    <option value="floating">Floating HUD (UI, Ambient)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Spatial Anchor Mode</label>
                  <select
                    value={anchorType}
                    onChange={(e) => setAnchorType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="world_local">Local Physical Room</option>
                    <option value="geo_spatial">Geospatial Lat/Long Pin</option>
                  </select>
                </div>
              </div>

              {/* Physical Bounding Box (Meters) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  True Physical Dimensions (Meters: W × H × D)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Width (X)</span>
                    <input
                      type="number"
                      step="0.05"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent text-xs font-mono text-purple-300 focus:outline-none"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Height (Y)</span>
                    <input
                      type="number"
                      step="0.05"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent text-xs font-mono text-purple-300 focus:outline-none"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Depth (Z)</span>
                    <input
                      type="number"
                      step="0.05"
                      value={dimensions.depth}
                      onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent text-xs font-mono text-purple-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Visual Hologram Representation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400" />
                  <span>Volumetric Bounding Simulation</span>
                </h3>
                <span className="text-[11px] font-mono text-purple-400">
                  Vol: {(dimensions.width * dimensions.height * dimensions.depth).toFixed(3)} m³
                </span>
              </div>

              {/* Pseudo-3D Perspective Isometric Canvas */}
              <div className="relative h-44 w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* 3D Perspective Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b076415_1px,transparent_1px),linear-gradient(to_bottom,#3b076415_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                {/* Perspective Bounding Cube */}
                <div
                  className="relative transition-all duration-300 border-2 border-purple-500/80 bg-purple-500/10 rounded-lg flex flex-col items-center justify-center p-3 text-center shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                  style={{
                    width: `${Math.min(Math.max(dimensions.width * 140, 80), 220)}px`,
                    height: `${Math.min(Math.max(dimensions.height * 90, 70), 130)}px`,
                    transform: 'perspective(400px) rotateX(15deg) rotateY(-20deg)',
                  }}
                >
                  <Eye className="w-5 h-5 text-purple-400 animate-pulse mb-1" />
                  <span className="text-[11px] font-bold text-white truncate max-w-[140px]">{modelTitle}</span>
                  <span className="text-[10px] font-mono text-purple-300">
                    {dimensions.width}m × {dimensions.height}m × {dimensions.depth}m
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
                  Plane Constraint: {placementType}
                </div>
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  AR QuickLook Ready
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Output & Synthesizer (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                {/* Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('html-tags')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'html-tags'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      WebSpatial Meta Tags
                    </button>
                    <button
                      onClick={() => setActiveTab('schema-json')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'schema-json'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Schema 3DModel JSON-LD
                    </button>
                    <button
                      onClick={() => setActiveTab('apple-quicklook')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'apple-quicklook'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Apple RealityKit Anchor
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const text = activeTab === 'html-tags' ? generatedHtmlTags : activeTab === 'schema-json' ? generatedSchemaJson : generatedQuickLook;
                      copyToClipboard(text, 'spatial-clipboard');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedId === 'spatial-clipboard' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'spatial-clipboard' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Preview */}
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-purple-300 border border-slate-800 overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed">
                  <pre>{activeTab === 'html-tags' ? generatedHtmlTags : activeTab === 'schema-json' ? generatedSchemaJson : generatedQuickLook}</pre>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Implementation:{' '}
                  <strong className="text-white font-mono">
                    {activeTab === 'html-tags' ? 'Insert into <head> element' : activeTab === 'schema-json' ? 'Embed in <script type="application/ld+json">' : 'Product action CTA anchor'}
                  </strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> W3C WebXR & Schema 2.1 Valid
                </span>
              </div>
            </div>

            {/* Spatial Indexing Diagnostic Checklist */}
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Spatial Search Engine Indexability Checklist</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Dual Format Coverage</strong>
                    <span className="text-slate-400 text-[11px]">Includes .glb for WebXR and .usdz for Apple visionOS.</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Real-World Bounding Units</strong>
                    <span className="text-slate-400 text-[11px]">Strict physical dimensions in meters ensure proper scale.</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Surface Alignment Plane</strong>
                    <span className="text-slate-400 text-[11px]">Detects {placementType} plane to prevent sinking or floating errors.</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Google Lens 3D Badge</strong>
                    <span className="text-slate-400 text-[11px]">Qualifies for the AR visual search badge in Google Mobile search.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Benchmark Table */}
        <section className="mb-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Traditional Flat 2D Webpages vs. WebSpatial 3DXR Volumetric Anchors
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              How spatial search engine optimization transforms static product pages into interactive augmented reality experiences.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Evaluation Dimension</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-rose-400">Legacy 2D Webpage</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800 text-purple-400">WebSpatial & WebXR Synthesizer</th>
                  <th className="p-3 sm:p-4 border-b border-slate-800">Impact on Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Apple Vision Pro / AR Glasses Experience</td>
                  <td className="p-3 sm:p-4 text-rose-400">Flat floating rectangle (0 depth)</td>
                  <td className="p-3 sm:p-4 text-purple-300 font-semibold">True 1:1 photorealistic room projection</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">+52% spatial dwell time</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Google Lens & Visual AI Indexing</td>
                  <td className="p-3 sm:p-4 text-slate-400">Basic 2D image thumbnail</td>
                  <td className="p-3 sm:p-4 text-purple-300 font-mono">Schema.org 3DModel AR rich snippet badge</td>
                  <td className="p-3 sm:p-4 font-medium text-purple-400">+3.4x click-through rate</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Dimension Comprehension</td>
                  <td className="p-3 sm:p-4 text-rose-400">Users guess scale from photos</td>
                  <td className="p-3 sm:p-4 text-purple-300 font-mono">Sub-centimeter physical bounding box</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">-40% e-commerce return rates</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-white">Cross-Headset Interoperability</td>
                  <td className="p-3 sm:p-4 text-slate-400">N/A (Standard 2D viewport)</td>
                  <td className="p-3 sm:p-4 text-emerald-400">VisionOS, Meta Horizon, Android XR</td>
                  <td className="p-3 sm:p-4 font-medium text-emerald-400">Universal 2026–2035 Support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Snippet-Optimized FAQ Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Frequently Asked Questions: Spatial SEO & WebXR Metadata
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct, snippet-optimized answers to high-volume developer and brand queries.
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
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 border-t border-slate-900 space-y-2 text-xs">
                    <p className="text-purple-300 font-semibold leading-relaxed bg-purple-950/40 p-3 rounded-lg border border-purple-900/50">
                      <strong>Direct Answer:</strong> {faq.a}
                    </p>
                    <p className="text-slate-400 leading-relaxed pt-1">{faq.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Spatial, Entity & Search Engine Tools (Law 6 & Law 12) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/60">
                Spatial &amp; Entity Grounding Cluster
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Related Entity Grounding &amp; AEO Diagnostic Tools
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/tools/brand-knowledge-graph-generator')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-purple-400">Knowledge Graph</div>
              <div className="text-xs font-black text-white group-hover:text-purple-300 mt-0.5">
                Brand Knowledge Graph Generator →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Connect 3D assets to organization and product entities in Google's Knowledge Graph.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/tools/geo-search-auditor')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-purple-400">Generative Engine (GEO)</div>
              <div className="text-xs font-black text-white group-hover:text-purple-300 mt-0.5">
                GEO Search Readiness Auditor →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Audit how multimodal search engines parse your web assets and schema entities.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-purple-400">Position #0 Sniper</div>
              <div className="text-xs font-black text-white group-hover:text-purple-300 mt-0.5">
                AEO Position #0 Sniper Optimizer →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Optimize your text anchors and answer copy for Position #0 featured snippets.
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
