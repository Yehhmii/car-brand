import { create } from 'zustand'

interface ScrollState {
  /** 0-1 progress of total page scroll, fed by LenisProvider */
  progress: number
  heroLoaded: boolean
  interiorLoaded: boolean
  reducedMotion: boolean
  setProgress: (p: number) => void
  setHeroLoaded: (v: boolean) => void
  setInteriorLoaded: (v: boolean) => void
  setReducedMotion: (v: boolean) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  heroLoaded: false,
  interiorLoaded: false,
  reducedMotion: false,
  setProgress: (p) => set({ progress: p }),
  setHeroLoaded: (v) => set({ heroLoaded: v }),
  setInteriorLoaded: (v) => set({ interiorLoaded: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}))
