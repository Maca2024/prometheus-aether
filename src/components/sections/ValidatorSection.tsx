'use client'

import { motion } from 'framer-motion'
import { usePromptStore, type AtomField } from '@/lib/store'
import { ATOM_META } from '@/lib/prompting-engine'
import GlassCard from '@/components/ui/GlassCard'
import NeonButton from '@/components/ui/NeonButton'
import { Search } from 'lucide-react'

const ATOM_ORDER: AtomField[] = ['role', 'context', 'goal', 'process', 'format']

export default function ValidatorSection() {
  const { validationInput, validationResult, setValidationInput, validatePrompt } =
    usePromptStore()

  return (
    <section className="relative py-20 px-4" id="validator">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider">
            <span style={{ color: '#ffd700' }}>PRE-FLIGHT</span>{' '}
            <span className="neon-text-cyan">VALIDATOR</span>
          </h2>
          <p className="mt-3 text-foreground/40 font-body text-lg">
            Analyze any prompt against the PROMETHEUS framework
          </p>
        </motion.div>

        {/* Input */}
        <GlassCard hover={false} className="mb-8">
          <textarea
            value={validationInput}
            onChange={(e) => setValidationInput(e.target.value)}
            placeholder="Paste your existing prompt here to analyze it against the PROMETHEUS framework..."
            rows={6}
            className="w-full bg-black/30 border border-foreground/10 rounded-sm px-4 py-3 text-sm font-body text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-neon-cyan/30 transition-colors resize-none mb-4"
          />
          <div className="flex justify-center">
            <NeonButton
              variant="gold"
              size="lg"
              onClick={validatePrompt}
              disabled={!validationInput.trim()}
            >
              <Search className="inline w-4 h-4 mr-2" />
              ANALYSEER PROMPT
            </NeonButton>
          </div>
        </GlassCard>

        {/* Analysis Grid */}
        {validationResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Score */}
            <div className="text-center mb-8">
              <div
                className="inline-block px-6 py-3 rounded-sm font-display text-2xl font-bold tracking-wider"
                style={{
                  color:
                    validationResult.score >= 70
                      ? '#00ff88'
                      : validationResult.score >= 40
                      ? '#ffd700'
                      : '#ff00ff',
                  background:
                    validationResult.score >= 70
                      ? 'rgba(0,255,136,0.08)'
                      : validationResult.score >= 40
                      ? 'rgba(255,215,0,0.08)'
                      : 'rgba(255,0,255,0.08)',
                  border: `1px solid ${
                    validationResult.score >= 70
                      ? 'rgba(0,255,136,0.2)'
                      : validationResult.score >= 40
                      ? 'rgba(255,215,0,0.2)'
                      : 'rgba(255,0,255,0.2)'
                  }`,
                }}
              >
                {validationResult.score}% PROMETHEUS COMPLIANCE
              </div>
            </div>

            {/* Atom Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {ATOM_ORDER.map((key) => {
                const meta = ATOM_META[key]
                const present = validationResult[key]
                return (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: ATOM_ORDER.indexOf(key) * 0.1 }}
                    className="p-4 rounded-sm text-center transition-all"
                    style={{
                      background: present
                        ? `${meta.color}08`
                        : 'rgba(255,0,255,0.05)',
                      border: `1px solid ${present ? `${meta.color}30` : 'rgba(255,0,255,0.15)'}`,
                    }}
                  >
                    <div className="text-2xl mb-1">{meta.icon}</div>
                    <div
                      className="text-xs font-display tracking-wider mb-1"
                      style={{ color: present ? meta.color : '#ff00ff' }}
                    >
                      {meta.label}
                    </div>
                    <div
                      className="text-lg font-display font-bold"
                      style={{ color: present ? '#00ff88' : '#ff00ff' }}
                    >
                      {present ? '✓' : '✗'}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Status & Tips */}
            <GlassCard
              hover={false}
              glowColor={
                validationResult.context && validationResult.goal
                  ? '#00ff88'
                  : '#ff00ff'
              }
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-sm font-display tracking-wider font-bold"
                  style={{
                    color:
                      validationResult.context && validationResult.goal
                        ? '#00ff88'
                        : '#ff00ff',
                  }}
                >
                  {validationResult.context && validationResult.goal
                    ? '✓ ESSENTIËLE ELEMENTEN AANWEZIG'
                    : '⚠️ ESSENTIËLE ELEMENTEN MISSEN'}
                </span>
              </div>

              {validationResult.tips.length > 0 && (
                <ul className="space-y-2">
                  {validationResult.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-sm font-body text-foreground/60 flex items-start gap-2"
                    >
                      <span className="text-neon-cyan mt-0.5">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </section>
  )
}
