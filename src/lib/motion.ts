'use client';

import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

export function useIsVisible<T extends Element>(ref: React.RefObject<T>, margin = '0px') {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const el = ref.current;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: margin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, margin]);
  return visible;
}
