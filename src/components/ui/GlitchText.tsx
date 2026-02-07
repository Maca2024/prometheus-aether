'use client'

import { motion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span'
}

export default function GlitchText({ text, className, as: Tag = 'h1' }: GlitchTextProps) {
  return (
    <Tag className={`relative inline-block ${className ?? ''}`}>
      <motion.span
        className="relative z-10"
        style={{
          background: 'linear-gradient(135deg, #00f0ff, #7000ff, #ff00ff, #00f0ff)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        {text}
      </motion.span>

      {/* Glitch layers */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{
          color: '#00f0ff',
          textShadow: '-2px 0 #ff00ff',
          animation: 'glitch 0.3s ease-in-out infinite alternate',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
        }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{
          color: '#ff00ff',
          textShadow: '2px 0 #00f0ff',
          animation: 'glitch 0.3s ease-in-out infinite alternate-reverse',
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
        }}
      >
        {text}
      </span>
    </Tag>
  )
}
