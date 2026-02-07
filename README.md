# PROMETHEUS AETHER

### Quantum Prompt Intelligence Platform

> **Aetherlink Forge | Protocol L2**
> Next-generation prompt engineering platform powered by the PROMETHEUS framework.
> Cyber-Industrial Luxury meets AI Intelligence.

---

## Overview

**Prometheus Aether** is a production-ready, full-stack AI platform that transforms the [Prometheus Nexus](https://github.com/Maca2024/prometheus-5.0) prompt engineering framework into a live, interactive web application with real AI capabilities, user authentication, persistent storage, and an administrative oversight layer for RLHF data collection.

### What it does

| Feature | Description |
|---------|-------------|
| **3D Pentagon Visualization** | Interactive Three.js pentagon representing the 5 PROMETHEUS atoms (Role, Context, Goal, Process, Format) with orbit controls and particle effects |
| **Complexity Spectrum** | 7 levels of prompt engineering mastery — from Direct Pattern (L1) to Multi-Agent Swarm (L7) |
| **Quantum Prompt Forge** | Structured prompt builder using the 5-atom model with real-time generation and clipboard export |
| **Pre-Flight Validator** | Analyze any existing prompt against the PROMETHEUS framework with compliance scoring |
| **Neural Link** | AI-powered chat interface with streaming responses, HUD-style bubbles, and PROMETHEUS context injection |
| **Google OAuth** | Supabase-powered authentication with persistent user profiles |
| **God Mode Dashboard** | Admin panel to view all global prompts/responses, user analytics, and RLHF dataset export |
| **Long-Term Memory** | pgvector-powered semantic memory for personalized AI interactions |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 + Framer Motion |
| **3D Graphics** | React Three Fiber + Drei |
| **State** | Zustand |
| **Auth / DB** | Supabase (PostgreSQL, Auth, Row Level Security) |
| **Vector Memory** | pgvector (Supabase) |
| **AI Engine** | Vercel AI SDK + OpenAI GPT-4o |
| **Deployment** | Vercel |

---

## Architecture

```
prometheus-aether/
├── .env.local.example              # Environment template
├── supabase/
│   └── schema.sql                  # Full DB schema + RLS policies
├── src/
│   ├── middleware.ts                # Session refresh middleware
│   ├── providers/
│   │   └── SupabaseProvider.tsx     # Auth state hydration
│   ├── lib/
│   │   ├── store.ts                # Zustand stores (UI, Prompt, Chat, Auth)
│   │   ├── prompting-engine.ts     # PROMETHEUS system prompt + builder
│   │   └── supabase/
│   │       ├── client.ts           # Browser client
│   │       ├── server.ts           # Server + Admin clients
│   │       └── middleware.ts       # Cookie session handler
│   ├── components/
│   │   ├── ParticleBackground.tsx  # Canvas particle system + grid
│   │   ├── three/
│   │   │   └── PentagonScene.tsx   # R3F 3D pentagon
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx       # Glassmorphism card
│   │   │   ├── NeonButton.tsx      # Neon button (5 color variants)
│   │   │   ├── GlitchText.tsx      # Animated gradient + glitch
│   │   │   └── StreamingText.tsx   # Word-by-word streaming
│   │   └── sections/
│   │       ├── HeroSection.tsx     # Hero + auth controls
│   │       ├── TabNavigation.tsx   # Sticky glassmorphism tabs
│   │       ├── PentagonSection.tsx # Pentagon + atom info
│   │       ├── SpectrumSection.tsx # 7-level complexity
│   │       ├── BuilderSection.tsx  # Prompt Forge
│   │       ├── ValidatorSection.tsx# Pre-flight validator
│   │       └── ChatSection.tsx     # Neural Link chat
│   └── app/
│       ├── layout.tsx              # Root layout (dark theme)
│       ├── globals.css             # Aetherlink CSS system
│       ├── page.tsx                # Main SPA one-pager
│       ├── admin/page.tsx          # God Mode dashboard
│       └── api/
│           ├── auth/callback/route.ts  # OAuth callback
│           └── chat/route.ts           # LLM streaming endpoint
```

---

## Design System

### Cyber-Industrial Luxury

The visual identity follows the **Aetherlink** aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#050505` | App background |
| `--neon-cyan` | `#00f0ff` | Primary accent, interactive elements |
| `--neon-purple` | `#7000ff` | Secondary accent, user messages |
| `--neon-pink` | `#ff00ff` | Warnings, Context atom |
| `--neon-gold` | `#ffd700` | Highlights, Goal atom |
| `--neon-green` | `#00ff88` | Success, Format atom |
| `--font-display` | Orbitron | Headings, labels, UI chrome |
| `--font-body` | Rajdhani | Body text, descriptions |
| `--font-mono` | JetBrains Mono | Code, generated output |

### Visual Effects

- **Glassmorphism**: `backdrop-filter: blur(20px)` with subtle white borders
- **Neon Glow**: Multi-layer `box-shadow` with color-matched opacity
- **Particle System**: 60 interactive canvas particles with mouse attraction and connection lines
- **Grid Background**: Subtle cyan grid overlay
- **Scan Line**: Animated horizontal scan line across the viewport
- **Glitch Text**: CSS clip-path glitch effect on hover
- **Streaming Typography**: Word-by-word Framer Motion reveal

---

## Database Schema

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profiles (extends auth.users) | User sees own; admin sees all |
| `sessions` | Chat sessions/threads | User sees own; admin sees all |
| `prompts` | Every prompt + response pair | User sees own; admin sees all |
| `feedback` | RLHF ratings and edits | User sees own; admin sees all |
| `memories` | pgvector embeddings for long-term context | User sees own; admin sees all |

### Row Level Security

- **Users** can only read/write their own data
- **Admins** (`role = 'admin'` in profiles) can read ALL data across ALL users
- Auto-creates profile on signup via database trigger

---

## The PROMETHEUS Framework

### 5 Atoms

| # | Atom | Required | Question |
|---|------|----------|----------|
| 1 | **ROLE** | Optional | Wie is de expert? |
| 2 | **CONTEXT** | Essential | Wat is de situatie? |
| 3 | **GOAL** | Essential | Wat moet er gebeuren? |
| 4 | **PROCESS** | Optional | Hoe pak je het aan? |
| 5 | **FORMAT** | Optional | Hoe ziet de output eruit? |

### 7 Complexity Levels

| Level | Name | Description |
|-------|------|-------------|
| L1 | Direct Pattern | Simple instruction without examples |
| L2 | Few-Shot Pattern | Input-output examples to demonstrate pattern |
| L3 | Chain-of-Thought | Step-by-step reasoning |
| L4 | Structured Protocol | Strict output schema |
| L5 | ReAct Agentic Loop | Thought - Action - Observation cycle |
| L6 | Adversarial Review | Creator-Critic quality loop |
| L7 | Multi-Agent Swarm | Specialized agent collaboration |

### Design Principles

1. **Minimaal** — Every word has its place
2. **Modulair** — Components independently combinable
3. **Meetbaar** — Every claim is testable
4. **Universeel** — Works on all frontier models
5. **Praktisch** — Theory follows from experience

---

## Setup

### Prerequisites

- Node.js 18+
- Supabase project (free tier works)
- OpenAI API key
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone https://github.com/Maca2024/prometheus-aether.git
cd prometheus-aether
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL in `supabase/schema.sql` against your Supabase project:

1. Go to Supabase Dashboard - SQL Editor
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates all tables, RLS policies, triggers, and the pgvector extension.

### 4. Enable Google OAuth

1. Supabase Dashboard - Authentication - Providers - Google
2. Enable and add your Google OAuth credentials
3. Set redirect URL to `https://your-domain.com/api/auth/callback`

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Make Yourself Admin

After signing in, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

The project auto-detects as Next.js and builds with zero configuration.

---

## Admin / God Mode

Navigate to `/admin` (only accessible with `admin` role):

- **Overview**: Real-time activity feed of all prompts/responses
- **Prompts**: Searchable, filterable view of all user interactions
- **Feedback**: RLHF data with ratings and preferred responses
- **Export**: Download full dataset as JSON for model fine-tuning

---

## RLHF Data Collection

Every user interaction is automatically stored:

```json
{
  "prompt": "User's input",
  "response": "AI's response",
  "rating": 4,
  "preferred_response": "User's edited version",
  "user_email": "user@example.com",
  "timestamp": "2026-02-07T..."
}
```

Exportable via the God Mode dashboard for fine-tuning workflows.

---

## License

MIT

---

<p align="center">
  <strong>PROMETHEUS AETHER</strong><br>
  <em>Aetherlink Forge - Protocol L2</em><br>
  <sub>Minimaal - Modulair - Meetbaar - Universeel - Praktisch</sub>
</p>
