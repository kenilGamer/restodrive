"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download, Scan } from "lucide-react"
import Link from "next/link"

interface QRCodeCardProps {
  qrCode: {
    id: string
    code: string
    imageUrl: string | null
    url: string
    _count: {
      scans: number
    }
  }
  index: number
}

export function QRCodeCard({ qrCode, index }: QRCodeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow hover:shadow-glow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">QR Code</CardTitle>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#11C97A]/20 border border-[#11C97A]/30">
              <Scan className="h-3 w-3 text-[#11C97A]" />
              <span className="text-xs font-medium text-[#11C97A]">
                {qrCode._count.scans} scans
              </span>
            </div>
          </div>
          <CardDescription className="text-gray-400">
            Code: {qrCode.code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qrCode.imageUrl && (
            <div className="w-full aspect-square bg-[#0D0D0D] rounded-[12px] border border-[#2A2A2A] p-4 flex items-center justify-center">
              <img
                src={qrCode.imageUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              asChild
            >
              <Link href={qrCode.url} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-400 hover:text-[#C97AFF] hover:bg-[#2A2A2A]"
            asChild
          >
            <Link href={`/dashboard/qr/${qrCode.code}/analytics`}>
              View Analytics →
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

