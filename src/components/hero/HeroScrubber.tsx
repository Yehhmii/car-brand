'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useFrameScrub } from './useFrameScrub'
import { heroSequence } from '@/lib/frameManifest'
import { useScrollStore } from '@/store/useScrollStore'

const quietContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
}

const quietItem = {
  initial: { opacity: 0, y: 15, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
}

export default function HeroScrubber() {
  const { canvasRef, draw, loaded } = useFrameScrub({
    frameCount: heroSequence.frameCount,
    path: heroSequence.path,
  })
  const setHeroLoaded = useScrollStore((s) => s.setHeroLoaded)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)
  const [isTouch, setIsTouch] = useState(false)
  const targetFrame = useRef(heroSequence.restingFrame)
  const displayedFrame = useRef(heroSequence.restingFrame)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse), (max-width: 768px)').matches)
  }, [])

  useEffect(() => {
    if (!loaded) return
    setHeroLoaded(true)

    if (reducedMotion || isTouch) {
      draw(heroSequence.restingFrame)
      return
    }

    draw(heroSequence.restingFrame)

    const tick = () => {
      displayedFrame.current += (targetFrame.current - displayedFrame.current) * 0.15
      draw(Math.round(displayedFrame.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const onMove = (e: PointerEvent) => {
      // Calculate Frame
      const pct = Math.min(1, Math.max(0, e.clientX / window.innerWidth))
      targetFrame.current = Math.min(
        heroSequence.frameCount,
        Math.max(1, Math.round(pct * (heroSequence.frameCount - 1)) + 1)
      )
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loaded, draw, isTouch, reducedMotion, setHeroLoaded])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-carbon-950">
      {isTouch ? (
        <video
          className="h-full w-full object-cover"
          src={heroSequence.mobileVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <canvas 
          ref={canvasRef} 
          className="h-full w-full object-cover transition-transform duration-700 ease-out" 
        />
      )}

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Stage Light Effect */}
      <div className="pointer-events-none absolute top-0 left-1/2 w-[200%] h-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.25)_0%,transparent_60%)] mix-blend-screen" />
      <div 
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
        style={{
          background: 'conic-gradient(from 180deg at 50% -10%, transparent 140deg, rgba(255,255,255,1) 180deg, transparent 220deg)'
        }}
      />

      {/* Base Bottom Gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-carbon-950/60" />

      {/* Top Navigation */}
      <motion.nav
        variants={{
          initial: { opacity: 0, y: -20, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] } }
        }}
        initial="initial"
        animate={loaded ? 'animate' : 'initial'}
        className="absolute top-8 left-8 right-8 md:top-10 md:left-16 md:right-16 z-20 flex items-center justify-between"
      >
        <div className="font-display text-xl md:text-2xl tracking-[0.4em] uppercase text-showroom-100">
          Axiom
        </div>
        
        <div className="hidden md:flex items-center gap-10 font-body text-xs uppercase tracking-[0.25em] text-showroom-100/70">
          <a href="#silhouette" className="hover:text-showroom-100 transition-colors">Silhouette</a>
          <a href="#engineering" className="hover:text-showroom-100 transition-colors">Engineering</a>
          <a href="#interior" className="hover:text-showroom-100 transition-colors">Interior</a>
          <a href="#performance" className="hover:text-showroom-100 transition-colors">Performance</a>
        </div>

        <motion.div
          layoutId="brand-emblem"
          className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-crimson-400/60 bg-carbon-950/60 backdrop-blur-sm shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        />
      </motion.nav>

      <motion.div
        variants={quietContainer}
        initial="initial"
        animate={loaded ? 'animate' : 'initial'}
        className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-8 md:p-16 z-10 pointer-events-none"
      >
        <motion.span
          variants={quietItem}
          className="font-body text-xs uppercase tracking-[0.3em] text-showroom-100/70"
        >
          01 — ARRIVAL
        </motion.span>
        <motion.h1
          variants={quietItem}
          className="font-display text-hero uppercase leading-[0.9] tracking-tightest text-showroom-100"
        >
          Presence,
          <br />
          Uninterrupted
        </motion.h1>
        <motion.p
          variants={quietItem}
          className="max-w-md font-body text-sm text-showroom-100/60 md:text-base"
        >
          Move your cursor across the frame. The car turns, the doors lift.
          Nothing here is video — every frame was placed by hand.
        </motion.p>
      </motion.div>

      {/* Clean Hover Card - Bottom Right */}
      <motion.div
        variants={{
          initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }}
        initial="initial"
        animate={loaded ? 'animate' : 'initial'}
        className="absolute bottom-8 right-8 z-20 group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white/20 w-64 md:bottom-16 md:right-16 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h3 className="font-display text-xs uppercase tracking-widest text-showroom-100/80 mb-3">Performance</h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="font-body text-xs text-showroom-100/60 mb-1">0-60 mph</p>
              <p className="font-display text-3xl text-showroom-100 leading-none">1.9<span className="text-lg text-showroom-100/60">s</span></p>
            </div>
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10 bg-white/5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-showroom-100"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </motion.div>

      {!loaded && (
        <div className="absolute inset-0 grid place-items-center bg-carbon-950 text-xs uppercase tracking-[0.3em] text-showroom-100/50 z-30">
          Loading Sequence…
        </div>
      )}
    </section>
  )
}
