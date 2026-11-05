import React, { useState } from 'react';
import { t } from '../i18n';
import { SOURCES } from '../sources.js';
import { useDataRefresh } from '../hooks';
import {
  StatusBadge,
  DonationDisclaimer,
  PaperTexture,
  WatercolorCard,
} from '../components';

const GLOSSARY_ITEMS = [
  {
    term: 'Active Fire Detection vs. Burned Area',
    explanation:
      'An active fire detection (thermal anomaly) is an instantaneous satellite measurement of radiant heat emitted at the exact second the sensor orbits overhead. A burned area, by contrast, maps the cumulative physical footprint of charred vegetation, ash, and leaf canopy loss after a fire event has subsided. We display both to avoid conflating brief brush flare-ups with persistent deep-peat combustion.',
  },
  {
    term: 'Species Range vs. Species Presence',
    explanation:
      'A species range represents the broad biogeographic envelope where environmental conditions permit a species to survive (based on official IUCN Red List distribution polygons). It does NOT confirm that an individual animal is physically standing at any specific GPS coordinate. Overlap between fire and species range signifies habitat exposure, not proven individual encounters.',
  },
  {
    term: 'Protected Area vs. Safe Habitat',
    explanation:
      'National Park and reserve boundaries (recorded in the UN World Database on Protected Areas) provide legal conservation status. However, legal borders do not block wind-blown fire embers or prevent illegal canal drainage. A designated protected area may experience severe fire risk during severe El Niño droughts.',
  },
  {
    term: 'Wildlife Impact Evidence Standard',
    explanation:
      'To maintain scientific honesty, every animal-related claim on H.O.M.E. is strictly categorized into one of five evidence tiers: 1) Verified veterinary rescue record; 2) Species range overlap with thermal signal; 3) Satellite fire detection count in range; 4) Mapped burned area extent; or 5) Unverified signal requiring ground-level patrol confirmation.',
  },
];

export default function TransparencyPage() {
  const { loading, statuses, lastRefreshed, refreshAll, exportData } = useDataRefresh();
  const [downloadNotice, setDownloadNotice] = useState(null);
  const claims = t('transparency.claims');

  // Trigger JSON download
  const handleDownloadJSON = async () => {
    try {
      setDownloadNotice('Packaging data bundle...');
      const jsonData = await exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `home-conservation-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadNotice('Download initiated successfully.');
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error('Failed to export data:', err);
      setDownloadNotice('Error exporting data. Please try again.');
    }
  };

  const handleRefresh = async () => {
    try {
      setDownloadNotice('Refreshing all live sources...');
      await refreshAll();
      setDownloadNotice('All active sources updated.');
      setTimeout(() => setDownloadNotice(null), 3000);
    } catch (err) {
      setDownloadNotice('Refresh completed with some cached fallbacks.');
      setTimeout(() => setDownloadNotice(null), 3000);
    }
  };

  return (
    <div className="relative min-h-screen py-12 sm:py-20">
      <PaperTexture intensity={0.3} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-paper-edge bg-cream-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-charcoal-700">
            <span className="h-2 w-2 rounded-full bg-moss-600" />
            Open Science Charter
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl font-bold text-moss-900 leading-tight">
            {t('transparency.title')}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-charcoal-700 italic">
            {t('transparency.subtitle')}
          </p>

          <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Conservation storytelling must earn trust through radical accountability. We disclose every satellite sensor, scientific database, API limit, and data license.
          </p>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-moss-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-cream-50 hover:bg-moss-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing Pipelines...' : t('common.refresh')}
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-2 rounded-xl border border-paper-edge bg-cream-100 px-5 py-2.5 text-xs sm:text-sm font-semibold text-charcoal-800 hover:bg-cream-200 transition-colors shadow-2xs"
            >
              <svg className="h-4 w-4 text-moss-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('common.download_data')}
            </button>
          </div>

          {downloadNotice && (
            <div className="mt-3 text-xs text-moss-800 bg-moss-50 border border-moss-200 rounded-lg py-1.5 px-4 inline-block animate-fadeIn">
              {downloadNotice}
            </div>
          )}
        </header>

        {/* 1. What We Do Not Claim Section */}
        <section className="paper-card-deckle rounded-2xl border border-paper-edge bg-paper-warm/95 p-6 sm:p-10 shadow-md space-y-6">
          <div className="border-b border-paper-edge pb-4">
            <span className="text-xs font-serif uppercase tracking-widest text-amber-800 font-bold">
              Ethical Guardrails
            </span>
            <h2 className="font-hand text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
              {t('transparency.what_we_dont_claim')}
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              We pledge to never sensationalize satellite data or exploit emotional imagery.
            </p>
          </div>

          <ul className="space-y-3.5">
            {Array.isArray(claims) &&
              claims.map((claim, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm text-charcoal-700 leading-relaxed bg-cream-50/80 p-3.5 rounded-xl border border-paper-edge"
                >
                  <span className="text-amber-700 font-bold shrink-0 text-base" aria-hidden="true">
                    ✕
                  </span>
                  <span>{claim}</span>
                </li>
              ))}
          </ul>
        </section>

        {/* 2. Registered Data Sources Grid */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
                Scientific Infrastructure
              </span>
              <h2 className="font-hand text-3xl sm:text-4xl font-bold text-moss-900">
                Registered Data Sources &amp; Telemetry Pipelines
              </h2>
            </div>
            <span className="text-xs text-charcoal-500 font-mono">
              Total Feeds: {SOURCES.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOURCES.map((source) => {
              const liveStatus = statuses[source.id]?.status || 'OK';
              const lastOk = statuses[source.id]?.last_ok;

              return (
                <article
                  key={source.id}
                  className="paper-card rounded-2xl border border-paper-edge p-6 flex flex-col justify-between gap-4 bg-paper-warm shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cream-200 text-charcoal-700 mb-1">
                          {source.category} &bull; {source.type}
                        </span>
                        <h3 className="font-hand text-2xl font-bold text-charcoal-900">
                          {source.label}
                        </h3>
                      </div>
                      <StatusBadge status={liveStatus} />
                    </div>

                    <div className="text-xs text-charcoal-600 space-y-1">
                      <div>
                        <strong className="text-charcoal-800">License:</strong> {source.license}
                      </div>
                      <div>
                        <strong className="text-charcoal-800">Attribution:</strong> {source.attribution}
                      </div>
                      {source.maxAgeHours && (
                        <div>
                          <strong className="text-charcoal-800">Cache Window:</strong> {source.maxAgeHours} hours
                        </div>
                      )}
                      {lastOk && (
                        <div className="text-[11px] text-moss-700">
                          Last synchronized: {new Date(lastOk).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-paper-edge flex items-center justify-between text-xs">
                    <span className={`font-semibold ${source.enabled ? 'text-moss-700' : 'text-charcoal-400'}`}>
                      {source.enabled ? '● Enabled' : '○ Standby'}
                    </span>
                    <a
                      href={source.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-moss-800 hover:text-moss-950 hover:underline flex items-center gap-1"
                    >
                      Official Registry <span>&nearr;</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. Scientific Glossary */}
        <section className="paper-card-deckle rounded-2xl border border-paper-edge bg-paper-warm/95 p-6 sm:p-10 shadow-md space-y-6">
          <div className="border-b border-paper-edge pb-4">
            <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
              Terminology
            </span>
            <h2 className="font-hand text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
              {t('transparency.glossary_title')}
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              Definitions of technical remote sensing and conservation biology terms used across this project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GLOSSARY_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-cream-50/80 border border-paper-edge space-y-2"
              >
                <h3 className="font-hand text-2xl font-bold text-moss-900">
                  {item.term}
                </h3>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
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
