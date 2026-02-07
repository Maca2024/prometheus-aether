'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  hover?: boolean
  onClick?: () => void
}

export default function GlassCard({
  children,
  className,
  glowColor,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={clsx(
        'glass rounded-lg p-6 transition-all duration-300',
        hover && 'glass-hover cursor-pointer',
        className
      )}
      style={
        glowColor
          ? {
              boxShadow: `0 0 15px ${glowColor}15, 0 0 30px ${glowColor}08, inset 0 0 15px ${glowColor}05`,
              borderColor: `${glowColor}20`,
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  )
}
