import React from 'react';

/**
 * DonationDisclaimer
 * A clear, always-visible disclaimer text component indicating that H.O.M.E.
 * never processes financial donations and direct giving goes directly to partners.
 *
 * @param {Object} props
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.compact=false] - Whether to render a smaller inline version
 */
export default function DonationDisclaimer({ className = '', compact = false }) {
  return (
    <div
      role="note"
      aria-label="Donation disclaimer"
      className={`flex items-start gap-2 text-xs text-[#7A6248] ${
        compact
          ? 'py-1 text-[11px]'
          : 'rounded-lg border border-[#D4A574]/40 bg-[#F5E6C8]/40 p-2.5 backdrop-blur-xs'
      } ${className}`}
    >
      <svg
        className={`shrink-0 text-[#E07B39] ${compact ? 'mt-0.5 h-3.5 w-3.5' : 'mt-0.5 h-4 w-4'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <span className="leading-relaxed">
        H.O.M.E. does not process donations. Donations are handled by the selected conservation partner.
      </span>
    </div>
  );
}
