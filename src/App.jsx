import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

// Page Imports
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import WildlifePage from './pages/WildlifePage';
import HomeProfile from './pages/HomeProfile';
import ActionPage from './pages/ActionPage';
import DashboardPage from './pages/DashboardPage';
import TransparencyPage from './pages/TransparencyPage';
import FuturePage from './pages/FuturePage';
import SponsorPage from './pages/SponsorPage';
import ReachPage from './pages/ReachPage';

/**
 * ScrollToTop helper: scrolls window back to (0, 0) on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <span className="text-6xl mb-4 block" role="img" aria-label="Forest leaf">
        🍃
      </span>
      <h1 className="font-hand text-6xl font-bold text-moss-900">404</h1>
      <p className="font-serif text-lg text-charcoal-700 mt-2 italic">
        The forest canopy is dense here. We couldn&apos;t find this page.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-xl bg-moss-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-xs"
      >
        Return to Tuki&apos;s Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/wildlife" element={<WildlifePage />} />
          <Route path="/reach" element={<ReachPage />} />
          <Route path="/wildlife/:species" element={<HomeProfile />} />
          <Route path="/action" element={<ActionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/future" element={<FuturePage />} />
          <Route path="/sponsor" element={<SponsorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
