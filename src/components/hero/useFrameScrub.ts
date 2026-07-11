'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface Options {
  frameCount: number
  path: (i: number) => string
  /** called once every frame has finished loading */
  onLoaded?: () => void
}

/**
 * Preloads a numbered image sequence and exposes a `draw(frameIndex)`
 * function that paints the given frame onto a single canvas. Frames are
 * 1-indexed to match the ffmpeg %04d output. Never mount <img> tags for
 * every frame — a single canvas + bitmap swap is what makes this read as
 * real playback instead of a slideshow.
 */
export function useFrameScrub({ frameCount, path, onLoaded }: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(false)
  const currentFrame = useRef(0)

  useEffect(() => {
    let cancelled = false
    const images: HTMLImageElement[] = []
    let loadedCount = 0

    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image()
      img.decoding = 'async'
      img.src = path(i)
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameCount && !cancelled) {
          setLoaded(true)
          onLoaded?.()
        }
      }
      images.push(img)
    }
    imagesRef.current = images

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount])

  const draw = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[frameIndex - 1]
    if (!canvas || !img?.complete || img.naturalWidth === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Scale for sharper rendering on high DPI displays
    const dpr = window.devicePixelRatio || 1
    const targetWidth = img.naturalWidth * dpr
    const targetHeight = img.naturalHeight * dpr

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth
      canvas.height = targetHeight
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Enforce high quality image smoothing for sharper frames
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    currentFrame.current = frameIndex
  }, [])

  return { canvasRef, draw, loaded, frameCount, currentFrame }
}
