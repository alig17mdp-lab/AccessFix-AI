import React, { useState, useEffect } from 'react';
import { Eye, Type, Contrast, Sparkles, X } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highlightFocus, setHighlightFocus] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (largeText) {
      root.classList.add('text-lg-mode');
    } else {
      root.classList.remove('text-lg-mode');
    }

    if (dyslexicFont) {
      root.classList.add('dyslexic-font-mode');
    } else {
      root.classList.remove('dyslexic-font-mode');
    }

    if (highlightFocus) {
      root.classList.add('highlight-focus-mode');
    } else {
      root.classList.remove('highlight-focus-mode');
    }
  }, [highContrast, largeText, dyslexicFont, highlightFocus]);

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {!isOpen ? (
        <button
          id="btn-accessibility-toolbar-open"
          onClick={() => setIsOpen(true)}
          aria-label="Open Accessibility Preferences Toolbar"
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400 text-sm font-semibold cursor-pointer border border-slate-700"
        >
          <Eye className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Accessibility</span>
        </button>
      ) : (
        <div
          role="dialog"
          aria-labelledby="a11y-toolbar-title"
          className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 w-80 text-slate-800 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <h2 id="a11y-toolbar-title" className="text-sm font-bold text-slate-900">
                Accessibility Preferences
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility toolbar"
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs font-medium cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-slate-600" />
                <span>High Contrast Mode</span>
              </span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-medium cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-600" />
                <span>Enlarge Typography (120%)</span>
              </span>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-medium cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Highlight Active Focus</span>
              </span>
              <input
                type="checkbox"
                checked={highlightFocus}
                onChange={(e) => setHighlightFocus(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-medium cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-600" />
                <span>Enhanced Readability Font</span>
              </span>
              <input
                type="checkbox"
                checked={dyslexicFont}
                onChange={(e) => setDyslexicFont(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>AuditSnipe Accessibility Engine</span>
            <button
              onClick={() => {
                setHighContrast(false);
                setLargeText(false);
                setDyslexicFont(false);
                setHighlightFocus(false);
              }}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
