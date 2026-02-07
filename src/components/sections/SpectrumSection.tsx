'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import { COMPLEXITY_LEVELS } from '@/lib/prompting-engine'
import GlassCard from '@/components/ui/GlassCard'

export default function SpectrumSection() {
  const { activeSpectrumLevel, setActiveSpectrumLevel } = useUIStore()
  const activeLevel = COMPLEXITY_LEVELS[activeSpectrumLevel - 1]

  return (
    <section className="relative py-20 px-4" id="spectrum">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider neon-text-purple">
            COMPLEXITY SPECTRUM
          </h2>
          <p className="mt-3 text-foreground/40 font-body text-lg">
            7 levels of prompt engineering mastery
          </p>
        </motion.div>

        {/* Level Nodes */}
        <div className="relative flex items-center justify-center gap-2 md:gap-4 mb-12 overflow-x-auto py-4">
          {/* Connecting gradient line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-px hidden md:block"
            style={{
              background: 'linear-gradient(90deg, #00f0ff, #ff00ff, #ffd700, #7000ff, #ff0044)',
              transform: 'translateY(-50%)',
              opacity: 0.2,
            }}
          />

          {COMPLEXITY_LEVELS.map((level) => {
            const isActive = activeSpectrumLevel === level.level
            return (
              <motion.button
                key={level.level}
                onClick={() => setActiveSpectrumLevel(level.level)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
              >
                <motion.div
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-display font-bold text-lg transition-all duration-300"
                  style={{
                    background: isActive ? `${level.color}20` : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${isActive ? level.color : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? level.color : 'rgba(255,255,255,0.3)',
                    boxShadow: isActive ? `0 0 20px ${level.color}30` : 'none',
                  }}
                >
                  L{level.level}
                </motion.div>
                <span
                  className="text-[10px] md:text-xs font-display tracking-wider whitespace-nowrap"
                  style={{ color: isActive ? level.color : 'rgba(255,255,255,0.2)' }}
                >
                  {level.name.split(' ')[0]}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Level Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSpectrumLevel}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard glowColor={activeLevel.color} hover={false} className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold"
                  style={{
                    background: `${activeLevel.color}20`,
                    border: `1px solid ${activeLevel.color}40`,
                    color: activeLevel.color,
                  }}
                >
                  L{activeLevel.level}
                </div>
                <h3
                  className="text-xl md:text-2xl font-display font-bold tracking-wider"
                  style={{ color: activeLevel.color }}
                >
                  {activeLevel.name}
                </h3>
              </div>

              <p className="text-foreground/70 font-body text-lg mb-4">{activeLevel.description}</p>

              <div className="mb-4">
                <span className="text-xs font-display tracking-wider text-foreground/40 uppercase">
                  Best used for:
                </span>
                <p className="text-foreground/60 font-body mt-1">{activeLevel.use}</p>
              </div>

              <div
                className="p-4 rounded-sm font-mono text-sm whitespace-pre-wrap"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: `1px solid ${activeLevel.color}15`,
                  color: `${activeLevel.color}cc`,
                }}
              >
                {activeLevel.example}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
