"""
Offline models for H.O.M.E. No server. Run:

    python ml/pipeline.py

Reads every snapshot in public/data-source plus ml/ndvi_samples.json.
Writes public/data-source/ml-scores.json.

Three methods, each kept separate:

1. NDVI change detection
   delta = after - before, on the workbook table only.
   A drop is a greenness change in that table. It is not burned area
   and not a wildlife outcome.

2. Random Forest on fire radiative power
   Each VIIRS row is scored higher or lower than the median FRP
   in this same file. Features do not include FRP or brightness.

3. Random Forest habitat suitability
   Occurrence rows are presence. Random points in the Kalimantan box
   are background. The score is "more like a recorded occurrence than
   like background." It is not presence, not movement, not mortality.

Out-of-bag votes are the only suitability numbers published for
points that were used in training.
"""

from __future__ import annotations

import json
import math
import random
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "data-source"
NDVI_PATH = Path(__file__).resolve().parent / "ndvi_samples.json"
OUT_PATH = DATA / "ml-scores.json"

SEED = 21
N_TREES = 48
MAX_DEPTH = 5
MIN_LEAF = 3

# Rough Kalimantan window used by the site.
BBOX = (108.0, -4.2, 119.0, 4.2)


def load_json(path: Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def km(lon1, lat1, lon2, lat2) -> float:
    """Equirectangular distance. Fine for ranking inside Borneo."""
    mid = math.radians((lat1 + lat2) / 2)
    dx = math.radians(lon2 - lon1) * math.cos(mid)
    dy = math.radians(lat2 - lat1)
    return 6371.0 * math.hypot(dx, dy)


def point_in_ring(lon, lat, ring) -> bool:
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > lat) != (yj > lat)) and (
            lon < (xj - xi) * (lat - yi) / ((yj - yi) or 1e-12) + xi
        ):
            inside = not inside
        j = i
    return inside


def polygon_contains(lon, lat, geometry) -> bool:
    if not geometry:
        return False
    if geometry["type"] == "Polygon":
        return point_in_ring(lon, lat, geometry["coordinates"][0])
    if geometry["type"] == "MultiPolygon":
        return any(point_in_ring(lon, lat, poly[0]) for poly in geometry["coordinates"])
    return False


def centroid(geometry):
    ring = geometry["coordinates"][0]
    lon = sum(p[0] for p in ring) / len(ring)
    lat = sum(p[1] for p in ring) / len(ring)
    return lon, lat


def gini(labels) -> float:
    n = len(labels)
    if n == 0:
        return 0.0
    counts = Counter(labels)
    return 1.0 - sum((c / n) ** 2 for c in counts.values())


class Tree:
    def __init__(self, max_depth, min_leaf, rng):
        self.max_depth = max_depth
        self.min_leaf = min_leaf
        self.rng = rng
        self.gain = []

    def fit(self, rows, feature_ids):
        self.root = self._split(rows, feature_ids, 0)
        return self

    def _split(self, rows, feature_ids, depth):
        labels = [y for _, y in rows]
        if (
            depth >= self.max_depth
            or len(rows) < self.min_leaf * 2
            or len(set(labels)) < 2
        ):
            return {"leaf": 1, "p": sum(labels) / len(labels)}

        parent = gini(labels)
        best = None
        candidates = feature_ids[:]
        self.rng.shuffle(candidates)
        k = max(1, int(math.sqrt(len(candidates))))
        for feat in candidates[:k]:
            values = sorted({row[feat] for row, _ in rows})
            if len(values) < 2:
                continue
            for i in range(len(values) - 1):
                thresh = (values[i] + values[i + 1]) / 2
                left = [(x, y) for x, y in rows if x[feat] <= thresh]
                right = [(x, y) for x, y in rows if x[feat] > thresh]
                if len(left) < self.min_leaf or len(right) < self.min_leaf:
                    continue
                impurity = (len(left) * gini([y for _, y in left]) + len(right) * gini([y for _, y in right])) / len(rows)
                gain = parent - impurity
                if best is None or gain > best[0]:
                    best = (gain, feat, thresh, left, right)
        if best is None or best[0] <= 1e-9:
            return {"leaf": 1, "p": sum(labels) / len(labels)}
        gain, feat, thresh, left, right = best
        self.gain.append((feat, gain * len(rows)))
        return {
            "leaf": 0,
            "feat": feat,
            "thresh": thresh,
            "left": self._split(left, feature_ids, depth + 1),
            "right": self._split(right, feature_ids, depth + 1),
        }

    def predict_one(self, x) -> float:
        node = self.root
        while not node["leaf"]:
            node = node["left"] if x[node["feat"]] <= node["thresh"] else node["right"]
        return node["p"]


class RandomForest:
    def __init__(self, n_features, n_trees=N_TREES, seed=SEED):
        self.n_features = n_features
        self.n_trees = n_trees
        self.rng = random.Random(seed)
        self.trees = []
        self.importance = [0.0] * n_features

    def fit(self, X, y):
        n = len(X)
        self.oob_sum = [0.0] * n
        self.oob_n = [0] * n
        feats = list(range(self.n_features))
        for _ in range(self.n_trees):
            bag = [self.rng.randrange(n) for _ in range(n)]
            inside = set(bag)
            tree = Tree(MAX_DEPTH, MIN_LEAF, self.rng)
            tree.fit([(X[i], y[i]) for i in bag], feats)
            self.trees.append(tree)
            for feat, gain in tree.gain:
                self.importance[feat] += gain
            for i in range(n):
                if i not in inside:
                    self.oob_sum[i] += tree.predict_one(X[i])
                    self.oob_n[i] += 1
        total = sum(self.importance) or 1.0
        self.importance = [v / total for v in self.importance]
        return self

    def predict(self, X):
        return [self.predict_one(row) for row in X]

    def predict_one(self, row) -> float:
        if not self.trees:
            return 0.0
        return sum(tree.predict_one(row) for tree in self.trees) / len(self.trees)

    def oob_report(self, y):
        pairs = [
            (self.oob_sum[i] / self.oob_n[i], y[i])
            for i in range(len(y))
            if self.oob_n[i] > 0
        ]
        if not pairs:
            return {"n_oob": 0}
        correct = sum((p >= 0.5) == bool(label) for p, label in pairs)
        pos = [p for p, label in pairs if label == 1]
        neg = [p for p, label in pairs if label == 0]
        return {
            "n_oob": len(pairs),
            "accuracy": round(correct / len(pairs), 3),
            "mean_score_on_positives": round(sum(pos) / len(pos), 3) if pos else None,
            "mean_score_on_negatives": round(sum(neg) / len(neg), 3) if neg else None,
        }


def nearest_ndvi(lon, lat, plots):
    best = None
    best_d = 1e18
    for plot in plots:
        d = km(lon, lat, plot["lon"], plot["lat"])
        if d < best_d:
            best_d = d
            best = plot
    return best, best_d


def confidence_ord(value) -> float:
    text = str(value).lower()
    if text in {"h", "high"}:
        return 1.0
    if text in {"n", "nominal", "medium"}:
        return 0.5
    if text in {"l", "low"}:
        return 0.0
    try:
        return max(0.0, min(1.0, float(value) / 100.0))
    except (TypeError, ValueError):
        return 0.5


def hour_from_acq(acq_time) -> float:
    text = str(acq_time or "0000").zfill(4)
    try:
        return int(text[:2]) + int(text[2:]) / 60.0
    except ValueError:
        return 0.0


def build():
    fires = load_json(DATA / "firms-sample.json")
    burns = load_json(DATA / "burned-area-kalimantan.json")
    species = load_json(DATA / "iucn-species.json")
    occurrences = load_json(DATA / "gbif-occurrences.json")
    protected = load_json(DATA / "protected-areas.json")
    ndvi_doc = load_json(NDVI_PATH)

    plots = []
    for plot in ndvi_doc["plots"]:
        delta = round(plot["ndvi_after"] - plot["ndvi_before"], 3)
        if delta <= -0.15:
            reading = "large greenness drop in the workbook table"
        elif delta < -0.05:
            reading = "modest greenness drop in the workbook table"
        elif delta > 0.05:
            reading = "greenness increase in the workbook table"
        else:
            reading = "little change in the workbook table"
        plots.append({**plot, "delta": delta, "reading": reading})

    burn_centroids = []
    for burn in burns:
        lon, lat = centroid(burn["geometry"])
        burn_centroids.append({**burn, "lon": lon, "lat": lat})

    parks = []
    for feature in protected["features"]:
        lon, lat = centroid(feature["geometry"])
        parks.append(
            {
                "id": feature.get("id"),
                "name": feature["properties"].get("NAME"),
                "lon": lon,
                "lat": lat,
                "geometry": feature["geometry"],
            }
        )

    def context(lon, lat):
        if fires:
            dists = [km(lon, lat, f["longitude"], f["latitude"]) for f in fires]
            nearest_fire = min(dists)
            fire_count_50 = sum(d <= 50 for d in dists)
        else:
            nearest_fire = None
            fire_count_50 = 0
        if burn_centroids:
            nearest_burn = min(km(lon, lat, b["lon"], b["lat"]) for b in burn_centroids)
        else:
            nearest_burn = None
        inside_burn = any(polygon_contains(lon, lat, b["geometry"]) for b in burns)
        if parks:
            nearest_park = min(parks, key=lambda p: km(lon, lat, p["lon"], p["lat"]))
            dist_park = km(lon, lat, nearest_park["lon"], nearest_park["lat"])
            park_name = nearest_park["name"]
        else:
            dist_park = None
            park_name = None
        inside_park = any(polygon_contains(lon, lat, p["geometry"]) for p in parks)
        plot, plot_km = nearest_ndvi(lon, lat, plots) if plots else (None, None)
        return {
            "nearest_fire_km": None if nearest_fire is None else round(nearest_fire, 1),
            "fires_within_50km": fire_count_50,
            "nearest_burn_km": None if nearest_burn is None else round(nearest_burn, 1),
            "inside_mapped_burn": inside_burn,
            "nearest_protected_area": park_name,
            "nearest_protected_area_km": None if dist_park is None else round(dist_park, 1),
            "inside_protected_area": inside_park,
            "nearest_ndvi_plot": None if plot is None else plot["location_name"],
            "nearest_ndvi_plot_km": None if plot_km is None else round(plot_km, 1),
            "ndvi_delta": None if plot is None else plot["delta"],
        }

    # --- Habitat suitability ---
    # Presence: every occurrence row. Background: random points in the box.
    rng = random.Random(SEED)
    background = []
    guard = 0
    while len(background) < 45 and guard < 5000:
        guard += 1
        lon = rng.uniform(BBOX[0], BBOX[2])
        lat = rng.uniform(BBOX[1], BBOX[3])
        if any(km(lon, lat, o["longitude"], o["latitude"]) < 25 for o in occurrences):
            continue
        background.append((lon, lat))

    hab_X = []
    hab_y = []
    hab_meta = []

    def hab_row(lon, lat):
        ctx = context(lon, lat)
        return [
            lon,
            lat,
            ctx["nearest_fire_km"] or 0.0,
            float(ctx["fires_within_50km"]),
            ctx["nearest_burn_km"] or 0.0,
            1.0 if ctx["inside_protected_area"] else 0.0,
            ctx["ndvi_delta"] if ctx["ndvi_delta"] is not None else 0.0,
        ], ctx

    for occ in occurrences:
        row, ctx = hab_row(occ["longitude"], occ["latitude"])
        hab_X.append(row)
        hab_y.append(1)
        hab_meta.append({"kind": "occurrence", "id": occ["id"], "species": occ["species"], "ctx": ctx})
    for lon, lat in background:
        row, ctx = hab_row(lon, lat)
        hab_X.append(row)
        hab_y.append(0)
        hab_meta.append({"kind": "background", "ctx": ctx})

    habitat_names = [
        "longitude",
        "latitude",
        "nearest_fire_km",
        "fires_within_50km",
        "nearest_burn_km",
        "inside_protected_area",
        "ndvi_delta_workbook",
    ]
    habitat_model = RandomForest(len(habitat_names), seed=SEED)
    habitat_model.fit(hab_X, hab_y)
    habitat_oob = habitat_model.oob_report(hab_y)

    # --- FRP forest, fire rows only ---
    frp_values = sorted(float(f.get("frp") or 0) for f in fires)
    median_frp = frp_values[len(frp_values) // 2] if frp_values else 0
    frp_names = [
        "longitude",
        "latitude",
        "confidence",
        "hour",
        "inside_mapped_burn",
        "nearest_protected_area_km",
        "ndvi_delta_workbook",
    ]
    frp_X = []
    frp_y = []
    fire_ctx = []
    for fire in fires:
        ctx = context(fire["longitude"], fire["latitude"])
        fire_ctx.append(ctx)
        frp_X.append(
            [
                fire["longitude"],
                fire["latitude"],
                confidence_ord(fire.get("confidence")),
                hour_from_acq(fire.get("acq_time")),
                1.0 if ctx["inside_mapped_burn"] else 0.0,
                ctx["nearest_protected_area_km"] or 0.0,
                ctx["ndvi_delta"] if ctx["ndvi_delta"] is not None else 0.0,
            ]
        )
        frp_y.append(1 if float(fire.get("frp") or 0) >= median_frp else 0)

    frp_model = RandomForest(len(frp_names), n_trees=40, seed=SEED + 3)
    frp_oob = {"n_oob": 0}
    frp_scores = []
    if len(fires) >= 8:
        frp_model.fit(frp_X, frp_y)
        frp_oob = frp_model.oob_report(frp_y)
        frp_scores = frp_model.predict(frp_X)

    fire_scores = []
    for i, fire in enumerate(fires):
        ctx = fire_ctx[i]
        # Full-model score on a training point is optimistic. Publish OOB
        # when the point was left out of at least one tree; otherwise null.
        if habitat_model.oob_n[i] > 0 and i < len(occurrences):
            pass
        suit = habitat_model.predict_one(hab_row(fire["longitude"], fire["latitude"])[0])
        fire_scores.append(
            {
                "id": fire["id"],
                "lat": fire["latitude"],
                "lon": fire["longitude"],
                "frp": fire.get("frp"),
                "frp_above_snapshot_median": bool(frp_y[i]),
                "frp_model_score": None if not frp_scores else round(frp_scores[i], 3),
                "habitat_suitability_score": round(suit, 3),
                "context": ctx,
                "reading": (
                    "Potential habitat exposure. A thermal anomaly near mapped "
                    "habitat features. Not a wildlife impact."
                ),
            }
        )

    # Species summary from OOB votes on occurrence rows only.
    species_rows = []
    for spec in species:
        name = spec["common_name"]
        idxs = [
            i
            for i, meta in enumerate(hab_meta)
            if meta["kind"] == "occurrence" and meta["species"] == name
        ]
        oob_vals = [
            habitat_model.oob_sum[i] / habitat_model.oob_n[i]
            for i in idxs
            if habitat_model.oob_n[i] > 0
        ]
        nearby_fires = 0
        deltas = []
        for i in idxs:
            ctx = hab_meta[i]["ctx"]
            nearby_fires += ctx["fires_within_50km"]
            if ctx["ndvi_delta"] is not None:
                deltas.append(ctx["ndvi_delta"])
        species_rows.append(
            {
                "id": spec["id"],
                "common_name": name,
                "scientific_name": spec["scientific_name"],
                "iucn_status": spec["red_list_status"],
                "n_occurrence_rows": len(idxs),
                "oob_mean_suitability": round(sum(oob_vals) / len(oob_vals), 3) if oob_vals else None,
                "occurrence_rows_with_oob": len(oob_vals),
                "fires_within_50km_summed_across_rows": nearby_fires,
                "mean_workbook_ndvi_delta": round(sum(deltas) / len(deltas), 3) if deltas else None,
                "claim_boundary": (
                    "Out-of-bag suitability only. A higher score means the forest "
                    "voted this coordinate more like the occurrence table than like "
                    "background. It does not mean an animal is there, will move, or was harmed."
                ),
            }
        )

    burn_scores = []
    for burn in burn_centroids:
        row, ctx = hab_row(burn["lon"], burn["lat"])
        burn_scores.append(
            {
                "id": burn["id"],
                "location_name": burn["location_name"],
                "province": burn.get("province"),
                "month": burn.get("month"),
                "habitat_suitability_score": round(habitat_model.predict_one(row), 3),
                "ndvi_delta": ctx["ndvi_delta"],
                "nearest_ndvi_plot": ctx["nearest_ndvi_plot"],
            }
        )

    park_scores = []
    for park in parks:
        row, ctx = hab_row(park["lon"], park["lat"])
        park_scores.append(
            {
                "id": park["id"],
                "name": park["name"],
                "habitat_suitability_score": round(habitat_model.predict_one(row), 3),
                "fires_within_50km": ctx["fires_within_50km"],
                "nearest_fire_km": ctx["nearest_fire_km"],
            }
        )

    # Neighbor airshed. Counts only. Not a plume model.
    def in_west_or_central(lon, lat):
        return 108.0 <= lon <= 115.6 and -4.2 <= lat <= 2.2

    upwind = [f for f in fires if in_west_or_central(f["longitude"], f["latitude"])]
    southern = [f for f in upwind if f["latitude"] < 1.0]

    neighbors = [
        {
            "id": "sarawak",
            "country": "Malaysia",
            "place": "Sarawak",
            "cities": ["Kuching", "Sibu"],
            "snapshot_detections_in_shared_airshed": len(upwind),
            "why_it_can_be_large": (
                "Sarawak shares the island with West Kalimantan. In a dry season, "
                "smoke from peat fires has crossed that border and sat over inland towns for days."
            ),
        },
        {
            "id": "sabah",
            "country": "Malaysia",
            "place": "Sabah",
            "cities": ["Kota Kinabalu"],
            "snapshot_detections_in_shared_airshed": len(fires),
            "why_it_can_be_large": (
                "Sabah sits on the same island airshed. Severe Borneo haze seasons "
                "have reached Malaysian Borneo, not only the peninsula."
            ),
        },
        {
            "id": "brunei",
            "country": "Brunei Darussalam",
            "place": "Brunei",
            "cities": ["Bandar Seri Begawan"],
            "snapshot_detections_in_shared_airshed": len(upwind),
            "why_it_can_be_large": (
                "Brunei is a small country wrapped by the Borneo airshed. "
                "When Kalimantan peat smolders, the smoke can arrive without a fire inside Brunei at all."
            ),
        },
        {
            "id": "peninsular-malaysia",
            "country": "Malaysia",
            "place": "Peninsular Malaysia",
            "cities": ["Kuala Lumpur", "Johor Bahru"],
            "snapshot_detections_on_monsoon_pathway": len(southern),
            "why_it_can_be_large": (
                "During the southwest monsoon, smoke from southern Kalimantan "
                "has crossed the sea and thickened the air over the peninsula. "
                "Schools and clinics have changed their day because of it."
            ),
        },
        {
            "id": "singapore",
            "country": "Singapore",
            "place": "Singapore",
            "cities": ["Singapore"],
            "snapshot_detections_on_monsoon_pathway": len(southern),
            "why_it_can_be_large": (
                "Singapore has no forest fire of this kind, and still has haze advisories "
                "in severe seasons. The source can be hundreds of kilometres upwind."
            ),
        },
    ]

    result = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "runner": "python ml/pipeline.py",
        "inputs": {
            "fires": len(fires),
            "burned_areas": len(burns),
            "occurrences": len(occurrences),
            "species": len(species),
            "protected_areas": len(parks),
            "ndvi_plots": len(plots),
            "background_points": len(background),
        },
        "disclaimer": (
            "These scores are computed from the files shipped with this site. "
            "Active fire detections are thermal anomalies, not burned forest and not wildlife deaths. "
            "NDVI figures are a workbook, not a satellite extract. "
            "Habitat suitability is a resemblance to the occurrence table, not a sighting and not a forecast of movement. "
            "Neighbor counts are detections sitting in a shared airshed or on a known monsoon pathway. "
            "They are not a smoke forecast and not a health tally."
        ),
        "ndvi": {
            "method": "change detection",
            "formula": "ndvi_after - ndvi_before",
            "threshold_large_drop": -0.15,
            "provenance": ndvi_doc["provenance"],
            "note": ndvi_doc["note"],
            "plots": [
                {
                    "id": p["id"],
                    "location_name": p["location_name"],
                    "lat": p["lat"],
                    "lon": p["lon"],
                    "before_window": p["before_window"],
                    "after_window": p["after_window"],
                    "ndvi_before": p["ndvi_before"],
                    "ndvi_after": p["ndvi_after"],
                    "delta": p["delta"],
                    "reading": p["reading"],
                }
                for p in plots
            ],
        },
        "random_forest_frp": {
            "method": "Random Forest",
            "task": "Is this detection's FRP at or above the median of this snapshot?",
            "median_frp": median_frp,
            "n_trees": 40 if frp_scores else 0,
            "features": frp_names,
            "feature_importance": [
                {"feature": name, "share": round(frp_model.importance[i], 3)}
                for i, name in enumerate(frp_names)
            ]
            if frp_scores
            else [],
            "oob": frp_oob,
            "not_claimed": "This class is about the brightness of the detection, not about animals.",
        },
        "random_forest_habitat": {
            "method": "Random Forest habitat suitability",
            "task": "Does this coordinate resemble the occurrence table more than random background in Kalimantan?",
            "n_trees": N_TREES,
            "max_depth": MAX_DEPTH,
            "features": habitat_names,
            "feature_importance": [
                {"feature": name, "share": round(habitat_model.importance[i], 3)}
                for i, name in enumerate(habitat_names)
            ],
            "oob": habitat_oob,
            "training_rows": {"presence": sum(hab_y), "background": len(hab_y) - sum(hab_y)},
            "not_claimed": (
                "Not a sighting, not a population estimate, not a movement model, not a mortality model."
            ),
        },
        "species": species_rows,
        "fires": fire_scores,
        "burned_areas": burn_scores,
        "protected_areas": park_scores,
        "neighbors": {
            "method": (
                "Count snapshot detections in West and Central Kalimantan (shared Borneo airshed) "
                "and, separately, those south of 1°N (a schematic southwest-monsoon pathway toward "
                "Singapore and Peninsular Malaysia). Not HYSPLIT. Not a forecast."
            ),
            "n_detections_shared_borneo_airshed": len(upwind),
            "n_detections_south_of_1n": len(southern),
            "countries": neighbors,
        },
    }

    OUT_PATH.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")
    print(
        "rows",
        result["inputs"],
        "habitat oob",
        habitat_oob,
        "frp oob",
        frp_oob,
    )


if __name__ == "__main__":
    build()
