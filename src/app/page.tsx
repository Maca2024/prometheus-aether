'use client'

import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import HeroSection from '@/components/sections/HeroSection'
import TabNavigation from '@/components/sections/TabNavigation'
import PentagonSection from '@/components/sections/PentagonSection'
import SpectrumSection from '@/components/sections/SpectrumSection'
import BuilderSection from '@/components/sections/BuilderSection'
import ValidatorSection from '@/components/sections/ValidatorSection'
import ChatSection from '@/components/sections/ChatSection'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
})

export default function Home() {
  const { activeTab } = useUIStore()

  return (
    <main className="relative min-h-screen">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Hero */}
      <HeroSection />

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'pentagon' && <PentagonSection />}
          {activeTab === 'spectrum' && <SpectrumSection />}
          {activeTab === 'builder' && <BuilderSection />}
          {activeTab === 'validator' && <ValidatorSection />}
          {activeTab === 'chat' && <ChatSection />}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-foreground/5">
        <p className="text-xs font-display tracking-[0.3em] text-foreground/20 uppercase">
          Prometheus Aether &middot; Aetherlink Forge &middot; Protocol L2
        </p>
        <p className="text-[10px] text-foreground/10 mt-2 font-body">
          Minimaal &middot; Modulair &middot; Meetbaar &middot; Universeel &middot; Praktisch
        </p>
      </footer>
    </main>
  )
}
