'use client'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface AnchorMorphProps {
  /** must match across the two sections you want to visually connect */
  layoutId: string
  className?: string
}

/**
 * Renders a shared-layoutId element. When mounted in two different
 * sections with the same layoutId (wrapped in a common <LayoutGroup> or
 * simply present in the same React tree), Framer Motion auto-animates
 * the FLIP transform between their differing size/position — this is
 * the "one anchor scale-morphs into the next section" trick from the
 * brief, used without any real 3D.
 */
export default function AnchorMorph({ layoutId, className }: AnchorMorphProps) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'rounded-full border border-crimson-400/60 bg-carbon-950/60 backdrop-blur-sm',
        className
      )}
    />
  )
}
