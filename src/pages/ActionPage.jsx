import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '../i18n';
import {
  WatercolorCard,
  PartnerCTA,
  DonationDisclaimer,
  PaperTexture,
} from '../components';

export default function ActionPage() {
  return (
    <div className="relative min-h-screen py-12 sm:py-20">
      <PaperTexture intensity={0.32} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-900 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            Direct Conservation Action
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl font-bold text-moss-900 leading-tight">
            You have a choice. The forest cannot wait.
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-charcoal-700 italic leading-snug">
            {t('story.choice_text')}
          </p>

          <p className="text-sm text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            H.O.M.E. is an open evidence and storytelling interface. We never collect or handle financial donations. Every action here connects you directly to vetted field organizations on the ground in Borneo.
          </p>
        </header>

        {/* 4 Large Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ACTION 1: RESCUE */}
          <WatercolorCard variant="warm" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                <span className="text-xs font-serif uppercase tracking-wider text-amber-800 font-bold">
                  Action Path 01 &bull; Veterinary &amp; Rapid Evacuation
                </span>
                <span className="text-3xl" role="img" aria-label="Rescue cross">
                  🩺
                </span>
              </div>

              <h2 className="font-hand text-4xl font-bold text-charcoal-900">
                {t('actions.rescue.title')}
              </h2>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {t('actions.rescue.desc')} When peat fires surround fragmented forest patches, wildlife may be at severe risk of smoke inhalation, severe scale or palm burns, and dehydration. Field rescue teams provide urgent medical treatment and safe translocations.
              </p>

              <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200 text-xs text-amber-900">
                <strong>Ground reality:</strong> Evacuation is the last line of defense when habitat corridors become impassable due to subterranean peat embers.
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-paper-edge space-y-4">
              <PartnerCTA
                partner="International Animal Rescue (YIARI)"
                action="Deploy Rapid Orangutan & Wildlife Medical Teams"
                label="Support YIARI Rescue Teams"
                url="https://www.internationalanimalrescue.org/"
                context="Directly support veterinarians and field responders operating in Ketapang, West Kalimantan."
              />

              <PartnerCTA
                partner="Borneo Orangutan Survival (BOS) Foundation"
                action="Emergency Evacuation & Peat Fire Response"
                label="Support BOS Foundation Rescue"
                url="https://orangutan.org/"
                context="Provide medical supplies, intensive burn clinics, and transit care for rescued animals in Nyaru Menteng."
              />
            </div>
          </WatercolorCard>

          {/* ACTION 2: PROTECT */}
          <WatercolorCard variant="cool" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                <span className="text-xs font-serif uppercase tracking-wider text-moss-800 font-bold">
                  Action Path 02 &bull; Peatland Corridors &amp; Land Tenure
                </span>
                <span className="text-3xl" role="img" aria-label="Shield">
                  🛡️
                </span>
              </div>

              <h2 className="font-hand text-4xl font-bold text-charcoal-900">
                {t('actions.protect.title')}
              </h2>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {t('actions.protect.desc')} Preventing a fire is ten times more effective than fighting a burning peat dome. Protecting intact peat forests keeps the water table high, preventing the subsurface dry-out that turns tropical rainforest into fuel.
              </p>

              <div className="rounded-xl bg-moss-50/80 p-3.5 border border-moss-200 text-xs text-moss-900">
                <strong>Ground reality:</strong> Canal blocking and rewetting peat soils ensures deep subterranean organic matter cannot ignite.
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-paper-edge space-y-4">
              <PartnerCTA
                partner="Conservation International"
                action="Safeguard Critical Peat Swamp Corridors"
                label="Protect Forest Hectares"
                url="https://www.conservation.org/"
                context="Help finance indigenous community forest patrols and boundary demarcation in Central Kalimantan."
              />

              <PartnerCTA
                partner="Borneo Orangutan Survival (BOS) Foundation"
                action="Rewet &amp; Defend Mawas Peat Reserve"
                label="Defend Mawas Peatland"
                url="https://orangutan.org/"
                context="The Mawas conservation area holds over 3,000 wild orangutans across 300,000 hectares of critical peat swamp."
              />
            </div>
          </WatercolorCard>

          {/* ACTION 3: WATCH */}
          <WatercolorCard variant="warm" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                <span className="text-xs font-serif uppercase tracking-wider text-amber-800 font-bold">
                  Action Path 03 &bull; Open Science &amp; Satellite Vigil
                </span>
                <span className="text-3xl" role="img" aria-label="Satellite">
                  🛰️
                </span>
              </div>

              <h2 className="font-hand text-4xl font-bold text-charcoal-900">
                {t('actions.watch.title')}
              </h2>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {t('actions.watch.desc')} Public transparency keeps environmental oversight honest. Anyone with a browser can monitor VIIRS active thermal anomalies, track fire frequency near national parks, and ensure no fire signal is ignored.
              </p>

              <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200 text-xs text-amber-900">
                <strong>Ground reality:</strong> Satellite detections alert local ranger posts within 3 hours of sensor overpass, allowing early containment.
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-paper-edge space-y-4">
              <PartnerCTA
                partner="NASA FIRMS"
                action="Inspect Real-Time VIIRS &amp; MODIS Thermal Overpasses"
                label="Launch NASA FIRMS Viewer"
                url="https://firms.modaps.eosdis.nasa.gov/"
                context="Free, public access to satellite fire telemetry covering the entire Indo-Malayan archipelago."
              />

              <PartnerCTA
                partner="NASA Earth Observatory"
                action="Examine Satellite Imagery of Peat Plumes"
                label="Read NASA EO Fire Reports"
                url="https://earthobservatory.nasa.gov/"
                context="Access scientific analysis, aerosol optical depth maps, and multi-spectral burn severity imagery."
              />
            </div>
          </WatercolorCard>

          {/* ACTION 4: RESTORE */}
          <WatercolorCard variant="cool" className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-paper-edge pb-3">
                <span className="text-xs font-serif uppercase tracking-wider text-moss-800 font-bold">
                  Action Path 04 &bull; Canopy Regeneration &amp; Peat Rewetting
                </span>
                <span className="text-3xl" role="img" aria-label="Sprout">
                  🌱
                </span>
              </div>

              <h2 className="font-hand text-4xl font-bold text-charcoal-900">
                {t('actions.restore.title')}
              </h2>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {t('actions.restore.desc')} Once the fires are extinguished, the slow work of healing begins. Peat must be re-hydrated by blocking drainage canals, and pioneer native trees (like Balangeran and Jelutung) must be hand-planted to rebuild high fruiting canopies.
              </p>

              <div className="rounded-xl bg-moss-50/80 p-3.5 border border-moss-200 text-xs text-moss-900">
                <strong>Ground reality:</strong> Peat regrowth requires 10 to 15 years before native fruit-bearing canopy trees support great ape foraging.
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-paper-edge space-y-4">
              <PartnerCTA
                partner="Mongabay Environmental News"
                action="Follow Investigative Peatland Restoration Reporting"
                label="Explore Mongabay Coverage"
                url="https://news.mongabay.com/"
                context="Independent environmental reporting examining field restoration projects, successes, and ongoing challenges in Kalimantan."
              />

              <PartnerCTA
                partner="Yayasan IAR Indonesia (YIARI)"
                action="Reforest Degraded Orangutan Corridors"
                label="Support Tree Replanting"
                url="https://www.internationalanimalrescue.org/"
                context="Community nurseries grow tens of thousands of endemic seedlings to reconnect isolated forest parcels."
              />
            </div>
          </WatercolorCard>
        </div>

        {/* Closing Notice & Transparency Link */}
        <div className="paper-card rounded-2xl p-6 sm:p-8 border border-paper-edge text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-hand text-3xl font-bold text-charcoal-900">
            Every action matters when the ground is dry.
          </h3>
          <p className="text-sm text-charcoal-700 leading-relaxed">
            Want to see how every fire detection is calculated and verified before supporting a partner?
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/map"
              className="rounded-lg bg-moss-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-xs"
            >
              Explore Live Fire Map &rarr;
            </Link>
            <Link
              to="/transparency"
              className="rounded-lg border border-paper-edge bg-cream-100 px-5 py-2.5 text-sm font-semibold text-charcoal-800 hover:bg-cream-200 transition-colors"
            >
              Our Transparency Standards &rarr;
            </Link>
          </div>

          <div className="pt-4 border-t border-paper-edge">
            <DonationDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
