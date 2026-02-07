'use client'

import { motion } from 'framer-motion'
import { useUIStore, type ActiveTab } from '@/lib/store'

const TABS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: 'pentagon', label: 'PENTAGON', icon: '🔷' },
  { id: 'spectrum', label: 'SPECTRUM', icon: '📊' },
  { id: 'builder', label: 'FORGE', icon: '⚒️' },
  { id: 'validator', label: 'VALIDATOR', icon: '✓' },
  { id: 'chat', label: 'NEURAL LINK', icon: '🧠' },
]

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useUIStore()

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 md:gap-2 py-3 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-3 md:px-5 py-2 font-display text-xs md:text-sm tracking-wider rounded-sm transition-all duration-300 whitespace-nowrap cursor-pointer"
                style={{
                  color: isActive ? '#00f0ff' : 'rgba(224,224,224,0.4)',
                  background: isActive ? 'rgba(0,240,255,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
                }}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}

                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
