"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar, Clock, Users, MapPin, Phone } from "lucide-react"

interface Reservation {
  id: string
  reservationNumber: string
  date: string
  time: string
  guestCount: number
  status: string
  customerName: string
  customerPhone: string
  table: {
    number: string
    capacity: number
  } | null
}

interface UpcomingReservationsProps {
  restaurantId: string
  limit?: number
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SEATED: "bg-green-500/20 text-green-400 border-green-500/30",
  COMPLETED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function UpcomingReservations({ restaurantId, limit = 5 }: UpcomingReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]
        const res = await fetch(
          `/api/bookings?restaurantId=${restaurantId}&date=${today}&status=CONFIRMED&limit=${limit}`
        )
        if (res.ok) {
          const data = await res.json()
          // Filter to only show future reservations
          const now = new Date()
          const upcoming = (data.reservations || []).filter((res: Reservation) => {
            const resDate = new Date(res.date)
            const [hours, minutes] = res.time.split(":").map(Number)
            resDate.setHours(hours, minutes || 0, 0, 0)
            return resDate >= now
          })
          setReservations(upcoming.slice(0, limit))
        }
      } catch (error) {
        console.error("Error fetching reservations:", error)
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId) {
      fetchReservations()
    }
  }, [restaurantId, limit])

  if (loading) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Reservations</CardTitle>
          <CardDescription className="text-gray-400">Today's table bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-[#2A2A2A]">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#2A2A2A] rounded w-1/4"></div>
                  <div className="h-3 bg-[#2A2A2A] rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-[#2A2A2A] rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reservations.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Reservations</CardTitle>
          <CardDescription className="text-gray-400">Today's table bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-gray-400">
            No upcoming reservations for today.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-white">Upcoming Reservations</CardTitle>
          <CardDescription className="text-gray-400">Today's table bookings</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
          <Link href="/dashboard/bookings">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <Link
              key={reservation.id}
              href={`/dashboard/bookings`}
              className="block group"
            >
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#2A2A2A] hover:border-[#FCD34D]/30 hover:bg-[#2A2A2A]/50 transition-all cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white group-hover:text-[#FCD34D] transition-colors">
                      {reservation.customerName}
                    </p>
                    <Badge className={`${statusColors[reservation.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"} text-xs border`}>
                      {reservation.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{reservation.guestCount} guests</span>
                    </div>
                    {reservation.table && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>Table {reservation.table.number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{reservation.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
