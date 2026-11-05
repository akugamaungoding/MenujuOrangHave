/**
 * /src/refresh.js
 * Resilient multi-tier data refresh and synchronization engine for H.O.M.E.
 * Features:
 * - Fallback chain: Live API -> IndexedDB Cache -> Static Snapshot -> null
 * - Parallel execution with 10s timeout and 1 automatic retry
 * - Explicit CORS failure detection (BLOCKED_BY_CORS)
 * - Missing API key detection (NEEDS_KEY) via localStorage and import.meta.env
 * - IndexedDB storage under 'home-data' database
 * - Complete data export for offline backup
 */

import { openDB } from 'idb';
import { SOURCES } from './sources.js';
import {
  SOURCE_STATUS_CODES,
  normalizeSourceStatus,
} from './schemas.js';

const DB_NAME = 'home-data';
const DB_VERSION = 1;
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRIES = 1;

// In-memory fallback if IndexedDB is unavailable
const memoryCache = new Map();
const memoryStatus = new Map();

let dbPromise = null;

/**
 * Initializes and returns the IndexedDB instance.
 */
async function getDb() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('status')) {
          db.createObjectStore('status', { keyPath: 'id' });
        }
      },
    }).catch((err) => {
      console.warn('H.O.M.E. IndexedDB initialization warning:', err);
      return null;
    });
  }
  return dbPromise;
}

/**
 * Resolves API key from localStorage or Vite environment variables.
 * Format in localStorage: `home_key_${keyName}`
 * Format in env: `VITE_${keyName}`
 * @param {string} keyName - Name of the key
 * @returns {string|null} Resolved key or null
 */
export function getApiKey(keyName) {
  if (!keyName) return null;

  // 1. Check user-configured key in localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userKey = window.localStorage.getItem(`home_key_${keyName}`);
      if (userKey && userKey.trim().length > 0) {
        return userKey.trim();
      }
    }
  } catch (err) {
    console.warn(`Failed reading localStorage for ${keyName}:`, err);
  }

  // 2. Check bundled environment variable
  try {
    const envKey = import.meta.env[`VITE_${keyName}`];
    if (envKey && String(envKey).trim().length > 0) {
      return String(envKey).trim();
    }
  } catch {
    // env not available
  }

  return null;
}

/**
 * Saves status into IndexedDB and memory cache.
 */
async function persistStatus(sourceId, status, lastFetched, lastOk, error) {
  const record = normalizeSourceStatus(sourceId, status, lastFetched, lastOk, error);
  record.id = sourceId;

  memoryStatus.set(sourceId, record);

  try {
    const db = await getDb();
    if (db) {
      await db.put('status', record);
    }
  } catch (err) {
    console.warn(`Could not persist status for ${sourceId}:`, err);
  }

  return record;
}

/**
 * Saves cached data into IndexedDB and memory cache.
 */
async function persistCache(sourceId, data) {
  const item = {
    id: sourceId,
    data,
    timestamp: Date.now(),
  };

  memoryCache.set(sourceId, item);

  try {
    const db = await getDb();
    if (db) {
      await db.put('cache', item);
    }
  } catch (err) {
    console.warn(`Could not persist cache for ${sourceId}:`, err);
  }
}

/**
 * Retrieves cached data from IndexedDB or memory cache.
 * @param {string} sourceId - ID of data source
 * @returns {Promise<any|null>} Cached payload or null
 */
export async function getCachedData(sourceId) {
  if (!sourceId) return null;

  // 1. Check memory cache first
  if (memoryCache.has(sourceId)) {
    return memoryCache.get(sourceId).data;
  }

  // 2. Check IndexedDB
  try {
    const db = await getDb();
    if (db) {
      const item = await db.get('cache', sourceId);
      if (item && item.data !== undefined) {
        memoryCache.set(sourceId, item);
        return item.data;
      }
    }
  } catch (err) {
    console.warn(`Failed reading IndexedDB cache for ${sourceId}:`, err);
  }

  // 3. If nothing in cache, try loading the snapshot file directly
  const source = SOURCES.find((s) => s.id === sourceId);
  if (source?.snapshot) {
    try {
      const snapRes = await fetch(source.snapshot);
      if (snapRes.ok) {
        const snapJson = await snapRes.json();
        const finalData = source.transform ? source.transform(snapJson) : snapJson;
        await persistCache(sourceId, finalData);
        return finalData;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Returns the current synchronization status of a source.
 * @param {string} sourceId - Source identifier
 * @returns {Promise<Object>} Normalized SourceStatus
 */
export async function getSourceStatus(sourceId) {
  if (!sourceId) {
    return normalizeSourceStatus('unknown', SOURCE_STATUS_CODES.FAILED, null, null, 'No source ID');
  }

  if (memoryStatus.has(sourceId)) {
    return memoryStatus.get(sourceId);
  }

  try {
    const db = await getDb();
    if (db) {
      const record = await db.get('status', sourceId);
      if (record) {
        memoryStatus.set(sourceId, record);
        return record;
      }
    }
  } catch (err) {
    console.warn(`Failed reading status for ${sourceId}:`, err);
  }

  return normalizeSourceStatus(sourceId, SOURCE_STATUS_CODES.STALE, null, null, null);
}

/**
 * Checks whether an error is caused by browser CORS restriction.
 */
function isCorsError(error) {
  if (!error) return false;
  if (error.name === 'TypeError') {
    const msg = String(error.message || '');
    return (
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError') ||
      msg.includes('Load failed') ||
      msg.toLowerCase().includes('cors') ||
      msg.length === 0
    );
  }
  return false;
}

/**
 * Executes a network fetch with timeout and retry logic.
 */
async function fetchWithRetry(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS, maxRetries = MAX_RETRIES) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      attempt++;
      if (attempt <= maxRetries) {
        // 500ms backoff before retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError;
}

/**
 * Loads the static snapshot for a source as fallback.
 */
async function loadSnapshotFallback(source) {
  if (!source.snapshot) return null;
  try {
    const res = await fetch(source.snapshot);
    if (!res.ok) {
      throw new Error(`Failed to load snapshot ${source.snapshot} (${res.status})`);
    }
    const json = await res.json();
    const data = source.transform ? source.transform(json) : json;
    await persistCache(source.id, data);
    return data;
  } catch (err) {
    console.warn(`Snapshot fallback failed for ${source.id}:`, err);
    return null;
  }
}

/**
 * Refreshes a single data source adhering strictly to the fallback chain:
 * Live Fetch -> IndexedDB Cache -> Snapshot File -> null
 * @param {Object|string} sourceOrId - Source object or ID
 * @returns {Promise<any|null>} Transformed source data or null
 */
export async function refreshSource(sourceOrId) {
  const source = typeof sourceOrId === 'string'
    ? SOURCES.find((s) => s.id === sourceOrId)
    : sourceOrId;

  if (!source) {
    return null;
  }

  if (source.enabled === false) {
    return getCachedData(source.id);
  }

  // 1. Check if source requires an API Key that is currently missing
  let apiKey = null;
  if (source.keyName) {
    apiKey = getApiKey(source.keyName);
    if (!apiKey) {
      // Mark as NEEDS_KEY and attempt fallback chain
      const cached = await getCachedData(source.id);
      if (cached) {
        await persistStatus(
          source.id,
          SOURCE_STATUS_CODES.NEEDS_KEY,
          Date.now(),
          null,
          `API key '${source.keyName}' required. Showing cached data.`
        );
        return cached;
      }

      const snapshotData = await loadSnapshotFallback(source);
      await persistStatus(
        source.id,
        SOURCE_STATUS_CODES.NEEDS_KEY,
        Date.now(),
        Date.now(),
        `API key '${source.keyName}' required. Showing static snapshot.`
      );
      return snapshotData;
    }
  }

  // 2. Link & Tile types do not fetch arbitrary data payloads directly
  if (source.type === 'link' || source.type === 'tile') {
    const metaData = { id: source.id, url: source.url, type: source.type };
    await persistCache(source.id, metaData);
    await persistStatus(source.id, SOURCE_STATUS_CODES.OK, Date.now(), Date.now(), null);
    return metaData;
  }

  // 3. Static type directly loads snapshot
  if (source.type === 'static') {
    try {
      const snapData = await loadSnapshotFallback(source);
      if (snapData) {
        await persistStatus(source.id, SOURCE_STATUS_CODES.OK, Date.now(), Date.now(), null);
        return snapData;
      }
    } catch (err) {
      await persistStatus(source.id, SOURCE_STATUS_CODES.FAILED, Date.now(), null, err.message);
      return null;
    }
  }

  // 4. Live API / CSV Fetch
  let fetchUrl = source.url;
  if (apiKey) {
    fetchUrl = fetchUrl.replace('{KEY}', encodeURIComponent(apiKey));
  }

  try {
    const response = await fetchWithRetry(fetchUrl);
    let parsedData = null;

    if (source.parse === 'csv') {
      const text = await response.text();
      parsedData = source.transform ? source.transform(text) : text;
    } else {
      const json = await response.json();
      parsedData = source.transform ? source.transform(json) : json;
    }

    if (Array.isArray(parsedData) && source.keep && source.keep > 0) {
      parsedData = parsedData.slice(0, source.keep);
    }

    await persistCache(source.id, parsedData);
    await persistStatus(source.id, SOURCE_STATUS_CODES.OK, Date.now(), Date.now(), null);
    return parsedData;
  } catch (err) {
    console.warn(`Live refresh failed for ${source.id}:`, err);

    let failureStatus = SOURCE_STATUS_CODES.FAILED;
    if (isCorsError(err)) {
      failureStatus = SOURCE_STATUS_CODES.BLOCKED_BY_CORS;
    }

    // Step A of Fallback: Try IndexedDB Cache
    try {
      const db = await getDb();
      if (db) {
        const item = await db.get('cache', source.id);
        if (item && item.data !== undefined) {
          const ageHours = (Date.now() - (item.timestamp || 0)) / (1000 * 60 * 60);
          const isStale = ageHours > (source.maxAgeHours || 24);
          const finalStatus = isStale ? SOURCE_STATUS_CODES.STALE : failureStatus;

          await persistStatus(
            source.id,
            finalStatus,
            Date.now(),
            item.timestamp,
            `${err.message} (Serving IndexedDB cache)`
          );
          return item.data;
        }
      }
    } catch (cacheErr) {
      console.warn(`Error reading IDB cache on failure fallback for ${source.id}:`, cacheErr);
    }

    // Step B of Fallback: Static Snapshot file
    const snapshotData = await loadSnapshotFallback(source);
    if (snapshotData) {
      await persistStatus(
        source.id,
        failureStatus,
        Date.now(),
        Date.now(),
        `${err.message} (Serving static snapshot fallback)`
      );
      return snapshotData;
    }

    // Step C: Complete failure
    await persistStatus(source.id, failureStatus, Date.now(), null, err.message);
    return null;
  }
}

/**
 * Refreshes all enabled sources in parallel with 10s timeout and 1 retry.
 * @returns {Promise<Object>} Map of source results keyed by source.id
 */
export async function refreshAllSources() {
  const enabledSources = SOURCES.filter((s) => s.enabled !== false);

  const results = await Promise.allSettled(
    enabledSources.map(async (source) => {
      const data = await refreshSource(source);
      const status = await getSourceStatus(source.id);
      return {
        id: source.id,
        data,
        status: status.status,
        lastOk: status.last_ok,
        error: status.error,
      };
    })
  );

  const resultMap = {};
  results.forEach((res, index) => {
    const sourceId = enabledSources[index].id;
    if (res.status === 'fulfilled') {
      resultMap[sourceId] = res.value;
    } else {
      resultMap[sourceId] = {
        id: sourceId,
        data: null,
        status: SOURCE_STATUS_CODES.FAILED,
        lastOk: null,
        error: res.reason ? String(res.reason.message || res.reason) : 'Unknown execution error',
      };
    }
  });

  return resultMap;
}

/**
 * Exports all cached records and status metadata as a JSON string for offline download.
 * @returns {Promise<string>} Stringified JSON payload
 */
export async function exportAllData() {
  const exportPayload = {
    app: 'H.O.M.E. - Hope for Orangutans & Melodic Ecosystems',
    version: '1.0.0',
    exported_at: new Date().toISOString(),
    statuses: {},
    cache: {},
  };

  try {
    const db = await getDb();
    if (db) {
      const allStatuses = await db.getAll('status');
      allStatuses.forEach((st) => {
        exportPayload.statuses[st.id] = st;
      });

      const allCaches = await db.getAll('cache');
      allCaches.forEach((c) => {
        exportPayload.cache[c.id] = c;
      });
    } else {
      memoryStatus.forEach((val, key) => {
        exportPayload.statuses[key] = val;
      });
      memoryCache.forEach((val, key) => {
        exportPayload.cache[key] = val;
      });
    }
  } catch (err) {
    console.warn('Error during exportAllData:', err);
  }

  return JSON.stringify(exportPayload, null, 2);
}

export default {
  refreshAllSources,
  refreshSource,
  getCachedData,
  getSourceStatus,
  exportAllData,
  getApiKey,
  SOURCE_STATUS_CODES,
};
