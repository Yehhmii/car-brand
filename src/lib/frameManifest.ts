export interface FrameSequence {
  id: string
  frameCount: number
  path: (i: number) => string
  mobileVideo: string
  /** resting frame shown before any interaction (1-indexed) */
  restingFrame: number
}

const pad = (i: number) => String(i).padStart(4, '0')

export const heroSequence: FrameSequence = {
  id: 'hero',
  frameCount: 128,
  path: (i) => `/frames/hero/frame_${pad(i)}.webp`,
  mobileVideo: '/videos/hero-mobile.mp4',
  restingFrame: 1,
}

export const interiorSequence: FrameSequence = {
  id: 'interior',
  frameCount: 156,
  path: (i) => `/frames/interior/frame_${pad(i)}.webp`,
  mobileVideo: '/videos/interior-mobile.mp4',
  restingFrame: 1,
}
