"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Variants } from "framer-motion"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Variant definitions (exported for custom use)
// ---------------------------------------------------------------------------

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// ---------------------------------------------------------------------------
// ScrollReveal — fade + slide-up triggered when element enters viewport
// ---------------------------------------------------------------------------

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "-80px", once: true })

  return (
    <motion.div
      ref={ref}
      variants={revealVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// StaggerGroup — container that staggers its children
// ---------------------------------------------------------------------------

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
}

export function StaggerGroup({ children, className }: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "-80px", once: true })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// StaggerItem — individual animated item inside StaggerGroup
// ---------------------------------------------------------------------------

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItem} className={cn(className)}>
      {children}
    </motion.div>
  )
}
