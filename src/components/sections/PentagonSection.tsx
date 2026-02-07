'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import { useUIStore, type AtomField } from '@/lib/store'
import { ATOM_META } from '@/lib/prompting-engine'

const PentagonScene = dynamic(() => import('@/components/three/PentagonScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="text-neon-cyan/40 font-display text-sm animate-pulse-glow">
        INITIALIZING PENTAGON...
      </div>
    </div>
  ),
})

const ATOM_KEYS: AtomField[] = ['role', 'context', 'goal', 'process', 'format']

export default function PentagonSection() {
  const { activeAtom, setActiveAtom } = useUIStore()

  const handleVertexClick = (index: number) => {
    setActiveAtom(ATOM_KEYS[index])
  }

  const currentAtom = activeAtom ? ATOM_META[activeAtom] : null

  return (
    <section className="relative py-20 px-4" id="pentagon">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider neon-text-cyan">
            HET PENTAGON
          </h2>
          <p className="mt-3 text-foreground/40 font-body text-lg">
            The 5 Atoms of PROMETHEUS — click a vertex to explore
          </p>
        </motion.div>

        {/* Pentagon + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* 3D Pentagon */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={null}>
              <PentagonScene onVertexClick={handleVertexClick} />
            </Suspense>
          </motion.div>

          {/* Atom Info Card */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {currentAtom ? (
                <motion.div
                  key={activeAtom}
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard glowColor={currentAtom.color} hover={false}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{currentAtom.icon}</span>
                      <h3
                        className="text-2xl font-display font-bold tracking-wider"
                        style={{ color: currentAtom.color }}
                      >
                        {currentAtom.label}
                      </h3>
                    </div>

                    <div
                      className="text-sm font-display tracking-wider mb-4 px-3 py-2 rounded-sm"
                      style={{
                        color: currentAtom.color,
                        background: `${currentAtom.color}10`,
                        border: `1px solid ${currentAtom.color}20`,
                      }}
                    >
                      Kernel: &quot;{currentAtom.question}&quot;
                    </div>

                    <p className="text-foreground/60 font-body text-lg leading-relaxed">
                      {currentAtom.description}
                    </p>

                    {(activeAtom === 'context' || activeAtom === 'goal') && (
                      <div className="mt-4 px-3 py-1.5 text-xs font-display tracking-wider text-neon-gold bg-neon-gold/5 border border-neon-gold/20 rounded-sm inline-block">
                        ESSENTIAL
                      </div>
                    )}

                    {(activeAtom === 'role' || activeAtom === 'process' || activeAtom === 'format') && (
                      <div className="mt-4 px-3 py-1.5 text-xs font-display tracking-wider text-foreground/30 bg-foreground/5 border border-foreground/10 rounded-sm inline-block">
                        OPTIONAL — ENHANCES QUALITY
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-[300px]"
                >
                  <p className="text-foreground/20 font-display tracking-wider text-center">
                    Select a vertex to explore an atom
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
