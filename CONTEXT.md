# CONTEXT — Prometheus Aether

## Project Genesis

This project is a **complete architectural transformation** of [prometheus-5.0](https://github.com/Maca2024/prometheus-5.0), a single-file HTML/JavaScript prompt engineering tool, into a production-grade full-stack AI platform.

### Source to Target Transformation

| Aspect | prometheus-5.0 (Source) | Prometheus Aether (Target) |
|--------|------------------------|---------------------------|
| **Architecture** | Single HTML file (1,379 lines) | Next.js 16 App Router (28 source files) |
| **Language** | Vanilla JavaScript | TypeScript (strict mode) |
| **Styling** | Inline CSS + CSS animations | Tailwind CSS v4 + Framer Motion |
| **3D Graphics** | Three.js (vanilla) | React Three Fiber + Drei |
| **Backend** | None (client-only) | Supabase (PostgreSQL, Auth, RLS) |
| **AI Integration** | None | Vercel AI SDK + OpenAI GPT-4o streaming |
| **Authentication** | None | Google OAuth via Supabase |
| **State Management** | DOM manipulation | Zustand (4 stores) |
| **Data Persistence** | None (ephemeral) | PostgreSQL with Row Level Security |
| **Memory** | None | pgvector semantic embeddings |
| **Admin** | None | God Mode dashboard with RLHF export |
| **Deployment** | Static HTML on Vercel | Next.js on Vercel (SSR + API routes) |

---

## What Was Preserved

Every piece of logic from the original was faithfully translated:

### 1. The Pentagon (5 Atoms)
- Original: Three.js wireframe pentagon with clickable vertices
- Aether: React Three Fiber `PentagonScene` with OrbitControls, orbiting particles, auto-rotation, and click-to-explore atom cards

### 2. Complexity Spectrum (7 Levels)
- Original: 7 circular nodes with gradient line, click to view details
- Aether: Framer Motion animated nodes, `AnimatePresence` card transitions, same 7-level data (L1 Direct to L7 Multi-Agent Swarm)

### 3. Prompt Builder (Quantum Forge)
- Original: 5 input cards, generate button, copy-to-clipboard
- Aether: `usePromptStore` Zustand store, same validation (Context + Goal required), same generation template, same copy/clear actions

### 4. Pre-Flight Validator
- Original: Keyword matching against 5 atom categories, color-coded grid
- Aether: Same keyword dictionaries (Dutch + English), same scoring logic, enhanced compliance percentage, same tip generation

### 5. Visual DNA
- Original colors: `#00f5ff` (cyan), `#ff00ff` (pink), `#ffd700` (gold), `#9d00ff` (purple), `#00ff88` (green)
- Aether colors: `#00f0ff`, `#ff00ff`, `#ffd700`, `#7000ff`, `#00ff88` — virtually identical
- Original fonts: Orbitron, Rajdhani — Aether: Same
- Particle system: Recreated with same mouse attraction behavior
- Grid background: Same subtle cyan overlay pattern

---

## What Was Added

### Backend Layer
- **Supabase PostgreSQL** with 5 tables: `profiles`, `sessions`, `prompts`, `feedback`, `memories`
- **Row Level Security**: Users see only their own data, admins see everything
- **Auto-profile creation**: Database trigger on `auth.users` insert
- **pgvector**: 1536-dimension embedding storage with IVFFlat index for semantic search

### Authentication
- **Google OAuth** via Supabase Auth
- **Session management** via `@supabase/ssr` cookie middleware
- **Protected routes**: Admin dashboard locked to `role = 'admin'`

### AI Engine
- **Vercel AI SDK** streaming endpoint at `/api/chat`
- **PROMETHEUS System Prompt**: Context-aware system instructions that incorporate:
  - The user's filled-in atoms from the Prompt Forge
  - Session history (last 20 messages)
  - User memory embeddings (when available)
- **Streaming responses**: Real-time text streaming with chunked parsing

### Chat Interface (Neural Link)
- **HUD-style bubbles**: Glassmorphism chat bubbles with neon accent lines
- **Role indicators**: `OPERATOR` (user) and `PROMETHEUS` (assistant)
- **Streaming animation**: Word-by-word reveal with Framer Motion
- **Context injection**: Atoms from the Forge automatically enhance AI context

### Admin Dashboard (God Mode)
- **Stats**: Total users, prompts, sessions, feedback counts
- **Activity feed**: Chronological view of all interactions
- **Search**: Full-text search across prompts and user emails
- **RLHF Export**: One-click JSON download of prompt-response pairs with ratings
- **Tabbed views**: Overview, Prompts, Feedback

---

## Design Decisions

### Why Next.js 16 (not 14)?
The project was scaffolded with `create-next-app@latest` which installed Next.js 16. This is the current latest version with Turbopack, improved App Router, and the new `proxy` middleware convention.

### Why Zustand (not Redux)?
- Minimal boilerplate
- No provider wrapping needed for most stores
- Perfect for the 4 isolated state domains (UI, Prompt, Chat, Auth)
- Excellent TypeScript inference

### Why Tailwind v4?
- New `@theme inline` syntax for design tokens
- CSS-first configuration (no `tailwind.config.ts`)
- Better performance and smaller bundle
- Native CSS custom property integration

### Why Supabase?
- Built-in Google OAuth with zero extra infrastructure
- PostgreSQL with Row Level Security for multi-tenant data isolation
- pgvector extension for semantic memory
- Real-time subscriptions (future enhancement)
- Free tier sufficient for MVP

### Why Vercel AI SDK?
- First-class Next.js integration
- Built-in streaming with proper backpressure
- Model-agnostic (swap OpenAI for Anthropic in one line)
- Edge-compatible

---

## The PROMETHEUS Framework — Deep Dive

### Philosophy

PROMETHEUS is a **structured prompt engineering framework** built on the principle that effective AI communication requires explicit structure. Unlike freestyle prompting, it decomposes every request into 5 atomic components that each serve a distinct cognitive function.

### The 5 Atoms Explained

**ROLE (Optional, Enhances Quality)**
Defines the persona or expertise lens through which the AI should process the request. Setting a role activates domain-specific knowledge patterns and adjusts communication style.

**CONTEXT (Essential)**
Provides the situational background — the "why" behind the request. Without context, the AI operates on assumptions. With context, it can calibrate scope, tone, and relevance.

**GOAL (Essential)**
The explicit objective. What must the AI produce? This is the atomic core of every prompt. Ambiguous goals produce ambiguous outputs.

**PROCESS (Optional, Recommended for Complex Tasks)**
Step-by-step methodology. When specified, the AI follows a defined workflow rather than choosing its own approach, reducing variance and improving consistency.

**FORMAT (Optional, Recommended for Structured Output)**
Output specification — JSON, markdown, table, code block, etc. Eliminates post-processing by defining structure upfront.

### Validation Logic

The validator uses **keyword-based heuristic analysis** to detect the presence of each atom in any given prompt text. Keywords are bilingual (Dutch + English) to support the framework's Dutch origins:

```
ROLE:    ['role', 'als een', 'jij bent', 'you are', 'act as', 'expert', 'specialist']
CONTEXT: ['context', 'situatie', 'achtergrond', 'we zijn', 'project', 'scenario']
GOAL:    ['goal', 'doel', 'taak', 'task', 'missie', 'objective', 'create', 'build']
PROCESS: ['process', 'stap', 'step', 'aanpak', 'procedure', 'workflow']
FORMAT:  ['format', 'output', 'structuur', 'json', 'xml', 'markdown', 'table']
```

Scoring: `(essential_count * 2 + optional_count) / 7 * 100`

---

## Future Roadmap

- [ ] pgvector memory retrieval in chat flow
- [ ] Real-time collaboration (Supabase Realtime)
- [ ] Prompt template library
- [ ] Multi-model support (Claude, Gemini, Llama)
- [ ] Voice input / Text-to-Speech
- [ ] Mobile PWA with offline prompt building
- [ ] A/B testing framework for prompt variants
- [ ] Webhook integrations (Slack, Discord)

---

## Credits

- **Original Framework**: PROMETHEUS Nexus v4.0 by Aetherlink
- **Visual Target**: Aetherlink Presentation
- **Architecture**: Rebuilt by ATLAS | Aetherlink Forge | Protocol L2
