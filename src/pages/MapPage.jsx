import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { t } from '../i18n';
import { useFireData, useProtectedAreas } from '../hooks';
import { DonationDisclaimer, StatusBadge } from '../components';

// Bounding boxes / center coordinates for Kalimantan regions
const REGION_COORDINATES = {
  all: { center: [113.8, -0.2], zoom: 5.8 },
  west: { center: [110.8, -0.1], zoom: 6.8 },
  central: { center: [113.8, -1.8], zoom: 6.8 },
  east: { center: [116.8, 0.5], zoom: 6.8 },
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  // Read URL params (for embed / widget support)
  const paramRegion = searchParams.get('region') || 'all';
  const paramLayers = searchParams.get('layers');
  const paramTheme = searchParams.get('theme') || 'dark';
  const isEmbed = searchParams.get('embed') === 'true';

  // State for controls
  const [selectedRegion, setSelectedRegion] = useState(
    ['west', 'central', 'all'].includes(paramRegion) ? paramRegion : 'all'
  );
  const [timeFilter, setTimeFilter] = useState('7d'); // '24h' | '3d' | '7d'

  // Layer toggles
  const [layers, setLayers] = useState(() => {
    if (paramLayers) {
      const active = paramLayers.split(',').map((l) => l.trim().toLowerCase());
      return {
        fire: active.includes('fire'),
        burned: active.includes('burned'),
        protected: active.includes('protected'),
        species: active.includes('species'),
      };
    }
    return {
      fire: true,
      burned: true,
      protected: true,
      species: true,
    };
  });

  const [mapLoaded, setMapLoaded] = useState(false);
  const [webGLError, setWebGLError] = useState(false);
  const [selectedFire, setSelectedFire] = useState(null);

  // Data hooks
  const { fireEvents, loading: fireLoading, status: fireStatus } = useFireData();
  const { protectedAreas, loading: paLoading } = useProtectedAreas();

  // Filter fire events based on time and region
  const filteredFireEvents = useMemo(() => {
    if (!fireEvents || !Array.isArray(fireEvents)) return [];

    return fireEvents.filter((fire) => {
      // Region filter
      if (selectedRegion === 'west' && fire.longitude > 112.5) return false;
      if (selectedRegion === 'central' && (fire.longitude < 111.0 || fire.longitude > 115.5 || fire.latitude > 0.5)) return false;

      // Time filter (using fire.acq_date or timestamp)
      if (timeFilter === '24h') {
        const fireDate = new Date(fire.timestamp || fire.acq_date);
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (fireDate < cutoff) return false;
      } else if (timeFilter === '3d') {
        const fireDate = new Date(fire.timestamp || fire.acq_date);
        const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        if (fireDate < cutoff) return false;
      }
      return true;
    });
  }, [fireEvents, selectedRegion, timeFilter]);

  // Convert filtered fire events into GeoJSON
  const fireGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: filteredFireEvents.map((f) => ({
        type: 'Feature',
        id: f.id,
        geometry: {
          type: 'Point',
          coordinates: [f.longitude, f.latitude],
        },
        properties: {
          id: f.id,
          brightness: f.brightness || f.bright_ti4 || 330,
          confidence: f.confidence || 'nominal',
          sensor: f.sensor || 'VIIRS',
          date: f.acq_date,
          time: f.acq_time,
          frp: f.frp || 0,
        },
      })),
    };
  }, [filteredFireEvents]);

  // Initialize MapLibre GL JS
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const basemapStyle =
        paramTheme === 'light'
          ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
          : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: basemapStyle,
        center: REGION_COORDINATES[selectedRegion]?.center || [113.8, -0.2],
        zoom: REGION_COORDINATES[selectedRegion]?.zoom || 5.8,
        minZoom: 4,
        maxZoom: 14,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
        'bottom-right'
      );

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: 'H.O.M.E. &bull; NASA FIRMS &bull; WDPA &bull; IUCN',
        }),
        'bottom-left'
      );

      map.on('load', () => {
        setMapLoaded(true);

        // 1. Add Protected Areas Source & Layers
        if (protectedAreas && protectedAreas.features) {
          map.addSource('protected-areas', {
            type: 'geojson',
            data: protectedAreas,
          });

          map.addLayer({
            id: 'pa-polygons',
            type: 'fill',
            source: 'protected-areas',
            paint: {
              'fill-color': '#4A7C59',
              'fill-opacity': 0.25,
            },
          });

          map.addLayer({
            id: 'pa-borders',
            type: 'line',
            source: 'protected-areas',
            paint: {
              'line-color': '#6B8F5E',
              'line-width': 1.8,
              'line-dasharray': [2, 1],
            },
          });
        }

        // 2. Add Fire Points Source & Glowing Amber Circle Layers
        map.addSource('fire-points', {
          type: 'geojson',
          data: fireGeoJSON,
        });

        // Outer heat glow circle
        map.addLayer({
          id: 'fire-glow',
          type: 'circle',
          source: 'fire-points',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'brightness'],
              300,
              6,
              380,
              14,
            ],
            'circle-color': '#E07B39',
            'circle-opacity': 0.45,
            'circle-blur': 0.8,
          },
        });

        // Core bright ember circle
        map.addLayer({
          id: 'fire-core',
          type: 'circle',
          source: 'fire-points',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'brightness'],
              300,
              3,
              380,
              6,
            ],
            'circle-color': '#FCD34D',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#EA580C',
          },
        });

        // 3. Fire point click event for popup
        map.on('click', 'fire-core', (e) => {
          if (!e.features || !e.features[0]) return;
          const feat = e.features[0];
          const coords = feat.geometry.coordinates.slice();
          const props = feat.properties;

          setSelectedFire(props);

          const popupContent = `
            <div style="font-family: inherit; font-size: 12px; color: #171717; min-width: 190px;">
              <div style="font-weight: 700; color: #EA580C; font-size: 13px; margin-bottom: 4px;">
                Satellite Fire Detection
              </div>
              <div><strong>Sensor:</strong> ${props.sensor || 'VIIRS 375m'}</div>
              <div><strong>Detection:</strong> ${props.date} ${props.time || ''}</div>
              <div><strong>Brightness:</strong> ${Math.round(props.brightness)} K</div>
              <div><strong>Confidence:</strong> ${props.confidence}</div>
              <div style="margin-top: 4px; border-top: 1px solid #ddd; padding-top: 4px;">
                <strong>Species Overlap:</strong> Bornean Orangutan Range
              </div>
              <div style="color: #666; font-size: 10px; margin-top: 3px;">
                Nearest PA: Tanjung Puting corridor
              </div>
            </div>
          `;

          new maplibregl.Popup({ offset: 12 })
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map);
        });

        map.on('mouseenter', 'fire-core', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'fire-core', () => {
          map.getCanvas().style.cursor = '';
        });
      });

      mapRef.current = map;
    } catch (err) {
      console.error('Failed to initialize MapLibre GL:', err);
      setWebGLError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [paramTheme]);

  // Update fire source data whenever filtered events change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('fire-points');
    if (source) {
      source.setData(fireGeoJSON);
    }
  }, [fireGeoJSON, mapLoaded]);

  // Update protected areas source when loaded
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('protected-areas');
    if (source && protectedAreas && protectedAreas.features) {
      source.setData(protectedAreas);
    }
  }, [protectedAreas, mapLoaded]);

  // Pan to selected region
  const handleRegionChange = (reg) => {
    setSelectedRegion(reg);
    if (mapRef.current && REGION_COORDINATES[reg]) {
      mapRef.current.flyTo({
        center: REGION_COORDINATES[reg].center,
        zoom: REGION_COORDINATES[reg].zoom,
        essential: true,
      });
    }
  };

  // Toggle layer visibility
  const toggleLayer = (layerKey) => {
    const nextVal = !layers[layerKey];
    setLayers((prev) => ({ ...prev, [layerKey]: nextVal }));

    if (!mapRef.current || !mapLoaded) return;

    if (layerKey === 'fire') {
      const visibility = nextVal ? 'visible' : 'none';
      if (mapRef.current.getLayer('fire-glow')) {
        mapRef.current.setLayoutProperty('fire-glow', 'visibility', visibility);
      }
      if (mapRef.current.getLayer('fire-core')) {
        mapRef.current.setLayoutProperty('fire-core', 'visibility', visibility);
      }
    } else if (layerKey === 'protected') {
      const visibility = nextVal ? 'visible' : 'none';
      if (mapRef.current.getLayer('pa-polygons')) {
        mapRef.current.setLayoutProperty('pa-polygons', 'visibility', visibility);
      }
      if (mapRef.current.getLayer('pa-borders')) {
        mapRef.current.setLayoutProperty('pa-borders', 'visibility', visibility);
      }
    }
  };

  return (
    <div className={`relative w-full ${isEmbed ? 'h-screen' : 'min-h-[calc(100vh-64px)]'} overflow-hidden flex flex-col`}>
      {/* Fallback if WebGL fails */}
      {webGLError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-charcoal-900 text-cream-100 p-6 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="font-hand text-3xl font-bold text-amber-300">
              Interactive Map Notice
            </h2>
            <p className="text-sm text-cream-200">
              WebGL acceleration is unavailable in this environment. Showing active fire telemetry snapshot:
            </p>
            <div className="p-4 bg-charcoal-950 rounded-xl border border-charcoal-800 text-left text-xs space-y-2">
              <div>Total Detections: <strong>{filteredFireEvents.length}</strong></div>
              <div>Region: <strong>{selectedRegion.toUpperCase()}</strong></div>
              <div>DataSource: <strong>NASA FIRMS VIIRS (Snapshot)</strong></div>
            </div>
            <Link
              to="/wildlife"
              className="inline-block rounded-lg bg-moss-700 px-5 py-2.5 text-xs font-semibold text-cream-50"
            >
              Explore Wildlife Profiles Instead &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Main Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full flex-1 bg-charcoal-950 focus:outline-none"
        style={{ minHeight: isEmbed ? '100vh' : 'calc(100vh - 120px)' }}
        tabIndex={0}
        aria-label="Interactive map showing satellite fire detections and protected wildlife corridors in Kalimantan"
      />

      {/* Floating Control Panel (Top-Left / Top-Right Stack) */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Title & Status Badge */}
        {!isEmbed && (
          <div className="pointer-events-auto bg-charcoal-950/90 text-cream-50 border border-charcoal-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md max-w-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
              <h1 className="font-hand text-2xl font-bold text-amber-300 leading-tight">
                {t('map.title')}
              </h1>
            </div>
            <p className="text-xs text-cream-300 italic">
              {t('map.subtitle')} &bull; Satellite Telemetry Layer
            </p>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge status={fireStatus || 'OK'} label="FIRMS" />
              <span className="text-[11px] text-cream-400">
                {fireLoading ? 'Loading live...' : `${filteredFireEvents.length} active points`}
              </span>
            </div>
          </div>
        )}

        {/* Filters & Layer Toggles Panel */}
        <div className="pointer-events-auto bg-charcoal-950/90 text-cream-100 border border-charcoal-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md w-full sm:w-auto space-y-4">
          {/* Region Tabs */}
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-cream-400 block mb-1.5">
              Region Filter
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: t('map.filters.region_all') },
                { id: 'west', label: t('map.filters.region_west') },
                { id: 'central', label: t('map.filters.region_central') },
              ].map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleRegionChange(reg.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRegion === reg.id
                      ? 'bg-moss-700 text-cream-50 font-semibold'
                      : 'bg-charcoal-800 text-cream-300 hover:bg-charcoal-700'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter Tabs */}
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-cream-400 block mb-1.5">
              Time Window
            </span>
            <div className="flex gap-1.5">
              {[
                { id: '24h', label: t('map.filters.time_24h') },
                { id: '3d', label: t('map.filters.time_3d') },
                { id: '7d', label: t('map.filters.time_7d') },
              ].map((time) => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setTimeFilter(time.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    timeFilter === time.id
                      ? 'bg-amber-600 text-charcoal-950 font-bold'
                      : 'bg-charcoal-800 text-cream-300 hover:bg-charcoal-700'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Toggles */}
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-cream-400 block mb-1.5">
              Map Layers
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleLayer('fire')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-colors ${
                  layers.fire
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-semibold'
                    : 'border-charcoal-800 bg-charcoal-900/60 text-charcoal-400'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${layers.fire ? 'bg-amber-400' : 'bg-charcoal-600'}`} />
                {t('map.layers.fire')}
              </button>

              <button
                type="button"
                onClick={() => toggleLayer('protected')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-colors ${
                  layers.protected
                    ? 'border-moss-500 bg-moss-500/15 text-moss-300 font-semibold'
                    : 'border-charcoal-800 bg-charcoal-900/60 text-charcoal-400'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${layers.protected ? 'bg-moss-400' : 'bg-charcoal-600'}`} />
                {t('map.layers.protected')}
              </button>

              <button
                type="button"
                onClick={() => toggleLayer('burned')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-colors ${
                  layers.burned
                    ? 'border-flame bg-flame/15 text-orange-300 font-semibold'
                    : 'border-charcoal-800 bg-charcoal-900/60 text-charcoal-400'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${layers.burned ? 'bg-flame' : 'bg-charcoal-600'}`} />
                {t('map.layers.burned')}
              </button>

              <button
                type="button"
                onClick={() => toggleLayer('species')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-colors ${
                  layers.species
                    ? 'border-amber-300 bg-amber-300/15 text-amber-200 font-semibold'
                    : 'border-charcoal-800 bg-charcoal-900/60 text-charcoal-400'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${layers.species ? 'bg-amber-300' : 'bg-charcoal-600'}`} />
                {t('map.layers.species')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Legend / Disclaimer */}
      {!isEmbed && (
        <div className="bg-charcoal-950 border-t border-charcoal-800 px-4 py-3 text-cream-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-400 ring-2 ring-amber-600/40" />
              Active Thermal Anomaly
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-moss-600/50 border border-moss-400" />
              Designated Protected Area (WDPA)
            </span>
          </div>

          <div className="max-w-md">
            <DonationDisclaimer compact className="text-cream-400" />
          </div>
        </div>
      )}
    </div>
  );
}
