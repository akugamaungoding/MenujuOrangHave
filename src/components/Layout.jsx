import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

/**
 * Main Layout component for H.O.M.E.
 * Provides:
 * - Storybook paper texture background throughout
 * - Skip to main content accessibility link
 * - Sticky responsive navigation with SoundToggle and mobile drawer
 * - Main viewport container supporting either direct children or nested Router <Outlet />
 * - Comprehensive footer with partner attributions and donation disclaimers
 */
export default function Layout({ children }) {
  return (
    <div className="paper-texture min-h-screen flex flex-col text-charcoal-800 antialiased selection:bg-amber-200 selection:text-charcoal-900">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-moss-700 focus:text-cream-50 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-sm transition-all"
      >
        Skip to main content
      </a>

      {/* Responsive Navigation Header */}
      <Navigation />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex="-1"
        className="flex-1 w-full focus:outline-none"
      >
        {children || <Outlet />}
      </main>

      {/* Storybook Footer */}
      <Footer />
    </div>
  );
}
