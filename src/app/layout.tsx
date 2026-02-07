import type { Metadata } from 'next'
import './globals.css'
import SupabaseProvider from '@/providers/SupabaseProvider'

export const metadata: Metadata = {
  title: 'PROMETHEUS AETHER | Quantum Prompt Intelligence',
  description:
    'Next-generation prompt engineering platform powered by the PROMETHEUS framework. Cyber-industrial luxury meets AI intelligence.',
  keywords: ['prometheus', 'prompt engineering', 'AI', 'aetherlink', 'LLM'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground font-body antialiased scan-line">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  )
}
