"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function CustomerLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [usePhone, setUsePhone] = useState(false)

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setError("")
      // Show success message instead of error
      const successMsg = document.createElement("div")
      successMsg.className = "text-sm text-green-500 mb-4"
      successMsg.textContent = "Registration successful! Please login."
      // This will be handled by the form UI
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Get CSRF token first
      const csrfResponse = await fetch("/api/auth/customer/csrf")
      const csrfData = await csrfResponse.json()
      const csrfToken = csrfData.csrfToken

      // Call customer login API to validate credentials
      const loginResponse = await fetch("/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [usePhone ? "phone" : "email"]: usePhone ? phone : email,
          password,
        }),
      })

      if (!loginResponse.ok) {
        const loginData = await loginResponse.json()
        setError(loginData.error || "Invalid email/phone or password")
        return
      }

      // If login API succeeds, create NextAuth session
      const signInResponse = await fetch("/api/auth/customer/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          csrfToken: csrfToken,
          [usePhone ? "phone" : "email"]: usePhone ? phone : email,
          password: password,
          redirect: "false",
          callbackUrl: "/customer/dashboard",
        }),
        credentials: "include",
        redirect: "manual", // Don't follow redirects automatically
      })

      // Check response status
      if (signInResponse.status === 200 || signInResponse.status === 302) {
        // Success - redirect to dashboard
        router.push("/customer/dashboard")
        router.refresh()
      } else {
        // Check if redirected to signin page (auth failed)
        const location = signInResponse.headers.get("location")
        if (location && (location.includes("/auth/login") || location.includes("/api/auth/signin"))) {
          setError("Invalid email/phone or password")
        } else {
          // Try to parse error from response
          const errorData = await signInResponse.json().catch(() => ({}))
          setError(errorData.error || "Login failed. Please try again.")
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Sign in to your account to track orders and earn loyalty points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={!usePhone ? "default" : "outline"}
                onClick={() => setUsePhone(false)}
                className="flex-1"
              >
                Email
              </Button>
              <Button
                type="button"
                variant={usePhone ? "default" : "outline"}
                onClick={() => setUsePhone(true)}
                className="flex-1"
              >
                Phone
              </Button>
            </div>

            {!usePhone ? (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 1234567890"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm">
              <Link href="/customer/register" className="text-primary hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

