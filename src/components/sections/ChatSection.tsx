'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore, useAuthStore, usePromptStore } from '@/lib/store'
import GlassCard from '@/components/ui/GlassCard'
import StreamingText from '@/components/ui/StreamingText'
import { Send, Loader2, Sparkles } from 'lucide-react'

export default function ChatSection() {
  const [input, setInput] = useState('')
  const { messages, isStreaming, addMessage, setStreaming } = useChatStore()
  const { user } = useAuthStore()
  const { atoms } = usePromptStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userMessage })
    setStreaming(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))

      const hasAtoms = Object.values(atoms).some((v) => v.trim())

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          atoms: hasAtoms ? atoms : undefined,
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          // Parse Vercel AI SDK data stream format
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2))
                fullResponse += text
              } catch {
                // skip parse errors
              }
            }
          }
        }
      }

      if (fullResponse) {
        addMessage({ role: 'assistant', content: fullResponse })
      }
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Neural link disrupted. Please check your connection and try again.',
      })
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section className="relative py-20 px-4" id="chat">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider neon-text-cyan">
            NEURAL LINK
          </h2>
          <p className="mt-3 text-foreground/40 font-body text-lg">
            {user
              ? 'Connected to PROMETHEUS intelligence core'
              : 'Sign in to activate the Neural Link'}
          </p>
        </motion.div>

        {/* Chat Container */}
        <GlassCard hover={false} className="relative min-h-[400px] max-h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <Sparkles className="w-8 h-8 text-neon-cyan/30 mb-4" />
                <p className="text-foreground/20 font-display text-sm tracking-wider">
                  AWAITING TRANSMISSION...
                </p>
                <p className="text-foreground/10 font-body text-xs mt-2">
                  Your prompts from the Forge will enhance AI context
                </p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 ${
                      msg.role === 'user' ? 'hud-bubble-user' : 'hud-bubble'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-display tracking-wider uppercase"
                        style={{
                          color: msg.role === 'user' ? '#7000ff' : '#00f0ff',
                        }}
                      >
                        {msg.role === 'user' ? 'OPERATOR' : 'PROMETHEUS'}
                      </span>
                      <span className="text-[10px] text-foreground/20">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {msg.role === 'assistant' ? (
                      <StreamingText
                        text={msg.content}
                        className="text-sm font-body text-foreground/80 leading-relaxed"
                      />
                    ) : (
                      <p className="text-sm font-body text-foreground/80 leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="hud-bubble px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 text-neon-cyan animate-spin" />
                    <span className="text-xs text-neon-cyan/60 font-display tracking-wider">
                      PROCESSING...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Command Center Input */}
          <div className="border-t border-foreground/5 p-3">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={user ? 'Enter command...' : 'Sign in to use Neural Link'}
                disabled={!user || isStreaming}
                rows={1}
                className="flex-1 bg-black/30 border border-foreground/10 rounded-sm px-4 py-2.5 text-sm font-body text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-neon-cyan/30 transition-colors resize-none disabled:opacity-30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!input.trim() || isStreaming || !user}
                className="p-2.5 rounded-sm transition-all disabled:opacity-30 cursor-pointer"
                style={{
                  background: 'rgba(0,240,255,0.1)',
                  border: '1px solid rgba(0,240,255,0.2)',
                }}
              >
                <Send className="w-4 h-4 text-neon-cyan" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
