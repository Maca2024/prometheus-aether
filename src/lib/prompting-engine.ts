// ============================================================
// PROMETHEUS AETHER — Prompting Engine
// Dynamic context injection + PROMETHEUS framework system prompt
// ============================================================

export const PROMETHEUS_SYSTEM_PROMPT = `You are PROMETHEUS AETHER, an advanced AI assistant powered by the PROMETHEUS prompting framework. You excel at understanding structured prompts and delivering precise, high-quality responses.

## YOUR CAPABILITIES:
- Deep understanding of the 5-atom PROMETHEUS framework (Role, Context, Goal, Process, Format)
- Ability to adapt your communication style based on the user's needs
- Expertise in prompt engineering and structured thinking
- Multi-language support (Dutch and English primarily)

## YOUR PERSONALITY:
- Professional yet approachable
- Concise and precise — every word has purpose
- You think step-by-step when faced with complex problems
- You proactively suggest improvements to unclear requests

## RESPONSE GUIDELINES:
1. Always acknowledge the user's intent before responding
2. Structure your responses clearly using markdown when appropriate
3. For complex tasks, break down your approach into steps
4. If a request is ambiguous, ask clarifying questions
5. Cite your reasoning when making recommendations`

export interface PromptContext {
  userMessage: string
  sessionHistory?: Array<{ role: string; content: string }>
  userMemories?: string[]
  prometheusAtoms?: {
    role?: string
    context?: string
    goal?: string
    process?: string
    format?: string
  }
}

export function buildSystemPrompt(ctx: PromptContext): string {
  const parts = [PROMETHEUS_SYSTEM_PROMPT]

  if (ctx.userMemories && ctx.userMemories.length > 0) {
    parts.push(`\n## USER CONTEXT (from memory):\n${ctx.userMemories.join('\n')}`)
  }

  if (ctx.prometheusAtoms) {
    const atoms = ctx.prometheusAtoms
    const atomParts: string[] = []
    if (atoms.role) atomParts.push(`ROLE: ${atoms.role}`)
    if (atoms.context) atomParts.push(`CONTEXT: ${atoms.context}`)
    if (atoms.goal) atomParts.push(`GOAL: ${atoms.goal}`)
    if (atoms.process) atomParts.push(`PROCESS: ${atoms.process}`)
    if (atoms.format) atomParts.push(`FORMAT: ${atoms.format}`)

    if (atomParts.length > 0) {
      parts.push(`\n## ACTIVE PROMETHEUS FRAMEWORK:\n${atomParts.join('\n')}`)
    }
  }

  return parts.join('\n')
}

export function buildMessages(ctx: PromptContext) {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: buildSystemPrompt(ctx) },
  ]

  if (ctx.sessionHistory) {
    for (const msg of ctx.sessionHistory.slice(-20)) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    }
  }

  messages.push({ role: 'user', content: ctx.userMessage })

  return messages
}

// ============================================================
// Complexity Level Descriptions (from original Prometheus)
// ============================================================

export const COMPLEXITY_LEVELS = [
  {
    level: 1,
    name: 'DIRECT PATTERN',
    description: 'Simplest form: direct instruction without examples.',
    use: 'Simple tasks, clear questions, standard transformations.',
    example: '"Translate this text to Dutch."',
    color: '#00f0ff',
  },
  {
    level: 2,
    name: 'FEW-SHOT PATTERN',
    description: 'Provide input-output examples to demonstrate the desired pattern.',
    use: 'When a specific format or style is needed.',
    example: 'Input: "Hello" → Output: "Hallo"\nInput: "Goodbye" → Output: "Tot ziens"',
    color: '#00d4ff',
  },
  {
    level: 3,
    name: 'CHAIN-OF-THOUGHT',
    description: 'Ask the model to think step-by-step before answering.',
    use: 'Complex problems, math, logical reasoning.',
    example: '"Think step by step: If a train travels 120km in 2 hours..."',
    color: '#7000ff',
  },
  {
    level: 4,
    name: 'STRUCTURED PROTOCOL',
    description: 'Define a strict schema the model must follow.',
    use: 'Consistent output structure required.',
    example: 'Output as JSON: { "severity": 1-10, "location": "file:line", "fix": "..." }',
    color: '#ff00ff',
  },
  {
    level: 5,
    name: 'ReAct AGENTIC LOOP',
    description: 'Reasoning + Acting cycle: Thought → Action → Observation → repeat.',
    use: 'Multi-step tasks with intermediate actions.',
    example: 'Thought: I need to search for...\nAction: search("query")\nObservation: ...',
    color: '#ffd700',
  },
  {
    level: 6,
    name: 'ADVERSARIAL REVIEW',
    description: 'Two opposing agents: one creates, one critiques — iterate until quality threshold.',
    use: 'Quality assurance critical.',
    example: 'Creator: [solution] → Critic: [issues found] → Creator: [improved solution]',
    color: '#ff6600',
  },
  {
    level: 7,
    name: 'MULTI-AGENT SWARM',
    description: 'Team of specialized agents solving a complex problem collaboratively.',
    use: 'Very complex tasks across multiple domains.',
    example: 'Orchestrator → [Analyst, Developer, Reviewer] → Synthesized output',
    color: '#ff0044',
  },
]

// ============================================================
// Atom Metadata
// ============================================================

export const ATOM_META: Record<
  string,
  { icon: string; label: string; color: string; question: string; description: string }
> = {
  role: {
    icon: '👤',
    label: 'ROLE',
    color: '#00f0ff',
    question: 'Wie is de expert?',
    description: 'Define the persona or expertise that executes the task.',
  },
  context: {
    icon: '🌐',
    label: 'CONTEXT',
    color: '#ff00ff',
    question: 'Wat is de situatie?',
    description: 'Background information to help understand the task.',
  },
  goal: {
    icon: '🎯',
    label: 'GOAL',
    color: '#ffd700',
    question: 'Wat moet er gebeuren?',
    description: 'The core of the request — what you want to achieve.',
  },
  process: {
    icon: '⚙️',
    label: 'PROCESS',
    color: '#7000ff',
    question: 'Hoe pak je het aan?',
    description: 'Step-by-step approach description.',
  },
  format: {
    icon: '📋',
    label: 'FORMAT',
    color: '#00ff88',
    question: 'Hoe ziet de output eruit?',
    description: 'Specify the desired output format.',
  },
}
