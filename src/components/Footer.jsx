import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { t, useTranslation } from '../i18n';

const QUICK_LINKS = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/map', labelKey: 'nav.map' },
  { path: '/wildlife', labelKey: 'nav.wildlife' },
  { path: '/reach', labelKey: 'nav.reach' },
  { path: '/action', labelKey: 'nav.action' },
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/transparency', labelKey: 'nav.transparency' },
  { path: '/future', labelKey: 'nav.future' },
  { path: '/sponsor', labelKey: 'nav.sponsor' },
];

const PARTNERS = [
  { name: 'International Animal Rescue (YIARI)', url: 'https://www.internationalanimalrescue.org/' },
  { name: 'BOS Foundation', url: 'https://orangutan.or.id/' },
  { name: 'NASA FIRMS', url: 'https://firms.modaps.eosdis.nasa.gov/' },
  { name: 'Mongabay Indonesia', url: 'https://www.mongabay.co.id/' },
  { name: 'NASA Earth Observatory', url: 'https://earthobservatory.nasa.gov/' },
  { name: 'Conservation International', url: 'https://www.conservation.org/' },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 border-t border-paper-edge bg-paper-warm/80 text-charcoal-800 transition-colors">
      {/* Decorative torn watercolor paper edge at top */}
      <div className="absolute -top-3 left-0 right-0 h-3 bg-gradient-to-b from-transparent to-paper-edge/30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        
        {/* Top Row: Brand & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-paper-edge/80">
          
          {/* Column 1: Brand & Story Quote */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 rounded">
              <span className="font-hand text-3xl font-bold tracking-wide text-moss-900 group-hover:text-moss-700 transition-colors">
                H.O.M.E.
              </span>
              <p className="font-serif text-xs text-charcoal-600 mt-0.5">
                {t('meta.expanded')}
              </p>
            </Link>

            <p className="text-sm text-charcoal-600 leading-relaxed font-sans">
              {t('meta.description')}
            </p>

            <div className="pt-2">
              <span className="inline-block rounded-md bg-moss-100/80 px-2.5 py-1 text-xs font-medium text-moss-800 border border-moss-200">
                🌿 Kalimantan, Borneo
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 font-sans">
              Story & Exploration
            </h3>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.slice(0, 4).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-charcoal-700 hover:text-moss-800 transition-colors inline-flex items-center gap-1.5 focus-visible:underline"
                  >
                    <span>•</span> {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Data & Organization Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 font-sans">
              Evidence & Actions
            </h3>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.slice(4).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-charcoal-700 hover:text-moss-800 transition-colors inline-flex items-center gap-1.5 focus-visible:underline"
                  >
                    <span>•</span> {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Share & Back to Top */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 font-sans">
              Share the Story
            </h3>
            <p className="text-xs text-charcoal-600 leading-normal">
              Spread awareness to keep Borneo's canopy alive and intact.
            </p>

            <div className="flex flex-wrap items-center gap-2 social-links">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-paper-edge bg-cream-100 px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 transition-colors cursor-pointer"
                aria-label="Copy page link to share"
              >
                <svg className="h-3.5 w-3.5 text-moss-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copied ? 'Copied link!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 rounded-lg border border-paper-edge bg-cream-100 px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 transition-colors cursor-pointer"
                aria-label={t('common.back_to_top')}
              >
                <svg className="h-3.5 w-3.5 text-moss-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>{t('common.back_to_top')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Partners & Data Attribution */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-paper-edge/80 text-xs text-charcoal-600">
          
          {/* Partner Attribution */}
          <div className="space-y-2">
            <h4 className="font-semibold text-charcoal-700 uppercase tracking-wider text-[11px]">
              Conservation Partners & Field Verification
            </h4>
            <p className="leading-relaxed">
              We stand in deep respect of frontline field teams rescuing wildlife and extinguishing peat fires:
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moss-800 hover:text-moss-900 underline underline-offset-2 decoration-moss-300 hover:decoration-moss-700 transition-colors"
                >
                  {partner.name} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-charcoal-700 uppercase tracking-wider text-[11px]">
              Scientific Data Sources & Licenses
            </h4>
            <p className="leading-relaxed">
              Thermal anomalies detected by NASA FIRMS (MODIS / VIIRS). Canopy change monitoring by Hansen / UMD / Global Forest Watch. Protected areas via WDPA (UNEP-WCMC). Species range boundaries via IUCN Red List.
            </p>
            <p className="italic text-charcoal-500">
              {t('common.illustrated_label')}
            </p>
          </div>
        </div>

        {/* Critical Donation Disclaimer Card */}
        <div className="my-6 rounded-lg bg-amber-50/70 border border-amber-200/90 p-4 text-xs text-charcoal-700 leading-relaxed shadow-2xs">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-600 font-bold text-sm leading-none mt-0.5">⚠️</span>
            <div>
              <strong className="font-semibold text-charcoal-800">Donation Transparency Notice: </strong>
              <span>{t('common.donation_disclaimer')}</span>
              {' '}
              <Link to="/transparency" className="text-moss-800 underline underline-offset-2 hover:text-moss-900 font-medium ml-1">
                Read our transparency standards →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Heartfelt Statement */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-500">
          <p>
            © {CURRENT_YEAR} H.O.M.E. — Built with care for Kalimantan's wildlife.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/transparency" className="hover:text-charcoal-800 transition-colors">
              {t('nav.transparency')}
            </Link>
            <span>•</span>
            <Link to="/future" className="hover:text-charcoal-800 transition-colors">
              {t('nav.future')}
            </Link>
            <span>•</span>
            <Link to="/sponsor" className="hover:text-charcoal-800 transition-colors">
              {t('nav.sponsor')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
