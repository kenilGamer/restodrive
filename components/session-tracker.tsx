"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { trackSession } from "@/lib/session-tracker"

export function SessionTracker() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      // Track session on mount and periodically update lastActive
      trackSession()
      
      // Update session activity every 5 minutes
      const interval = setInterval(() => {
        trackSession()
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearInterval(interval)
    }
  }, [session])

  return null // This component doesn't render anything
}

