/**
 * /src/transforms.js
 * Transform functions referenced by source configurations.
 * Handles format parsing, bounding-box geographic filtering, and schema normalization.
 */

import {
  normalizeFireEvent,
  normalizeSpecies,
  normalizeProtectedArea,
} from './schemas.js';

/**
 * Kalimantan geographic bounding box:
 * Latitude: -4.5 to 4.5
 * Longitude: 108.0 to 119.0
 */
const KALIMANTAN_BBOX = {
  minLat: -4.5,
  maxLat: 4.5,
  minLon: 108.0,
  maxLon: 119.0,
};

/**
 * Parses FIRMS CSV text (or already-parsed JSON array), filters to the Kalimantan
 * bounding box, and normalizes into FireEvent objects.
 * @param {string|Array} input - CSV text string or parsed JSON array
 * @returns {Array<Object>} Array of normalized FireEvent objects
 */
export function transformFirmsCsv(input) {
  if (!input) return [];

  // If already parsed JSON array (e.g. from static snapshot)
  if (Array.isArray(input)) {
    return input
      .filter((row) => {
        const lat = Number(row.latitude ?? row.lat);
        const lon = Number(row.longitude ?? row.lon);
        return (
          lat >= KALIMANTAN_BBOX.minLat &&
          lat <= KALIMANTAN_BBOX.maxLat &&
          lon >= KALIMANTAN_BBOX.minLon &&
          lon <= KALIMANTAN_BBOX.maxLon
        );
      })
      .map((row) => normalizeFireEvent(row, 'nasa-firms-viirs'));
  }

  if (typeof input !== 'string') return [];

  const lines = input.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header line
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const latIdx = headers.findIndex((h) => h === 'latitude' || h === 'lat');
  const lonIdx = headers.findIndex((h) => h === 'longitude' || h === 'lon');

  if (latIdx === -1 || lonIdx === -1) {
    return [];
  }

  const fireEvents = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    if (cols.length < headers.length) continue;

    const rowObj = {};
    headers.forEach((h, index) => {
      rowObj[h] = cols[index];
    });

    const lat = parseFloat(rowObj[headers[latIdx]]);
    const lon = parseFloat(rowObj[headers[lonIdx]]);

    // Filter to Kalimantan bounding box
    if (
      !isNaN(lat) &&
      !isNaN(lon) &&
      lat >= KALIMANTAN_BBOX.minLat &&
      lat <= KALIMANTAN_BBOX.maxLat &&
      lon >= KALIMANTAN_BBOX.minLon &&
      lon <= KALIMANTAN_BBOX.maxLon
    ) {
      fireEvents.push(normalizeFireEvent(rowObj, 'nasa-firms-viirs'));
    }
  }

  return fireEvents;
}

/**
 * Target focal species catalog metadata for H.O.M.E.
 */
const TARGET_SPECIES_DEFAULTS = {
  'pongo-pygmaeus': {
    id: 'bornean-orangutan',
    slug: 'bornean-orangutan',
    common_name: 'Bornean Orangutan',
    scientific_name: 'Pongo pygmaeus',
    red_list_status: 'CR',
    red_list_category: 'Critically Endangered',
    population_trend: 'decreasing',
    threats: ['habitat loss', 'fire', 'hunting', 'oil palm monoculture'],
    story_role: 'Elder of the Peat Canopy',
    avatar: '/assets/art/orangutan.svg',
  },
  'manis-javanica': {
    id: 'sunda-pangolin',
    slug: 'sunda-pangolin',
    common_name: 'Sunda Pangolin',
    scientific_name: 'Manis javanica',
    red_list_status: 'CR',
    red_list_category: 'Critically Endangered',
    population_trend: 'decreasing',
    threats: ['hunting', 'trade', 'habitat loss', 'ground peat fires'],
    story_role: 'Guardian of the Forest Floor',
    avatar: '/assets/art/pangolin.svg',
  },
  'helarctos-malayanus': {
    id: 'sun-bear',
    slug: 'sun-bear',
    common_name: 'Sun Bear',
    scientific_name: 'Helarctos malayanus',
    red_list_status: 'VU',
    red_list_category: 'Vulnerable',
    population_trend: 'decreasing',
    threats: ['deforestation', 'hunting', 'hollow tree nesting loss'],
    story_role: 'Root Forager & Seed Planter',
    avatar: '/assets/art/sun-bear.svg',
  },
  'tragulus-kanchil': {
    id: 'mouse-deer',
    slug: 'mouse-deer',
    common_name: 'Lesser Mouse Deer',
    scientific_name: 'Tragulus kanchil',
    red_list_status: 'LC',
    red_list_category: 'Least Concern',
    population_trend: 'stable',
    threats: ['habitat loss', 'understory fire', 'snare poaching'],
    story_role: 'Quick-Footed Understory Messenger',
    avatar: '/assets/art/mouse-deer.svg',
  },
  'rhinoplax-vigil': {
    id: 'helmeted-hornbill',
    slug: 'helmeted-hornbill',
    common_name: 'Helmeted Hornbill',
    scientific_name: 'Rhinoplax vigil',
    red_list_status: 'CR',
    red_list_category: 'Critically Endangered',
    population_trend: 'decreasing',
    threats: ['hunting', 'deforestation', 'loss of ancient emergent trees'],
    story_role: 'Canopy Sentinel',
    avatar: '/assets/art/hornbill.svg',
  },
};

/**
 * Extracts and maps species conservation data for the 5 target species.
 * Accepts either an IUCN Red List API payload or local snapshot array.
 * @param {Object|Array} json - Raw IUCN API response or snapshot array
 * @returns {Array<Object>} Array of normalized Species objects
 */
export function transformIucnSpecies(json) {
  if (!json) return [];

  // Snapshot array format
  if (Array.isArray(json)) {
    return json.map((sp) => normalizeSpecies(sp, 'iucn-redlist'));
  }

  // Single species response from /api/v3/species/{name}
  if (json.result && Array.isArray(json.result)) {
    const records = json.result.map((rec) => {
      const sciKey = String(rec.scientific_name || json.name || '')
        .toLowerCase()
        .replace(/\s+/g, '-');
      const base = TARGET_SPECIES_DEFAULTS[sciKey] || {};
      return normalizeSpecies(
        {
          ...base,
          scientific_name: rec.scientific_name || base.scientific_name,
          red_list_status: rec.category || base.red_list_status,
          population_trend: rec.population_trend || base.population_trend,
          last_assessed: rec.assessment_date || '2024',
        },
        'iucn-redlist'
      );
    });
    return records;
  }

  return Object.values(TARGET_SPECIES_DEFAULTS).map((sp) =>
    normalizeSpecies(sp, 'iucn-redlist')
  );
}

/**
 * Extracts occurrence points from GBIF search responses.
 * Filters records within the Kalimantan geographic bounds.
 * @param {Object|Array} json - Raw GBIF occurrence search response or array
 * @returns {Array<Object>} Array of normalized occurrence records
 */
export function transformGbifOccurrences(json) {
  if (!json) return [];

  const items = Array.isArray(json)
    ? json
    : Array.isArray(json.results)
    ? json.results
    : [];

  return items
    .map((item) => {
      const lat = Number(item.decimalLatitude ?? item.latitude);
      const lon = Number(item.decimalLongitude ?? item.longitude);
      const eventDate = item.eventDate || item.event_date || null;
      let year = Number(item.year);
      if (!year && eventDate) {
        year = new Date(eventDate).getFullYear();
      }

      return {
        id: String(item.key || item.id || `gbif-${Math.random().toString(36).substr(2, 6)}`),
        species: String(item.species || item.vernacularName || item.scientific_name || 'Kalimantan Fauna'),
        scientific_name: String(item.scientificName || item.scientific_name || item.species || ''),
        latitude: lat,
        longitude: lon,
        year: year || 2023,
        event_date: eventDate,
        province: String(item.stateProvince || item.province || 'Kalimantan'),
        locality: String(item.locality || ''),
        basis_of_record: String(item.basisOfRecord || item.basis_of_record || 'HUMAN_OBSERVATION'),
        dataset: String(item.datasetName || item.dataset || 'GBIF Occurrence Records'),
        source_id: 'gbif-occurrences',
      };
    })
    .filter(
      (item) =>
        !isNaN(item.latitude) &&
        !isNaN(item.longitude) &&
        item.latitude >= KALIMANTAN_BBOX.minLat &&
        item.latitude <= KALIMANTAN_BBOX.maxLat &&
        item.longitude >= KALIMANTAN_BBOX.minLon &&
        item.longitude <= KALIMANTAN_BBOX.maxLon
    );
}

/**
 * Simplifies and normalizes protected areas GeoJSON.
 * Ensures valid GeoJSON FeatureCollection structure.
 * @param {Object} geojson - Raw GeoJSON FeatureCollection or object
 * @returns {Object} Normalized GeoJSON FeatureCollection
 */
export function transformProtectedAreas(geojson) {
  if (!geojson) {
    return { type: 'FeatureCollection', features: [] };
  }

  const features = Array.isArray(geojson.features)
    ? geojson.features
    : Array.isArray(geojson)
    ? geojson
    : geojson.type === 'Feature'
    ? [geojson]
    : [];

  return {
    type: 'FeatureCollection',
    features: features.map((feat) => normalizeProtectedArea(feat, 'wdpa-protected-areas')),
  };
}

export default {
  transformFirmsCsv,
  transformIucnSpecies,
  transformGbifOccurrences,
  transformProtectedAreas,
};
