'use client'
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface StatCounterProps {
  value: number
  suffix?: string
  decimals?: number
  label: string
  /** use dark-on-light text colors (for sections on a showroom-100 background) */
  dark?: boolean
}

export default function StatCounter({
  value,
  suffix = '',
  decimals = 0,
  label,
  dark = false,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const prefersReduced = useReducedMotion()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping: 30, stiffness: 90 })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  useEffect(() => {
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = `${value.toFixed(decimals)}${suffix}`
      return
    }
    const unsub = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${v.toFixed(decimals)}${suffix}`
    })
    return unsub
  }, [spring, decimals, suffix, prefersReduced, value])

  return (
    <div className="flex flex-col gap-1">
      <span
        ref={ref}
        className={`font-display text-5xl tabular-nums tracking-tightest md:text-7xl ${
          dark ? 'text-carbon-950' : 'text-showroom-100'
        }`}
      >
        0{suffix}
      </span>
      <span
        className={`font-body text-xs uppercase tracking-[0.25em] ${
          dark ? 'text-carbon-950/50' : 'text-showroom-100/50'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
