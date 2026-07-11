'use client'
import { useRef } from 'react'
import RevealText, { RevealItem } from '@/components/ui/RevealText'
import AnchorMorph from '@/components/ui/AnchorMorph'
import { motion, useScroll, useTransform } from 'framer-motion'

const SmokeEffect = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[80vh] pointer-events-none opacity-50 mix-blend-screen overflow-hidden">
      <svg className="w-[150%] h-full -ml-[25%]" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <defs>
          <filter id="smoke-blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <g filter="url(#smoke-blur)">
          {/* Wave 1 */}
          <motion.path 
            fill="rgba(255,255,255,0.2)"
            animate={{
              d: [
                "M0 500 Q 250 200 500 500 T 1000 500 L 1000 1000 L 0 1000 Z",
                "M0 500 Q 250 500 500 200 T 1000 500 L 1000 1000 L 0 1000 Z",
                "M0 500 Q 250 200 500 500 T 1000 500 L 1000 1000 L 0 1000 Z",
              ]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Wave 2 */}
          <motion.path 
            fill="rgba(255,255,255,0.15)"
            animate={{
              d: [
                "M0 500 Q 250 500 500 100 T 1000 500 L 1000 1000 L 0 1000 Z",
                "M0 500 Q 250 100 500 500 T 1000 500 L 1000 1000 L 0 1000 Z",
                "M0 500 Q 250 500 500 100 T 1000 500 L 1000 1000 L 0 1000 Z",
              ]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Wave 3 */}
          <motion.path 
            fill="rgba(255,255,255,0.1)"
            animate={{
              d: [
                "M0 500 Q 250 100 500 600 T 1000 500 L 1000 1000 L 0 1000 Z",
                "M0 500 Q 250 600 500 100 T 1000 500 L 1000 1000 L 0 1000 Z",
                "M0 500 Q 250 100 500 600 T 1000 500 L 1000 1000 L 0 1000 Z",
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      </svg>
    </div>
  )
}

export default function Reserve() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Calculate how far the section has scrolled into view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  })

  // Move the inner content slower than the scroll to create a "reveal from behind" parallax illusion
  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-carbon-950">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-carbon-800 to-carbon-950 px-8 py-16 md:px-16"
      >
        {/* Animated Smoke / Exhaust Effect */}
        <SmokeEffect />

        <RevealText container className="relative z-10 flex flex-1 flex-col items-start justify-center gap-6">
          <RevealItem className="font-body text-xs uppercase tracking-[0.3em] text-showroom-100/60">
            06 — RESERVE
          </RevealItem>
          <RevealItem>
            <h2 className="max-w-3xl font-display text-5xl uppercase leading-[0.9] tracking-tightest text-showroom-100 md:text-8xl drop-shadow-2xl">
              Allocation is limited.<br/>So is patience.
            </h2>
          </RevealItem>
          <RevealItem>
            <a
              href="#configure"
              className="mt-4 relative group overflow-hidden inline-block border border-crimson-400/70 px-8 py-4 font-body text-xs uppercase tracking-[0.25em] text-showroom-100 transition-colors duration-300 ease-fall hover:border-crimson-500"
            >
              <div className="absolute inset-0 bg-crimson-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Begin Reservation</span>
            </a>
          </RevealItem>
        </RevealText>

        <div className="relative z-10 flex items-end justify-between border-t border-carbon-600/50 pt-8 mt-16">
          <AnchorMorph layoutId="brand-emblem" className="h-32 w-32 md:h-40 md:w-40" />
          <div className="flex flex-col items-end gap-1 font-body text-xs uppercase tracking-[0.2em] text-showroom-100/40">
            <span>© {new Date().getFullYear()} — All specifications subject to homologation.</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
