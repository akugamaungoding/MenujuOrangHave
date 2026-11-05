/**
 * /src/schemas.js
 * Schema definitions and normalizers for H.O.M.E. data models.
 * Ensures consistent typings across API responses, static snapshots, and IDB caches.
 */

export const SOURCE_STATUS_CODES = {
  OK: 'OK',
  STALE: 'STALE',
  FAILED: 'FAILED',
  BLOCKED_BY_CORS: 'BLOCKED_BY_CORS',
  NEEDS_KEY: 'NEEDS_KEY',
};

const MANDATORY_DONATION_DISCLAIMER =
  'H.O.M.E. never processes donations. 100% of your contributions go directly to verified partner organizations.';

/**
 * Normalizes a raw fire event (e.g. from NASA FIRMS VIIRS CSV or JSON).
 * @param {Object} raw - Raw fire detection entry
 * @param {string} [sourceId='nasa-firms-viirs'] - ID of source
 * @returns {Object} Normalized FireEvent
 */
export function normalizeFireEvent(raw = {}, sourceId = 'nasa-firms-viirs') {
  const lat = Number(raw.latitude ?? raw.lat ?? 0);
  const lon = Number(raw.longitude ?? raw.lon ?? 0);
  const acqDate = String(raw.acq_date || raw.date || new Date().toISOString().split('T')[0]);
  const rawTime = String(raw.acq_time || raw.time || '0000').padStart(4, '0');
  const hours = rawTime.slice(0, 2);
  const minutes = rawTime.slice(2, 4);

  let timestamp = null;
  try {
    timestamp = new Date(`${acqDate}T${hours}:${minutes}:00Z`).toISOString();
  } catch {
    timestamp = new Date().toISOString();
  }

  const ti4 = Number(raw.bright_ti4 ?? raw.brightness ?? 0);
  const ti5 = Number(raw.bright_ti5 ?? 0);
  const frp = Number(raw.frp ?? 0);

  return {
    id: String(
      raw.id ||
      `${sourceId}-${lat.toFixed(4)}-${lon.toFixed(4)}-${acqDate}-${rawTime}`
    ),
    latitude: lat,
    longitude: lon,
    brightness: ti4 || Number(raw.brightness ?? 0),
    scan: Number(raw.scan ?? 0.375),
    track: Number(raw.track ?? 0.375),
    acq_date: acqDate,
    acq_time: rawTime,
    timestamp,
    satellite: String(raw.satellite || 'N'),
    confidence: String(raw.confidence || 'nominal').toLowerCase(),
    version: String(raw.version || '2.0NRT'),
    bright_ti4: ti4,
    bright_ti5: ti5,
    frp: Math.round(frp * 10) / 10,
    daynight: String(raw.daynight || 'D').toUpperCase() === 'N' ? 'N' : 'D',
    sensor: String(raw.sensor || 'VIIRS'),
    source_id: String(sourceId || raw.source_id || 'nasa-firms-viirs'),
  };
}

/**
 * Normalizes burned area records.
 * @param {Object} raw - Raw burned area record
 * @param {string} [sourceId='burned-area-snapshot'] - ID of source
 * @returns {Object} Normalized BurnedArea
 */
export function normalizeBurnedArea(raw = {}, sourceId = 'burned-area-snapshot') {
  const areaSqkm = Number(raw.area_sqkm ?? (raw.area_ha ? raw.area_ha / 100 : 0));
  const areaHa = Number(raw.area_ha ?? (areaSqkm ? areaSqkm * 100 : 0));

  return {
    id: String(raw.id || `burned-area-${raw.month || 'record'}-${Math.random().toString(36).substr(2, 6)}`),
    month: String(raw.month || raw.date || ''),
    product: String(raw.product || 'MODIS MCD64A1'),
    resolution: String(raw.resolution || '500m'),
    area_sqkm: Math.round(areaSqkm * 10) / 10,
    area_ha: Math.round(areaHa),
    location_name: String(raw.location_name || raw.province || 'Kalimantan Peat Ecosystem'),
    province: String(raw.province || 'Kalimantan'),
    confidence: String(raw.confidence || 'verified'),
    geometry: raw.geometry || null,
    source_id: String(sourceId || raw.source_id || 'burned-area-snapshot'),
  };
}

/**
 * Normalizes species conservation status profile.
 * @param {Object} raw - Raw species entry
 * @param {string} [sourceId='iucn-redlist'] - ID of source
 * @returns {Object} Normalized Species
 */
export function normalizeSpecies(raw = {}, sourceId = 'iucn-redlist') {
  const commonName = String(raw.common_name || raw.name || 'Unknown Species');
  const scientificName = String(raw.scientific_name || raw.taxon_name || '');
  const slug = String(
    raw.slug ||
    raw.id ||
    commonName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  );

  const rawStatus = String(raw.red_list_status || raw.category || raw.iucn_category || 'CR').toUpperCase();
  const validStatuses = ['CR', 'EN', 'VU', 'NT', 'LC', 'DD'];
  const redListStatus = validStatuses.includes(rawStatus) ? rawStatus : 'CR';

  const categoryNames = {
    CR: 'Critically Endangered',
    EN: 'Endangered',
    VU: 'Vulnerable',
    NT: 'Near Threatened',
    LC: 'Least Concern',
    DD: 'Data Deficient',
  };

  const rawThreats = Array.isArray(raw.threats)
    ? raw.threats
    : typeof raw.threats === 'string'
    ? raw.threats.split(',').map((s) => s.trim())
    : ['habitat loss', 'wildfire'];

  return {
    id: slug,
    slug,
    common_name: commonName,
    scientific_name: scientificName,
    red_list_status: redListStatus,
    red_list_category: String(raw.red_list_category || categoryNames[redListStatus] || 'Critically Endangered'),
    population_trend: String(raw.population_trend || raw.trend || 'decreasing').toLowerCase(),
    threats: rawThreats,
    habitat: String(raw.habitat || 'Tropical lowland and peat swamp rainforests'),
    description: String(raw.description || ''),
    story_role: String(raw.story_role || 'Forest Inhabitant'),
    avatar: String(raw.avatar || `/assets/art/${slug}.svg`),
    occurrences_count: Number(raw.occurrences_count ?? 0),
    last_assessed: String(raw.last_assessed || '2024'),
    source_id: String(sourceId || raw.source_id || 'iucn-redlist'),
  };
}

/**
 * Normalizes habitat ecosystems.
 * @param {Object} raw - Raw habitat record
 * @returns {Object} Normalized Habitat
 */
export function normalizeHabitat(raw = {}) {
  const name = String(raw.name || 'Tropical Peat Swamp Forest');
  const id = String(raw.id || raw.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  return {
    id,
    name,
    biome: String(raw.biome || 'Tropical and Subtropical Moist Broadleaf Forests'),
    description: String(raw.description || ''),
    carbon_storage: String(raw.carbon_storage || 'Deep Peat Carbon Dome (>3,000 tC/ha)'),
    peat_depth_meters: Number(raw.peat_depth_meters ?? 4.5),
    threat_level: String(raw.threat_level || 'Critical'),
    key_species: Array.isArray(raw.key_species) ? raw.key_species : [],
    vegetation_type: String(raw.vegetation_type || 'Ombrogenous peat dome and dipterocarp forest'),
    area_remaining_pct: Number(raw.area_remaining_pct ?? 42),
  };
}

/**
 * Normalizes protected area records (GeoJSON Feature compliant).
 * @param {Object} raw - Raw protected area feature or object
 * @param {string} [sourceId='wdpa-protected-areas'] - ID of source
 * @returns {Object} Normalized GeoJSON Feature
 */
export function normalizeProtectedArea(raw = {}, sourceId = 'wdpa-protected-areas') {
  const props = raw.properties || raw;
  const wdpaId = props.WDPAID ?? props.id ?? 0;
  const name = String(props.NAME || props.name || 'Protected Area');

  return {
    type: 'Feature',
    id: String(raw.id || props.WDPAID ? `wdpa-${wdpaId}` : `pa-${Math.random().toString(36).substr(2, 6)}`),
    properties: {
      WDPAID: Number(wdpaId) || wdpaId,
      NAME: name,
      ORIG_NAME: String(props.ORIG_NAME || props.original_name || name),
      DESIG_ENG: String(props.DESIG_ENG || props.designation || 'National Park'),
      IUCN_CAT: String(props.IUCN_CAT || props.iucn_category || 'II'),
      REP_AREA: Number(props.REP_AREA ?? props.area_sqkm ?? 0),
      PROVINCE: String(props.PROVINCE || props.province || 'Kalimantan'),
      STATUS: String(props.STATUS || 'Designated'),
      STATUS_YR: Number(props.STATUS_YR ?? 1990),
      GOV_TYPE: String(props.GOV_TYPE || 'Federal or national ministry'),
      KEY_SPECIES: Array.isArray(props.KEY_SPECIES) ? props.KEY_SPECIES : [],
    },
    geometry: raw.geometry || props.geometry || null,
    source_id: String(sourceId || raw.source_id || 'wdpa-protected-areas'),
  };
}

/**
 * Normalizes animal rescue and rehabilitation stories.
 * @param {Object} raw - Raw rescue record
 * @param {string} [sourceId='iar-yiari'] - ID of source
 * @returns {Object} Normalized RescueStory
 */
export function normalizeRescueStory(raw = {}, sourceId = 'iar-yiari') {
  return {
    id: String(raw.id || `rescue-${Math.random().toString(36).substr(2, 7)}`),
    title: String(raw.title || 'Peat Fire Boundary Rescue'),
    species: String(raw.species || 'Bornean Orangutan'),
    animal_name: String(raw.animal_name || raw.name || 'Unnamed Individual'),
    location: String(raw.location || 'Ketapang, West Kalimantan'),
    coordinates: Array.isArray(raw.coordinates) ? raw.coordinates : [110.15, -1.82],
    year: String(raw.year || '2023'),
    rescue_partner: String(raw.rescue_partner || raw.partner || 'Yayasan IAR Indonesia (YIARI)'),
    narrative: String(raw.narrative || raw.story || ''),
    status: String(raw.status || 'Rehabilitated & Under Forest Monitoring'),
    image_url: String(raw.image_url || ''),
    source_id: String(sourceId || raw.source_id || 'iar-yiari'),
  };
}

/**
 * Normalizes donation and partner call-to-action cards.
 * Enforces strict disclaimer compliance: H.O.M.E. NEVER handles donations.
 * @param {Object} raw - Raw partner CTA entry
 * @returns {Object} Normalized PartnerCta
 */
export function normalizePartnerCta(raw = {}) {
  return {
    id: String(raw.id || `partner-${Math.random().toString(36).substr(2, 6)}`),
    partner_name: String(raw.partner_name || raw.name || 'Conservation Partner'),
    tagline: String(raw.tagline || 'Direct frontline wildlife rescue and habitat regeneration'),
    donation_url: String(raw.donation_url || raw.url || '#'),
    website_url: String(raw.website_url || raw.url || '#'),
    species_supported: Array.isArray(raw.species_supported) ? raw.species_supported : [],
    disclaimer: MANDATORY_DONATION_DISCLAIMER,
    verified: Boolean(raw.verified ?? true),
  };
}

/**
 * Normalizes source health and synchronization status.
 * @param {string} sourceId - ID of the source
 * @param {string} status - One of OK, STALE, FAILED, BLOCKED_BY_CORS, NEEDS_KEY
 * @param {string|number|Date|null} [lastFetched=null] - Last fetch attempt timestamp
 * @param {string|number|Date|null} [lastOk=null] - Last successful fetch timestamp
 * @param {string|Error|null} [error=null] - Error explanation if any
 * @returns {Object} Normalized SourceStatus
 */
export function normalizeSourceStatus(
  sourceId,
  status,
  lastFetched = null,
  lastOk = null,
  error = null
) {
  const allowed = Object.values(SOURCE_STATUS_CODES);
  const safeStatus = allowed.includes(status) ? status : SOURCE_STATUS_CODES.FAILED;

  const toIso = (val) => {
    if (!val) return null;
    try {
      return new Date(val).toISOString();
    } catch {
      return null;
    }
  };

  return {
    source_id: String(sourceId),
    status: safeStatus,
    last_fetched: toIso(lastFetched),
    last_ok: toIso(lastOk),
    error: error ? String(error.message || error) : null,
  };
}

export default {
  SOURCE_STATUS_CODES,
  normalizeFireEvent,
  normalizeBurnedArea,
  normalizeSpecies,
  normalizeHabitat,
  normalizeProtectedArea,
  normalizeRescueStory,
  normalizePartnerCta,
  normalizeSourceStatus,
};
