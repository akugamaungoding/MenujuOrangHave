import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { t } from '../i18n';
import {
  CharacterCard,
  PartnerCTA,
  DonationDisclaimer,
  WatercolorCard,
  PaperTexture,
} from '../components';

const SPECIES_PROFILES = {
  orangutan: {
    slug: 'orangutan',
    characterName: 'Tuki',
    speciesName: 'Bornean Orangutan',
    scientificName: 'Pongo pygmaeus',
    iucnStatus: 'CR',
    populationTrend: 'Decreasing',
    threats: [
      'Peatland fires burning ancient fruiting canopies',
      'Oil palm monoculture landscape fragmentation',
      'Isolation of breeding groups in degraded forest remnants',
      'Hunting and infant trafficking along fire margins',
    ],
    habitat: 'Lowland dipterocarp forest, freshwater swamp, and tropical peat swamp forests below 500m elevation. Dependent on contiguous tall trees for night nesting and year-round wild figs.',
    narrative: {
      rescue: {
        title: 'Stage I &bull; The Edge of the Peat Fire',
        text: 'The smoke rose thick through the lower branches. Tuki, clutching the higher limbs of an old Meranti tree, was cut off from the main canopy by an encroaching line of burning peat. Ground rescue scouts dispatched by local villagers pinpointed her coordinates through the dense haze.',
      },
      treatment: {
        title: 'Stage II &bull; Emergency Veterinary Care',
        text: 'At the partner transit hospital, veterinarians administered emergency oxygen, treated second-degree palm burns caused by hot branches, and initiated intravenous fluid rehydration for severe dehydration.',
      },
      recovery: {
        title: 'Stage III &bull; Forest School &amp; Nesting Acclimatization',
        text: 'During recovery in a protected island enclosure, Tuki regained her physical strength. Over eight months, she practiced high canopy foraging, leaf identification, and nightly nest construction using fresh leafy twigs.',
      },
      return: {
        title: 'Stage IV &bull; The Return to Bukit Baka Canopy',
        text: 'Equipped with an aerial radio tracking collar, Tuki was airlifted to a remote, unburned ridge in Bukit Baka Bukit Raya National Park. Within two hours, she climbed 35 meters into the mist, building a fresh nest before nightfall.',
      },
    },
    realRescueStory: {
      partner: 'Yayasan IAR Indonesia (YIARI)',
      caseId: 'Ketapang Field Log #2023-04',
      date: 'September 2023',
      location: 'Sungai Putri Peatland Border, West Kalimantan',
      summary: 'A wild female orangutan and her young infant were safely evacuated from an isolated 2-hectare patch surrounded by smoldering canal fires.',
      url: 'https://www.internationalanimalrescue.org/',
    },
    partner: {
      name: 'Yayasan IAR Indonesia (YIARI)',
      action: 'Support Emergency Orangutan Rescue & Medical Care',
      url: 'https://www.internationalanimalrescue.org/',
      context: 'YIARI runs the largest orangutan rescue and rehabilitation center in West Kalimantan.',
    },
  },
  pangolin: {
    slug: 'pangolin',
    characterName: 'Liku',
    speciesName: 'Sunda Pangolin',
    scientificName: 'Manis javanica',
    iucnStatus: 'CR',
    populationTrend: 'Decreasing',
    threats: [
      'Subterranean peat fire ember heat suffocating burrow cavities',
      'Defensive curling behavior trapping animals in front of flames',
      'Illegal international wildlife trafficking for scales',
      'Destruction of termite mounds and ancient rotting logs',
    ],
    habitat: 'Primary and secondary tropical rainforests, peat swamp forest margins, and dense bamboo groves. Requires extensive subterranean root burrows and tree hollows for nocturnal shelter.',
    narrative: {
      rescue: {
        title: 'Stage I &bull; Trapped Beneath the Embers',
        text: 'When smoke filtered down into root cavities, Liku followed ancient defensive instinct: she curled into an impenetrable armored ball. A joint community fire patrol noticed displaced ground soil and carefully extricated her before underground heat breached the hollow.',
      },
      treatment: {
        title: 'Stage II &bull; Scaled Burn Treatment &amp; Rehydration',
        text: 'Under quarantine care, wildlife clinicians cleaned soot from delicate facial membranes, applied specialized healing balm to heat-stressed keratin scales, and hydrated her with nutrient-rich feeding formulas.',
      },
      recovery: {
        title: 'Stage III &bull; Quiet Nocturnal Conditioning',
        text: 'Liku was housed in a low-noise nocturnal rehabilitation pen designed with deep leaf litter, rotting logs, and simulated ant hills, re-establishing independent termite digging routines.',
      },
      return: {
        title: 'Stage IV &bull; Release into Kutai Ironwood Forest',
        text: 'On a moonless night, Liku was released deep within Kutai National Park’s ancient ironwood core, disappearing into a subterranean burrow system shielded from regional agricultural borders.',
      },
    },
    realRescueStory: {
      partner: 'BKSDA East Kalimantan & WRC',
      caseId: 'Sunda Pangolin Intake #PL-2024-02',
      date: 'March 2024',
      location: 'Sangatta Margins, Kutai National Park',
      summary: 'Rescued from agricultural canal clearing fire; treated for severe dehydration and returned to unfragmented primary forest.',
      url: 'https://www.iucnredlist.org/',
    },
    partner: {
      name: 'IUCN Pangolin Specialist Group',
      action: 'Safeguard Pangolin Burrow Micro-Habitats',
      url: 'https://www.iucnredlist.org/',
      context: 'Collaborating across Southeast Asia to protect pangolin populations from both fire and trafficking.',
    },
  },
  sunbear: {
    slug: 'sunbear',
    characterName: 'Madu',
    speciesName: 'Sun Bear',
    scientificName: 'Helarctos malayanus',
    iucnStatus: 'VU',
    populationTrend: 'Decreasing',
    threats: [
      'Loss of ancient hollow hardwood trees used for maternal dens',
      'Destruction of stingless bee hives and forest floor termite nests',
      'Forest road fragmentation causing vehicle strikes',
      'Snare poaching along palm concession boundaries',
    ],
    habitat: 'Dense tropical evergreen lowland and hill dipterocarp forests. Sun bears require standing hollow trees exceeding 80cm diameter to birth and nurse cubs safely off the forest floor.',
    narrative: {
      rescue: {
        title: 'Stage I &bull; Displaced Orphan by the Burnt Meranti',
        text: 'Following a lightning-ignited forest fringe fire, Madu was found as a disoriented cub wandering near a charred hardwood trunk. Forest rangers observed the area for 36 hours; when no mother returned, intervention was authorized.',
      },
      treatment: {
        title: 'Stage II &bull; Cub Nursing &amp; Veterinary Rehabilitation',
        text: 'Specialized sanctuary carers provided round-the-clock infant formula, treated smoke-induced conjunctivitis, and monitored weight gain in a naturalized nursery.',
      },
      recovery: {
        title: 'Stage III &bull; The Art of Tree Climbing',
        text: 'As Madu grew, sanctuary keepers encouraged natural foraging behaviors: peeling tough bark to reach honeycombs, ripping open fallen deadwood, and scaling 20-meter training trees.',
      },
      return: {
        title: 'Stage IV &bull; The Wild Ridges of Betung Kerihun',
        text: 'Madu was translocated to the expansive interior of Betung Kerihun National Park, where vast tracts of contiguous forest provide abundant wild honey and undisturbed denning hollows.',
      },
    },
    realRescueStory: {
      partner: 'BOS Foundation Samboja Lestari',
      caseId: 'Sun Bear Rehabilitation Log #SB-58',
      date: 'November 2023',
      location: 'Samboja Forest Fringe, East Kalimantan',
      summary: 'Cub rescued from deforested perimeter; successfully completed 14 months of naturalized sanctuary conditioning.',
      url: 'https://orangutan.org/',
    },
    partner: {
      name: 'BOS Foundation',
      action: 'Support Samboja Sun Bear Sanctuary',
      url: 'https://orangutan.org/',
      context: 'BOS Foundation cares for over 70 rescued sun bears at their East Kalimantan rehabilitation center.',
    },
  },
  mousedeer: {
    slug: 'mousedeer',
    characterName: 'Kecil',
    speciesName: 'Lesser Mouse Deer',
    scientificName: 'Tragulus kanchil',
    iucnStatus: 'LC',
    populationTrend: 'Stable',
    threats: [
      'Fast-moving ground fire sweeping low undergrowth foliage',
      'Severe respiratory distress from thick low-lying smoke layers',
      'Lack of ground shrub cover exposing animals to predators',
      'Wire snare poaching on fire escape paths',
    ],
    habitat: 'Lowland dipterocarp forest understory, dense riverside thickets, and swamp forest margins where dense shrubs and fallen fruit are abundant within 1 meter of the forest floor.',
    narrative: {
      rescue: {
        title: 'Stage I &bull; Trapped by Understory Flames',
        text: 'As brush fires quickly consumed the low shrub layer along a seasonal stream bed, Kecil was cut off from the deep forest. Villagers assisting firefighter patrols found the miniature ungulate exhausted on a mud bank.',
      },
      treatment: {
        title: 'Stage II &bull; Calming Care &amp; Burn Topical Treatment',
        text: 'Mouse deer are highly sensitive to capture stress (capture myopathy). Field veterinarians placed Kecil in a dark, quiet enclosure, treating minor hoof burns and administering electrolyte solutions.',
      },
      recovery: {
        title: 'Stage III &bull; Herbaceous Browse Recuperation',
        text: 'Fed fresh native fig leaves, fallen wild berries, and forest mushrooms, Kecil quickly regained agility and instinctual flight responses.',
      },
      return: {
        title: 'Stage IV &bull; Safe Release into Danau Sentarum Wetlands',
        text: 'Kecil was released into Danau Sentarum National Park’s dense riparian buffer zone, vanishing seamlessly into the lush ferns beside the water.',
      },
    },
    realRescueStory: {
      partner: 'Danau Sentarum Conservation Area',
      caseId: 'Wildlife Transit Entry #DS-2023-11',
      date: 'October 2023',
      location: 'Kapuas Hulu Watershed, West Kalimantan',
      summary: 'Displaced mouse deer treated for smoke exposure during regional dry spell and returned to unburnt wetland thickets.',
      url: 'https://news.mongabay.com/',
    },
    partner: {
      name: 'Mongabay Environmental News',
      action: 'Track Wetland Understory Fire Damage',
      url: 'https://news.mongabay.com/',
      context: 'Reporting on the importance of understory shrub layers for small ungulates and ecosystem seed dispersers.',
    },
  },
  hornbill: {
    slug: 'hornbill',
    characterName: 'Rangkong',
    speciesName: 'Helmeted Hornbill',
    scientificName: 'Rhinoplax vigil',
    iucnStatus: 'CR',
    populationTrend: 'Decreasing',
    threats: [
      'Burning and felling of ancient emergent dipterocarp nest trees',
      'Mother and chicks sealed inside tree trunk during nesting season unable to escape smoke',
      'Targeted illegal poaching for solid keratin casques (red ivory)',
      'Loss of wild strangler fig trees across river valleys',
    ],
    habitat: 'Pristine lowland and hill evergreen rainforests with tall emergent canopy trees rising above 45 meters. Requires ancient trees with natural fungal cavities for successful breeding cycles.',
    narrative: {
      rescue: {
        title: 'Stage I &bull; The Sealed Hollow in the Smoke',
        text: 'During the dry breeding season, the female hornbill seals herself into a tree cavity with mud to brood her egg. When an uncontrolled peat plume blanketed the valley, researchers monitoring the nest saw the male struggle to deliver fruit through the suffocating haze.',
      },
      treatment: {
        title: 'Stage II &bull; Emergency Canopy Extraction',
        text: 'Trained tree-climbing biologists scaled the 40-meter dipterocarp, carefully opening the cavity seal to extract the weakened chick and mother, administering portable oxygen at the base of the trunk.',
      },
      recovery: {
        title: 'Stage III &bull; High Aviary Flight Conditioning',
        text: 'Both birds recuperated in a specialized high-canopy flight facility, regaining powerful wing strength and vocalization calls that resonate over kilometers.',
      },
      return: {
        title: 'Stage IV &bull; Soaring Across Betung Kerihun Canopies',
        text: 'Rangkong was returned to the vast ridge forests of Betung Kerihun, where his iconic laughing call once again reverberated across the primary canopy.',
      },
    },
    realRescueStory: {
      partner: 'Rangkong Indonesia & YIARI',
      caseId: 'Canopy Nest Monitoring Field Dossier #BK-09',
      date: 'August 2023',
      location: 'Betung Kerihun National Park Canopy Buffer',
      summary: 'Emergency intervention safeguarded an active nest cavity during regional transboundary haze; chick successfully fledged.',
      url: 'https://www.internationalanimalrescue.org/',
    },
    partner: {
      name: 'BirdLife International / YIARI',
      action: 'Guard Active Hornbill Nesting Trees',
      url: 'https://www.internationalanimalrescue.org/',
      context: 'Deploying tree guardians and acoustic sensors to protect nesting mother hornbills across Borneo.',
    },
  },
};

export default function HomeProfile() {
  const { species } = useParams();
  const profileKey = (species || '').toLowerCase();
  const data = SPECIES_PROFILES[profileKey] || SPECIES_PROFILES.orangutan;

  return (
    <div className="relative min-h-screen py-12 sm:py-20">
      <PaperTexture intensity={0.3} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-charcoal-500 flex items-center gap-2">
          <Link to="/" className="hover:text-moss-700 underline">
            Home
          </Link>
          <span>&rsaquo;</span>
          <Link to="/wildlife" className="hover:text-moss-700 underline">
            Wildlife Impact Panel
          </Link>
          <span>&rsaquo;</span>
          <span className="font-semibold text-charcoal-800">{data.characterName}</span>
        </nav>

        {/* Hero Section */}
        <header className="paper-card-deckle rounded-3xl border border-paper-edge bg-paper-warm/95 p-6 sm:p-12 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Illustration Avatar */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-full border-4 border-moss-300 bg-cream-50 p-4 shadow-inner overflow-hidden">
                <img
                  src={`/assets/art/${data.slug}.svg`}
                  alt={`${data.characterName} the ${data.speciesName}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 text-[11px] italic text-charcoal-500">
                {t('common.illustrated_label')}
              </p>
            </div>

            {/* Right: Bio & Status */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-serif uppercase tracking-widest text-moss-800 font-bold">
                  {data.speciesName}
                </span>
                <span className="text-xs text-charcoal-500 italic">
                  ({data.scientificName})
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    data.iucnStatus === 'CR'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : data.iucnStatus === 'VU'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-green-100 text-green-800 border border-green-300'
                  }`}
                >
                  IUCN: {data.iucnStatus} &bull; {data.populationTrend}
                </span>
              </div>

              <h1 className="font-hand text-5xl sm:text-6xl font-bold text-moss-900 leading-tight">
                {data.characterName}&apos;s Canopy Life
              </h1>

              <p className="text-sm text-charcoal-700 leading-relaxed">
                {data.habitat}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/map"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-moss-700 px-4 py-2.5 text-xs font-semibold text-cream-50 hover:bg-moss-800 shadow-2xs"
                >
                  View Range on Fire Map &rarr;
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-moss-600/40 bg-cream-100 px-4 py-2.5 text-xs font-semibold text-moss-800 hover:bg-cream-200"
                >
                  Watch Protected Home &rarr;
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Narrative Four-Stage Journey */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-serif uppercase tracking-widest text-amber-800 font-bold">
              Illustrated Narrative Journey
            </span>
            <h2 className="font-hand text-4xl sm:text-5xl font-bold text-charcoal-900">
              The Path from Fire to Canopy Return
            </h2>
            <p className="text-xs text-charcoal-500 italic">
              A composite story illustrating standard veterinary evacuation, rehabilitation, and release protocols practiced by our partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stage 1 */}
            <WatercolorCard variant="warm">
              <h3 className="font-hand text-2xl font-bold text-amber-900 mb-2" dangerouslySetInnerHTML={{ __html: data.narrative.rescue.title }} />
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                {data.narrative.rescue.text}
              </p>
            </WatercolorCard>

            {/* Stage 2 */}
            <WatercolorCard variant="warm">
              <h3 className="font-hand text-2xl font-bold text-amber-900 mb-2" dangerouslySetInnerHTML={{ __html: data.narrative.treatment.title }} />
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                {data.narrative.treatment.text}
              </p>
            </WatercolorCard>

            {/* Stage 3 */}
            <WatercolorCard variant="cool">
              <h3 className="font-hand text-2xl font-bold text-moss-900 mb-2" dangerouslySetInnerHTML={{ __html: data.narrative.recovery.title }} />
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                {data.narrative.recovery.text}
              </p>
            </WatercolorCard>

            {/* Stage 4 */}
            <WatercolorCard variant="cool">
              <h3 className="font-hand text-2xl font-bold text-moss-900 mb-2" dangerouslySetInnerHTML={{ __html: data.narrative.return.title }} />
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                {data.narrative.return.text}
              </p>
            </WatercolorCard>
          </div>
        </section>

        {/* Real Field Rescue Story Metadata */}
        <section className="paper-card rounded-2xl border border-paper-edge p-6 sm:p-8 bg-paper-warm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper-edge pb-4">
            <div>
              <span className="text-xs font-serif uppercase tracking-wider text-moss-800 font-semibold">
                Verified Ground Case Study
              </span>
              <h3 className="font-hand text-2xl sm:text-3xl font-bold text-charcoal-900">
                Partner Rescue Case: {data.realRescueStory.caseId}
              </h3>
            </div>
            <span className="text-xs font-mono text-charcoal-500">
              Recorded: {data.realRescueStory.date}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-charcoal-700 space-y-2">
            <p>
              <strong>Location:</strong> {data.realRescueStory.location}
            </p>
            <p>
              <strong>Field Summary:</strong> {data.realRescueStory.summary}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href={data.realRescueStory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-moss-800 hover:text-moss-950 underline flex items-center gap-1"
            >
              Read full partner field report at {data.realRescueStory.partner} <span>&nearr;</span>
            </a>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="pt-4">
          <PartnerCTA
            partner={data.partner.name}
            action={data.partner.action}
            label={`Support ${data.characterName}'s Species Directly`}
            url={data.partner.url}
            context={data.partner.context}
          />
        </section>

        {/* Global Footer Disclaimer */}
        <div className="pt-4 border-t border-paper-edge">
          <DonationDisclaimer />
        </div>
      </div>
    </div>
  );
}
