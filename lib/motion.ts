import type { CSSProperties } from 'react'

/** Inline boot script: hides reveal targets only when the observer is expected to run. */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.dataset.motion='on';setTimeout(function(){if(!d.dataset.revealBound)d.removeAttribute('data-motion')},3000)}catch(e){}})();`

/** Inline style for staggered children (`--i` drives animation/transition delays). */
export function stagger(index: number): CSSProperties {
  return { '--i': index } as CSSProperties
}

/** Style for a layer that drifts with the pointer inside <PointerParallax>; `depth` is the max shift in px. */
export function depthStyle(depth: number): CSSProperties {
  return {
    transform: `translate3d(calc(var(--px, 0) * ${-depth}px), calc(var(--py, 0) * ${-depth}px), 0)`,
    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
  }
}
