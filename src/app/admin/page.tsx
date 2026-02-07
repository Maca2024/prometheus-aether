'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store'
import GlassCard from '@/components/ui/GlassCard'
import NeonButton from '@/components/ui/NeonButton'
import { Shield, Users, MessageSquare, ThumbsUp, Download, ArrowLeft, Search } from 'lucide-react'

interface PromptRow {
  id: string
  role: string
  content: string
  created_at: string
  model: string | null
  user_id: string
  profiles: { email: string; full_name: string } | null
  session_id: string
}

interface FeedbackRow {
  id: string
  rating: number
  feedback_type: string
  preferred_response: string | null
  created_at: string
  prompt_id: string
  profiles: { email: string } | null
}

interface Stats {
  totalUsers: number
  totalPrompts: number
  totalSessions: number
  totalFeedback: number
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const [activeView, setActiveView] = useState<'overview' | 'prompts' | 'feedback' | 'users'>('overview')
  const [prompts, setPrompts] = useState<PromptRow[]>([])
  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalPrompts: 0, totalSessions: 0, totalFeedback: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)

    const [profilesRes, promptsRes, sessionsRes, feedbackRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('prompts').select('*, profiles(email, full_name)').order('created_at', { ascending: false }).limit(100),
      supabase.from('sessions').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*, profiles(email)').order('created_at', { ascending: false }).limit(100),
    ])

    setStats({
      totalUsers: profilesRes.count ?? 0,
      totalPrompts: promptsRes.data?.length ?? 0,
      totalSessions: sessionsRes.count ?? 0,
      totalFeedback: feedbackRes.data?.length ?? 0,
    })

    setPrompts((promptsRes.data as unknown as PromptRow[]) ?? [])
    setFeedback((feedbackRes.data as unknown as FeedbackRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user?.role === 'admin') loadData()
  }, [user, loadData])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard hover={false} className="max-w-md text-center">
          <Shield className="w-12 h-12 text-neon-pink mx-auto mb-4" />
          <h1 className="text-2xl font-display text-neon-pink tracking-wider mb-2">
            ACCESS DENIED
          </h1>
          <p className="text-foreground/40 font-body">
            God Mode requires admin clearance.
          </p>
          <a href="/" className="inline-block mt-4">
            <NeonButton variant="cyan" size="sm">
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              RETURN
            </NeonButton>
          </a>
        </GlassCard>
      </div>
    )
  }

  const exportDataset = () => {
    const dataset = prompts
      .filter((p) => p.role === 'user')
      .map((userPrompt) => {
        const assistantResponse = prompts.find(
          (p) =>
            p.role === 'assistant' &&
            p.session_id === userPrompt.session_id &&
            new Date(p.created_at) > new Date(userPrompt.created_at)
        )
        const promptFeedback = feedback.find((f) => f.prompt_id === assistantResponse?.id)

        return {
          prompt: userPrompt.content,
          response: assistantResponse?.content ?? '',
          rating: promptFeedback?.rating ?? null,
          preferred_response: promptFeedback?.preferred_response ?? null,
          user_email: userPrompt.profiles?.email ?? 'anonymous',
          timestamp: userPrompt.created_at,
        }
      })

    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prometheus-rlhf-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredPrompts = searchQuery
    ? prompts.filter(
        (p) =>
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : prompts

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-neon-gold" />
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider text-neon-gold">
              GOD MODE
            </h1>
            <span className="text-xs font-display text-foreground/30 tracking-wider">
              ADMIN DASHBOARD
            </span>
          </div>
          <div className="flex items-center gap-3">
            <NeonButton variant="green" size="sm" onClick={exportDataset}>
              <Download className="inline w-4 h-4 mr-2" />
              EXPORT RLHF
            </NeonButton>
            <a href="/">
              <NeonButton variant="cyan" size="sm">
                <ArrowLeft className="inline w-4 h-4 mr-2" />
                BACK
              </NeonButton>
            </a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'USERS', value: stats.totalUsers, icon: Users, color: '#00f0ff' },
            { label: 'PROMPTS', value: stats.totalPrompts, icon: MessageSquare, color: '#7000ff' },
            { label: 'SESSIONS', value: stats.totalSessions, icon: Shield, color: '#ffd700' },
            { label: 'FEEDBACK', value: stats.totalFeedback, icon: ThumbsUp, color: '#00ff88' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover={false} glowColor={stat.color}>
                <stat.icon className="w-5 h-5 mb-2" style={{ color: stat.color }} />
                <div className="text-3xl font-display font-bold" style={{ color: stat.color }}>
                  {loading ? '...' : stat.value}
                </div>
                <div className="text-xs font-display tracking-wider text-foreground/30 mt-1">
                  {stat.label}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'prompts', 'feedback'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className="px-4 py-2 text-xs font-display tracking-wider rounded-sm transition-all cursor-pointer"
              style={{
                color: activeView === view ? '#00f0ff' : 'rgba(224,224,224,0.3)',
                background: activeView === view ? 'rgba(0,240,255,0.08)' : 'transparent',
                border: `1px solid ${activeView === view ? 'rgba(0,240,255,0.2)' : 'transparent'}`,
              }}
            >
              {view.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeView === 'prompts' && (
          <div className="mb-6 flex items-center gap-2">
            <Search className="w-4 h-4 text-foreground/30" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts or users..."
              className="flex-1 bg-black/30 border border-foreground/10 rounded-sm px-4 py-2 text-sm font-body text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-neon-cyan/30"
            />
          </div>
        )}

        {/* Content */}
        {activeView === 'overview' && (
          <GlassCard hover={false}>
            <h3 className="text-lg font-display tracking-wider text-neon-cyan mb-4">
              RECENT ACTIVITY
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {prompts.slice(0, 20).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-sm bg-black/20 border border-foreground/5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-display tracking-wider"
                      style={{ color: p.role === 'user' ? '#7000ff' : '#00f0ff' }}
                    >
                      {p.role.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-foreground/20">
                      {p.profiles?.email ?? 'unknown'} &middot;{' '}
                      {new Date(p.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-body text-foreground/60 line-clamp-2">
                    {p.content}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeView === 'prompts' && (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredPrompts.map((p) => (
              <GlassCard key={p.id} hover={false} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-display px-2 py-0.5 rounded-sm"
                      style={{
                        color: p.role === 'user' ? '#7000ff' : '#00f0ff',
                        background: p.role === 'user' ? 'rgba(112,0,255,0.1)' : 'rgba(0,240,255,0.1)',
                        border: `1px solid ${p.role === 'user' ? 'rgba(112,0,255,0.2)' : 'rgba(0,240,255,0.2)'}`,
                      }}
                    >
                      {p.role.toUpperCase()}
                    </span>
                    <span className="text-xs text-foreground/30">
                      {p.profiles?.email ?? 'anonymous'}
                    </span>
                  </div>
                  <span className="text-[10px] text-foreground/20">
                    {new Date(p.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-body text-foreground/70 whitespace-pre-wrap">
                  {p.content}
                </p>
              </GlassCard>
            ))}
          </div>
        )}

        {activeView === 'feedback' && (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {feedback.length === 0 ? (
              <GlassCard hover={false}>
                <p className="text-center text-foreground/30 font-display text-sm tracking-wider py-8">
                  NO FEEDBACK DATA YET
                </p>
              </GlassCard>
            ) : (
              feedback.map((f) => (
                <GlassCard key={f.id} hover={false} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-display text-neon-gold">
                        RATING: {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                      </span>
                      <span className="text-xs text-foreground/30">
                        {f.feedback_type}
                      </span>
                    </div>
                    <span className="text-[10px] text-foreground/20">
                      {f.profiles?.email} &middot; {new Date(f.created_at).toLocaleString()}
                    </span>
                  </div>
                  {f.preferred_response && (
                    <p className="text-sm font-body text-foreground/60 mt-2">
                      Preferred: {f.preferred_response}
                    </p>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
