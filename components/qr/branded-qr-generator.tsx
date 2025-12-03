"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Download, Palette, Image as ImageIcon, Settings } from "lucide-react"
import { downloadQRCode } from "@/lib/utils/download"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BrandedQRGeneratorProps {
  restaurantId: string
  restaurantLogo?: string | null
  restaurantPrimaryColor?: string | null
  onGenerated?: (qrCode: any) => void
}

export function BrandedQRGenerator({
  restaurantId,
  restaurantLogo,
  restaurantPrimaryColor,
  onGenerated,
}: BrandedQRGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [customization, setCustomization] = useState({
    includeLogo: true,
    logoSize: 60,
    foregroundColor: restaurantPrimaryColor || "#000000",
    backgroundColor: "#FFFFFF",
    frameStyle: "square" as "square" | "rounded" | "circle",
    errorCorrectionLevel: "M" as "L" | "M" | "Q" | "H",
  })

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/qr/generate-branded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          type: "MENU",
          customization,
        }),
      })

      const data = await response.json()
      if (data.qrCode && onGenerated) {
        onGenerated(data.qrCode)
      }
      // Reload page to show new QR code
      window.location.reload()
    } catch (error) {
      console.error("Error generating branded QR code:", error)
      alert("Failed to generate QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (imageUrl: string) => {
    try {
      await downloadQRCode(imageUrl, restaurantId)
    } catch (error: any) {
      console.error("Error downloading QR code:", error)
      alert(error.message || "Failed to download QR code. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#C97AFF]" />
                Generate Branded QR Code
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create a custom QR code with your branding
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCustomization(!showCustomization)}
              className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCustomization && (
            <div className="space-y-4 p-4 bg-[#0D0D0D] rounded-[12px] border border-[#2A2A2A]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Foreground Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customization.foregroundColor}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          foregroundColor: e.target.value,
                        })
                      }
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customization.foregroundColor}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          foregroundColor: e.target.value,
                        })
                      }
                      className="flex-1 bg-[#1A1A1A] border-[#2A2A2A] text-white"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customization.backgroundColor}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customization.backgroundColor}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="flex-1 bg-[#1A1A1A] border-[#2A2A2A] text-white"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              {restaurantLogo && (
                <div className="space-y-2">
                  <Label className="text-gray-400 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Logo Settings
                  </Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={customization.includeLogo}
                        onChange={(e) =>
                          setCustomization({
                            ...customization,
                            includeLogo: e.target.checked,
                          })
                        }
                        className="rounded border-[#2A2A2A]"
                      />
                      Include Logo
                    </label>
                    {customization.includeLogo && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-400">Size:</Label>
                        <Input
                          type="number"
                          min="30"
                          max="100"
                          value={customization.logoSize}
                          onChange={(e) =>
                            setCustomization({
                              ...customization,
                              logoSize: parseInt(e.target.value) || 60,
                            })
                          }
                          className="w-20 bg-[#1A1A1A] border-[#2A2A2A] text-white"
                        />
                        <span className="text-sm text-gray-500">px</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Frame Style</Label>
                  <Select
                    value={customization.frameStyle}
                    onValueChange={(value: "square" | "rounded" | "circle") =>
                      setCustomization({
                        ...customization,
                        frameStyle: value,
                      })
                    }
                  >
                    <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                      <SelectItem value="square" className="text-white">
                        Square
                      </SelectItem>
                      <SelectItem value="rounded" className="text-white">
                        Rounded
                      </SelectItem>
                      <SelectItem value="circle" className="text-white">
                        Circle
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Error Correction</Label>
                  <Select
                    value={customization.errorCorrectionLevel}
                    onValueChange={(value: "L" | "M" | "Q" | "H") =>
                      setCustomization({
                        ...customization,
                        errorCorrectionLevel: value,
                      })
                    }
                  >
                    <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                      <SelectItem value="L" className="text-white">
                        Low (7%)
                      </SelectItem>
                      <SelectItem value="M" className="text-white">
                        Medium (15%)
                      </SelectItem>
                      <SelectItem value="Q" className="text-white">
                        Quartile (25%)
                      </SelectItem>
                      <SelectItem value="H" className="text-white">
                        High (30%)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 shadow-glow"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {loading ? "Generating..." : "Generate Branded QR Code"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

