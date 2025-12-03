"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, Globe, ExternalLink, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WebsiteSettingsFormProps {
  restaurant: {
    id: string
    slug: string
    description?: string | null
    coverImage?: string | null
    isPublished: boolean
    primaryColor?: string | null
    secondaryColor?: string | null
    fontFamily?: string | null
    website?: string | null
  }
}

export function WebsiteSettingsForm({ restaurant }: WebsiteSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [savedState, setSavedState] = useState({
    isPublished: restaurant.isPublished,
  })
  const [formData, setFormData] = useState({
    description: restaurant.description || "",
    coverImage: restaurant.coverImage || "",
    isPublished: restaurant.isPublished,
    primaryColor: restaurant.primaryColor || "#DC2626",
    secondaryColor: restaurant.secondaryColor || "#F97316",
    fontFamily: restaurant.fontFamily || "Inter",
    website: restaurant.website || "",
  })

  const websiteUrl = typeof window !== 'undefined' ? `${window.location.origin}/r/${restaurant.slug}` : ''
  const hasUnsavedChanges = formData.isPublished !== savedState.isPublished

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/restaurants/${restaurant.id}/website`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description || null,
          coverImage: formData.coverImage || null,
          isPublished: formData.isPublished,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          fontFamily: formData.fontFamily,
          website: formData.website || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSavedState({ isPublished: formData.isPublished })
        router.refresh()
        
        // If website was just published, show success message with link
        if (formData.isPublished && !savedState.isPublished) {
          alert(`Website published successfully! Your website is now live at:\n\n${websiteUrl}\n\nClick OK to view it.`)
          // Optionally open the website in a new tab
          setTimeout(() => {
            window.open(websiteUrl, '_blank')
          }, 500)
        } else {
          alert("Website settings updated successfully!")
        }
      } else {
        alert(data.error || "Failed to update website settings")
      }
    } catch (error) {
      console.error("Error updating website:", error)
      alert("Failed to update website settings")
    } finally {
      setLoading(false)
    }
  }

  const copyWebsiteUrl = () => {
    navigator.clipboard.writeText(websiteUrl)
    alert("Website URL copied to clipboard!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Website Status */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">Website Status</CardTitle>
          <CardDescription className="text-gray-400">
            Control your restaurant website visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isPublished" className="text-white">
                Publish Website
              </Label>
              <p className="text-sm text-gray-400 mt-1">
                Make your restaurant website publicly accessible
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublished: checked })
              }
            />
          </div>

          {/* Status Display - Only show saved state */}
          {savedState.isPublished ? (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-white font-medium">Website is Live</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                    Published
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Input
                  value={websiteUrl}
                  readOnly
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyWebsiteUrl}
                  className="border-[#2A2A2A]"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(websiteUrl, "_blank")}
                  className="border-[#2A2A2A]"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-500 text-sm">
                  Website is not published. Enable publishing and save to make it live.
                </span>
              </div>
            </div>
          )}

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                You have unsaved changes. Click "Save Website Settings" to apply them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Content */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">Website Content</CardTitle>
          <CardDescription className="text-gray-400">
            Customize your website appearance and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-400">
              Description
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[100px] px-3 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
              placeholder="Tell customers about your restaurant..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-gray-400">
              Cover Image URL
            </Label>
            <Input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
              placeholder="https://example.com/cover-image.jpg"
            />
            <p className="text-xs text-gray-500">
              Recommended: 1920x1080px. This image appears at the top of your website.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-400">
              External Website URL (Optional)
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
              placeholder="https://your-restaurant.com"
            />
            <p className="text-xs text-gray-500">
              Link to your main website if you have one.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">Branding</CardTitle>
          <CardDescription className="text-gray-400">
            Customize colors and fonts for your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-gray-400">
                Primary Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-10 w-20 p-1 bg-[#0D0D0D] border-[#2A2A2A] cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                  placeholder="#DC2626"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor" className="text-gray-400">
                Secondary Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-10 w-20 p-1 bg-[#0D0D0D] border-[#2A2A2A] cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 bg-[#0D0D0D] border-[#2A2A2A] text-white"
                  placeholder="#F97316"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontFamily" className="text-gray-400">
              Font Family
            </Label>
            <select
              id="fontFamily"
              value={formData.fontFamily}
              onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
              className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0"
      >
        <Save className="h-4 w-4 mr-2" />
        {loading ? "Saving..." : "Save Website Settings"}
      </Button>
    </form>
  )
}

