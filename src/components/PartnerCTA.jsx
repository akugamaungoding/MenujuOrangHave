import React from 'react';
import DonationDisclaimer from './DonationDisclaimer.jsx';
import PaperTexture from './PaperTexture.jsx';

/**
 * PartnerCTA
 * A call-to-action button/card linking directly to an official conservation partner.
 * Always displays the mandatory donation disclaimer and uses warm amber styling.
 *
 * @param {Object} props
 * @param {string} props.partner - Partner organization name
 * @param {string} props.action - Action title (e.g. "Support Peatland Restoration")
 * @param {string} [props.label='Direct Partner Support'] - Button text
 * @param {string} props.url - Partner's official URL
 * @param {string} [props.context] - Descriptive context explaining the initiative
 * @param {string} [props.className='']
 */
export default function PartnerCTA({
  partner,
  action,
  label = 'Support Partner Directly',
  url,
  context,
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-[#D4A574] bg-[#FDF6E3] p-6 shadow-[0_10px_28px_rgba(212,165,116,0.3)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(224,123,57,0.35)] ${className}`}
    >
      <PaperTexture intensity={0.25} />

      {/* Warm amber header accent */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4A574]/30 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8956A]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C25A24]">
            <svg
              className="h-3.5 w-3.5 text-[#E07B39]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
            </svg>
            Conservation Partner
          </span>
          <span className="text-xs font-semibold text-[#6B8F5E]">{partner}</span>
        </div>

        <div>
          <h4 className="text-xl font-bold text-[#2C2C2C]">{action}</h4>
          {context && (
            <p className="mt-2 text-sm leading-relaxed text-[#4A3E39]">{context}</p>
          )}
        </div>

        {/* CTA External Link Button */}
        <div className="pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A574] via-[#E8956A] to-[#E07B39] px-6 py-3.5 text-base font-semibold text-[#FFFDF7] shadow-md transition-all duration-200 hover:from-[#C28B59] hover:via-[#D4733F] hover:to-[#C25A24] hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-[#E8956A]/50 sm:w-auto"
          >
            <span>{label}</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>

        {/* Always Visible Mandatory Donation Disclaimer */}
        <div className="pt-2">
          <DonationDisclaimer compact />
        </div>
      </div>
    </div>
  );
}
