# H.O.M.E. Static Data Snapshots

This directory contains pre-processed, static fallback datasets for the H.O.M.E. (Hope for Orangutans & Melodic Ecosystems) web application.

## Purpose & Fallback Chain

H.O.M.E. operates on a multi-tier resilient data retrieval architecture designed for high availability and offline responsiveness:

```
[User Request]
       │
       ▼
 1. Live API Fetch (NASA FIRMS, GBIF, IUCN)
       │
       ├─► (Success) ──► Store in IndexedDB ('home-data') ──► Render
       │
       ▼ (CORS Block / Network Failure / Missing Key / Timeout > 10s)
 2. Local IndexedDB Cache ('home-data')
       │
       ├─► (Valid Cache found) ──► Render with 'STALE' or 'OK' badge
       │
       ▼ (Cache missing or empty)
 3. Static Snapshot Fallback (/data-source/*.json)
       │
       ├─► (Loaded successfully) ──► Render with source snapshot attribution
       │
       ▼
 4. Safe Empty State (No broken UI or crashes)
```

Because public environmental APIs (such as the IUCN Red List API and Mongabay RSS feeds) frequently impose strict CORS policies or require individual developer API tokens, these static snapshot files guarantee that every user experiences rich, scientifically accurate storytelling regardless of external service availability.

---

## File Manifest

| File | Description | Primary Upstream Source | Update Cadence |
|---|---|---|---|
| `firms-sample.json` | Sample VIIRS NRT active fire detections across Kalimantan | NASA FIRMS (VIIRS 375m) | Weekly / On-demand |
| `iucn-species.json` | Comprehensive Red List conservation profiles for 5 key species | IUCN Red List API v3 / Red List 2024 | Bi-annual |
| `gbif-occurrences.json` | Verified geographic occurrence points across Kalimantan | GBIF Occurrence API | Quarterly |
| `protected-areas.json` | GeoJSON FeatureCollection of 5 major national parks in Borneo | UNEP-WCMC & IUCN (WDPA) | Annual |
| `burned-area-kalimantan.json` | Historical and recent burned area scars and estimates | MODIS MCD64A1 / Sentinel-2 Level-2A | Monthly |

---

## The 5 Featured Indicator Species

1. **Bornean Orangutan** (*Pongo pygmaeus*) — **Critically Endangered (CR)**
   - *Key threats*: Habitat loss from peatland drainage, agricultural conversion, catastrophic peat fires, hunting.
   - *Focal habitat*: Lowland peat swamp forests below 500m elevation.

2. **Sunda Pangolin** (*Manis javanica*) — **Critically Endangered (CR)**
   - *Key threats*: Heavy commercial poaching and illegal trade, habitat fragmentation, vulnerability to smoldering ground peat smoke.
   - *Focal habitat*: Primary and secondary tropical rainforests, peat margins.

3. **Sun Bear** (*Helarctos malayanus*) — **Vulnerable (VU)**
   - *Key threats*: Deforestation, commercial plantation encroachment, loss of mature hollow nesting trees.
   - *Focal habitat*: Dense evergreen lowland and dipterocarp forests.

4. **Lesser Mouse Deer** (*Tragulus kanchil*) — **Least Concern (LC)**
   - *Key threats*: Brush fires, snare poaching, destruction of understory riparian vegetation.
   - *Focal habitat*: Dense riverine undergrowth and wetland fringes.

5. **Helmeted Hornbill** (*Rhinoplax vigil*) — **Critically Endangered (CR)**
   - *Key threats*: Targeted poaching for keratin hornbill ivory, loss of ancient emergent nesting trees, smoke exposure during breeding.
   - *Focal habitat*: Pristine lowland dipterocarp forests with tall canopies.

---

## Data Update Procedures

### Updating FIRMS Active Fire Data
1. Request an API key from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/).
2. Fetch the latest active fire CSV for the Borneo bounding box (`108.0, -4.5, 119.0, 4.5`):
   ```bash
   curl "https://firms.modaps.eosdis.nasa.gov/api/area/csv/{YOUR_KEY}/VIIRS_SNPP_NRT/108,-4.5,119,4.5/2" -o latest-fires.csv
   ```
3. Use `/src/transforms.js` (`transformFirmsCsv`) to parse, filter, and output valid JSON into `firms-sample.json`.

### Updating IUCN & GBIF Species Data
1. Verify conservation status codes against the official [IUCN Red List](https://www.iucnredlist.org/).
2. Query GBIF API for taxon keys within Kalimantan coordinates (`decimalLatitude=-4.5,4.5&decimalLongitude=108.0,119.0`).
3. Replace records in `gbif-occurrences.json` and `iucn-species.json`.

---

## Scientific Integrity & Guidelines

- **Honest Science Language**: H.O.M.E. never presents speculative wildlife mortality figures. Because ground-truth casualty counts cannot be verified from satellite thermal anomalies alone, telemetry and satellite data are framed strictly around *habitat exposure*, *thermal anomalies*, and *threatened ranges*.
- **No Direct Financial Transactions**: H.O.M.E. does not process, intermediate, or handle charitable funds. All donor calls to action connect directly to vetted partner organizations (such as Yayasan IAR Indonesia and BOS Foundation).
- **Attribution**: All visualizations and datasets must retain explicit source citations complying with the NASA Open Data Policy, UNEP-WCMC terms, and GBIF data agreements.
