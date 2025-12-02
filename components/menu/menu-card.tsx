"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

interface MenuCardProps {
  menu: {
    id: string
    name: string
    version: number
    isActive: boolean
    _count: {
      categories: number
    }
  }
  index: number
  restaurantSlug: string
}

export function MenuCard({ menu, index, restaurantSlug }: MenuCardProps) {
  // Debug: Log the slug
  if (!restaurantSlug) {
    console.error("MenuCard: restaurantSlug is missing!", { menu, restaurantSlug })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow hover:shadow-glow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{menu.name}</CardTitle>
            {menu.isActive ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#11C97A]/20 border border-[#11C97A]/30">
                <CheckCircle2 className="h-3 w-3 text-[#11C97A]" />
                <span className="text-xs font-medium text-[#11C97A]">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#2A2A2A] border border-[#2A2A2A]">
                <XCircle className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">Inactive</span>
              </div>
            )}
          </div>
          <CardDescription className="text-gray-400">
            Version {menu.version} • {menu._count.categories} categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
            >
              <Link href={`/dashboard/menu/${menu.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            {menu.isActive ? (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex-1 text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              >
                <Link 
                  href={restaurantSlug ? `/qr/${restaurantSlug}` : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!restaurantSlug || restaurantSlug.trim() === '') {
                      e.preventDefault()
                      alert(`Restaurant slug is missing or empty. Current value: "${restaurantSlug}". Please check your settings.`)
                      console.error("Preview button clicked but restaurantSlug is invalid:", restaurantSlug)
                      return
                    }
                    console.log("Preview clicked, navigating to:", `/qr/${restaurantSlug}`)
                    // Allow navigation to proceed
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="flex-1 text-gray-600 cursor-not-allowed opacity-50"
                title="Activate menu to preview"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

