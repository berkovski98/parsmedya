import { cn } from '@/lib/utils'

/**
 * Sparse "pixels" borrowed from the Pars Medya logo mark, snapped to the 64px `bg-grid`
 * (pair it with a grid positioned `top right`). Purely decorative.
 */
const pixels: { col: number; row: number; tone: 'solid' | 'soft' | 'line'; i: number }[] = [
  { col: 2, row: 1, tone: 'solid', i: 0 },
  { col: 3, row: 1, tone: 'soft', i: 3 },
  { col: 2, row: 2, tone: 'soft', i: 5 },
  { col: 5, row: 0, tone: 'line', i: 1 },
  { col: 1, row: 4, tone: 'soft', i: 2 },
  { col: 8, row: 2, tone: 'line', i: 4 },
  { col: 4, row: 7, tone: 'solid', i: 6 },
  { col: 11, row: 0, tone: 'soft', i: 7 },
  { col: 1, row: 8, tone: 'line', i: 2 },
]

export function PixelField({ className, size = 64 }: { className?: string; size?: number }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {pixels.map((pixel) => (
        <span
          key={`${pixel.col}-${pixel.row}`}
          className={cn(
            'pixel-blink absolute',
            pixel.tone === 'solid' && 'bg-accent [--pixel-min:0.35] [--pixel-max:0.85]',
            pixel.tone === 'soft' && 'bg-accent [--pixel-min:0.06] [--pixel-max:0.28]',
            pixel.tone === 'line' && 'border border-accent/60 [--pixel-min:0.2] [--pixel-max:0.7]',
          )}
          style={{
            right: pixel.col * size - size + 1,
            top: pixel.row * size + 1,
            width: size - 1,
            height: size - 1,
            '--i': pixel.i,
            opacity: pixel.tone === 'soft' ? 0.18 : 0.55,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
