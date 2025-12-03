"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  avatar: string | null
  dateOfBirth: Date | null
  dietaryPreferences: string[]
  allergies: string[]
  favoriteCuisines: string[]
}

interface ProfileFormProps {
  customer: Customer
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email || "")
  const [phone, setPhone] = useState(customer.phone || "")
  const [dateOfBirth, setDateOfBirth] = useState(
    customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split("T")[0] : ""
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/customers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Update failed")
        return
      }

      setSuccess("Profile updated successfully")
      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {success && (
        <div className="text-sm text-green-500">{success}</div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Profile"
        )}
      </Button>
    </form>
  )
}

