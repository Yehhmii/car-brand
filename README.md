# Car Brand — Cinematic Hypercar Site

A frame-sequence-scrubbed, GSAP/Lenis-pinned brand site built with
Next.js App Router. Hero and Interior sections play back **image
sequences** on a `<canvas>` (not `<video>`), scrubbed by pointer-X and
scroll position respectively, so the car appears to orbit / open in 3D
while everything is actually pre-rendered frames.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> First `npm run dev` / `npm run build` needs internet access once, to
> fetch the Google Fonts (Inter + Oswald) used by `next/font/google`.
> If you're running this fully offline, swap `src/app/fonts.ts` to use
> `next/font/local` with your own woff2 files instead.

## What's already generated for you

The two reference clips you provided have been extracted into frame
sequences and dropped in `public/frames/`:

- `public/frames/hero/` — 128 WebP frames (from the red doors-open clip),
  used by `HeroScrubber` (pointer-X scrub).
- `public/frames/interior/` — 156 WebP frames (from the Jesko Attack
  doors-open clip), used by the `Interior` section (scroll-pinned scrub).
- `public/videos/hero-mobile.mp4` / `interior-mobile.mp4` — small H.264
  fallbacks that autoplay/loop on touch devices instead of forcing
  canvas-scrub UX (per the brief's mobile QA note).
- `public/images/showroom-hero.png` — your uploaded showroom still,
  used as the parallax background in the **Presence** section.

Frames were extracted at native source framerate (24fps) and scaled to
960px wide, quality ~75 WebP — good enough for on-screen scrub fidelity
at a fraction of PNG size. Total sequence payload is ~9MB combined.

### Regenerating frames from new source video

```bash
ffmpeg -i your-clip.mp4 -vf "scale=960:-1" -c:v libwebp -q:v 75 \
  -compression_level 4 public/frames/hero/frame_%04d.webp
```

Update `frameCount` in `src/lib/frameManifest.ts` to match the new
frame count, and re-encode a small mobile `.mp4` fallback for the
`mobileVideo` field the same way.

## Structure

See `src/components/hero`, `src/components/sections`, `src/components/ui`,
`src/components/providers`, `src/lib`, `src/store` — mirrors the
architecture from the build brief:

1. **Hero — Arrival** — pointer-x frame scrub (`HeroScrubber`)
2. **Presence — Silhouette** — static image, GSAP parallax
3. **Engineering — Under the Skin** — horizontal pinned scroll, 3 callouts
4. **Interior — Cockpit** — scroll-pinned frame scrub (`Interior`)
5. **Performance — Numbers** — animated `StatCounter`s
6. **Reserve** — CTA + final `AnchorMorph` (shared `layoutId="brand-emblem"`
   with the hero's corner emblem)

## Notes / things you'll want to adjust

- **Display font**: the brief calls for a paid face (Bierika). This
  build uses **Oswald** (free, Google Fonts) as a structurally similar
  condensed-geometric stand-in — swap in `src/app/fonts.ts` once you've
  licensed the real face.
- **Copy** is placeholder — stat numbers, section headlines, and CTA
  text are written in the brand's tone per the brief's guardrails, but
  are not real spec data. Replace with your actual performance figures.
- **`prefers-reduced-motion`** is respected globally: canvas sequences
  freeze on their resting/final frame, Lenis smoothing is skipped, and
  `RevealText`/`StatCounter` fall back to plain opacity fades.
- **Touch devices** get the native `<video>` fallback instead of
  pointer/scroll canvas-scrub (touch-scrub UX is unreliable, per §7 of
  the brief).
