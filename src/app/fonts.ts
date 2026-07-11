// Font strategy: this build ships with zero network-dependent font
// loading so `next build` succeeds in fully offline / restricted-network
// environments (CI, sandboxes, air-gapped machines). Two CSS variables
// are exported below and consumed in globals.css / tailwind.config.ts
// exactly like next/font would -- swap either block for a real
// next/font/google or next/font/local call once you have proper network
// access or a licensed Bierika woff2. See README "Fonts" section.

// --- display face --------------------------------------------------
// Brief calls for Bierika (paid) -- a tall, condensed-geometric display
// face with hard terminals. Until you license it (or if you'd rather
// use next/font/google's free "Oswald", which has near-identical
// proportions), this stack falls back to the tightest condensed
// system faces available cross-platform (declared in globals.css).
export const display = {
  variable: '--font-display',
}

// --- body / UI face --------------------------------------------------
export const body = {
  variable: '--font-body',
}

/**
 * To switch to real Google-hosted fonts once you have network access,
 * replace the two exports above with:
 *
 *   import { Inter, Oswald } from 'next/font/google'
 *   export const display = Oswald({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-display', display: 'swap' })
 *   export const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
 *
 * layout.tsx already reads `.variable` off both exports, so no other
 * changes are needed there.
 */
