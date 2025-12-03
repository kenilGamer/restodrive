"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Edit, Trash2, Plus } from "lucide-react"
import { AddressForm } from "./address-form"

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

interface AddressListProps {
  addresses: Address[]
}

export function AddressList({ addresses: initialAddresses }: AddressListProps) {
  const router = useRouter()
  const [addresses, setAddresses] = useState(initialAddresses)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

    try {
      const response = await fetch(`/api/customers/addresses/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAddresses(addresses.filter((a) => a.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error("Delete address error:", error)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/addresses/${id}/default`, {
        method: "PUT",
      })

      if (response.ok) {
        setAddresses(
          addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          }))
        )
        router.refresh()
      }
    } catch (error) {
      console.error("Set default address error:", error)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowAddForm(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Address
      </Button>

      {showAddForm && (
        <Card>
          <CardContent className="p-6">
            <AddressForm
              onSuccess={() => {
                setShowAddForm(false)
                router.refresh()
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No addresses saved</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                {editingId === address.id ? (
                  <AddressForm
                    address={address}
                    onSuccess={() => {
                      setEditingId(null)
                      router.refresh()
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{address.label || address.type}</h3>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{address.fullName}</p>
                        <p className="text-sm text-gray-500">{address.phone}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}
                        {address.state && `, ${address.state}`}
                        {address.zipCode && ` ${address.zipCode}`}
                      </p>
                      <p>{address.country}</p>
                    </div>

                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(address.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

