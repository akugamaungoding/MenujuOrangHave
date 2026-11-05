import React, { useState } from 'react';
import { t } from '../i18n';
import {
  WatercolorCard,
  DonationDisclaimer,
  PaperTexture,
} from '../components';

const PLANNED_PRODUCTS = [
  {
    key: 'habitat_risk',
    titleKey: 'future.products.habitat_risk.title',
    descKey: 'future.products.habitat_risk.desc',
    icon: '📊',
    timeline: 'Q2 2025',
    audience: 'Conservation NGOs & Field Stations',
    details: 'Automated monthly risk indices assessing peat moisture anomalies, proximity to illegal drainage canals, and historical burn return intervals.',
  },
  {
    key: 'fire_api',
    titleKey: 'future.products.fire_api.title',
    descKey: 'future.products.fire_api.desc',
    icon: '⚡',
    timeline: 'Q3 2025',
    audience: 'Academic Researchers & Data Scientists',
    details: 'RESTful and GeoJSON programmatic endpoints streaming filtered VIIRS/MODIS fire signals overlaid with IUCN distribution polygons and WDPA reserve buffers.',
  },
  {
    key: 'restoration',
    titleKey: 'future.products.restoration.title',
    descKey: 'future.products.restoration.desc',
    icon: '🌱',
    timeline: 'Q4 2025',
    audience: 'Reforestation Partners & Donors',
    details: 'Multi-spectral satellite time series (Sentinel-2 NDVI and EVI) verifying vegetative canopy regrowth over burned peatland corridors across 5-year cycles.',
  },
  {
    key: 'corridor',
    titleKey: 'future.products.corridor.title',
    descKey: 'future.products.corridor.desc',
    icon: '🗺️',
    timeline: 'Q1 2026',
    audience: 'Wildlife Corridors Alliances',
    details: 'Landscape connectivity modeling evaluating whether orangutan and sun bear dispersal pathways between separated national parks remain contiguous.',
  },
  {
    key: 'esg',
    titleKey: 'future.products.esg.title',
    descKey: 'future.products.esg.desc',
    icon: '🏛️',
    timeline: 'Q2 2026',
    audience: 'ESG Auditing & Supply Chain Verifiers',
    details: 'High-assurance corporate supply chain verification detecting zero-deforestation violations and peat drainage fire events near concession boundaries.',
  },
];

export default function FuturePage() {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    org: '',
    interest: 'fire_api',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  return (
    <div className="relative min-h-screen py-12 sm:py-20">
      <PaperTexture intensity={0.3} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-moss-300 bg-moss-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-moss-800">
            <span className="h-2 w-2 rounded-full bg-moss-600 animate-pulse" />
            Ecosystem Data Pipeline
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl font-bold text-moss-900 leading-tight">
            {t('future.title')}
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-charcoal-700 italic">
            {t('future.subtitle')}
          </p>

          <p className="text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            The fire does not end when the smoke clears. To safeguard Kalimantan’s peat forests permanently, we are developing an open-access habitat archive connecting satellite telemetry directly to ecological interventions.
          </p>
        </header>

        {/* Planned Data Products Grid */}
        <section className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
              Development Roadmap
            </span>
            <h2 className="font-hand text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
              Upcoming Conservation Data Products
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PLANNED_PRODUCTS.map((prod) => (
              <WatercolorCard
                key={prod.key}
                variant={prod.key === 'fire_api' || prod.key === 'habitat_risk' ? 'warm' : 'cool'}
                className="flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-100 border border-moss-300 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-moss-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-moss-600" />
                      {t('future.planned_label')} &bull; {prod.timeline}
                    </span>
                    <span className="text-2xl" role="img" aria-label={prod.key}>
                      {prod.icon}
                    </span>
                  </div>

                  <h3 className="font-hand text-3xl font-bold text-charcoal-900">
                    {t(prod.titleKey)}
                  </h3>

                  <p className="text-sm font-medium text-charcoal-700">
                    {t(prod.descKey)}
                  </p>

                  <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
                    {prod.details}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-paper-edge flex items-center justify-between text-xs text-charcoal-500">
                  <span>Target: {prod.audience}</span>
                  <a
                    href={`mailto:partnerships@home-project.org?subject=Interest in ${encodeURIComponent(t(prod.titleKey))}`}
                    className="font-semibold text-moss-700 hover:text-moss-900 underline"
                  >
                    Partner on this &rarr;
                  </a>
                </div>
              </WatercolorCard>
            ))}
          </div>
        </section>

        {/* Partnership Inquiry Section */}
        <section className="paper-card-deckle rounded-3xl border border-paper-edge bg-paper-warm/95 p-8 sm:p-12 shadow-lg space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-serif uppercase tracking-widest text-amber-800 font-bold">
              Collaborate
            </span>
            <h2 className="font-hand text-4xl font-bold text-moss-900">
              Inquire About Data Partnerships
            </h2>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              Are you an environmental researcher, satellite remote-sensing laboratory, or conservation fund? We welcome collaborative data sharing and co-development.
            </p>
            <p className="text-xs text-moss-800 font-mono font-medium">
              Direct Contact: <a href="mailto:partnerships@home-project.org" className="underline">partnerships@home-project.org</a>
            </p>
          </div>

          {inquirySubmitted ? (
            <div className="p-8 rounded-2xl bg-moss-50 border border-moss-300 text-center space-y-3 animate-fadeIn">
              <span className="text-4xl">🕊️</span>
              <h3 className="font-hand text-3xl font-bold text-moss-900">
                Thank You for Reaching Out
              </h3>
              <p className="text-sm text-charcoal-700 max-w-md mx-auto">
                Your partnership inquiry has been received. Our data curation team will follow up directly at {formState.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full rounded-xl border border-paper-edge bg-cream-50 px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-moss-600"
                    placeholder="Dr. Maya Lin"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full rounded-xl border border-paper-edge bg-cream-50 px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-moss-600"
                    placeholder="maya@conservation-lab.org"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="org" className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    id="org"
                    value={formState.org}
                    onChange={(e) => setFormState({ ...formState, org: e.target.value })}
                    className="w-full rounded-xl border border-paper-edge bg-cream-50 px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-moss-600"
                    placeholder="University or NGO"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Area of Interest
                  </label>
                  <select
                    id="interest"
                    value={formState.interest}
                    onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                    className="w-full rounded-xl border border-paper-edge bg-cream-50 px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-moss-600"
                  >
                    <option value="fire_api">Fire Exposure API Access</option>
                    <option value="habitat_risk">Habitat Risk Assessment Report</option>
                    <option value="restoration">Post-Fire Restoration Satellite Tracking</option>
                    <option value="corridor">Wildlife Migration Corridor Monitoring</option>
                    <option value="esg">ESG &amp; Corporate Supply Chain Diligence</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-charcoal-700 mb-1">
                  How would you like to collaborate?
                </label>
                <textarea
                  id="message"
                  rows="3"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full rounded-xl border border-paper-edge bg-cream-50 px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-moss-600"
                  placeholder="Tell us about your research goals or data integration needs..."
                />
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="rounded-xl bg-moss-700 px-6 py-3 text-xs sm:text-sm font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-xs"
                >
                  Submit Partnership Inquiry &rarr;
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Global Footer Disclaimer */}
        <div className="pt-4 border-t border-paper-edge">
          <DonationDisclaimer />
        </div>
      </div>
    </div>
  );
}
