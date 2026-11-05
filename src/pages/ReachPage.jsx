import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SdgMark from '../components/SdgMark';
import { DonationDisclaimer, PaperTexture, WatercolorCard } from '../components';

const SDG_COPY = [
  {
    n: 15,
    caption:
      'Life on land. The forest, the peat, and the five species in this story. A range on a map is not a guarantee they are standing there.',
  },
  {
    n: 13,
    caption:
      'Climate action. Drained peat can burn underground and release carbon long after the flame looks small from the road.',
  },
  {
    n: 3,
    caption:
      'Good health. Haze is a breathing problem for people far from the fire line. This site does not count illnesses.',
  },
  {
    n: 11,
    caption:
      'Sustainable cities. In severe seasons, schools, clinics, and airports in neighboring cities have changed their plans because the air arrived brown.',
  },
  {
    n: 12,
    caption:
      'Responsible consumption. Much of the drained peat under these fires was opened for commodities. The fire pixel alone does not name a company.',
  },
  {
    n: 17,
    caption:
      'Partnerships. ASEAN already has a haze agreement. Rescue groups, satellite teams, and neighbors have to read the same evidence without flattening it.',
  },
];

function Bar({ share }) {
  const width = `${Math.round((share || 0) * 100)}%`;
  return (
    <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
      <span className="block h-full rounded-full bg-moss-600" style={{ width }} />
    </span>
  );
}

export default function ReachPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetch('/data-source/ml-scores.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load model output (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (alive) setData(json);
      })
      .catch((err) => {
        if (alive) setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  const ndvi = data?.ndvi?.plots || [];
  const habitat = data?.random_forest_habitat;
  const frp = data?.random_forest_frp;
  const neighbors = data?.neighbors?.countries || [];

  return (
    <div className="relative min-h-screen py-12 sm:py-16">
      <PaperTexture intensity={0.28} />
      <div className="relative z-10 mx-auto max-w-5xl space-y-16 px-4 sm:px-6">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss-800">
            Habitat of Our Missing Endangered
          </p>
          <h1 className="font-hand text-5xl font-bold text-moss-900 sm:text-6xl">
            The smoke keeps the address.
          </h1>
          <p className="font-serif text-lg italic text-charcoal-700">
            A fire in Kalimantan can become a week of closed windows in another country.
          </p>
          <p className="text-sm leading-relaxed text-charcoal-700">
            H.O.M.E. is the habitat of our missing endangered. The story starts with Tuki&apos;s
            trees. It does not end at the border. Malaysia, Brunei, and Singapore share the
            air. On the same island, Sarawak, Sabah, and Brunei can smell a peat fire that
            never crossed a fence. Across the sea, the southwest monsoon has carried
            Kalimantan smoke over Peninsular Malaysia and Singapore. Severe seasons have
            shut schools, delayed flights, and filled clinics with people who could not
            breathe easily. That reach is real. This page does not turn it into a death count.
          </p>
        </header>

        <section aria-labelledby="neighbor-heading" className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 id="neighbor-heading" className="font-hand text-4xl font-bold text-moss-900">
              Neighboring countries
            </h2>
            <p className="text-sm leading-relaxed text-charcoal-700">
              The numbers below are detections in the snapshot that sit in West and Central
              Kalimantan, or south of 1°N. They mark a shared airshed and a known seasonal
              pathway. They are not a smoke forecast, and they are not a measure of how many
              people got sick.
            </p>
            {data?.neighbors?.method ? (
              <p className="text-xs leading-relaxed text-charcoal-500">{data.neighbors.method}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {neighbors.map((place) => {
              const count =
                place.snapshot_detections_in_shared_airshed ??
                place.snapshot_detections_on_monsoon_pathway;
              const countLabel = place.snapshot_detections_on_monsoon_pathway
                ? 'Snapshot detections on the monsoon pathway'
                : 'Snapshot detections in the shared Borneo airshed';
              return (
                <WatercolorCard key={place.id} variant="warm" className="h-full">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    {place.country}
                  </p>
                  <h3 className="mt-1 font-hand text-3xl font-bold text-charcoal-900">
                    {place.place}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-700">{place.why_it_can_be_large}</p>
                  <p className="mt-3 text-xs text-charcoal-500">
                    Cities that have lived through this air: {place.cities.join(', ')}.
                  </p>
                  <p className="mt-4 border-t border-paper-edge pt-3 text-sm">
                    <span className="font-hand text-3xl font-bold text-moss-900">{count ?? '—'}</span>
                    <span className="mt-1 block text-xs text-charcoal-600">{countLabel}</span>
                  </p>
                </WatercolorCard>
              );
            })}
          </div>

          <p className="text-sm text-charcoal-700">
            Read the field record at{' '}
            <a
              className="font-semibold text-moss-800 underline underline-offset-4"
              href="https://earthobservatory.nasa.gov/topic/fires"
            >
              NASA Earth Observatory
            </a>{' '}
            and{' '}
            <a
              className="font-semibold text-moss-800 underline underline-offset-4"
              href="https://news.mongabay.com/"
            >
              Mongabay
            </a>
            . The ASEAN Agreement on Transboundary Haze Pollution is the regional promise
            that this smoke is a shared problem.
          </p>
        </section>

        <section aria-labelledby="sdg-heading" className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 id="sdg-heading" className="font-hand text-4xl font-bold text-moss-900">
              Sustainable Development Goals
            </h2>
            <p className="text-sm leading-relaxed text-charcoal-700">
              Six goals meet in one fire season. The tiles use the official goal numbers and
              colors. The drawings are original, so they are not the United Nations icon set.
              Names and colors follow{' '}
              <a
                className="font-semibold text-moss-800 underline underline-offset-4"
                href="https://sdgs.un.org/goals"
              >
                sdgs.un.org/goals
              </a>
              .
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SDG_COPY.map((goal) => (
              <li key={goal.n}>
                <a
                  href={`https://sdgs.un.org/goals/goal${goal.n}`}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
                >
                  <SdgMark n={goal.n} caption={goal.caption} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="model-heading" className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 id="model-heading" className="font-hand text-4xl font-bold text-moss-900">
              What the models read
            </h2>
            <p className="text-sm leading-relaxed text-charcoal-700">
              Python runs offline, once, over every snapshot: fires, burned area, occurrences,
              protected areas, species, and the NDVI workbook. The browser only displays the
              JSON. Nothing here predicts where an animal will walk, or whether one died.
            </p>
            {error ? <p className="text-sm text-amber-900">{error}</p> : null}
            {data?.disclaimer ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
                {data.disclaimer}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <WatercolorCard>
              <p className="text-xs font-semibold uppercase tracking-wider text-moss-800">NDVI change</p>
              <h3 className="mt-1 font-hand text-2xl font-bold text-charcoal-900">Greenness, two dates</h3>
              <p className="mt-2 text-sm text-charcoal-700">
                Delta is the later workbook value minus the earlier one. A drop means the
                table got less green. It is not a burned-area map.
              </p>
              <p className="mt-3 text-xs text-charcoal-500">{data?.ndvi?.note}</p>
            </WatercolorCard>
            <WatercolorCard>
              <p className="text-xs font-semibold uppercase tracking-wider text-moss-800">Random Forest</p>
              <h3 className="mt-1 font-hand text-2xl font-bold text-charcoal-900">Fire radiative power</h3>
              <p className="mt-2 text-sm text-charcoal-700">
                Each detection is classed against the median FRP in this file. Brightness is
                the question. Wildlife is not.
              </p>
              {frp?.oob?.accuracy != null ? (
                <p className="mt-3 text-xs text-charcoal-600">
                  Out-of-bag accuracy on this snapshot: {frp.oob.accuracy} ({frp.oob.n_oob} rows left out of at least one tree). Median FRP {frp.median_frp}.
                </p>
              ) : null}
            </WatercolorCard>
            <WatercolorCard>
              <p className="text-xs font-semibold uppercase tracking-wider text-moss-800">Habitat suitability</p>
              <h3 className="mt-1 font-hand text-2xl font-bold text-charcoal-900">Resemblance, not a sighting</h3>
              <p className="mt-2 text-sm text-charcoal-700">
                A second forest asks whether a coordinate looks more like the occurrence
                table than like random background in Kalimantan.
              </p>
              {habitat?.oob?.accuracy != null ? (
                <p className="mt-3 text-xs text-charcoal-600">
                  Out-of-bag accuracy: {habitat.oob.accuracy}. Mean score on occurrence rows{' '}
                  {habitat.oob.mean_score_on_positives}; on background {habitat.oob.mean_score_on_negatives}.
                  Training rows: {habitat.training_rows.presence} presence, {habitat.training_rows.background} background.
                </p>
              ) : null}
            </WatercolorCard>
          </div>

          {habitat?.feature_importance?.length ? (
            <div className="rounded-2xl border border-paper-edge bg-paper-warm/80 p-5">
              <h3 className="font-hand text-2xl font-bold text-moss-900">
                What the habitat forest split on
              </h3>
              <ul className="mt-4 space-y-3">
                {habitat.feature_importance
                  .slice()
                  .sort((a, b) => b.share - a.share)
                  .map((item) => (
                    <li key={item.feature} className="text-sm">
                      <span className="flex justify-between gap-4 text-charcoal-800">
                        <span className="font-medium">{item.feature}</span>
                        <span>{Math.round(item.share * 100)}%</span>
                      </span>
                      <Bar share={item.share} />
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {data?.species?.length ? (
            <div className="overflow-x-auto rounded-2xl border border-paper-edge">
              <table className="min-w-full text-left text-sm">
                <caption className="px-4 py-3 text-left font-hand text-2xl font-bold text-moss-900">
                  Suitability beside each species table
                </caption>
                <thead className="bg-cream-100 text-xs uppercase tracking-wide text-charcoal-600">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Species</th>
                    <th className="px-4 py-2 font-semibold">IUCN</th>
                    <th className="px-4 py-2 font-semibold">OOB suitability</th>
                    <th className="px-4 py-2 font-semibold">Workbook NDVI delta nearby</th>
                  </tr>
                </thead>
                <tbody>
                  {data.species.map((row) => (
                    <tr key={row.id} className="border-t border-paper-edge">
                      <td className="px-4 py-3">
                        <span className="font-medium text-charcoal-900">{row.common_name}</span>
                        <span className="block text-xs italic text-charcoal-500">{row.scientific_name}</span>
                      </td>
                      <td className="px-4 py-3">{row.iucn_status}</td>
                      <td className="px-4 py-3">
                        {row.oob_mean_suitability ?? '—'}
                        <span className="block text-[11px] text-charcoal-500">
                          {row.n_occurrence_rows} occurrence rows
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.mean_workbook_ndvi_delta ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-3 text-xs leading-relaxed text-charcoal-600">
                {data.species[0]?.claim_boundary} Occurrence rows in this project are a small
                stand-in table. Replace them with a GBIF extract before you cite a score.
              </p>
            </div>
          ) : null}

          {ndvi.length ? (
            <div className="space-y-3">
              <h3 className="font-hand text-2xl font-bold text-moss-900">NDVI workbook, plot by plot</h3>
              <ul className="space-y-3">
                {ndvi.map((plot) => {
                  const drop = Math.min(0, plot.delta);
                  const width = `${Math.round((Math.abs(drop) / 0.6) * 100)}%`;
                  return (
                    <li key={plot.id} className="rounded-xl border border-paper-edge bg-cream-50 px-4 py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-charcoal-900">{plot.location_name}</span>
                        <span className="text-sm text-charcoal-700">
                          {plot.ndvi_before.toFixed(2)} → {plot.ndvi_after.toFixed(2)} ({plot.delta.toFixed(2)})
                        </span>
                      </div>
                      <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                        <span className="block h-full rounded-full bg-amber-700" style={{ width }} />
                      </span>
                      <span className="mt-1 block text-xs text-charcoal-500">{plot.reading}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <p className="text-sm text-charcoal-700">
            Regenerate the file with <code className="rounded bg-cream-200 px-1">python ml/pipeline.py</code>.
            The script is the whole model. There is no hidden service.
          </p>
          <Link to="/transparency" className="inline-block text-sm font-semibold text-moss-800 underline underline-offset-4">
            See every source and what we do not claim
          </Link>
        </section>

        <DonationDisclaimer />
      </div>
    </div>
  );
}
