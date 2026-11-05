/**
 * Original SDG tiles. Number and color follow the UN Sustainable Development
 * Goals. The drawings are ours, not the official UN icon set.
 * https://sdgs.un.org/goals
 */
const GOALS = {
  3: { color: "#4C9F38", title: "Good Health" },
  11: { color: "#FD9D24", title: "Sustainable Cities" },
  12: { color: "#BF8B2E", title: "Responsible Consumption" },
  13: { color: "#3F7E44", title: "Climate Action" },
  15: { color: "#56C02B", title: "Life on Land" },
  17: { color: "#19486A", title: "Partnerships" },
};

function Glyph({ n }) {
  const common = {
    fill: "none",
    stroke: "white",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (n === 3) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
        <path d="M12 20s-6-3.6-6-8a3.2 3.2 0 016-1.2A3.2 3.2 0 0118 12c0 4.4-6 8-6 8z" {...common} />
      </svg>
    );
  }
  if (n === 11) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
        <path d="M4 20V10l4-2v12M10 20V6l5-2v16M16 20v-8l4-1.5V20" {...common} />
      </svg>
    );
  }
  if (n === 12) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
        <path d="M7 8a5 5 0 018.6-2M17 16a5 5 0 01-8.6 2" {...common} />
        <path d="M16 4l2 2-2 2M8 20l-2-2 2-2" {...common} />
      </svg>
    );
  }
  if (n === 13) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
        <circle cx="12" cy="12" r="3" {...common} />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" {...common} />
      </svg>
    );
  }
  if (n === 15) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
        <path d="M12 21V11M12 14c-4 0-6-2.2-6-2.2S8 8 12 11c4-3 6 .8 6 .8S16 14 12 14z" {...common} />
        <path d="M5 21h14" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <circle cx="7" cy="9" r="2" {...common} />
      <circle cx="17" cy="9" r="2" {...common} />
      <circle cx="12" cy="16" r="2" {...common} />
      <path d="M8.7 10.4l2.2 3.6M15.3 10.4l-2.2 3.6" {...common} />
    </svg>
  );
}

export default function SdgMark({ n, caption, compact = false }) {
  const goal = GOALS[n];
  if (!goal) return null;
  return (
    <figure className={compact ? "flex items-center gap-3" : "flex flex-col gap-2"}>
      <div
        className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-md text-white shadow-sm"
        style={{ backgroundColor: goal.color }}
        role="img"
        aria-label={`Sustainable Development Goal ${n}, ${goal.title}`}
      >
        <Glyph n={n} />
        <span className="mt-0.5 text-[10px] font-bold leading-none">{n}</span>
      </div>
      <figcaption className="text-xs leading-snug text-charcoal-700">
        <span className="font-semibold text-charcoal-900">
          {n}. {goal.title}
        </span>
        {caption ? <span className="mt-1 block">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}

export { GOALS };
