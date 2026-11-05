import React from 'react';
import PaperTexture from './PaperTexture.jsx';

/**
 * WatercolorCard
 * A card component with watercolor-bleed deckle edges, paper grain texture,
 * and warm, cool, or charred burn variants.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @param {'warm'|'cool'|'burn'} [props.variant='warm']
 */
export default function WatercolorCard({
  children,
  className = '',
  variant = 'warm',
}) {
  const variantStyles = {
    warm: {
      card: 'bg-[#FDF6E3] border-[#D4A574]/40 text-[#2C2C2C] shadow-[0_10px_30px_rgba(212,165,116,0.25)]',
      halo: 'bg-gradient-to-br from-[#F5E6C8]/60 via-[#E8956A]/20 to-[#D4A574]/30',
      accent: 'border-t-[#D4A574] border-b-[#E8956A]',
      textureIntensity: 0.35,
    },
    cool: {
      card: 'bg-[#F4F8F5] border-[#4A7C59]/40 text-[#2C2C2C] shadow-[0_10px_30px_rgba(74,124,89,0.2)]',
      halo: 'bg-gradient-to-br from-[#E2EFE7]/70 via-[#8BB87D]/20 to-[#4A7C59]/25',
      accent: 'border-t-[#6B8F5E] border-b-[#4A7C59]',
      textureIntensity: 0.3,
    },
    burn: {
      card: 'bg-[#FAF4EB] border-[#2C2C2C]/50 text-[#2C2C2C] shadow-[0_12px_32px_rgba(44,44,44,0.3)]',
      halo: 'bg-gradient-to-br from-[#2C2C2C]/15 via-[#E07B39]/25 to-[#4A342B]/30',
      accent: 'border-t-[#2C2C2C] border-b-[#E07B39]',
      textureIntensity: 0.45,
    },
  };

  const selected = variantStyles[variant] || variantStyles.warm;

  // Organic irregular border radius that gives the authentic hand-torn deckle paper feel
  const deckleEdgeStyle = {
    borderRadius: '255px 18px 225px 22px / 20px 225px 18px 255px',
  };

  return (
    <div className={`relative p-[3px] transition-all duration-300 ${className}`}>
      {/* Soft watercolor bleed halo underlayer */}
      <div
        className={`absolute inset-0 -z-10 blur-xs transition-opacity duration-300 ${selected.halo}`}
        style={deckleEdgeStyle}
        aria-hidden="true"
      />

      {/* Main Card Surface */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-transform duration-300 ${selected.card} ${selected.accent}`}
        style={deckleEdgeStyle}
      >
        {/* Paper Grain Overlay */}
        <PaperTexture intensity={selected.textureIntensity} />

        {/* Charred singe edge decoration if burn variant */}
        {variant === 'burn' && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-[#2C2C2C]/80 via-[#E07B39]/50 to-transparent"
            aria-hidden="true"
          />
        )}

        {/* Card Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
