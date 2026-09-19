import React, { useState, useMemo } from 'react';
import {
  MousePointer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Code2,
  Sliders,
  ShieldCheck,
  Layers,
  HelpCircle,
  Zap,
  RefreshCw,
  ExternalLink,
  Target,
  Maximize2,
  Smartphone,
  Eye,
} from 'lucide-react';

interface TargetPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  padding: number;
  spacingToNeighbor: number;
  targetType: 'button' | 'icon' | 'inline' | 'essential';
  description: string;
}

const PRESETS: TargetPreset[] = [
  {
    id: 'small-icon-fail',
    name: 'Small Social Icon (Failing: 16×16px, 4px Spacing)',
    width: 16,
    height: 16,
    padding: 0,
    spacingToNeighbor: 4,
    targetType: 'icon',
    description: 'Fails WCAG 2.2 SC 2.5.8: Physical size is under 24px and spacing circle overlaps neighbor.',
  },
  {
    id: 'spaced-icon-pass',
    name: 'Small Icon with Spacing Buffer (Passing: 16×16px, 12px Spacing)',
    width: 16,
    height: 16,
    padding: 0,
    spacingToNeighbor: 12,
    targetType: 'icon',
    description: 'Passes via Spacing Exception: 24px diameter concentric circle does not intersect neighbor.',
  },
  {
    id: 'standard-button-pass',
    name: 'Compliant Standard Button (Passing: 36×36px)',
    width: 36,
    height: 36,
    padding: 8,
    spacingToNeighbor: 8,
    targetType: 'button',
    description: 'Exceeds WCAG 2.2 Level AA requirement (≥ 24×24 CSS px) and approaches Apple/Android 44px ideal.',
  },
  {
    id: 'inline-link-exempt',
    name: 'Inline Paragraph Link (Exempt from SC 2.5.8)',
    width: 20,
    height: 14,
    padding: 0,
    spacingToNeighbor: 2,
    targetType: 'inline',
    description: 'Legally Exempt: Targets embedded directly inside flowing text paragraphs are excluded.',
  },
];

interface TouchTargetSizeCalculatorProps {
  onNavigate: (route: string) => void;
}

export const TouchTargetSizeCalculator: React.FC<TouchTargetSizeCalculatorProps> = ({
  onNavigate,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('small-icon-fail');
  const [width, setWidth] = useState<number>(16);
  const [height, setHeight] = useState<number>(16);
  const [padding, setPadding] = useState<number>(0);
  const [spacingToNeighbor, setSpacingToNeighbor] = useState<number>(4);
  const [targetType, setTargetType] = useState<'button' | 'icon' | 'inline' | 'essential'>('icon');
  const [showSpacingCircle, setShowSpacingCircle] = useState<boolean>(true);
  const [copiedSolution, setCopiedSolution] = useState<string | null>(null);

  // Apply Preset
  const handleSelectPreset = (preset: TargetPreset) => {
    setSelectedPresetId(preset.id);
    setWidth(preset.width);
    setHeight(preset.height);
    setPadding(preset.padding);
    setSpacingToNeighbor(preset.spacingToNeighbor);
    setTargetType(preset.targetType);
  };

  // Mathematical WCAG 2.2 SC 2.5.8 Calculations
  const calculation = useMemo(() => {
    const totalEffectiveWidth = width + padding * 2;
    const totalEffectiveHeight = height + padding * 2;

    // Minimum requirement is 24x24 CSS pixels
    const meetsSizeDirectly = totalEffectiveWidth >= 24 && totalEffectiveHeight >= 24;

    // Radius of 24px diameter circle centered on target
    const circleDiameter = 24;
    const circleRadius = 12;

    // Calculate overhang beyond the target edge:
    // If target width is < 24px, the circle extends beyond target bounds by: (24 - totalEffectiveWidth) / 2
    const overhangX = Math.max(0, (circleDiameter - totalEffectiveWidth) / 2);
    const overhangY = Math.max(0, (circleDiameter - totalEffectiveHeight) / 2);

    // If spacing to neighbor is greater than overhangX (or 24 - target width), circles do not collide
    const meetsSpacingException = !meetsSizeDirectly && spacingToNeighbor >= overhangX * 2;

    const isInlineExempt = targetType === 'inline';
    const isEssentialExempt = targetType === 'essential';
    const isExempt = isInlineExempt || isEssentialExempt;

    const isCompliant = meetsSizeDirectly || meetsSpacingException || isExempt;

    let verdict = 'FAIL (Non-Compliant with WCAG 2.2 AA)';
    let verdictColor = 'text-red-600 bg-red-50 border-red-200';
    let complianceType = 'Fails both physical size (<24px) and spacing buffer rules.';

    if (isExempt) {
      verdict = 'PASS (Exempt under SC 2.5.8)';
      verdictColor = 'text-blue-700 bg-blue-50 border-blue-200';
      complianceType = isInlineExempt
        ? 'Inline Text Exception: Target is constrained within a natural block of flowing text.'
        : 'Essential Exception: Dimensional constraints are intrinsic to functionality (e.g. geo pin).';
    } else if (meetsSizeDirectly) {
      verdict = 'PASS (Meets ≥ 24×24px Direct Target Size)';
      verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      complianceType = `Physical target area is ${totalEffectiveWidth}×${totalEffectiveHeight} CSS px (≥ 24×24px minimum).`;
    } else if (meetsSpacingException) {
      verdict = 'PASS (Spacing Exception Compliant)';
      verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      complianceType = `Physical size is ${totalEffectiveWidth}×${totalEffectiveHeight}px, but ${spacingToNeighbor}px gap protects the 24px concentric circle buffer.`;
    }

    return {
      totalEffectiveWidth,
      totalEffectiveHeight,
      meetsSizeDirectly,
      meetsSpacingException,
      isExempt,
      isCompliant,
      overhangX,
      overhangY,
      circleDiameter,
      verdict,
      verdictColor,
      complianceType,
    };
  }, [width, height, padding, spacingToNeighbor, targetType]);

  // CSS Code Remediation Patterns
  const remediations = useMemo(() => {
    // Solution 1: Explicit Min Dimensions
    const codeMinDimension = `/* Solution 1: Direct WCAG 2.2 Level AA Dimension Override */
.interactive-target {
  min-width: 24px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}`;

    // Solution 2: Padding Hit-Area Expansion
    const neededPaddingX = Math.max(0, Math.ceil((24 - width) / 2));
    const neededPaddingY = Math.max(0, Math.ceil((24 - height) / 2));
    const codePadding = `/* Solution 2: Expand Hit Area with Padding */
.interactive-target {
  padding: ${neededPaddingY}px ${neededPaddingX}px;
  box-sizing: border-box;
}`;

    // Solution 3: Invisible Pseudo-Element Hit Expander (Maintains Small Visual Size)
    const insetVal = Math.max(4, Math.ceil((24 - Math.max(width, height)) / 2));
    const codePseudo = `/* Solution 3: Invisible Hit Target Expander (Preserves Small Visual Icon) */
.icon-button {
  position: relative;
  /* Visual icon stays ${width}x${height}px */
}

.icon-button::after {
  content: '';
  position: absolute;
  inset: -${insetVal}px; /* Expands touch target to ≥ 24x24px */
  cursor: pointer;
}`;

    return { codeMinDimension, codePadding, codePseudo };
  }, [width, height]);

  const handleCopyCode = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSolution(type);
      setTimeout(() => setCopiedSolution(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to Platform Scanner
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
              WCAG 2.2 Level AA (SC 2.5.8)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Interactive Dimension Engine
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-300 text-blue-900 text-xs font-black uppercase tracking-wider shadow-xs">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Official W3C WCAG 2.2 Criterion 2.5.8 Diagnostic</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            WCAG 2.2 Touch Target Size &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-600">
              Spacing Buffer Calculator
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Test buttons, icons, and interactive elements against the 24×24 CSS pixel mandate and concentric circular spacing buffers. Calculate compliance verdicts and generate instant CSS hit-area fixes.
          </p>

          {/* Core Benchmark Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <MousePointer className="w-3.5 h-3.5 text-blue-600" />
              <span>24×24 CSS px Minimum Bounds</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Concentric Spacing Circle Buffer</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>W3C SC 2.5.8 Exceptions Built-in</span>
            </div>
          </div>
        </div>

        {/* Quick Presets Carousel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Load Real-World Interactive Presets:</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Click to test instant scenarios</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedPresetId === p.id
                    ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-xs font-black truncate">{p.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sliders & Parameter Controls (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Target Dimensions &amp; Padding</span>
                </h2>
                <button
                  onClick={() => {
                    setWidth(24);
                    setHeight(24);
                    setPadding(0);
                    setSpacingToNeighbor(8);
                  }}
                  className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to 24px</span>
                </button>
              </div>

              {/* Target Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Interactive Element Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'icon', label: 'Icon Button' },
                    { id: 'button', label: 'Standard Button' },
                    { id: 'inline', label: 'Inline Text Link (Exempt)' },
                    { id: 'essential', label: 'Essential Map Pin' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTargetType(t.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                        targetType === t.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Width */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Target Core Width:</span>
                  <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                    {width} CSS px
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>8px</span>
                  <span className="text-emerald-600 font-bold">24px (WCAG Min)</span>
                  <span>64px</span>
                </div>
              </div>

              {/* Slider 2: Height */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Target Core Height:</span>
                  <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                    {height} CSS px
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>8px</span>
                  <span className="text-emerald-600 font-bold">24px (WCAG Min)</span>
                  <span>64px</span>
                </div>
              </div>

              {/* Slider 3: Padding */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Internal Padding:</span>
                  <span className="font-mono font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {padding} px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
              </div>

              {/* Slider 4: Spacing to Neighbor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Gap to Adjacent Interactive Neighbor:</span>
                  <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                    {spacingToNeighbor} px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={spacingToNeighbor}
                  onChange={(e) => setSpacingToNeighbor(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Spacing Circle Toggle */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Render 24px Concentric Spacing Circle:</span>
                <button
                  onClick={() => setShowSpacingCircle(!showSpacingCircle)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    showSpacingCircle ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                      showSpacingCircle ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Geometric Stage & Verdict (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Geometric Canvas */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-mono font-black uppercase text-slate-300">
                    Geometric Viewport Simulation (Scale 2.5×)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Target Size: {calculation.totalEffectiveWidth}×{calculation.totalEffectiveHeight}px
                </span>
              </div>

              {/* Graphical Simulator Area */}
              <div className="relative h-64 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)]"
                  style={{ backgroundSize: '16px 16px' }}
                />

                {/* Central Target & Neighbor Visualization Container */}
                <div className="relative flex items-center">
                  {/* Primary Target Button A */}
                  <div
                    className="relative flex items-center justify-center transition-all duration-300 z-10"
                    style={{
                      width: `${calculation.totalEffectiveWidth * 2.5}px`,
                      height: `${calculation.totalEffectiveHeight * 2.5}px`,
                    }}
                  >
                    {/* Concentric 24px Diameter Spacing Circle */}
                    {showSpacingCircle && (
                      <div
                        className={`absolute rounded-full border-2 border-dashed pointer-events-none transition-all duration-300 ${
                          calculation.isCompliant
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : 'border-red-400 bg-red-500/10'
                        }`}
                        style={{
                          width: `${24 * 2.5}px`,
                          height: `${24 * 2.5}px`,
                        }}
                        title="24px Concentric Spacing Circle"
                      />
                    )}

                    {/* Button Visual Body */}
                    <div
                      className={`w-full h-full rounded-xl flex items-center justify-center font-mono text-xs font-black shadow-lg transition-all ${
                        calculation.isCompliant
                          ? 'bg-blue-600 text-white border-2 border-blue-400'
                          : 'bg-red-600 text-white border-2 border-red-400 animate-pulse'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                    </div>

                    {/* Dimension Marker Tag */}
                    <div className="absolute -bottom-6 font-mono text-[9px] text-slate-300 whitespace-nowrap">
                      {calculation.totalEffectiveWidth}×{calculation.totalEffectiveHeight}px
                    </div>
                  </div>

                  {/* Visual Gap / Spacing Ruler */}
                  <div
                    className="relative flex items-center justify-center border-t border-b border-indigo-400/60 my-auto transition-all duration-300"
                    style={{
                      width: `${spacingToNeighbor * 2.5}px`,
                      height: '2px',
                    }}
                  >
                    {spacingToNeighbor > 3 && (
                      <span className="absolute -top-4 font-mono text-[9px] text-indigo-300">
                        {spacingToNeighbor}px
                      </span>
                    )}
                  </div>

                  {/* Neighbor Target Button B */}
                  <div
                    className="relative flex items-center justify-center rounded-xl bg-slate-800 border-2 border-slate-700 text-slate-400 transition-all duration-300 z-10"
                    style={{
                      width: `${24 * 2.5}px`,
                      height: `${24 * 2.5}px`,
                    }}
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    <div className="absolute -bottom-6 font-mono text-[9px] text-slate-400 whitespace-nowrap">
                      Neighbor
                    </div>
                  </div>
                </div>

                {/* Corner Legend */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-dashed border-emerald-400 bg-emerald-500/20" />
                    <span>24px Diameter Spacing Circle</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                    <span>Target A Bounding Box</span>
                  </div>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className={`p-4 rounded-2xl border ${calculation.verdictColor} space-y-1`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {calculation.isCompliant ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-700" />
                    )}
                    <span className="text-sm font-black tracking-tight">{calculation.verdict}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200">
                    SC 2.5.8 Level AA
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium pl-7">
                  {calculation.complianceType}
                </p>
              </div>
            </div>

            {/* 1-Click CSS Remediation Code Generator */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span>Automated CSS Remediation Generator</span>
                </div>
                <p className="text-xs text-slate-500">
                  Choose the optimal solution for your design system and copy with 1 click:
                </p>
              </div>

              {/* Solution 1: Dimension Override */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Solution A: Explicit Minimum Dimensions (24×24px)
                  </span>
                  <button
                    onClick={() => handleCopyCode(remediations.codeMinDimension, 'dim')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedSolution === 'dim' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSolution === 'dim' ? 'Copied!' : 'Copy CSS'}</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 p-2.5 rounded-xl overflow-x-auto">
                  {remediations.codeMinDimension}
                </pre>
              </div>

              {/* Solution 3: Pseudo Element Expander */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Solution B: Invisible Pseudo-Element Hit Expander (Keeps Small Visuals)
                  </span>
                  <button
                    onClick={() => handleCopyCode(remediations.codePseudo, 'pseudo')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedSolution === 'pseudo' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSolution === 'pseudo' ? 'Copied!' : 'Copy CSS'}</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono bg-slate-900 text-sky-400 p-2.5 rounded-xl overflow-x-auto">
                  {remediations.codePseudo}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Companion Deep Link */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-blue-800">
                W3C Guidelines &amp; Mathematical Specification
              </span>
              <h3 className="text-xl font-black text-slate-950">
                Pillar Guide: WCAG 2.2 Target Size (Minimum) SC 2.5.8
              </h3>
              <p className="text-xs text-slate-600 max-w-xl">
                Review the official W3C normative text, mathematical concentric spacing circle calculations, exemptions for inline text, and developer test fixtures.
              </p>
            </div>
            <button
              onClick={() =>
                onNavigate('/blog/wcag-22-touch-target-size-minimum-sc-258-guide')
              }
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Read SC 2.5.8 Technical Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Related Accessibility & Technical Testing Tools (Law 6 & Law 12) */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/60">
                Auditing Arsenal
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Complementary Accessibility &amp; UX Diagnostic Tools
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/scanner')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-blue-400">172-Point DOM Audit</div>
              <div className="text-xs font-black text-white group-hover:text-blue-300 mt-0.5">
                Full-Domain Accessibility Scanner →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Automated detection for contrast ratios, missing labels, and touch targets across live pages.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/tools/site-comparison')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-blue-400">Competitor Analysis</div>
              <div className="text-xs font-black text-white group-hover:text-blue-300 mt-0.5">
                Site Comparison Engine →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Benchmark accessibility scores and load times against your competitors.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-black uppercase text-blue-400">Position #0 Sniper</div>
              <div className="text-xs font-black text-white group-hover:text-blue-300 mt-0.5">
                AEO Position #0 Sniper Optimizer →
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Audit answer blocks and token clarity for AI search engines and voice assistants.
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
