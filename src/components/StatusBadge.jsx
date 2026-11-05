import React from 'react';

const STATUS_CONFIG = {
  OK: {
    label: 'Operational',
    badgeClass: 'bg-[#EBF5EE] text-[#2F6B43] border-[#B7DFC6]',
    dotClass: 'bg-[#4A7C59] shadow-[0_0_8px_rgba(74,124,89,0.5)]',
    iconColor: '#4A7C59',
  },
  STALE: {
    label: 'Stale Data',
    badgeClass: 'bg-[#FFF9E6] text-[#9E6D00] border-[#FCE18A]',
    dotClass: 'bg-[#D4A574]',
    iconColor: '#D4A574',
  },
  FAILED: {
    label: 'Connection Failed',
    badgeClass: 'bg-[#FBEAE8] text-[#B92A1D] border-[#F1AEA7]',
    dotClass: 'bg-[#B92A1D]',
    iconColor: '#B92A1D',
  },
  BLOCKED_BY_CORS: {
    label: 'CORS Restricted',
    badgeClass: 'bg-[#FDF0E6] text-[#C25A24] border-[#F7C6A5]',
    dotClass: 'bg-[#E07B39]',
    iconColor: '#E07B39',
  },
  NEEDS_KEY: {
    label: 'API Key Required',
    badgeClass: 'bg-[#EBF3FB] text-[#205493] border-[#B2D4F5]',
    dotClass: 'bg-[#205493]',
    iconColor: '#205493',
  },
};

/**
 * StatusBadge
 * Displays live data feed connectivity status, source label, and last update timestamp.
 *
 * @param {Object} props
 * @param {'OK'|'STALE'|'FAILED'|'BLOCKED_BY_CORS'|'NEEDS_KEY'} props.status - Status state
 * @param {string} [props.label] - Data source name (e.g., 'NASA FIRMS Hotspots')
 * @param {string|Date} [props.lastUpdated] - Optional timestamp or human string
 * @param {string} [props.className='']
 */
export default function StatusBadge({
  status = 'OK',
  label,
  lastUpdated,
  className = '',
}) {
  const current = STATUS_CONFIG[status] || STATUS_CONFIG.OK;

  const formattedTime =
    lastUpdated instanceof Date
      ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : lastUpdated;

  return (
    <div
      role="status"
      aria-label={`Data status: ${label || status} is ${current.label}`}
      className={`inline-flex flex-wrap items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-xs transition-colors duration-200 ${current.badgeClass} ${className}`}
    >
      {/* Pulsing Status Dot */}
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {status === 'OK' && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4A7C59]/40"
            aria-hidden="true"
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${current.dotClass}`}
          aria-hidden="true"
        />
      </span>

      {/* Source Label (if provided) */}
      {label && <span className="font-semibold text-[#2C2C2C]">{label}:</span>}

      {/* Status String */}
      <span className="font-medium">{current.label}</span>

      {/* Last Updated Timestamp */}
      {formattedTime && (
        <span className="border-l border-current/30 pl-2 text-[11px] opacity-80">
          {formattedTime}
        </span>
      )}
    </div>
  );
}
