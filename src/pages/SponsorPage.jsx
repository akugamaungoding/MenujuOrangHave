import React, { useState } from 'react';
import { t } from '../i18n';
import {
  WatercolorCard,
  DonationDisclaimer,
  PaperTexture,
} from '../components';

export default function SponsorPage() {
  // Widget configuration state
  const [widgetRegion, setWidgetRegion] = useState('all');
  const [widgetTheme, setWidgetTheme] = useState('dark');
  const [widgetLayers, setWidgetLayers] = useState({
    fire: true,
    protected: true,
    species: false,
    burned: true,
  });
  const [copied, setCopied] = useState(false);

  // Generate iframe code
  const activeLayersParam = Object.keys(widgetLayers)
    .filter((k) => widgetLayers[k])
    .join(',');

  const embedUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://home-wildlife.org'}/map?embed=true&region=${widgetRegion}&theme=${widgetTheme}&layers=${activeLayersParam}`;

  const iframeSnippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  style="border: 0; border-radius: 12px; overflow: hidden;"
  title="H.O.M.E. Kalimantan Fire & Habitat Map"
  allow="geolocation"
  loading="lazy"
></iframe>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(iframeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const toggleLayer = (key) => {
    setWidgetLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative min-h-screen py-12 sm:py-20">
      <PaperTexture intensity={0.3} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-900 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            Institutional Alliances
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl font-bold text-moss-900 leading-tight">
            {t('sponsor.title')}
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-charcoal-700 italic">
            {t('sponsor.subtitle')}
          </p>

          <p className="text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Support the open satellite infrastructure protecting Indonesia’s remaining peat swamp ecosystems. Sponsor a wildlife corridor, underwrite automated fire watches, or embed live conservation maps onto your own digital platforms.
          </p>

          <div className="pt-2">
            <span className="inline-block rounded-md bg-cream-200/90 border border-paper-edge px-3 py-1 text-[11px] font-semibold text-charcoal-600">
              Integrity Policy: Sponsor placements never alter, censor, or influence scientific fire telemetry.
            </span>
          </div>
        </header>

        {/* 2 Sponsorship Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Track 1: Adopt a Corridor */}
          <WatercolorCard variant="warm" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                <span className="inline-block rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  {t('sponsor.sponsor_label')} &bull; Corridor Tier
                </span>
                <span className="text-2xl">🌲</span>
              </div>

              <h2 className="font-hand text-3xl sm:text-4xl font-bold text-charcoal-900">
                {t('sponsor.corridor_title')}
              </h2>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {t('sponsor.corridor_desc')} Underwrite continuous high-resolution satellite surveillance across vital migration corridors connecting Betung Kerihun and Danau Sentarum.
              </p>

              <div className="p-4 rounded-xl bg-cream-50 border border-paper-edge text-xs space-y-2 text-charcoal-600">
                <div className="font-semibold text-charcoal-800">Media Kit Inclusions:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Quarterly verified corridor health impact briefs</li>
                  <li>Dedicated institutional acknowledgment on public map layers</li>
                  <li>Direct telemetry integration into corporate ESG reporting</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-paper-edge">
              <a
                href="mailto:partnerships@home-project.org?subject=Inquiry: Adopt a Corridor Sponsorship"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-charcoal-950 hover:bg-amber-500 transition-colors shadow-xs"
              >
                <span>{t('sponsor.inquire')} for Corridor</span>
                <span>&rarr;</span>
              </a>
            </div>
          </WatercolorCard>

          {/* Track 2: Sponsor a Fire Watch Zone */}
          <WatercolorCard variant="cool" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                <span className="inline-block rounded-full bg-moss-100 text-moss-900 border border-moss-300 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  {t('sponsor.sponsor_label')} &bull; Early Warning Tier
                </span>
                <span className="text-2xl">🔥</span>
              </div>

              <h2 className="font-hand text-3xl sm:text-4xl font-bold text-charcoal-900">
                {t('sponsor.firewatch_title')}
              </h2>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {t('sponsor.firewatch_desc')} Fund continuous automated thermal anomaly alert pipelines for specific high-risk peat domes in Central or West Kalimantan.
              </p>

              <div className="p-4 rounded-xl bg-cream-50 border border-paper-edge text-xs space-y-2 text-charcoal-600">
                <div className="font-semibold text-charcoal-800">Media Kit Inclusions:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Real-time automated incident SMS / webhook notification stream</li>
                  <li>Underwriting credit for ground community fire patrol gear</li>
                  <li>Full API access with unlimited rate query limits</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-paper-edge">
              <a
                href="mailto:partnerships@home-project.org?subject=Inquiry: Sponsor a Fire Watch Zone"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-moss-700 px-5 py-3 text-sm font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-xs"
              >
                <span>{t('sponsor.inquire')} for Fire Watch</span>
                <span>&rarr;</span>
              </a>
            </div>
          </WatercolorCard>
        </div>

        {/* White-Label Widget Embed Section */}
        <section className="paper-card-deckle rounded-3xl border border-paper-edge bg-paper-warm/95 p-6 sm:p-10 shadow-lg space-y-8">
          <div className="border-b border-paper-edge pb-4">
            <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
              White-Label Syndication
            </span>
            <h2 className="font-hand text-3xl sm:text-4xl font-bold text-moss-900 mt-1">
              {t('sponsor.widget_title')}
            </h2>
            <p className="text-sm text-charcoal-700 mt-1">
              {t('sponsor.widget_desc')} Embed our real-time Kalimantan fire and habitat map directly into your newsroom story, educational curriculum, or corporate sustainability report.
            </p>
          </div>

          {/* Generator Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-cream-50 p-6 rounded-2xl border border-paper-edge">
            {/* 1. Region */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">
                Focus Region
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Kalimantan' },
                  { id: 'west', label: 'West Kalimantan' },
                  { id: 'central', label: 'Central Kalimantan' },
                ].map((reg) => (
                  <label key={reg.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="widgetRegion"
                      checked={widgetRegion === reg.id}
                      onChange={() => setWidgetRegion(reg.id)}
                      className="text-moss-700 focus:ring-moss-600"
                    />
                    <span>{reg.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Theme */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">
                Color Theme
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'dark', label: 'Dark Matter (High Contrast)' },
                  { id: 'light', label: 'Positron (Light Storybook)' },
                ].map((th) => (
                  <label key={th.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="widgetTheme"
                      checked={widgetTheme === th.id}
                      onChange={() => setWidgetTheme(th.id)}
                      className="text-moss-700 focus:ring-moss-600"
                    />
                    <span>{th.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Layers */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-2">
                Active Layers
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetLayers.fire}
                    onChange={() => toggleLayer('fire')}
                    className="rounded text-moss-700 focus:ring-moss-600"
                  />
                  <span>VIIRS Active Fire Points</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetLayers.protected}
                    onChange={() => toggleLayer('protected')}
                    className="rounded text-moss-700 focus:ring-moss-600"
                  />
                  <span>WDPA Protected Reserves</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetLayers.burned}
                    onChange={() => toggleLayer('burned')}
                    className="rounded text-moss-700 focus:ring-moss-600"
                  />
                  <span>Burned Area Footprints</span>
                </label>
              </div>
            </div>
          </div>

          {/* Generated Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-charcoal-700">
                Embed HTML Snippet:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs font-semibold text-moss-800 hover:text-moss-950 underline flex items-center gap-1"
              >
                {copied ? '✓ Copied to clipboard!' : 'Copy snippet code'}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-charcoal-950 text-amber-300 font-mono text-xs overflow-x-auto border border-charcoal-800 select-all">
              {iframeSnippet}
            </pre>
          </div>

          {/* Interactive Live Preview Box */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600 block">
              Live Embed Preview:
            </span>
            <div className="w-full h-80 rounded-2xl overflow-hidden border-2 border-paper-edge bg-charcoal-900 shadow-inner">
              <iframe
                src={`/map?embed=true&region=${widgetRegion}&theme=${widgetTheme}&layers=${activeLayersParam}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                title="Map Widget Preview"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Global Footer Disclaimer */}
        <div className="pt-4 border-t border-paper-edge">
          <DonationDisclaimer />
        </div>
      </div>
    </div>
  );
}
