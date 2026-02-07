'use client'

import { motion } from 'framer-motion'
import GlitchText from '@/components/ui/GlitchText'
import NeonButton from '@/components/ui/NeonButton'
import { useAuthStore, useUIStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'

export default function HeroSection() {
  const { user } = useAuthStore()
  const { setActiveTab } = useUIStore()

  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(0,240,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(112,0,255,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Auth bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-20 flex items-center gap-4"
      >
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neon-cyan font-display tracking-wider">
              {user.name || user.email}
            </span>
            {user.role === 'admin' && (
              <a
                href="/admin"
                className="px-3 py-1 text-xs font-display text-neon-gold border border-neon-gold/30 rounded-sm hover:bg-neon-gold/10 transition-colors"
              >
                GOD MODE
              </a>
            )}
            <NeonButton variant="purple" size="sm" onClick={handleLogout}>
              DISCONNECT
            </NeonButton>
          </div>
        ) : (
          <NeonButton variant="cyan" size="sm" onClick={handleLogin}>
            CONNECT WITH GOOGLE
          </NeonButton>
        )}
      </motion.div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm font-display tracking-[0.3em] text-neon-cyan/60 mb-6 uppercase"
        >
          Aetherlink Forge &middot; Protocol L2
        </motion.p>

        {/* Main Title */}
        <GlitchText
          text="PROMETHEUS"
          as="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-wider leading-none"
        />

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl md:text-4xl font-display font-light tracking-[0.2em] mt-2"
          style={{
            background: 'linear-gradient(90deg, #7000ff, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AETHER
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-lg md:text-xl text-foreground/60 font-body font-light max-w-2xl mx-auto"
        >
          Quantum Prompt Intelligence — Engineer, validate, and deploy structured
          prompts with the power of the PROMETHEUS framework.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <NeonButton variant="cyan" size="lg" onClick={() => setActiveTab('builder')}>
            LAUNCH FORGE
          </NeonButton>
          <NeonButton variant="purple" size="lg" onClick={() => setActiveTab('pentagon')}>
            EXPLORE FRAMEWORK
          </NeonButton>
        </motion.div>

        {/* Framework principles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-wrap justify-center gap-6 text-xs font-display tracking-widest text-foreground/30 uppercase"
        >
          {['Minimaal', 'Modulair', 'Meetbaar', 'Universeel', 'Praktisch'].map(
            (principle, i) => (
              <motion.span
                key={principle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="hover:text-neon-cyan/60 transition-colors"
              >
                {principle}
              </motion.span>
            )
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 border border-neon-cyan/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-neon-cyan/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
