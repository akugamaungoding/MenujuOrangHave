import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { t } from '../i18n';
import { useFireData, useProtectedAreas } from '../hooks';
import {
  CharacterCard,
  PartnerCTA,
  DonationDisclaimer,
  WatercolorCard,
  PaperTexture,
  StatusBadge,
} from '../components';

const PROTECTED_HOMES = [
  {
    id: 'tanjung-puting',
    name: 'Tanjung Puting National Park',
    localName: 'Taman Nasional Tanjung Puting',
    province: 'Central Kalimantan',
    areaHa: '415,040 ha',
    designation: 'Biosphere Reserve & National Park',
    bbox: { minLng: 111.5, maxLng: 112.5, minLat: -3.5, maxLat: -2.4 },
    speciesKeys: ['orangutan', 'sunbear'],
    description: 'A global sanctuary for wild Bornean orangutans. Features dense tropical peat swamp and freshwater mangroves along the Sekonyer River.',
    partner: {
      name: 'Friends of the National Park Foundation (FNPF) & BOS',
      action: 'Guard Tanjung Puting Peat Boundaries',
      url: 'https://orangutan.org/',
      context: 'Maintain water pumps, fire watchtowers, and canopy replanting along peat fringes.',
    },
  },
  {
    id: 'betung-kerihun',
    name: 'Betung Kerihun National Park',
    localName: 'Taman Nasional Betung Kerihun',
    province: 'West Kalimantan',
    areaHa: '800,000 ha',
    designation: 'Transboundary Conservation Reserve',
    bbox: { minLng: 112.2, maxLng: 114.3, minLat: 0.6, maxLat: 1.8 },
    speciesKeys: ['orangutan', 'hornbill', 'sunbear'],
    description: 'The mountainous crown of Borneo. Towering dipterocarp ridges provide nesting cavities for the Helmeted Hornbill and ancient refuge for sun bears.',
    partner: {
      name: 'WWF Indonesia / Betung Kerihun Authority',
      action: 'Protect Mountainous Forest Corridors',
      url: 'https://www.internationalanimalrescue.org/',
      context: 'Community rangers patrol high-elevation canopy corridors bordering Sarawak.',
    },
  },
  {
    id: 'bukit-baka',
    name: 'Bukit Baka Bukit Raya National Park',
    localName: 'Taman Nasional Bukit Baka Bukit Raya',
    province: 'West & Central Kalimantan',
    areaHa: '181,090 ha',
    designation: 'Heart of Borneo Watershed Reserve',
    bbox: { minLng: 112.0, maxLng: 113.0, minLat: -1.1, maxLat: -0.3 },
    speciesKeys: ['hornbill', 'sunbear'],
    description: 'Rugged granitic peaks forming the headwaters of the Melawi and Katingan rivers. Primary habitat for hornbills, cloud leopards, and sun bears.',
    partner: {
      name: 'Yayasan IAR Indonesia (YIARI)',
      action: 'Monitor Bukit Baka Release Sites',
      url: 'https://www.internationalanimalrescue.org/',
      context: 'Over 60 rehabilitated orangutans have been safely released into Bukit Baka forests.',
    },
  },
  {
    id: 'danau-sentarum',
    name: 'Danau Sentarum National Park',
    localName: 'Taman Nasional Danau Sentarum',
    province: 'West Kalimantan',
    areaHa: '132,000 ha',
    designation: 'Ramsar Wetland of International Importance',
    bbox: { minLng: 111.7, maxLng: 112.6, minLat: 0.5, maxLat: 1.3 },
    speciesKeys: ['mousedeer'],
    description: 'A vast floodplain basin that fills and empties with seasonal rains. Seasonal dry spells leave peat thickets vulnerable to edge fires.',
    partner: {
      name: 'Mongabay Environmental News',
      action: 'Follow Sentarum Wetland Water Levels',
      url: 'https://news.mongabay.com/',
      context: 'Document seasonal wetland drying and traditional fire-prevention practices among local fishermen.',
    },
  },
  {
    id: 'kutai',
    name: 'Kutai National Park',
    localName: 'Taman Nasional Kutai',
    province: 'East Kalimantan',
    areaHa: '198,630 ha',
    designation: 'Lowland Rainforest & Ironwood Sanctuary',
    bbox: { minLng: 117.0, maxLng: 117.8, minLat: 0.0, maxLat: 0.8 },
    speciesKeys: ['orangutan', 'sunbear', 'pangolin'],
    description: 'The eastern bastion of Borneo’s great ironwood trees. Bounded by coastal mangroves and recovering peat corridors along the Sangatta River.',
    partner: {
      name: 'BOS Foundation East Kalimantan',
      action: 'Defend Kutai Ironwood Forest Margins',
      url: 'https://orangutan.org/',
      context: 'Coordinate with local forest guards to intercept fires along agricultural borders.',
    },
  },
];

const STORAGE_KEY = 'home_watched_reserve_id';

export default function DashboardPage() {
  const { fireEvents, loading: fireLoading, refresh: refreshFire } = useFireData();
  const [selectedHomeId, setSelectedHomeId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'tanjung-puting';
  });

  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [refreshNotice, setRefreshNotice] = useState(null);

  // Save selection
  const handleSelectHome = (id) => {
    setSelectedHomeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    setRefreshNotice(null);
  };

  const currentHome = useMemo(() => {
    return PROTECTED_HOMES.find((h) => h.id === selectedHomeId) || PROTECTED_HOMES[0];
  }, [selectedHomeId]);

  // Compute nearby fires in the last 7 days within the home's bounding box
  const nearbyFires = useMemo(() => {
    if (!fireEvents || !Array.isArray(fireEvents) || !currentHome) return [];

    const { bbox } = currentHome;
    return fireEvents.filter((fire) => {
      const lat = fire.latitude;
      const lng = fire.longitude;
      return (
        lat >= bbox.minLat &&
        lat <= bbox.maxLat &&
        lng >= bbox.minLng &&
        lng <= bbox.maxLng
      );
    });
  }, [fireEvents, currentHome]);

  // Derive status
  const homeStatus = useMemo(() => {
    const count = nearbyFires.length;
    if (count === 0) {
      return {
        key: 'safe',
        label: t('dashboard.status_safe'),
        color: 'text-green-800 bg-green-50 border-green-300',
        dot: 'bg-green-500',
        badge: 'Safe & Uncompromised',
        actionAdvice: 'No immediate satellite fire alerts in this quadrant. Support habitat protection patrols.',
      };
    } else if (count <= 3) {
      return {
        key: 'risk',
        label: t('dashboard.status_risk'),
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        dot: 'bg-amber-500 animate-ping',
        badge: 'Active Fire Alerts Nearby',
        actionAdvice: 'Satellite thermal anomalies detected within perimeter buffer. Ground ranger patrols notified.',
      };
    } else {
      return {
        key: 'recovering',
        label: t('dashboard.status_recovering'),
        color: 'text-orange-900 bg-orange-50 border-orange-300',
        dot: 'bg-flame animate-pulse',
        badge: 'Elevated Fire Activity & Recovery Zone',
        actionAdvice: 'Multiple thermal detections recorded. Immediate support needed for firebreaks and medical evacuation teams.',
      };
    }
  }, [nearbyFires]);

  // Request browser notification
  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          new Notification(`H.O.M.E. Vigil: ${currentHome.name}`, {
            body: `You are now watching ${currentHome.name}. We will notify you when new satellite fire alerts are detected.`,
            icon: '/favicon.svg',
          });
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
  };

  // Manual refresh with in-app notification
  const handleCheckNow = async () => {
    setRefreshNotice('Scanning latest NASA VIIRS overpass...');
    try {
      if (refreshFire) await refreshFire();
      const count = nearbyFires.length;
      setRefreshNotice(
        count === 0
          ? `All clear! 0 satellite thermal anomalies within ${currentHome.name} quadrant.`
          : `Notice: ${count} active thermal detections detected within ${currentHome.name} quadrant.`
      );
    } catch {
      setRefreshNotice('Refreshed satellite snapshot.');
    }
  };

  return (
    <div className="relative min-h-screen py-12 sm:py-16">
      <PaperTexture intensity={0.3} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-moss-300 bg-moss-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-moss-800">
            <span className="h-2 w-2 rounded-full bg-moss-600 animate-ping" />
            Frontend Impact Vigil
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl font-bold text-moss-900 leading-tight">
            {t('dashboard.title')}
          </h1>

          <p className="font-serif text-lg text-charcoal-700 italic">
            Select a living sanctuary to monitor. We compute proximity to satellite fire anomalies in real time without tracking you.
          </p>
        </header>

        {/* Home Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {PROTECTED_HOMES.map((home) => (
            <button
              key={home.id}
              type="button"
              onClick={() => handleSelectHome(home.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                selectedHomeId === home.id
                  ? 'bg-moss-700 text-cream-50 border-moss-800 shadow-md scale-102'
                  : 'bg-paper-warm text-charcoal-700 border-paper-edge hover:bg-cream-100 hover:border-moss-400'
              }`}
            >
              {home.name.replace(' National Park', '')}
            </button>
          ))}
        </div>

        {/* In-app Refresh Alert (if any) */}
        {refreshNotice && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between shadow-xs animate-fadeIn">
            <span>{refreshNotice}</span>
            <button
              type="button"
              onClick={() => setRefreshNotice(null)}
              className="text-amber-700 hover:text-amber-950 font-bold ml-3"
            >
              &times;
            </button>
          </div>
        )}

        {/* Watched Home Main Dashboard Card */}
        <div className="paper-card-deckle rounded-3xl border border-paper-edge bg-paper-warm/95 p-6 sm:p-10 shadow-lg space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-paper-edge pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-serif uppercase tracking-wider text-moss-800 font-bold">
                  {currentHome.designation}
                </span>
                <span className="text-xs text-charcoal-500">
                  &bull; {currentHome.province} &bull; {currentHome.areaHa}
                </span>
              </div>
              <h2 className="font-hand text-4xl sm:text-5xl font-bold text-moss-900">
                {currentHome.name}
              </h2>
              <p className="text-xs text-charcoal-500 italic mt-0.5">
                Local: {currentHome.localName}
              </p>
            </div>

            {/* Status Pill Badge */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${homeStatus.color}`}>
              <span className={`h-3 w-3 rounded-full ${homeStatus.dot}`} />
              <div>
                <span className="font-bold text-sm block leading-tight">
                  {homeStatus.badge}
                </span>
                <span className="text-xs opacity-90">
                  {nearbyFires.length} thermal detections in last 7 days
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-cream-50 border border-paper-edge text-center">
              <span className="text-xs text-charcoal-500 block mb-1">Satellite Fires in Quadrant</span>
              <span className="font-hand text-4xl font-bold text-amber-800">
                {fireLoading ? '...' : nearbyFires.length}
              </span>
              <span className="text-[10px] text-charcoal-400 block mt-1">NASA VIIRS 375m radius</span>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 border border-paper-edge text-center">
              <span className="text-xs text-charcoal-500 block mb-1">Monitored Surface Area</span>
              <span className="font-hand text-3xl font-bold text-moss-900">
                {currentHome.areaHa}
              </span>
              <span className="text-[10px] text-charcoal-400 block mt-1">Designated Conservation Core</span>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 border border-paper-edge flex flex-col justify-center items-center gap-2 text-center">
              <button
                type="button"
                onClick={handleCheckNow}
                className="w-full rounded-lg bg-moss-700 px-3 py-2 text-xs font-semibold text-cream-50 hover:bg-moss-800 transition-colors shadow-2xs"
              >
                Scan Latest NASA Overpass
              </button>

              {'Notification' in window && notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestNotification}
                  className="w-full rounded-lg border border-moss-600/40 bg-cream-100 px-3 py-1.5 text-[11px] font-medium text-moss-800 hover:bg-cream-200"
                >
                  Enable Browser Fire Alerts
                </button>
              )}
            </div>
          </div>

          {/* Method Statement */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-charcoal-700 space-y-1">
            <p className="font-semibold text-amber-900">
              Methodology Statement:
            </p>
            <p className="leading-relaxed">
              Status is derived from satellite fire detections within the geographic bounding box of this protected area in the last 7 days. It reflects regional atmospheric thermal exposure, not confirmed ground damage to canopy trees.
            </p>
          </div>

          {/* Resident Species in this Home */}
          <div className="space-y-4 pt-4 border-t border-paper-edge">
            <div className="flex items-center justify-between">
              <h3 className="font-hand text-3xl font-bold text-moss-900">
                Resident Wildlife of {currentHome.name.replace(' National Park', '')}
              </h3>
              <Link
                to="/wildlife"
                className="text-xs font-semibold text-moss-800 hover:underline"
              >
                All Species &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {currentHome.speciesKeys.map((key) => {
                const charName = t(`characters.${key}.name`);
                const speciesName = t(`characters.${key}.species`);
                const desc = t(`story.${key === 'orangutan' ? 'tuki_desc' : key === 'sunbear' ? 'madu_desc' : key === 'pangolin' ? 'liku_desc' : key === 'mousedeer' ? 'kecil_desc' : 'rangkong_desc'}`);

                return (
                  <div key={key} className="w-full flex flex-col items-center">
                    <CharacterCard
                      species={key}
                      name={charName}
                      description={desc}
                      iucnStatus={key === 'mousedeer' ? 'LC' : key === 'sunbear' ? 'VU' : 'CR'}
                    />
                    <Link
                      to={`/wildlife/${key}`}
                      className="mt-2 text-xs font-semibold text-moss-700 hover:underline"
                    >
                      Read {charName}&apos;s profile &rarr;
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dedicated Partner CTA for this Home */}
          <div className="pt-6 border-t border-paper-edge">
            <PartnerCTA
              partner={currentHome.partner.name}
              action={currentHome.partner.action}
              label="Support This Reserve Directly"
              url={currentHome.partner.url}
              context={currentHome.partner.context}
            />
          </div>
        </div>

        {/* Global Footer Disclaimer */}
        <div className="pt-4 border-t border-paper-edge">
          <DonationDisclaimer />
        </div>
      </div>
    </div>
  );
}
