import React, { useId } from 'react';

/**
 * PaperTexture
 * Overlays a subtle watercolor paper grain texture using an inline SVG feTurbulence filter.
 *
 * @param {Object} props
 * @param {number} [props.intensity=0.5] - Texture opacity multiplier between 0 and 1
 * @param {string} [props.className] - Additional CSS classes
 */
export default function PaperTexture({ intensity = 0.5, className = '' }) {
  const filterId = useId().replace(/:/g, '-');
  const clampedIntensity = Math.max(0, Math.min(1, intensity));

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden mix-blend-multiply ${className}`}
      style={{ opacity: clampedIntensity }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`paper-grain-${filterId}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="
                0.05 0 0 0 0.96
                0 0.05 0 0 0.94
                0 0 0.05 0 0.88
                0 0 0 0.35 0
              "
              result="tinted"
            />
            <feBlend in="SourceGraphic" in2="tinted" mode="multiply" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="#F5E6C8"
          filter={`url(#paper-grain-${filterId})`}
        />
      </svg>
    </div>
  );
}
