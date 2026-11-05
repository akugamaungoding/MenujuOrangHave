import React from 'react';
import WatercolorCard from './WatercolorCard.jsx';

/**
 * IUCN Status metadata with colors and readable labels
 */
const IUCN_STATUSES = {
  CR: {
    code: 'CR',
    label: 'Critically Endangered',
    badgeClass: 'bg-[#FBEAE8] text-[#B92A1D] border-[#F1AEA7]',
    dotClass: 'bg-[#B92A1D]',
  },
  EN: {
    code: 'EN',
    label: 'Endangered',
    badgeClass: 'bg-[#FDF0E6] text-[#C25A24] border-[#F7C6A5]',
    dotClass: 'bg-[#C25A24]',
  },
  VU: {
    code: 'VU',
    label: 'Vulnerable',
    badgeClass: 'bg-[#FFF9E6] text-[#9E6D00] border-[#FCE18A]',
    dotClass: 'bg-[#D4A574]',
  },
  LC: {
    code: 'LC',
    label: 'Least Concern',
    badgeClass: 'bg-[#EBF5EE] text-[#2F6B43] border-[#B7DFC6]',
    dotClass: 'bg-[#4A7C59]',
  },
};

/**
 * CharacterCard
 * Displays an illustrated animal character with watercolor illustration,
 * IUCN conservation status badge, and official scientific disclaimer notice.
 *
 * @param {Object} props
 * @param {'orangutan'|'pangolin'|'sunbear'|'mousedeer'|'hornbill'} props.species - Matches art filename
 * @param {string} props.name - Character's story name
 * @param {string} props.description - Story / species bio
 * @param {'CR'|'EN'|'VU'|'LC'} [props.iucnStatus='CR'] - Conservation status code
 * @param {string} [props.className='']
 */
export default function CharacterCard({
  species,
  name,
  description,
  iucnStatus = 'CR',
  className = '',
}) {
  const statusInfo = IUCN_STATUSES[iucnStatus] || IUCN_STATUSES.CR;
  const imageSrc = `/assets/art/${species}.svg`;

  return (
    <WatercolorCard
      variant="warm"
      className={`group w-full max-w-sm transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      <article className="flex flex-col items-center text-center">
        {/* Character Illustration Frame */}
        <div className="relative mb-4 flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-2 border-[#D4A574]/40 bg-[#FFFDF7] p-2 shadow-inner">
          <img
            src={imageSrc}
            alt={`${name} the ${species}`}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* IUCN Status Badge */}
        <div className="mb-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${statusInfo.badgeClass}`}
            title={`IUCN Red List Status: ${statusInfo.label}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusInfo.dotClass}`}
              aria-hidden="true"
            />
            <span>{statusInfo.code}</span>
            <span className="text-[10px] font-medium opacity-85">({statusInfo.label})</span>
          </span>
        </div>

        {/* Character Name & Species */}
        <h3 className="text-2xl font-bold tracking-tight text-[#2C2C2C]">
          {name}
        </h3>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#6B8F5E]">
          {species.replace(/-/g, ' ')}
        </p>

        {/* Emotional / Science Story Bio */}
        <p className="mb-4 text-sm leading-relaxed text-[#4A3E39]">
          {description}
        </p>

        {/* Mandatory Character Notice Label */}
        <div className="mt-auto border-t border-[#D4A574]/30 pt-3 text-center">
          <p className="text-[11px] italic text-[#8C7A6B]">
            Illustrated character, inspired by real species.
          </p>
        </div>
      </article>
    </WatercolorCard>
  );
}
