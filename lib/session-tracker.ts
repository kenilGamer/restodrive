// Client-side session tracking utility
// Call this on app load to track/update current session

export async function trackSession() {
  try {
    const response = await fetch("/api/auth/sessions/track", {
      method: "POST",
    })
    
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    // Silently fail - session tracking is not critical
    console.error("Failed to track session:", error)
  }
  
  return null
}

