"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin, CheckCircle2, XCircle, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ReservationCalendar } from "./reservation-calendar"

interface TableBookingSystemProps {
  restaurantId: string
}

interface Table {
  id: string
  number: string
  capacity: number
  status: "available" | "occupied" | "reserved"
  reservation?: Reservation
}

interface Reservation {
  id: string
  reservationNumber: string
  date: string
  time: string
  guestCount: number
  customerName: string
  customerPhone: string
  status: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  table?: {
    number: string
    capacity: number
  } | null
  specialRequests?: string | null
  occasion?: string | null
}

export function TableBookingSystem({ restaurantId }: TableBookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [tables, setTables] = useState<Table[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [view, setView] = useState<"floor" | "calendar">("floor")
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    fetchTables()
    fetchReservations()
  }, [restaurantId, selectedDate])

  const fetchTables = async () => {
    // Mock data - replace with actual API call
    setTables([
      { id: "1", number: "1", capacity: 2, status: "available" },
      { id: "2", number: "2", capacity: 4, status: "occupied" },
      { id: "3", number: "3", capacity: 6, status: "reserved" },
      { id: "4", number: "4", capacity: 2, status: "available" },
      { id: "5", number: "5", capacity: 4, status: "available" },
      { id: "6", number: "6", capacity: 8, status: "reserved" },
    ])
  }

  const fetchReservations = async () => {
    try {
      // Fetch reservations for a date range (current month)
      const startDate = new Date(selectedDate)
      startDate.setDate(1) // First day of month
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
      endDate.setDate(0) // Last day of month
      
      const res = await fetch(
        `/api/bookings?restaurantId=${restaurantId}&startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`
      )
      if (res.ok) {
        const data = await res.json()
        // Format dates to YYYY-MM-DD for consistency
        const formattedReservations = (data.reservations || []).map((r: any) => ({
          ...r,
          date: new Date(r.date).toISOString().split("T")[0],
        }))
        setReservations(formattedReservations)
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    }
  }

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-[#11C97A]/20 border-[#11C97A]/50 text-[#11C97A]"
      case "occupied":
        return "bg-[#FF6A55]/20 border-[#FF6A55]/50 text-[#FF6A55]"
      case "reserved":
        return "bg-[#C97AFF]/20 border-[#C97AFF]/50 text-[#C97AFF]"
      default:
        return "bg-[#2A2A2A] border-[#2A2A2A] text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-white">Table Booking System</h1>
          <p className="mt-1 text-sm text-gray-400">Manage table reservations and floor plan</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[12px] p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("floor")}
              className={`${view === "floor" ? "bg-[#FCD34D] text-[#0D0D0D]" : "text-gray-400"}`}
            >
              Floor Plan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("calendar")}
              className={`${view === "calendar" ? "bg-[#FCD34D] text-[#0D0D0D]" : "text-gray-400"}`}
            >
              Calendar
            </Button>
          </div>
          <Button
            onClick={() => setShowBookingModal(true)}
            className="bg-gradient-to-r from-[#C97AFF] to-[#6B7CFF] hover:from-[#B869E6] hover:to-[#5B6CE6] text-white border-0 shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] px-4 py-2 text-white focus:outline-none focus:border-[#C97AFF]"
            />
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#11C97A]"></div>
                <span className="text-sm text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6A55]"></div>
                <span className="text-sm text-gray-400">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#C97AFF]"></div>
                <span className="text-sm text-gray-400">Reserved</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "floor" ? (
        /* Floor Plan View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
              <CardHeader>
                <CardTitle className="text-white">Floor Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {tables.map((table, index) => (
                    <motion.div
                      key={table.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        className={`w-full aspect-square rounded-[12px] border-2 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 ${
                          table.status === "available"
                            ? "bg-[#11C97A]/10 border-[#11C97A]/50 hover:bg-[#11C97A]/20"
                            : table.status === "occupied"
                            ? "bg-[#FF6A55]/10 border-[#FF6A55]/50 hover:bg-[#FF6A55]/20"
                            : "bg-[#C97AFF]/10 border-[#C97AFF]/50 hover:bg-[#C97AFF]/20"
                        }`}
                      >
                        <MapPin className={`h-6 w-6 mb-2 ${
                          table.status === "available"
                            ? "text-[#11C97A]"
                            : table.status === "occupied"
                            ? "text-[#FF6A55]"
                            : "text-[#C97AFF]"
                        }`} />
                        <span className="text-lg font-bold text-white">Table {table.number}</span>
                        <span className="text-xs text-gray-400 mt-1">{table.capacity} seats</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservations List */}
          <div>
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
              <CardHeader>
                <CardTitle className="text-white">Today's Reservations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {reservations.map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-[12px] bg-[#0D0D0D] border border-[#2A2A2A] hover:border-[#C97AFF]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white text-sm">{reservation.customerName}</p>
                          <p className="text-xs text-gray-400">{reservation.reservationNumber}</p>
                        </div>
                        <Badge className="bg-[#C97AFF]/20 text-[#C97AFF] border-[#C97AFF]/50 text-xs">
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reservation.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.guestCount} guests
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {reservations.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">No reservations for this date</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Enhanced Calendar View */
        <ReservationCalendar
          restaurantId={restaurantId}
          reservations={reservations.map((r) => ({
            ...r,
            date: r.date.split("T")[0], // Ensure date is in YYYY-MM-DD format
          }))}
          onDateSelect={(date) => {
            setSelectedDate(date)
          }}
          onReservationClick={(reservation) => {
            // Handle reservation click - could open detail modal
            console.log("Reservation clicked:", reservation)
          }}
        />
      )}
    </div>
  )
}

