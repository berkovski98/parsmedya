'use client'

import { useEffect, useRef } from 'react'

const pattern = /^(\D*?)(\d+)(.*)$/

/** Counts a stat like "120+", "%98" or "8 Yıl" up from zero when it enters the viewport. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    const match = value.match(pattern)
    if (!element || !match) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const [, prefix, digits, suffix] = match
    const target = Number(digits)
    let frame = 0
    const run = () => {
      const start = performance.now()
      const duration = 1400
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 4)
        element.textContent = `${prefix}${Math.round(target * eased)}${suffix}`
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      io.disconnect()
      run()
    }, { threshold: 0.6 })
    io.observe(element)

    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      element.textContent = value
    }
  }, [value])

  return <span className={className}><span className="sr-only">{value}</span><span ref={ref} aria-hidden="true" className="tabular-nums">{value}</span></span>
}
