'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useFrameScrub } from '@/components/hero/useFrameScrub'
import { interiorSequence } from '@/lib/frameManifest'
import { motion } from 'framer-motion'
import { useScrollStore } from '@/store/useScrollStore'
import RevealText, { RevealItem } from '@/components/ui/RevealText'

export default function Interior() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { canvasRef, draw, loaded } = useFrameScrub({
    frameCount: interiorSequence.frameCount,
    path: interiorSequence.path,
  })
  const setInteriorLoaded = useScrollStore((s) => s.setInteriorLoaded)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)
  const obj = useRef({ frame: interiorSequence.restingFrame })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse), (max-width: 768px)').matches)
  }, [])

  useEffect(() => {
    if (!loaded || !sectionRef.current) return
    setInteriorLoaded(true)
    draw(interiorSequence.restingFrame)

    if (reducedMotion || isTouch) {
      draw(interiorSequence.frameCount) // freeze on final resting frame
      return
    }

    const ctx = gsap.context(() => {
      const st = gsap.to(obj.current, {
        frame: interiorSequence.frameCount,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 0.5,
          pin: true,
          onUpdate: () => draw(Math.round(obj.current.frame)),
        },
      })
      return () => {
        st.scrollTrigger?.kill()
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loaded, draw, isTouch, reducedMotion, setInteriorLoaded])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-carbon-950">
      {isTouch ? (
        <video
          className="h-full w-full object-cover"
          src={interiorSequence.mobileVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-carbon-950/50" />

      <RevealText
        container
        className="absolute inset-x-0 bottom-16 flex flex-col items-start gap-3 px-8 md:px-16"
      >
        <RevealItem className="font-body text-xs uppercase tracking-[0.3em] text-showroom-100/70">
          04 — COCKPIT
        </RevealItem>
        <RevealItem>
          <h2 className="max-w-2xl font-display text-4xl uppercase leading-[0.95] tracking-tightest text-showroom-100 md:text-6xl">
            Scroll. The door lifts. You&apos;re inside.
          </h2>
        </RevealItem>
      </RevealText>

      {/* Clean Hover Card - Bottom Right */}
      <motion.div
        variants={{
          initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }}
        initial="initial"
        animate={loaded ? 'animate' : 'initial'}
        className="absolute bottom-8 right-8 z-10 group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white/20 w-64 md:bottom-16 md:right-16 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h3 className="font-display text-xs uppercase tracking-widest text-showroom-100/80 mb-3">BEST INTERIOR</h3>
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
        <div className="absolute inset-0 grid place-items-center bg-carbon-950 text-xs uppercase tracking-[0.3em] text-showroom-100/50">
          Loading Sequence…
        </div>
      )}
    </section>
  )
}
