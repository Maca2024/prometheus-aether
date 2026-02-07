import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { buildMessages } from '@/lib/prompting-engine'
import type { PromptContext } from '@/lib/prompting-engine'

export const maxDuration = 30

export async function POST(req: Request) {
  const body = await req.json()
  const { message, history, memories, atoms } = body as {
    message: string
    history?: Array<{ role: string; content: string }>
    memories?: string[]
    atoms?: PromptContext['prometheusAtoms']
  }

  const ctx: PromptContext = {
    userMessage: message,
    sessionHistory: history,
    userMemories: memories,
    prometheusAtoms: atoms,
  }

  const messages = buildMessages(ctx)

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })

  return result.toTextStreamResponse()
}
