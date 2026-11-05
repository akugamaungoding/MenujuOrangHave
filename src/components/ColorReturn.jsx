import React, { useSyncExternalStore } from 'react';

function subscribeReducedMotion(callback) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }
  return () => {};
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * ColorReturn
 * Inverse of BurnTransition — color blooms back outwards from the center.
 * Uses a radial reveal and CSS filter transition from desaturated charcoal/grayscale
 * to rich, full watercolor vibrancy. Respects prefers-reduced-motion with a smooth crossfade.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.triggered=false] - Whether the color restoration is triggered
 * @param {string} [props.className='']
 * @param {number} [props.duration=1600] - Duration of the transition in ms
 */
export default function ColorReturn({
  children,
  triggered = false,
  className = '',
  duration = 1600,
}) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Reduced motion: simple filter crossfade
  if (reducedMotion) {
    return (
      <div
        className={`relative transition-all ease-out ${className}`}
        style={{
          transitionDuration: `${duration}ms`,
          filter: triggered ? 'grayscale(0%) saturate(100%)' : 'grayscale(100%) contrast(90%)',
        }}
      >
        {children}
      </div>
    );
  }

  // Full motion: Two-layer radial bloom
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Grayscale / Ash Layer */}
      <div
        className="transition-opacity ease-out"
        style={{
          filter: 'grayscale(100%) contrast(95%) brightness(90%)',
          transitionDuration: `${duration}ms`,
        }}
      >
        {children}
      </div>

      {/* Radiant Color Layer (reveals radially outward from center) */}
      <div
        className="pointer-events-none absolute inset-0 transition-all ease-out"
        style={{
          transitionDuration: `${duration}ms`,
          opacity: triggered ? 1 : 0,
          WebkitMaskImage: triggered
            ? 'radial-gradient(circle at 50% 50%, black 70%, rgba(0,0,0,0.8) 85%, transparent 100%)'
            : 'radial-gradient(circle at 50% 50%, black 0%, transparent 0%)',
          maskImage: triggered
            ? 'radial-gradient(circle at 50% 50%, black 70%, rgba(0,0,0,0.8) 85%, transparent 100%)'
            : 'radial-gradient(circle at 50% 50%, black 0%, transparent 0%)',
          filter: triggered ? 'saturate(108%)' : 'grayscale(100%)',
        }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Golden dawn restoration ring pulse when triggered */}
      {triggered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 animate-pulse opacity-25"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(245,230,200,0.8) 0%, rgba(139,184,125,0.4) 40%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
