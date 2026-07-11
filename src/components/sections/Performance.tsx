'use client'
import RevealText, { RevealItem } from '@/components/ui/RevealText'
import StatCounter from '@/components/ui/StatCounter'

const STATS = [
  { value: 2.3, suffix: 's', decimals: 1, label: '0–100 km/h' },
  { value: 531, suffix: 'km/h', decimals: 0, label: 'Top Speed' },
  { value: 1600, suffix: 'hp', decimals: 0, label: 'Power, E85' },
  { value: 1345, suffix: 'kg', decimals: 0, label: 'Dry Weight' },
]

export default function Performance() {
  return (
    <section className="relative w-full bg-showroom-100 px-8 py-32 md:px-16 md:py-48">
      <RevealText container className="mb-16 flex flex-col gap-3">
        <RevealItem className="font-body text-xs uppercase tracking-[0.3em] text-carbon-950/50">
          05 — NUMBERS
        </RevealItem>
        <RevealItem>
          <h2 className="max-w-2xl font-display text-4xl uppercase leading-[0.95] tracking-tightest text-carbon-950 md:text-6xl">
            Nothing here is rounded up.
          </h2>
        </RevealItem>
      </RevealText>

      <div className="grid grid-cols-2 gap-y-16 md:grid-cols-4">
        {STATS.map((s) => (
          <StatCounter key={s.label} {...s} dark />
        ))}
      </div>
    </section>
  )
}
