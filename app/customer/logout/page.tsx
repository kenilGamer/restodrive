"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function CustomerLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirect: false, callbackUrl: "/customer/login" }).then(() => {
      router.push("/customer/login")
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing out...</p>
    </div>
  )
}

