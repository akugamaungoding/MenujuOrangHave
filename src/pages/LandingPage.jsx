import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { t, useTranslation } from '../i18n';
import { useFireData, useSpeciesData } from '../hooks';
import { SOURCES } from '../sources';
import {
  ScrollChapter,
  BurnTransition,
  ColorReturn,
  CharacterCard,
  PartnerCTA,
  WatercolorCard,
  DonationDisclaimer,
  StatusBadge,
  PaperTexture,
} from '../components';

export default function LandingPage() {
  useTranslation();
  const { fireEvents, loading: fireLoading } = useFireData();
  const { species: speciesList } = useSpeciesData();

  // Color return bloom state
  const [colorRevived, setColorRevived] = useState(false);
  const [activeChapter, setActiveChapter] = useState('cover');

  // Parallax scroll position
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fireCount = fireEvents?.length || 0;
  const highConfidenceCount = fireEvents?.filter(
    (f) => f.confidence === 'high' || f.confidence === 'h'
  ).length || 0;

  // 5 storybook characters
  const characters = [
    {
      species: 'orangutan',
      name: t('characters.orangutan.name'),
      speciesName: t('characters.orangutan.species'),
      scientific: t('characters.orangutan.scientific'),
      desc: t('story.tuki_desc'),
      iucnStatus: 'CR',
      slug: 'orangutan',
    },
    {
      species: 'pangolin',
      name: t('characters.pangolin.name'),
      speciesName: t('characters.pangolin.species'),
      scientific: t('characters.pangolin.scientific'),
      desc: t('story.liku_desc'),
      iucnStatus: 'CR',
      slug: 'pangolin',
    },
    {
      species: 'sunbear',
      name: t('characters.sunbear.name'),
      speciesName: t('characters.sunbear.species'),
      scientific: t('characters.sunbear.scientific'),
      desc: t('story.madu_desc'),
      iucnStatus: 'VU',
      slug: 'sunbear',
    },
    {
      species: 'mousedeer',
      name: t('characters.mousedeer.name'),
      speciesName: t('characters.mousedeer.species'),
      scientific: t('characters.mousedeer.scientific'),
      desc: t('story.kecil_desc'),
      iucnStatus: 'LC',
      slug: 'mousedeer',
    },
    {
      species: 'hornbill',
      name: t('characters.hornbill.name'),
      speciesName: t('characters.hornbill.species'),
      scientific: t('characters.hornbill.scientific'),
      desc: t('story.rangkong_desc'),
      iucnStatus: 'CR',
      slug: 'hornbill',
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* =========================================================================
          CHAPTER 1: COVER — "This is Tuki's home."
          ========================================================================= */}
      <ScrollChapter
        id="chapter-cover"
        bgVariant="cream"
        onEnter={() => setActiveChapter('cover')}
        className="relative flex flex-col justify-center items-center text-center min-h-screen pt-20 pb-16 overflow-hidden"
      >
        {/* Parallax Forest Art Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url('/assets/art/forest-home.svg')`,
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            transform: `translateY(${scrollY * 0.18}px)`,
          }}
          aria-hidden="true"
        />

        <PaperTexture intensity={0.4} />

        <div className="relative z-10 max-w-4xl px-4 mx-auto flex flex-col items-center">
          {/* Chapter badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-moss-300 bg-moss-50/90 px-4 py-1 text-xs font-serif uppercase tracking-widest text-moss-800 shadow-xs mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-moss-600 animate-pulse" />
            Chapter I &middot; The Canopy
          </div>

          {/* Main Storybook Title */}
          <h1 className="font-hand text-5xl sm:text-7xl md:text-8xl font-bold text-moss-900 tracking-tight leading-none drop-shadow-xs">
            {t('story.cover_title')}
          </h1>

          <p className="mt-4 font-serif text-xl sm:text-2xl md:text-3xl text-charcoal-700 italic max-w-2xl leading-snug">
            {t('story.cover_subtitle')}
          </p>

          <p className="mt-6 text-base sm:text-lg text-charcoal-600 max-w-xl leading-relaxed">
            {t('story.meet_intro')}
          </p>

          {/* Key Call to Action buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#chapter-choice"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3.5 text-base font-semibold text-cream-50 shadow-md transition-all hover:from-amber-700 hover:to-amber-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {t('common.help_rescue')}
            </a>

            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-moss-600/40 bg-cream-50/80 px-6 py-3.5 text-base font-semibold text-moss-800 backdrop-blur-xs transition-colors hover:bg-moss-50 hover:border-moss-600 focus:outline-none focus:ring-2 focus:ring-moss-600"
            >
              <svg className="h-5 w-5 text-moss-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {t('common.explore_map')}
            </Link>

            <a
              href="#chapter-fire"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-amber-700 underline underline-offset-4 decoration-amber-400 transition-colors"
            >
              {t('common.see_fire_data')} &darr;
            </a>
          </div>

          {/* Gentle Scroll Indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-charcoal-500 animate-bounce">
            <span className="font-serif text-xs italic tracking-widest uppercase">Scroll to turn the page</span>
            <svg
              className="h-5 w-5 text-moss-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </ScrollChapter>

      {/* =========================================================================
          CHAPTER 2: MEET THE HOME — 5 Animal Characters
          ========================================================================= */}
      <ScrollChapter
        id="chapter-meet"
        bgVariant="forest"
        onEnter={() => setActiveChapter('meet')}
        className="py-24"
      >
        <PaperTexture intensity={0.3} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block rounded-full bg-moss-200/70 border border-moss-300 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-moss-800 mb-3">
              Chapter II &middot; The Forest Kin
            </span>
            <h2 className="font-hand text-4xl sm:text-6xl font-bold text-moss-900 tracking-tight">
              {t('story.meet_title')}
            </h2>
            <p className="mt-3 font-serif text-base sm:text-lg text-charcoal-700 italic">
              {t('story.meet_intro')}
            </p>
            <p className="mt-2 text-xs text-charcoal-500 font-medium">
              {t('common.illustrated_label')}
            </p>
          </div>

          {/* 5 Character Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {characters.map((char) => (
              <div key={char.species} className="w-full flex flex-col items-center">
                <CharacterCard
                  species={char.species}
                  name={char.name}
                  description={char.desc}
                  iucnStatus={char.iucnStatus}
                />
                <Link
                  to={`/wildlife/${char.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-moss-700 hover:text-moss-900 hover:underline"
                >
                  Explore {char.name}&apos;s story &amp; scientific profile &rarr;
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/wildlife"
              className="inline-flex items-center gap-2 rounded-lg border border-moss-600/30 bg-moss-50 px-5 py-2.5 text-sm font-semibold text-moss-800 hover:bg-moss-100 transition-colors"
            >
              View Full Wildlife Impact Panel &rarr;
            </Link>
          </div>
        </div>
      </ScrollChapter>

      {/* =========================================================================
          CHAPTER 3: THE FIRE COMES — Edge Burn & Thermal Signals
          ========================================================================= */}
      <ScrollChapter
        id="chapter-fire"
        bgVariant="burn"
        onEnter={() => setActiveChapter('fire')}
        className="py-24 relative overflow-hidden"
      >
        {/* Burning Forest Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `url('/assets/art/forest-burning.svg')`,
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          aria-hidden="true"
        />

        <BurnTransition className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="rounded-3xl border border-charcoal-700 bg-charcoal-900/90 text-cream-100 p-8 sm:p-14 shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-700 pb-6 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-400/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <span className="h-2 w-2 rounded-full bg-flame animate-ping" />
                Chapter III &middot; The Thermal Wave
              </span>

              <span className="text-xs text-cream-300/80 font-mono">
                Sensor: NASA VIIRS (375m) &bull; Near Real-Time
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <h2 className="font-hand text-4xl sm:text-6xl font-bold text-amber-300 leading-tight">
                  {t('story.fire_title')}
                </h2>

                <p className="font-serif text-xl sm:text-2xl text-cream-100 italic leading-snug">
                  &ldquo;{t('story.fire_text')}&rdquo;
                </p>

                <p className="text-sm sm:text-base text-cream-300 leading-relaxed">
                  {t('story.fire_text2')}
                </p>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    to="/map"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-flame px-6 py-3 text-sm font-semibold text-charcoal-950 shadow-md hover:from-amber-400 hover:to-orange-500 transition-all"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {t('common.see_fire_data')}
                  </Link>

                  <a
                    href="#chapter-evidence"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cream-400/30 px-5 py-3 text-sm font-medium text-cream-200 hover:bg-cream-100/10 transition-colors"
                  >
                    View Satellite Evidence &darr;
                  </a>
                </div>
              </div>

              {/* Fire Stats Box */}
              <div className="lg:col-span-5 bg-charcoal-950/80 rounded-2xl border border-amber-500/30 p-6 space-y-6">
                <div className="border-b border-charcoal-800 pb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-400">
                    Live Fire Detections
                  </span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-hand text-5xl font-bold text-amber-400">
                      {fireLoading ? '...' : fireCount}
                    </span>
                    <span className="text-xs text-cream-300 font-medium">
                      active thermal hotspots
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-cream-400 block mb-1">High Confidence</span>
                    <span className="font-semibold text-amber-300 text-lg">
                      {fireLoading ? '...' : highConfidenceCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block mb-1">Time Horizon</span>
                    <span className="font-semibold text-cream-200 text-lg">
                      Last 48 Hours
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-charcoal-900 border border-charcoal-800 p-3 text-[11px] text-cream-400 leading-tight">
                  <span className="text-amber-400 font-semibold block mb-0.5">Scientific note:</span>
                  Hotspot detections indicate thermal anomalies, not confirmed animal casualties. We track habitat exposure.
                </div>
              </div>
            </div>
          </div>
        </BurnTransition>
      </ScrollChapter>

      {/* =========================================================================
          CHAPTER 4: THE EVIDENCE — Map Preview & Verified Levels
          ========================================================================= */}
      <ScrollChapter
        id="chapter-evidence"
        bgVariant="cream"
        onEnter={() => setActiveChapter('evidence')}
        className="py-24"
      >
        <PaperTexture intensity={0.35} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-cream-200 border border-paper-edge px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-charcoal-700 mb-3">
              Chapter IV &middot; The Satellite Record
            </span>
            <h2 className="font-hand text-4xl sm:text-6xl font-bold text-charcoal-900 tracking-tight">
              {t('story.evidence_title')}
            </h2>
            <p className="mt-3 font-serif text-lg text-charcoal-700 italic">
              {t('story.evidence_text')}
            </p>
          </div>

          {/* Interactive Map Preview Card */}
          <div className="paper-card rounded-2xl p-6 sm:p-8 border border-paper-edge space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-hand text-2xl font-bold text-moss-900">
                  Kalimantan Fire &amp; Habitat Boundary Preview
                </h3>
                <p className="text-xs text-charcoal-500">
                  Overlaid with 5 designated national park reserves and 5 species ranges.
                </p>
              </div>

              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-xl bg-moss-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-xs"
              >
                {t('common.explore_map')} &rarr;
              </Link>
            </div>

            {/* Simulated interactive mini map box */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-xl border-2 border-paper-edge bg-charcoal-900 flex flex-col justify-between p-6">
              {/* Subtle map grid lines */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #4A7C59 1px, transparent 1px), linear-gradient(to bottom, #4A7C59 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-charcoal-950/80 backdrop-blur-xs rounded-lg px-3 py-1.5 border border-charcoal-700 text-xs text-cream-200">
                  <span className="font-semibold text-amber-400">Center:</span> Kalimantan [112.5&deg;E, 0.0&deg;N]
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2.5 py-1 text-[11px] font-medium text-amber-300 border border-amber-400/30">
                    &bull; Active VIIRS Hotspots
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-moss-500/20 px-2.5 py-1 text-[11px] font-medium text-moss-300 border border-moss-400/30">
                    &bull; WDPA Reserves
                  </span>
                </div>
              </div>

              <div className="relative z-10 text-center space-y-2">
                <p className="font-hand text-3xl sm:text-4xl text-cream-50 font-bold">
                  {fireCount} Satellite Detections Loaded
                </p>
                <p className="text-xs text-cream-300 max-w-md mx-auto">
                  Click through to explore precise coordinates, brightness temperature, confidence levels, and peat swamp overlap.
                </p>
              </div>

              <div className="relative z-10 flex justify-center">
                <Link
                  to="/map"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-charcoal-950 hover:bg-amber-400 transition-colors shadow-md"
                >
                  Launch Fullscreen Map Viewer &rarr;
                </Link>
              </div>
            </div>

            {/* Evidence Levels Grid */}
            <div className="pt-4 border-t border-paper-edge">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-4">
                Transparent Evidence Standard
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-cream-50 border border-paper-edge text-xs">
                  <span className="font-semibold text-moss-800 block">
                    {t('evidence_levels.verified_rescue.label')}
                  </span>
                  <span className="text-charcoal-600 text-[11px]">
                    {t('evidence_levels.verified_rescue.desc')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-cream-50 border border-paper-edge text-xs">
                  <span className="font-semibold text-moss-800 block">
                    {t('evidence_levels.range_overlap.label')}
                  </span>
                  <span className="text-charcoal-600 text-[11px]">
                    {t('evidence_levels.range_overlap.desc')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-cream-50 border border-paper-edge text-xs">
                  <span className="font-semibold text-moss-800 block">
                    {t('evidence_levels.fire_detection.label')}
                  </span>
                  <span className="text-charcoal-600 text-[11px]">
                    {t('evidence_levels.fire_detection.desc')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-cream-50 border border-paper-edge text-xs">
                  <span className="font-semibold text-moss-800 block">
                    {t('evidence_levels.burned_area.label')}
                  </span>
                  <span className="text-charcoal-600 text-[11px]">
                    {t('evidence_levels.burned_area.desc')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs sm:col-span-2">
                  <span className="font-semibold text-amber-900 block">
                    {t('evidence_levels.needs_verification.label')}
                  </span>
                  <span className="text-amber-800 text-[11px]">
                    {t('evidence_levels.needs_verification.desc')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollChapter>

      {/* =========================================================================
          CHAPTER 5: THE CHOICE — 4 Action Cards
          ========================================================================= */}
      <ScrollChapter
        id="chapter-choice"
        bgVariant="cream"
        onEnter={() => setActiveChapter('choice')}
        className="py-24"
      >
        <PaperTexture intensity={0.3} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-900 mb-3">
              Chapter V &middot; The Human Branch
            </span>
            <h2 className="font-hand text-4xl sm:text-6xl font-bold text-moss-900 tracking-tight">
              {t('story.choice_title')}
            </h2>
            <p className="mt-3 font-serif text-lg text-charcoal-700 italic">
              {t('story.choice_text')}
            </p>
          </div>

          {/* 4 Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: RESCUE */}
            <div
              onMouseEnter={() => setColorRevived(true)}
              onClick={() => setColorRevived(true)}
            >
              <WatercolorCard variant="warm" className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-serif uppercase tracking-widest text-amber-800 font-bold">
                      Path 1 &middot; Active Response
                    </span>
                    <span className="text-2xl" role="img" aria-label="Rescue">
                      🩺
                    </span>
                  </div>
                  <h3 className="font-hand text-3xl font-bold text-charcoal-900">
                    {t('actions.rescue.title')}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-700 leading-relaxed">
                    {t('actions.rescue.desc')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-paper-edge space-y-3">
                  <PartnerCTA
                    partner="International Animal Rescue (YIARI)"
                    action="Support Wildlife Rescue Team"
                    label="Support Rescue Directly"
                    url="https://www.internationalanimalrescue.org/"
                    context="Teams deploy when fire traps animals in degraded peat swamps."
                  />
                </div>
              </WatercolorCard>
            </div>

            {/* Card 2: PROTECT */}
            <div
              onMouseEnter={() => setColorRevived(true)}
              onClick={() => setColorRevived(true)}
            >
              <WatercolorCard variant="cool" className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
                      Path 2 &middot; Habitat Defence
                    </span>
                    <span className="text-2xl" role="img" aria-label="Protect">
                      🛡️
                    </span>
                  </div>
                  <h3 className="font-hand text-3xl font-bold text-charcoal-900">
                    {t('actions.protect.title')}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-700 leading-relaxed">
                    {t('actions.protect.desc')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-paper-edge space-y-3">
                  <PartnerCTA
                    partner="Borneo Orangutan Survival (BOS) Foundation"
                    action="Defend Critical Peat Corridors"
                    label="Back BOS Foundation"
                    url="https://orangutan.org/"
                    context="Guard unburnt forest islands against illegal peat drainage and fire spread."
                  />
                </div>
              </WatercolorCard>
            </div>

            {/* Card 3: WATCH */}
            <div
              onMouseEnter={() => setColorRevived(true)}
              onClick={() => setColorRevived(true)}
            >
              <WatercolorCard variant="warm" className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-serif uppercase tracking-widest text-amber-800 font-bold">
                      Path 3 &middot; Open Satellite Vigil
                    </span>
                    <span className="text-2xl" role="img" aria-label="Watch">
                      🛰️
                    </span>
                  </div>
                  <h3 className="font-hand text-3xl font-bold text-charcoal-900">
                    {t('actions.watch.title')}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-700 leading-relaxed">
                    {t('actions.watch.desc')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-paper-edge space-y-3">
                  <PartnerCTA
                    partner="NASA FIRMS"
                    action="Explore Open Fire Data"
                    label="View NASA Hotspots"
                    url="https://firms.modaps.eosdis.nasa.gov/"
                    context="Inspect raw VIIRS and MODIS fire detection streams directly."
                  />
                </div>
              </WatercolorCard>
            </div>

            {/* Card 4: RESTORE */}
            <div
              onMouseEnter={() => setColorRevived(true)}
              onClick={() => setColorRevived(true)}
            >
              <WatercolorCard variant="cool" className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
                      Path 4 &middot; Canopy Rebirth
                    </span>
                    <span className="text-2xl" role="img" aria-label="Restore">
                      🌱
                    </span>
                  </div>
                  <h3 className="font-hand text-3xl font-bold text-charcoal-900">
                    {t('actions.restore.title')}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-700 leading-relaxed">
                    {t('actions.restore.desc')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-paper-edge space-y-3">
                  <PartnerCTA
                    partner="Mongabay Environmental Reporting"
                    action="Read Kalimantan Field Dispatches"
                    label="Read on Mongabay"
                    url="https://news.mongabay.com/"
                    context="Learn what restoration works from independent on-the-ground journalists."
                  />
                </div>
              </WatercolorCard>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/action"
              className="inline-flex items-center gap-2 rounded-xl bg-moss-700 px-6 py-3.5 text-base font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-md"
            >
              Explore Full Action Directory &rarr;
            </Link>
          </div>
        </div>
      </ScrollChapter>

      {/* =========================================================================
          CHAPTER 6: COLOR RETURNS — Hope Blooms Back
          ========================================================================= */}
      <ScrollChapter
        id="chapter-return"
        bgVariant="restored"
        onEnter={() => {
          setActiveChapter('return');
          setColorRevived(true);
        }}
        className="py-24 relative overflow-hidden"
      >
        <PaperTexture intensity={0.25} />

        {/* Restored forest art background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url('/assets/art/forest-restored.svg')`,
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          aria-hidden="true"
        />

        <ColorReturn triggered={colorRevived} duration={2000} className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6 paper-card-deckle p-8 sm:p-14 rounded-3xl border border-moss-300 bg-paper-warm/95 shadow-xl">
            <span className="inline-block rounded-full bg-moss-100 border border-moss-300 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-moss-800">
              Chapter VI &middot; The Green Return
            </span>

            <h2 className="font-hand text-5xl sm:text-7xl font-bold text-moss-900 leading-tight">
              {t('story.return_title')}
            </h2>

            <p className="font-serif text-xl sm:text-3xl text-moss-800 italic max-w-2xl mx-auto leading-relaxed">
              &ldquo;{t('story.return_text')}&rdquo;
            </p>

            <p className="text-sm sm:text-base text-charcoal-700 max-w-xl mx-auto leading-relaxed">
              Every protected hectare keeps a canopy bridge intact. When you choose to protect, monitor, or support field teams, the charcoal gives way to green.
            </p>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-moss-700 px-6 py-3.5 text-base font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-md"
              >
                Watch a Home Territory &rarr;
              </Link>
              <Link
                to="/action"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-moss-600 bg-cream-100 px-6 py-3.5 text-base font-semibold text-moss-900 hover:bg-cream-200 transition-colors"
              >
                {t('common.help_rescue')}
              </Link>
            </div>
          </div>
        </ColorReturn>
      </ScrollChapter>

      {/* =========================================================================
          CHAPTER 7: THE PROOF — Data Freshness & Verified Sources
          ========================================================================= */}
      <ScrollChapter
        id="chapter-proof"
        bgVariant="cream"
        onEnter={() => setActiveChapter('proof')}
        className="py-24"
      >
        <PaperTexture intensity={0.35} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-cream-200 border border-paper-edge px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-charcoal-700 mb-3">
              Chapter VII &middot; The Open Ledger
            </span>
            <h2 className="font-hand text-4xl sm:text-6xl font-bold text-charcoal-900 tracking-tight">
              {t('story.proof_title')}
            </h2>
            <p className="mt-3 font-serif text-lg text-charcoal-700 italic">
              {t('story.proof_text')}
            </p>
          </div>

          {/* Sources Status Badges Grid */}
          <div className="paper-card rounded-2xl p-6 sm:p-8 border border-paper-edge space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper-edge pb-4">
              <div>
                <h3 className="font-hand text-2xl font-bold text-moss-900">
                  Active Data Pipeline Status
                </h3>
                <p className="text-xs text-charcoal-500">
                  Every data point is tied to its originating satellite sensor or biological database.
                </p>
              </div>

              <Link
                to="/transparency"
                className="text-xs font-semibold text-moss-800 hover:underline"
              >
                Read full transparency charter &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOURCES.slice(0, 6).map((source) => (
                <div
                  key={source.id}
                  className="p-3.5 rounded-xl bg-cream-50 border border-paper-edge flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-charcoal-800">
                      {source.label}
                    </span>
                    <StatusBadge status="OK" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-charcoal-500">
                    <span>License: {source.license}</span>
                    <a
                      href={source.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-moss-700 hover:underline"
                    >
                      Source &nearr;
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-paper-edge">
              <DonationDisclaimer />
            </div>
          </div>

          {/* Final Call to Action Triad */}
          <div className="text-center pt-6 space-y-4">
            <h3 className="font-hand text-3xl font-bold text-moss-900">
              The forest cannot wait. Who will answer?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/action"
                className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3.5 text-base font-semibold text-cream-50 hover:from-amber-700 hover:to-amber-800 shadow-md transition-all"
              >
                {t('common.help_rescue')}
              </Link>
              <Link
                to="/map"
                className="rounded-xl border border-moss-700 bg-cream-50 px-6 py-3.5 text-base font-semibold text-moss-900 hover:bg-cream-100 transition-colors shadow-xs"
              >
                {t('common.explore_map')}
              </Link>
              <Link
                to="/transparency"
                className="rounded-xl border border-paper-edge bg-cream-50/70 px-5 py-3.5 text-sm font-medium text-charcoal-700 hover:bg-cream-100 transition-colors"
              >
                {t('nav.transparency')}
              </Link>
            </div>
          </div>
        </div>
      </ScrollChapter>
    </div>
  );
}
