'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'cyan' | 'purple' | 'gold' | 'pink' | 'green'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

const COLORS = {
  cyan: { bg: 'rgba(0,240,255,0.1)', border: '#00f0ff', text: '#00f0ff', shadow: 'rgba(0,240,255,0.3)' },
  purple: { bg: 'rgba(112,0,255,0.1)', border: '#7000ff', text: '#7000ff', shadow: 'rgba(112,0,255,0.3)' },
  gold: { bg: 'rgba(255,215,0,0.1)', border: '#ffd700', text: '#ffd700', shadow: 'rgba(255,215,0,0.3)' },
  pink: { bg: 'rgba(255,0,255,0.1)', border: '#ff00ff', text: '#ff00ff', shadow: 'rgba(255,0,255,0.3)' },
  green: { bg: 'rgba(0,255,136,0.1)', border: '#00ff88', text: '#00ff88', shadow: 'rgba(0,255,136,0.3)' },
}

const SIZES = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
}

export default function NeonButton({
  children,
  onClick,
  variant = 'cyan',
  size = 'md',
  className,
  disabled,
  type = 'button',
}: NeonButtonProps) {
  const c = COLORS[variant]

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03, boxShadow: `0 0 25px ${c.shadow}` }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'relative font-display font-semibold tracking-wider uppercase rounded-md',
        'transition-all duration-300 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        SIZES[size],
        className
      )}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        boxShadow: `0 0 15px ${c.shadow}`,
      }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
