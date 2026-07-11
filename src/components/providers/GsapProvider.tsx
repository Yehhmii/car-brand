'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    // Pinned frame-scrub sections mount asynchronously (after frames load),
    // so measurements taken on first paint go stale — refresh once things
    // settle.
    const t = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => {
      clearTimeout(t)
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return <>{children}</>
}
