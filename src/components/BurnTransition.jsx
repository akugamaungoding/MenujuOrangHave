import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';

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
 * BurnTransition
 * A scroll-triggered component that makes its children appear to burn from the edges.
 * Uses CSS mask-image / gradients to reveal a charcoal scorch effect as user scrolls.
 * Gracefully degrades to a simple crossfade if prefers-reduced-motion is active.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @param {number} [props.progress] - Optional manual progress (0 = pristine, 1 = fully burned)
 */
export default function BurnTransition({
  children,
  className = '',
  progress: controlledProgress,
}) {
  const containerRef = useRef(null);
  const tickingRef = useRef(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Track scroll position if progress is not controlled
  useEffect(() => {
    if (typeof controlledProgress === 'number') {
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight || 800;

            // Progress from 0 when bottom enters screen to 1 when element is past center
            const totalDistance = windowHeight + rect.height;
            const currentPos = windowHeight - rect.top;
            const rawProgress = currentPos / totalDistance;
            const clamped = Math.max(0, Math.min(1, (rawProgress - 0.2) / 0.6));

            setScrollProgress(clamped);
          }
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [controlledProgress]);

  const activeProgress =
    typeof controlledProgress === 'number'
      ? Math.max(0, Math.min(1, controlledProgress))
      : scrollProgress;

  // Reduced motion: gentle fade
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`relative transition-opacity duration-700 ease-in-out ${className}`}
        style={{ opacity: 1 - activeProgress * 0.7 }}
      >
        {children}
      </div>
    );
  }

  // Full motion: Dynamic edge burning with charcoal & amber ember gradient mask
  const maskRadius = Math.max(0, (1 - activeProgress) * 120);
  const burnEdgeOpacity = activeProgress > 0.05 && activeProgress < 0.95 ? 1 : 0;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background Scorched Charcoal Canvas revealed underneath as mask burns */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#2C2C2C] transition-opacity duration-300"
        style={{ opacity: activeProgress * 0.9 }}
        aria-hidden="true"
      >
        {/* Glowing ember singe flecks */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,123,57,0.3)_0%,rgba(44,44,44,0.95)_75%)]"
          aria-hidden="true"
        />
      </div>

      {/* Children layer with dynamic burn mask */}
      <div
        className="relative z-10 transition-transform duration-200"
        style={{
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${maskRadius * 0.65}%, rgba(0,0,0,0.5) ${maskRadius * 0.85}%, transparent ${maskRadius}%)`,
          maskImage: `radial-gradient(circle at 50% 50%, black ${maskRadius * 0.65}%, rgba(0,0,0,0.5) ${maskRadius * 0.85}%, transparent ${maskRadius}%)`,
          filter: `sepia(${activeProgress * 0.6}) brightness(${1 - activeProgress * 0.3})`,
        }}
      >
        {children}
      </div>

      {/* Ember Singe Ring overlay at the frontier of the burn */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          opacity: burnEdgeOpacity,
          background: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, maskRadius * 0.7)}%, rgba(224,123,57,0.7) ${maskRadius * 0.85}%, rgba(44,44,44,0.9) ${maskRadius}%, transparent ${maskRadius + 10}%)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
