import type { Transition, Variants } from 'framer-motion'

export const EASE_FALL = [0.16, 1, 0.3, 1] as const // fast start, long soft settle
export const EASE_FALL_OUT = [0.7, 0, 0.84, 0] as const // slow start, sharp exit

export const DURATION_ENTER = 0.9
export const DURATION_EXIT = 0.55

export const STAGGER_CHILDREN = 0.07 // 60-90ms, never more

export const fallIn: Variants = {
  initial: { opacity: 0, y: 48, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION_ENTER, ease: EASE_FALL } as Transition,
  },
  exit: {
    opacity: 0,
    y: -32,
    filter: 'blur(4px)',
    transition: { duration: DURATION_EXIT, ease: EASE_FALL_OUT } as Transition,
  },
}

export const fallInContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: 0.05,
    },
  },
}

// Reduced-motion variant: plain opacity, no transform/blur, no stagger.
export const fadeOnly: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: 'linear' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'linear' } },
}
