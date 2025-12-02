"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface SlugDisplayProps {
  slug: string
}

export function SlugDisplay({ slug }: SlugDisplayProps) {
  const [copied, setCopied] = useState(false)
  const menuUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/qr/${slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="restaurantSlug" className="text-gray-400">Menu URL Slug</Label>
      <div className="flex items-center gap-2">
        <Input
          id="restaurantSlug"
          value={slug}
          readOnly
          className="bg-[#0D0D0D] border-[#2A2A2A] text-white font-mono text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-[#2A2A2A] text-gray-400 hover:text-white hover:border-cyan-500/50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Your menu URL:{" "}
        <span className="text-cyan-400 font-mono break-all">{menuUrl}</span>
      </p>
    </div>
  )
}

