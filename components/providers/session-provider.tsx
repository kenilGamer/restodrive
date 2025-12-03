"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { Session } from "next-auth"

interface SessionProviderProps {
  children: React.ReactNode
  session: Session | null
  basePath?: string
}

export function SessionProvider({ children, session, basePath }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session} basePath={basePath}>
      {children}
    </NextAuthSessionProvider>
  )
}
