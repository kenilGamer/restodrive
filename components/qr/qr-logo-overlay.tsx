"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface QRLogoOverlayProps {
  qrImageUrl: string
  logoUrl?: string | null
  logoSize?: number
  backgroundColor?: string
}

export function QRLogoOverlay({
  qrImageUrl,
  logoUrl,
  logoSize = 60,
  backgroundColor = "#FFFFFF",
}: QRLogoOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !logoUrl) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Draw QR code
      ctx.drawImage(img, 0, 0, 300, 300)

      // Draw logo background
      const logoX = (300 - logoSize) / 2
      const logoY = (300 - logoSize) / 2
      ctx.fillStyle = backgroundColor
      ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)

      // Draw logo
      const logoImg = new window.Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.onload = () => {
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
      }
      logoImg.src = logoUrl
    }
    img.src = qrImageUrl
  }, [qrImageUrl, logoUrl, logoSize, backgroundColor])

  if (!logoUrl) {
    return <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
  }

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="w-full h-full object-contain"
    />
  )
}

