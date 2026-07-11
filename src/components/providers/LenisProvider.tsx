'use client'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollStore } from '@/store/useScrollStore'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const setProgress = useScrollStore((s) => s.setProgress)
  const setReducedMotion = useScrollStore((s) => s.setReducedMotion)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)

    if (mq.matches) {
      // Respect reduced-motion: skip Lenis smoothing entirely, use native scroll.
      return () => mq.removeEventListener('change', onChange)
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })
    lenisRef.current = lenis

    lenis.on('scroll', () => {
      ScrollTrigger.update()
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    })

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      mq.removeEventListener('change', onChange)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [setProgress, setReducedMotion])

  return <>{children}</>
}
