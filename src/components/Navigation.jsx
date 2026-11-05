import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { t, useTranslation } from '../i18n';
import SoundToggle from './SoundToggle';

const NAV_ITEMS = [
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

export default function Navigation() {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Handle ESC key to close drawer and restore focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-edge/80 bg-paper-warm/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 rounded-md p-1"
          aria-label="H.O.M.E. — Return to homepage"
        >
          {/* Watercolor leaf emblem */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-moss-100 text-moss-700 border border-moss-300 group-hover:bg-moss-200 transition-colors shadow-xs">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-hand text-2xl font-bold leading-tight tracking-wide text-moss-900 group-hover:text-moss-700 transition-colors">
              H.O.M.E.
            </span>
            <span className="hidden sm:inline font-serif text-[10px] tracking-wide text-charcoal-500 -mt-0.5 max-w-[14rem] leading-tight">
              {t('meta.expanded')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-1"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-moss-900 bg-moss-100/90 font-semibold shadow-xs'
                    : 'text-charcoal-700 hover:text-moss-800 hover:bg-cream-200/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{t(item.labelKey)}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-moss-600 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Medium Screen Navigation (Compact) */}
        <nav
          className="hidden md:flex xl:hidden items-center gap-1"
          aria-label="Compact Primary Navigation"
        >
          {NAV_ITEMS.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'text-moss-900 bg-moss-100 font-semibold'
                    : 'text-charcoal-700 hover:text-moss-800 hover:bg-cream-200/60'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-moss-200 bg-cream-50 p-0.5" role="group" aria-label={t('common.language')}>
            {['en', 'id'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  locale === code ? 'bg-moss-700 text-cream-50' : 'text-charcoal-600 hover:bg-cream-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <SoundToggle />

          {/* Mobile / Tablet Hamburger Toggle */}
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg text-charcoal-700 hover:bg-cream-200 hover:text-charcoal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 cursor-pointer"
          >
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
            <div className="w-5 h-5 relative flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 bg-charcoal-800 rounded transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-charcoal-800 rounded transition-all duration-200 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-charcoal-800 rounded transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/40 backdrop-blur-xs transition-opacity xl:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide in from Right) */}
      <aside
        id="mobile-navigation-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-paper-warm border-l border-paper-edge p-6 shadow-2xl transition-transform duration-300 ease-out xl:hidden flex flex-col justify-between overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-paper-edge">
            <div className="flex items-center gap-2">
              <span className="font-hand text-2xl font-bold text-moss-900">H.O.M.E.</span>
              <span className="text-xs text-charcoal-500 font-serif">Storybook Menu</span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile Navigation Links">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-moss-100 text-moss-900 font-semibold border-l-4 border-moss-600'
                      : 'text-charcoal-700 hover:bg-cream-200 hover:text-charcoal-900'
                  }`
                }
              >
                <span>{t(item.labelKey)}</span>
                <span className="text-xs text-moss-700 opacity-60">→</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Drawer Footer Disclaimer & Sound */}
        <div className="pt-6 mt-6 border-t border-paper-edge flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-600">Ambient Atmosphere:</span>
            <SoundToggle />
          </div>
          <p className="text-[11px] leading-relaxed text-charcoal-500 italic">
            "{t('meta.tagline')}"
          </p>
        </div>
      </aside>
    </header>
  );
}
