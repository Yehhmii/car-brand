'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'
import { fallIn, fallInContainer, fadeOnly } from '@/lib/motion'
import clsx from 'clsx'

interface RevealTextProps {
  children: ReactNode
  as?: 'div' | 'span'
  className?: string
  /** stagger children (use when passing multiple RevealText.Item) */
  container?: boolean
}

export default function RevealText({
  children,
  className,
  container = false,
}: RevealTextProps) {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? fadeOnly : container ? fallInContainer : fallIn

  return (
    <motion.div
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.4 }}
      className={clsx(className)}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div variants={prefersReduced ? fadeOnly : fallIn} className={clsx(className)}>
      {children}
    </motion.div>
  )
}
