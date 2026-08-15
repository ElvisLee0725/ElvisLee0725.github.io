import { useEffect, useRef } from 'react';

// Port of legacy client/modules/revealOnScroll.js — fades/scales an element
// in once the user has scrolled it into view past `threshold`% of the
// viewport height. Attach the returned ref to the element to reveal.
export default function useRevealOnScroll(threshold = 75) {
  const ref = useRef(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    el.classList.add('reveal-item');

    function calculate() {
      if (revealedRef.current) return;
      const browserHeight = window.innerHeight;
      if (window.scrollY + browserHeight > el.offsetTop) {
        const percentScroll = (el.getBoundingClientRect().top / browserHeight) * 100;
        if (percentScroll < threshold) {
          el.classList.add('reveal-item--is-visible');
          revealedRef.current = true;
          window.removeEventListener('scroll', onScroll);
        }
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        calculate();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll);
    calculate(); // in case it's already in view on mount

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return ref;
}
