'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import RevealText, { RevealItem } from '@/components/ui/RevealText'
import AnchorMorph from '@/components/ui/AnchorMorph'

interface Blob {
  id: number
  x: number
  y: number
  size: number
}

const CALLOUTS = [
  { index: '01', title: 'Carbon Monocoque', copy: 'A single cured shell, 90kg, no compromise between stiffness and mass.' },
  { index: '02', title: 'Active Aero', copy: 'Splitter and rear wing adjust in milliseconds, reading the road ahead of you.' },
  { index: '03', title: 'Triplex Damping', copy: 'A third damper cancels squat under load — the nose stays level, always.' },
]

export default function Engineering() {
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Gooey Mask State
  const [blobs, setBlobs] = useState<Blob[]>([])
  const blobIdCounter = useRef(0)
  const lastEmitPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!trackRef.current || !sectionRef.current) return
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const distance = track.scrollWidth - window.innerWidth
      if (distance <= 0) return

      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 0.5,
          pin: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const dx = x - lastEmitPosition.current.x
    const dy = y - lastEmitPosition.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 40) { // Emit densely for smooth liquid pooling
      lastEmitPosition.current = { x, y }
      const id = blobIdCounter.current++
      const size = 100 + Math.random() * 50 // Organic varying sizes

      setBlobs((prev) => [...prev, { id, x, y, size }])

      // Lifetime of the blob before it starts exiting (liquid evaporates)
      setTimeout(() => {
        setBlobs((prev) => prev.filter((b) => b.id !== id))
      }, 1000) 
    }
  }

  return (
    <section 
      ref={sectionRef} 
      onPointerMove={handlePointerMove}
      className="relative h-screen w-full overflow-hidden bg-carbon-900"
    >
      {/* SVG Definitions for Mask and Gooey Filter */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="gooey-mask-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -20" 
              result="goo" 
            />
          </filter>
          
          <mask id="liquid-mask">
            <g filter="url(#gooey-mask-filter)">
              <AnimatePresence>
                {blobs.map((blob) => (
                  <motion.circle
                    key={blob.id}
                    cx={blob.x}
                    cy={blob.y}
                    fill="white"
                    initial={{ r: 0 }}
                    animate={{ r: blob.size }}
                    exit={{ r: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>
            </g>
          </mask>
        </defs>
      </svg>

      {/* The Revealed Image Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{
          maskImage: 'url(#liquid-mask)',
          WebkitMaskImage: 'url(#liquid-mask)',
        }}
      >
        <Image
          src="/images/under-the-hood.png"
          alt="Engineering background revealed"
          fill
          className="object-cover opacity-60"
          priority={false}
        />
        {/* Subtle color wash over the image so it blends with the dark theme */}
        <div className="absolute inset-0 bg-crimson-950/20 mix-blend-color" />
      </div>

      <div className="absolute left-8 top-8 z-10 flex items-center gap-3 md:left-16 md:top-10 pointer-events-none">
        <AnchorMorph layoutId="panel-line" className="h-6 w-6" />
        <span className="font-body text-xs uppercase tracking-[0.3em] text-showroom-100/60">
          03 — UNDER THE SKIN
        </span>
      </div>

      <div ref={trackRef} className="flex h-full w-max items-center gap-24 px-16 md:px-32 pointer-events-none">
        {CALLOUTS.map((c) => (
          <RevealText key={c.index} container className="flex w-[70vw] flex-col gap-4 md:w-[36vw] pointer-events-auto">
            <RevealItem className="font-display text-8xl text-crimson-500/30 md:text-9xl">
              {c.index}
            </RevealItem>
            <RevealItem>
              <h3 className="font-display text-3xl uppercase tracking-tightest text-showroom-100 md:text-4xl drop-shadow-lg">
                {c.title}
              </h3>
            </RevealItem>
            <RevealItem className="max-w-sm font-body text-sm text-showroom-100/60 md:text-base drop-shadow-md">
              {c.copy}
            </RevealItem>
          </RevealText>
        ))}
      </div>
    </section>
  )
}
