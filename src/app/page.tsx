'use client'
import { LayoutGroup } from 'framer-motion'
import HeroScrubber from '@/components/hero/HeroScrubber'
import Presence from '@/components/sections/Presence'
import Engineering from '@/components/sections/Engineering'
import Interior from '@/components/sections/Interior'
import Performance from '@/components/sections/Performance'
import Reserve from '@/components/sections/Reserve'

export default function Home() {
  return (
    <LayoutGroup>
      <main className="relative w-full">
        <HeroScrubber />
        <Presence />
        <Engineering />
        <Interior />
        <Performance />
        <Reserve />
      </main>
    </LayoutGroup>
  )
}
