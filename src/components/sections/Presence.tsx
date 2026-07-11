'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { motion, AnimatePresence, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion'
import RevealText, { RevealItem } from '@/components/ui/RevealText'

interface TrailImage {
  id: number
  x: number
  y: number
  imgIndex: number
  rotation: number
}

export default function Presence() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)

  // Trail State
  const [trails, setTrails] = useState<TrailImage[]>([])
  const trailIdCounter = useRef(0)
  const lastEmitPosition = useRef({ x: 0, y: 0 })
  const imgIndexRef = useRef(1) // 1 to 15
  const isFirstMove = useRef(true)

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 30, stiffness: 150, mass: 0.8 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Parallax background image
  useEffect(() => {
    if (!sectionRef.current || !imgWrapRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(imgWrapRef.current, {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Pointer move handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isFirstMove.current) {
      mouseX.set(x)
      mouseY.set(y)
      springX.jump(x)
      springY.jump(y)
      lastEmitPosition.current = { x, y }
      isFirstMove.current = false
      return
    }

    mouseX.set(x)
    mouseY.set(y)
  }

  // Animation frame loop to emit trails based on spring position (Lag & Spring)
  useAnimationFrame(() => {
    if (isFirstMove.current) return

    const latestX = springX.get()
    const latestY = springY.get()
    const dx = latestX - lastEmitPosition.current.x
    const dy = latestY - lastEmitPosition.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 90) { // Emit every 70px for a denser, smoother trail
      lastEmitPosition.current = { x: latestX, y: latestY }
      const id = trailIdCounter.current++
      const imgIndex = imgIndexRef.current
      const rotation = Math.random() * 20 - 10 // Softer random rotation (-10 to 10 deg)

      setTrails((prev) => [...prev, { id, x: latestX, y: latestY, imgIndex, rotation }])
      
      // Cycle image index 1-15
      imgIndexRef.current = (imgIndexRef.current % 15) + 1

      // Fade & Destroy automatically
      setTimeout(() => {
        setTrails((prev) => prev.filter(t => t.id !== id))
      }, 500) // Start fading out slightly faster
    }
  })

  return (
    <section 
      ref={sectionRef} 
      onPointerMove={handlePointerMove}
      className="relative h-[120vh] w-full overflow-hidden bg-carbon-950"
    >
      <div ref={imgWrapRef} className="absolute inset-0">
        <Image
          src="/images/showroom-hero.png"
          alt="Hypercar in a marble-floored showroom, doors raised"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/70 via-carbon-950/30 to-carbon-950" />
      </div>

      {/* Dynamic Cursor Image Trail Layer */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <AnimatePresence>
          {trails.map((trail) => (
            <motion.div
              key={trail.id}
              initial={{ opacity: 0, scale: 0.6, rotate: trail.rotation, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: { duration: 0.3, ease: 'easeOut' } }}
              exit={{ opacity: 0, scale: 0.4, x: '-50%', y: '-50%', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
              className="absolute shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 rounded-2xl overflow-hidden bg-carbon-950/20 backdrop-blur-sm"
              style={{ 
                 left: trail.x, 
                 top: trail.y,
                 width: 260,
                 height: 340,
                 transformOrigin: 'center center'
              }}
            >
              <Image 
                src={`/images/showroom-cars/car${trail.imgIndex}.jpg`} 
                alt="Showroom trail detail" 
                fill 
                className="object-cover opacity-90" 
                sizes="260px" 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <RevealText
        container
        className="absolute inset-x-0 top-32 z-20 flex flex-col items-start gap-4 px-8 md:px-16"
      >
        <RevealItem className="font-body text-xs uppercase tracking-[0.3em] text-showroom-100/70">
          02 — SILHOUETTE
        </RevealItem>
        <RevealItem>
          <h2 className="max-w-3xl font-display text-4xl uppercase leading-[0.95] tracking-tightest text-showroom-100 md:text-6xl drop-shadow-2xl">
            A shape that argues with air, and wins.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="max-w-md font-body text-sm text-showroom-100/60 md:text-base mt-2">
            Every curve and intake is dictated by performance. Move your cursor 
            across the frame to explore the lineage of our design.
          </p>
        </RevealItem>
      </RevealText>
    </section>
  )
}
