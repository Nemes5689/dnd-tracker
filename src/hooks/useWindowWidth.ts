import { useState, useEffect } from 'react';

/**
 * Reactive window-width hook. Re-renders the calling component whenever the
 * window is resized (debounced via requestAnimationFrame for cheapness).
 *
 * Use this only for layout decisions that genuinely need to change at runtime
 * (e.g. switching between 2-column and 3-column layout in Combat View). For
 * pure styling, prefer Tailwind responsive classes (sm:, md:, lg:) — those
 * don't trigger React re-renders at all.
 */
export function useWindowWidth(): number {
  const [width, set_width] = useState<number>(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth
  );

  useEffect(() => {
    let raf: number | null = null;
    function onResize() {
      if (raf != null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        set_width(window.innerWidth);
      });
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return width;
}

/**
 * Returns the current viewport breakpoint matching tailwind.config.js:
 *   - 'base': < 1024px (unsupported — see below-min-width-notice)
 *   - 'sm':   1024-1279px (tablet portrait, small laptop)
 *   - 'md':   1280-1535px (tablet landscape, medium laptop)
 *   - 'lg':   1536-1919px (desktop, large monitors)
 *   - 'xl':   >= 1920px (wide / fullscreen)
 */
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export function useBreakpoint(): Breakpoint {
  const width = useWindowWidth();
  if (width >= 1920) return 'xl';
  if (width >= 1536) return 'lg';
  if (width >= 1280) return 'md';
  if (width >= 1024) return 'sm';
  return 'base';
}

/**
 * Boolean helper: is the viewport at least the given breakpoint?
 *   useIsAtLeast('md') === true at md, lg, xl.
 */
export function useIsAtLeast(bp: Breakpoint): boolean {
  const current = useBreakpoint();
  const order: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];
  return order.indexOf(current) >= order.indexOf(bp);
}
