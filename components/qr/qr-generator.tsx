"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

interface QRGeneratorProps {
  restaurantId: string
  onGenerated?: (qrCode: any) => void
}

export function QRGenerator({ restaurantId, onGenerated }: QRGeneratorProps) {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          type: "MENU",
        }),
      })

      const data = await response.json()
      if (data.qrCode && onGenerated) {
        onGenerated(data.qrCode)
      }
      // Reload page to show new QR code
      window.location.reload()
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGenerate} disabled={loading}>
      <QrCode className="mr-2 h-4 w-4" />
      {loading ? "Generating..." : "Generate QR Code"}
    </Button>
  )
}

