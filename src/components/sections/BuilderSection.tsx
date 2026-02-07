'use client'

import { motion } from 'framer-motion'
import { usePromptStore, type AtomField } from '@/lib/store'
import { ATOM_META } from '@/lib/prompting-engine'
import GlassCard from '@/components/ui/GlassCard'
import NeonButton from '@/components/ui/NeonButton'
import { Copy, Trash2, Zap } from 'lucide-react'
import { useState } from 'react'

const ATOM_ORDER: AtomField[] = ['role', 'context', 'goal', 'process', 'format']

export default function BuilderSection() {
  const { atoms, generatedPrompt, setAtom, generatePrompt, clearAtoms } = usePromptStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!generatedPrompt) return
    await navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isValid = atoms.context.trim() && atoms.goal.trim()

  return (
    <section className="relative py-20 px-4" id="builder">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider">
            <span className="neon-text-cyan">QUANTUM</span>{' '}
            <span style={{ color: '#ffd700' }}>PROMPT FORGE</span>
          </h2>
          <p className="mt-3 text-foreground/40 font-body text-lg">
            Construct your structured prompt using the 5 atoms
          </p>
        </motion.div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ATOM_ORDER.map((key, i) => {
            const meta = ATOM_META[key]
            const isEssential = key === 'context' || key === 'goal'
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={key === 'context' || key === 'goal' ? 'md:col-span-1' : ''}
              >
                <GlassCard hover={false} className="h-full">
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
                    style={{ background: meta.color }}
                  />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{meta.icon}</span>
                    <span
                      className="font-display text-sm font-bold tracking-wider"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    {isEssential && (
                      <span className="text-[10px] font-display text-neon-gold bg-neon-gold/10 px-1.5 py-0.5 rounded-sm">
                        REQUIRED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/30 font-body mb-2">
                    {meta.question}
                  </p>
                  <textarea
                    value={atoms[key]}
                    onChange={(e) => setAtom(key, e.target.value)}
                    placeholder={meta.description}
                    rows={isEssential ? 4 : 3}
                    className="w-full bg-black/30 border border-foreground/10 rounded-sm px-3 py-2 text-sm font-body text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-neon-cyan/30 transition-colors resize-none"
                    style={{
                      boxShadow: atoms[key]
                        ? `inset 0 0 10px ${meta.color}08`
                        : 'none',
                    }}
                  />
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <NeonButton
            variant="cyan"
            size="lg"
            onClick={generatePrompt}
            disabled={!isValid}
          >
            <Zap className="inline w-4 h-4 mr-2" />
            GENEREER
          </NeonButton>
          <NeonButton variant="purple" size="lg" onClick={handleCopy} disabled={!generatedPrompt}>
            <Copy className="inline w-4 h-4 mr-2" />
            {copied ? 'GEKOPIEERD!' : 'KOPIEER'}
          </NeonButton>
          <NeonButton variant="pink" size="lg" onClick={clearAtoms}>
            <Trash2 className="inline w-4 h-4 mr-2" />
            WISSEN
          </NeonButton>
        </div>

        {/* Output */}
        {generatedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard hover={false} glowColor="#00ff88">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
                <span className="text-xs font-display tracking-wider text-neon-green">
                  GENERATED OUTPUT
                </span>
              </div>
              <pre className="font-mono text-sm text-neon-green/80 whitespace-pre-wrap leading-relaxed p-4 bg-black/40 rounded-sm border border-neon-green/10 overflow-x-auto">
                {generatedPrompt}
              </pre>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </section>
  )
}
