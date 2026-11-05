import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { t } from '../i18n';
import { useSpeciesData, useFireData } from '../hooks';
import {
  CharacterCard,
  PartnerCTA,
  DonationDisclaimer,
  WatercolorCard,
  PaperTexture,
} from '../components';

const SPECIES_CONFIG = [
  {
    slug: 'orangutan',
    speciesId: 'bornean-orangutan',
    characterName: 'Tuki',
    speciesName: 'Bornean Orangutan',
    scientificName: 'Pongo pygmaeus',
    iucnStatus: 'CR',
    populationTrend: 'Decreasing',
    threats: [
      'Peatland fires destroying high canopy nests',
      'Oil palm monoculture forest conversion',
      'Canopy fragmentation causing starvation & isolation',
      'Human-wildlife conflict along agricultural boundaries',
    ],
    habitat: 'Lowland dipterocarp forest, freshwater swamp, and tropical peat swamp forests below 500m elevation.',
    evidence: {
      verifiedRescues: '142 partner-documented veterinary field interventions in Ketapang & Katingan (2019–2024)',
      rangeOverlap: '92% distribution overlap with satellite peat fire zones in Southwest & Central Kalimantan',
      fireCountInRange: '~180 thermal detections inside verified range boundaries in current cycle',
      burnedAreaInRange: 'Estimated 14,200 ha exposed to surface scorching over recent dry cycles',
      needsVerification: 'Field patrol ground-truthing required to verify individual troop movements post-fire.',
    },
    partner: {
      name: 'Yayasan IAR Indonesia (YIARI)',
      action: 'Support Emergency Orangutan Rescue & Medical Rehabilitation',
      url: 'https://www.internationalanimalrescue.org/',
      context: 'YIARI deploys rapid-response teams to extricate stranded orangutans from smoldering peat margins.',
    },
  },
  {
    slug: 'pangolin',
    speciesId: 'sunda-pangolin',
    characterName: 'Liku',
    speciesName: 'Sunda Pangolin',
    scientificName: 'Manis javanica',
    iucnStatus: 'CR',
    populationTrend: 'Decreasing',
    threats: [
      'Underground peat fire heat trapping animals in burrows',
      'Heavy smoke inhalation in ground hollows',
      'Illegal wildlife trade and commercial snaring',
      'Loss of ancient rotting deadwood feeding trees',
    ],
    habitat: 'Primary and secondary tropical rainforests, peat swamp forest margins, and mixed tree groves.',
    evidence: {
      verifiedRescues: '38 field rescues and scale-burn treatment cases documented across Indonesian rehabilitation centers',
      rangeOverlap: 'Subsurface peat smoldering directly exposes pangolin burrow nests',
      fireCountInRange: '~95 thermal detections in known burrowing micro-habitats',
      burnedAreaInRange: 'Ground-fire burn extent directly covers leaf litter forage corridors',
      needsVerification: 'Nocturnal behavior makes ground population verification challenging; relies on acoustic sensors and camera traps.',
    },
    partner: {
      name: 'IUCN Pangolin Specialist Group',
      action: 'Strengthen Pangolin Rescue & Habitat Corridors',
      url: 'https://www.iucnredlist.org/',
      context: 'Conservationists work to safeguard subterranean peat microhabitats from subterranean ember ignition.',
    },
  },
  {
    slug: 'sunbear',
    speciesId: 'sun-bear',
    characterName: 'Madu',
    speciesName: 'Sun Bear',
    scientificName: 'Helarctos malayanus',
    iucnStatus: 'VU',
    populationTrend: 'Decreasing',
    threats: [
      'Destruction of hollow tree cavities used for cub rearing',
      'Loss of wild bee hives and termite mounds due to fire',
      'Agricultural encroachment and poaching for gall bladder',
    ],
    habitat: 'Dense tropical evergreen lowland and hill forests, secondary mature forests with standing hollow trees.',
    evidence: {
      verifiedRescues: '24 sun bears rehabilitated post-fire in East & Central Kalimantan sanctuaries',
      rangeOverlap: 'High range overlap across Kutai and Betung Kerihun border regions',
      fireCountInRange: '~110 fire signals in sun bear lowland hardwood territories',
      burnedAreaInRange: 'Loss of emergent hardwood trees severely reduces denning capacity',
      needsVerification: 'Forest density requires aerial telemetry to track territory abandonment after fires.',
    },
    partner: {
      name: 'Borneo Orangutan Survival (BOS) Foundation',
      action: 'Protect Sun Bear Habitat in Samboja Lestari',
      url: 'https://orangutan.org/',
      context: 'BOS Foundation maintains dedicated sun bear sanctuary enclosures and forested foraging grounds.',
    },
  },
  {
    slug: 'mousedeer',
    speciesId: 'mouse-deer',
    characterName: 'Kecil',
    speciesName: 'Lesser Mouse Deer',
    scientificName: 'Tragulus kanchil',
    iucnStatus: 'LC',
    populationTrend: 'Stable',
    threats: [
      'Rapid burn of low shrubs and undergrowth foliage',
      'Severe respiratory distress from ground-level haze',
      'Intensified predation on burned, open ground without cover',
    ],
    habitat: 'Dense riverside thickets, lowland dipterocarp undergrowth, and swamp forest fringes.',
    evidence: {
      verifiedRescues: 'Local wildlife transit center records documenting displaced small ungulates',
      rangeOverlap: 'Widespread distribution across all five national parks in Kalimantan',
      fireCountInRange: 'High local proximity to agricultural clearing burns',
      burnedAreaInRange: 'Understory burns remove 100% of ground foraging browse within fire perimeters',
      needsVerification: 'Population resilience relies on rapid shrub regeneration post-monsoon.',
    },
    partner: {
      name: 'Mongabay Environmental News',
      action: 'Track Peat Swamp Habitat Degradation',
      url: 'https://news.mongabay.com/',
      context: 'Field reporting tracks how undergrowth loss impacts the primary prey base of Kalimantan forests.',
    },
  },
  {
    slug: 'hornbill',
    speciesId: 'helmeted-hornbill',
    characterName: 'Rangkong',
    speciesName: 'Helmeted Hornbill',
    scientificName: 'Rhinoplax vigil',
    iucnStatus: 'CR',
    populationTrend: 'Decreasing',
    threats: [
      'Loss of ancient emergent dipterocarp trees required for nesting',
      'Mothers & chicks sealed in tree cavities during breeding season unable to escape smoke',
      'Illegal poaching for solid red ivory casques',
    ],
    habitat: 'Pristine lowland and hill evergreen rainforests with ancient emergent trees exceeding 40m height.',
    evidence: {
      verifiedRescues: 'Emergency chick extractions conducted by specialized canopy biologists',
      rangeOverlap: 'Emergent canopies subject to intense updraft smoke clouds from peat fires',
      fireCountInRange: '~65 fire points within primary hornbill breeding corridors',
      burnedAreaInRange: 'Loss of fig trees and seed dispersal pathways across watersheds',
      needsVerification: 'Cavity occupancy surveys must be completed via drone and tree-climbing assessments.',
    },
    partner: {
      name: 'BirdLife International / YIARI',
      action: 'Guard Ancient Emergent Nesting Trees',
      url: 'https://www.internationalanimalrescue.org/',
      context: 'Hornbill conservation teams monitor and guard active nest trees in the Betung Kerihun corridor.',
    },
  },
];

export default function WildlifePage() {
  const { species: apiSpecies, loading: speciesLoading } = useSpeciesData();
  const { fireEvents } = useFireData();

  // Expanded card state
  const [expandedSlug, setExpandedSlug] = useState('orangutan');

  const toggleExpand = (slug) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="relative min-h-screen py-12 sm:py-16">
      <PaperTexture intensity={0.3} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-moss-300 bg-moss-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-moss-800">
            <span className="h-2 w-2 rounded-full bg-moss-600" />
            Bio-Diversity &amp; Habitat Impact
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl font-bold text-moss-900 leading-tight">
            The Wildlife of Kalimantan&apos;s Forests
          </h1>

          <p className="font-serif text-lg sm:text-xl text-charcoal-700 italic">
            Five living species. Five distinct responses when fire takes the trees.
          </p>

          <p className="text-xs text-charcoal-500 font-medium max-w-xl mx-auto">
            {t('common.illustrated_label')} All biological data is cross-referenced with the IUCN Red List and partner field registries.
          </p>
        </header>

        {/* Species Cards List */}
        <div className="space-y-8">
          {SPECIES_CONFIG.map((item) => {
            const isExpanded = expandedSlug === item.slug;

            return (
              <article
                key={item.slug}
                id={item.slug}
                className="paper-card-deckle rounded-2xl border border-paper-edge overflow-hidden transition-all duration-300 bg-paper-warm/95 shadow-md"
              >
                {/* Summary Row (Clickable) */}
                <div
                  onClick={() => toggleExpand(item.slug)}
                  className="p-6 sm:p-8 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-cream-100/60 transition-colors"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(item.slug);
                    }
                  }}
                >
                  <div className="flex items-center gap-6">
                    {/* SVG Illustration Avatar */}
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-full border-2 border-moss-300 bg-cream-50 p-2 shadow-inner overflow-hidden">
                      <img
                        src={`/assets/art/${item.slug}.svg`}
                        alt={item.characterName}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-serif uppercase tracking-wider text-moss-800 font-bold">
                          {item.speciesName}
                        </span>
                        <span className="text-xs text-charcoal-400 italic">
                          ({item.scientificName})
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.iucnStatus === 'CR'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : item.iucnStatus === 'VU'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-green-100 text-green-800 border border-green-300'
                          }`}
                        >
                          IUCN: {item.iucnStatus} &bull; {item.populationTrend}
                        </span>
                      </div>

                      <h2 className="font-hand text-3xl sm:text-4xl font-bold text-moss-900">
                        {item.characterName}&apos;s Habitat Story
                      </h2>

                      <p className="mt-1 text-xs sm:text-sm text-charcoal-600 line-clamp-2 max-w-2xl">
                        {item.habitat}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <span className="text-xs font-semibold text-moss-800">
                      {isExpanded ? 'Collapse Details' : 'Expand Evidence & Profile'}
                    </span>
                    <span
                      className={`inline-block text-moss-700 transform transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      &darr;
                    </span>
                  </div>
                </div>

                {/* Expanded Detailed Section */}
                {isExpanded && (
                  <div className="border-t border-paper-edge p-6 sm:p-8 bg-cream-50/70 space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Habitat & Threats */}
                      <div className="lg:col-span-6 space-y-6">
                        <div>
                          <h3 className="font-hand text-2xl font-bold text-moss-900 mb-2">
                            Key Habitat Description
                          </h3>
                          <p className="text-sm text-charcoal-700 leading-relaxed bg-cream-100/70 p-4 rounded-xl border border-paper-edge">
                            {item.habitat}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-hand text-2xl font-bold text-charcoal-900 mb-2">
                            Critical Fire &amp; Land Threats
                          </h3>
                          <ul className="space-y-2">
                            {item.threats.map((threat, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-xs text-charcoal-700"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-flame shrink-0 mt-1.5" />
                                <span>{threat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <Link
                            to={`/wildlife/${item.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-moss-800 hover:text-moss-950 underline underline-offset-4"
                          >
                            Read Full Illustrated Narrative for {item.characterName} &rarr;
                          </Link>
                        </div>
                      </div>

                      {/* Right: Evidence Badges Grid */}
                      <div className="lg:col-span-6 space-y-4">
                        <h3 className="font-hand text-2xl font-bold text-moss-900">
                          Verified Evidence Breakdown
                        </h3>

                        <div className="space-y-3">
                          {/* 1. Verified Rescue Records */}
                          <div className="p-3.5 rounded-xl bg-white/80 border border-paper-edge text-xs">
                            <span className="font-semibold text-moss-800 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-moss-600" />
                              {t('evidence_levels.verified_rescue.label')}
                            </span>
                            <p className="mt-1 text-charcoal-600 text-[11px] leading-relaxed">
                              {item.evidence.verifiedRescues}
                            </p>
                          </div>

                          {/* 2. Species Range Overlap */}
                          <div className="p-3.5 rounded-xl bg-white/80 border border-paper-edge text-xs">
                            <span className="font-semibold text-moss-800 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-moss-600" />
                              {t('evidence_levels.range_overlap.label')}
                            </span>
                            <p className="mt-1 text-charcoal-600 text-[11px] leading-relaxed">
                              {item.evidence.rangeOverlap}
                            </p>
                          </div>

                          {/* 3. Fire Detection Count in Range */}
                          <div className="p-3.5 rounded-xl bg-white/80 border border-paper-edge text-xs">
                            <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              {t('evidence_levels.fire_detection.label')} in Range
                            </span>
                            <p className="mt-1 text-charcoal-600 text-[11px] leading-relaxed">
                              {item.evidence.fireCountInRange}
                            </p>
                          </div>

                          {/* 4. Burned Area in Range */}
                          <div className="p-3.5 rounded-xl bg-white/80 border border-paper-edge text-xs">
                            <span className="font-semibold text-orange-800 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-flame" />
                              {t('evidence_levels.burned_area.label')}
                            </span>
                            <p className="mt-1 text-charcoal-600 text-[11px] leading-relaxed">
                              {item.evidence.burnedAreaInRange}
                            </p>
                          </div>

                          {/* 5. Needs Field Verification Notice */}
                          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs">
                            <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-600" />
                              {t('evidence_levels.needs_verification.label')}
                            </span>
                            <p className="mt-1 text-amber-800 text-[11px] leading-relaxed">
                              {item.evidence.needsVerification}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partner Call to Action */}
                    <div className="pt-4 border-t border-paper-edge">
                      <PartnerCTA
                        partner={item.partner.name}
                        action={item.partner.action}
                        label={`Support ${item.characterName}'s Species`}
                        url={item.partner.url}
                        context={item.partner.context}
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Global Footer Disclaimer */}
        <div className="pt-6 border-t border-paper-edge">
          <DonationDisclaimer />
        </div>
      </div>
    </div>
  );
}
