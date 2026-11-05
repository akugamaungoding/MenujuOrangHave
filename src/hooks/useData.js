/**
 * /src/hooks/useData.js
 * React hooks for interacting with the H.O.M.E. multi-tier data layer.
 * Provides caching, offline fallbacks, status tracking, and manual refresh controls.
 */

import { useState, useEffect, useCallback } from 'react';
import { SOURCES } from '../sources.js';
import {
  refreshAllSources,
  refreshSource,
  getCachedData,
  getSourceStatus,
  exportAllData,
} from '../refresh.js';
import { SOURCE_STATUS_CODES } from '../schemas.js';

/**
 * Hook to manage data refresh cycles across all or individual sources.
 * Exposes loading state, per-source health status, and export capability.
 */
export function useDataRefresh() {
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [error, setError] = useState(null);

  // Load initial statuses on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialStatuses() {
      const statusMap = {};
      for (const source of SOURCES) {
        const s = await getSourceStatus(source.id);
        statusMap[source.id] = s;
      }
      if (isMounted) {
        setStatuses(statusMap);
      }
    }

    loadInitialStatuses();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await refreshAllSources();
      const updatedStatuses = {};
      Object.keys(results).forEach((id) => {
        updatedStatuses[id] = {
          source_id: id,
          status: results[id].status,
          last_ok: results[id].lastOk,
          error: results[id].error,
        };
      });
      setStatuses(updatedStatuses);
      setLastRefreshed(new Date().toISOString());
      return results;
    } catch (err) {
      setError(err.message || 'Failed refreshing sources');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSingle = useCallback(async (sourceId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await refreshSource(sourceId);
      const st = await getSourceStatus(sourceId);
      setStatuses((prev) => ({ ...prev, [sourceId]: st }));
      return data;
    } catch (err) {
      setError(err.message || `Failed to refresh source ${sourceId}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    statuses,
    lastRefreshed,
    error,
    refreshAll,
    refreshSingle,
    exportData: exportAllData,
  };
}

/**
 * Hook to consume active fire detections (NASA FIRMS VIIRS).
 * Automatically falls back to local snapshot if live API or key is missing.
 */
export function useFireData() {
  const [fireEvents, setFireEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(SOURCE_STATUS_CODES.STALE);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        let data = await getCachedData('nasa-firms-viirs');
        if (!data || data.length === 0) {
          data = await refreshSource('nasa-firms-viirs');
        }

        const st = await getSourceStatus('nasa-firms-viirs');

        if (isMounted) {
          setFireEvents(Array.isArray(data) ? data : []);
          setStatus(st.status);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading fire data');
          setStatus(SOURCE_STATUS_CODES.FAILED);
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refreshSource('nasa-firms-viirs');
      const st = await getSourceStatus('nasa-firms-viirs');
      setStatus(st.status);
      setFireEvents(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || 'Error refreshing fire data');
      setStatus(SOURCE_STATUS_CODES.FAILED);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fireEvents,
    loading,
    error,
    status,
    refresh,
  };
}

/**
 * Hook to consume conservation profiles for the 5 key species.
 */
export function useSpeciesData() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(SOURCE_STATUS_CODES.STALE);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        let data = await getCachedData('iucn-redlist');
        if (!data || data.length === 0) {
          data = await refreshSource('iucn-redlist');
        }

        const st = await getSourceStatus('iucn-redlist');

        if (isMounted) {
          setSpecies(Array.isArray(data) ? data : []);
          setStatus(st.status);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading species data');
          setStatus(SOURCE_STATUS_CODES.FAILED);
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refreshSource('iucn-redlist');
      const st = await getSourceStatus('iucn-redlist');
      setStatus(st.status);
      setSpecies(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || 'Error refreshing species data');
      setStatus(SOURCE_STATUS_CODES.FAILED);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    species,
    loading,
    error,
    status,
    refresh,
  };
}

/**
 * Hook to consume protected areas GeoJSON in Kalimantan.
 */
export function useProtectedAreas() {
  const [protectedAreas, setProtectedAreas] = useState({
    type: 'FeatureCollection',
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(SOURCE_STATUS_CODES.STALE);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        let data = await getCachedData('wdpa-protected-areas');
        if (!data || !data.features || data.features.length === 0) {
          data = await refreshSource('wdpa-protected-areas');
        }

        const st = await getSourceStatus('wdpa-protected-areas');

        if (isMounted) {
          if (data && data.features) {
            setProtectedAreas(data);
          } else {
            setProtectedAreas({ type: 'FeatureCollection', features: [] });
          }
          setStatus(st.status);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading protected areas');
          setStatus(SOURCE_STATUS_CODES.FAILED);
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refreshSource('wdpa-protected-areas');
      const st = await getSourceStatus('wdpa-protected-areas');
      setStatus(st.status);
      if (data && data.features) {
        setProtectedAreas(data);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error refreshing protected areas');
      setStatus(SOURCE_STATUS_CODES.FAILED);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    protectedAreas,
    loading,
    error,
    status,
    refresh,
  };
}

export default {
  useDataRefresh,
  useFireData,
  useSpeciesData,
  useProtectedAreas,
};
