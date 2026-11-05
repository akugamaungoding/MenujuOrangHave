import React, { useEffect, useRef } from 'react';

/**
 * ScrollChapter
 * A section wrapper for scroll-driven story chapters.
 * Enforces minimum full-viewport height, scroll-snap alignment,
 * and triggers onEnter / onLeave callbacks via IntersectionObserver.
 *
 * @param {Object} props
 * @param {string} props.id - HTML section id
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onEnter] - Triggered when chapter enters active view
 * @param {() => void} [props.onLeave] - Triggered when chapter leaves active view
 * @param {string} [props.className='']
 * @param {'cream'|'forest'|'burn'|'restored'} [props.bgVariant='cream']
 */
export default function ScrollChapter({
  id,
  children,
  onEnter,
  onLeave,
  className = '',
  bgVariant = 'cream',
}) {
  const sectionRef = useRef(null);
  const wasIntersectingRef = useRef(false);

  const bgVariants = {
    cream: 'bg-[#FDF6E3] text-[#2C2C2C]',
    forest: 'bg-[#4A7C59]/10 text-[#2C2C2C]',
    burn: 'bg-[#2C2C2C] text-[#FDF6E3]',
    restored: 'bg-gradient-to-b from-[#FDF6E3] via-[#F4F8F5] to-[#EBF5EE] text-[#2C2C2C]',
  };

  const selectedBg = bgVariants[bgVariant] || bgVariants.cream;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!wasIntersectingRef.current) {
              wasIntersectingRef.current = true;
              onEnter?.();
            }
          } else {
            if (wasIntersectingRef.current) {
              wasIntersectingRef.current = false;
              onLeave?.();
            }
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [onEnter, onLeave]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative min-h-screen w-full snap-start overflow-hidden px-4 py-16 sm:px-8 md:py-24 ${selectedBg} ${className}`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
