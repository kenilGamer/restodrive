"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Address {
  id: string
  type: string
  label: string | null
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string | null
  zipCode: string | null
  country: string
  isDefault: boolean
}

interface AddressFormProps {
  address?: Address
  onSuccess: () => void
  onCancel: () => void
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const [type, setType] = useState(address?.type || "HOME")
  const [label, setLabel] = useState(address?.label || "")
  const [fullName, setFullName] = useState(address?.fullName || "")
  const [phone, setPhone] = useState(address?.phone || "")
  const [addressLine1, setAddressLine1] = useState(address?.addressLine1 || "")
  const [addressLine2, setAddressLine2] = useState(address?.addressLine2 || "")
  const [city, setCity] = useState(address?.city || "")
  const [state, setState] = useState(address?.state || "")
  const [zipCode, setZipCode] = useState(address?.zipCode || "")
  const [country, setCountry] = useState(address?.country || "India")
  const [isDefault, setIsDefault] = useState(address?.isDefault || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!fullName || !phone || !addressLine1 || !city) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const url = address
        ? `/api/customers/addresses/${address.id}`
        : "/api/customers/addresses"
      const method = address ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          label: label || null,
          fullName,
          phone,
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state: state || null,
          zipCode: zipCode || null,
          country,
          isDefault,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to save address")
        return
      }

      onSuccess()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Address Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOME">Home</SelectItem>
              <SelectItem value="WORK">Work</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="label">Label (Optional)</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., My Home"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Input
          id="addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input
          id="addressLine2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          Set as default address
        </Label>
      </div>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            address ? "Update Address" : "Save Address"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

