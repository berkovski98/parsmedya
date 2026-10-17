'use client'

import { useEffect, useRef } from 'react'

/**
 * Exposes the pointer position as `--px` / `--py` (-0.5…0.5) so child layers can
 * shift with CSS. Only active on fine pointers without reduced motion.
 */
export function PointerParallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    let frame = 0
    const set = (x: number, y: number) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--px', x.toFixed(3))
        element.style.setProperty('--py', y.toFixed(3))
      })
    }
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      set((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5)
    }
    const onLeave = () => set(0, 0)
    element.addEventListener('pointermove', onMove, { passive: true })
    element.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
