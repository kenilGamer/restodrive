"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, MapPin, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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

interface ReservationCalendarProps {
  restaurantId: string
  reservations: Reservation[]
  onDateSelect?: (date: string) => void
  onReservationClick?: (reservation: Reservation) => void
}

type ViewMode = "month" | "week" | "day"

export function ReservationCalendar({
  restaurantId,
  reservations,
  onDateSelect,
  onReservationClick,
}: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-500/20 border-blue-500/50 text-blue-400"
      case "PENDING":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
      case "SEATED":
        return "bg-green-500/20 border-green-500/50 text-green-400"
      case "COMPLETED":
        return "bg-gray-500/20 border-gray-500/50 text-gray-400"
      case "CANCELLED":
        return "bg-red-500/20 border-red-500/50 text-red-400"
      case "NO_SHOW":
        return "bg-orange-500/20 border-orange-500/50 text-orange-400"
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle2 className="h-3 w-3" />
      case "CANCELLED":
        return <XCircle className="h-3 w-3" />
      case "NO_SHOW":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    const days = direction === "prev" ? -7 : 7
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    const days = direction === "prev" ? -1 : 1
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
    setSelectedDate(newDate.toISOString().split("T")[0])
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today.toISOString().split("T")[0])
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getReservationsForDate = (date: Date | null): Reservation[] => {
    if (!date) return []
    const dateStr = date.toISOString().split("T")[0]
    return reservations.filter((r) => r.date === dateStr)
  }

  const getReservationsForDay = (date: Date): Reservation[] => {
    const dateStr = date.toISOString().split("T")[0]
    return reservations.filter((r) => r.date === dateStr)
  }

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const formatWeekRange = () => {
    const weekDays = getWeekDays()
    const start = weekDays[0]
    const end = weekDays[6]
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  const formatDay = () => {
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Time slots for day view
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
  })

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("month")}
                className={`${
                  viewMode === "month"
                    ? "bg-[#FCD34D] text-[#0D0D0D]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("week")}
                className={`${
                  viewMode === "week"
                    ? "bg-[#FCD34D] text-[#0D0D0D]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("day")}
                className={`${
                  viewMode === "day"
                    ? "bg-[#FCD34D] text-[#0D0D0D]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Day
              </Button>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (viewMode === "month") navigateMonth("prev")
                  else if (viewMode === "week") navigateWeek("prev")
                  else navigateDay("prev")
                }}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-center min-w-[200px]">
                <h2 className="text-lg font-semibold text-white">
                  {viewMode === "month"
                    ? formatMonthYear()
                    : viewMode === "week"
                    ? formatWeekRange()
                    : formatDay()}
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (viewMode === "month") navigateMonth("next")
                  else if (viewMode === "week") navigateWeek("next")
                  else navigateDay("next")
                }}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#C97AFF]" />
            Reservation Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "month" && (
            <div className="space-y-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map((date, index) => {
                  const dayReservations = getReservationsForDate(date)
                  const isToday =
                    date &&
                    date.toDateString() === new Date().toDateString()
                  const isSelected =
                    date &&
                    date.toISOString().split("T")[0] === selectedDate

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className={`min-h-[100px] rounded-[12px] border p-2 transition-all cursor-pointer hover:border-[#C97AFF]/50 ${
                        !date
                          ? "border-transparent"
                          : isSelected
                          ? "bg-[#FCD34D]/20 border-[#FCD34D]"
                          : isToday
                          ? "bg-[#C97AFF]/10 border-[#C97AFF]/30"
                          : "bg-[#0D0D0D] border-[#2A2A2A]"
                      }`}
                      onClick={() => {
                        if (date) {
                          const dateStr = date.toISOString().split("T")[0]
                          setSelectedDate(dateStr)
                          onDateSelect?.(dateStr)
                        }
                      }}
                    >
                      {date && (
                        <>
                          <div
                            className={`text-sm font-semibold mb-1 ${
                              isToday ? "text-[#C97AFF]" : "text-gray-300"
                            }`}
                          >
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayReservations.slice(0, 3).map((reservation) => (
                              <div
                                key={reservation.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onReservationClick?.(reservation)
                                }}
                                className={`text-xs p-1 rounded truncate border ${getStatusColor(
                                  reservation.status
                                )}`}
                                title={`${reservation.time} - ${reservation.customerName} (${reservation.guestCount} guests)`}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(reservation.status)}
                                  <span className="truncate">
                                    {reservation.time}
                                  </span>
                                </div>
                                <div className="truncate text-[10px]">
                                  {reservation.customerName}
                                </div>
                              </div>
                            ))}
                            {dayReservations.length > 3 && (
                              <div className="text-xs text-gray-500 text-center py-1">
                                +{dayReservations.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {viewMode === "week" && (
            <div className="space-y-4">
              {/* Day Headers */}
              <div className="grid grid-cols-8 gap-2">
                <div className="text-sm font-semibold text-gray-400 py-2">
                  Time
                </div>
                {getWeekDays().map((date) => (
                  <div
                    key={date.toDateString()}
                    className="text-center text-sm font-semibold text-gray-400 py-2"
                  >
                    <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className="text-xs text-gray-500">{date.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 gap-2">
                    <div className="text-xs text-gray-500 py-2 text-right pr-2">
                      {timeSlot}
                    </div>
                    {getWeekDays().map((date) => {
                      const dateStr = date.toISOString().split("T")[0]
                      const slotReservations = reservations.filter(
                        (r) =>
                          r.date === dateStr &&
                          r.time.startsWith(timeSlot.split(":")[0])
                      )

                      return (
                        <div
                          key={date.toDateString()}
                          className="min-h-[60px] rounded-[8px] border border-[#2A2A2A] bg-[#0D0D0D] p-1"
                        >
                          {slotReservations.map((reservation) => (
                            <div
                              key={reservation.id}
                              onClick={() => onReservationClick?.(reservation)}
                              className={`text-xs p-1 rounded mb-1 border cursor-pointer hover:scale-105 transition-transform ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(reservation.status)}
                                <span className="font-semibold">
                                  {reservation.time}
                                </span>
                              </div>
                              <div className="truncate">
                                {reservation.customerName}
                              </div>
                              <div className="text-[10px] flex items-center gap-1">
                                <Users className="h-2 w-2" />
                                {reservation.guestCount}
                                {reservation.table && (
                                  <>
                                    <MapPin className="h-2 w-2 ml-1" />
                                    {reservation.table.number}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "day" && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {formatDay()}
                </h3>
                <Badge className="bg-[#C97AFF]/20 text-[#C97AFF] border-[#C97AFF]/50">
                  {getReservationsForDay(currentDate).length} reservations
                </Badge>
              </div>

              {/* Day Timeline */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {timeSlots.map((timeSlot) => {
                  const slotReservations = reservations.filter(
                    (r) =>
                      r.date === currentDate.toISOString().split("T")[0] &&
                      r.time.startsWith(timeSlot.split(":")[0])
                  )

                  if (slotReservations.length === 0) return null

                  return (
                    <div key={timeSlot} className="space-y-2">
                      <div className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <div className="w-12 text-right">{timeSlot}</div>
                        <div className="flex-1 h-px bg-[#2A2A2A]"></div>
                      </div>
                      <div className="ml-14 space-y-2">
                        {slotReservations.map((reservation) => (
                          <motion.div
                            key={reservation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => onReservationClick?.(reservation)}
                            className={`p-4 rounded-[12px] border cursor-pointer hover:scale-[1.02] transition-transform ${getStatusColor(
                              reservation.status
                            )}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {getStatusIcon(reservation.status)}
                                  <span className="font-semibold text-white">
                                    {reservation.customerName}
                                  </span>
                                  <Badge
                                    className={`text-xs ${getStatusColor(
                                      reservation.status
                                    )}`}
                                  >
                                    {reservation.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-400">
                                  {reservation.reservationNumber}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-white">
                                  {reservation.time}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {reservation.guestCount} guests
                              </div>
                              {reservation.table && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  Table {reservation.table.number}
                                </div>
                              )}
                              {reservation.occasion && (
                                <div className="text-[#C97AFF]">
                                  🎉 {reservation.occasion}
                                </div>
                              )}
                            </div>
                            {reservation.specialRequests && (
                              <div className="mt-2 text-xs text-gray-400 italic">
                                "{reservation.specialRequests}"
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-[18px] shadow-glow">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm text-gray-400">Status:</span>
            {[
              { status: "CONFIRMED", label: "Confirmed" },
              { status: "PENDING", label: "Pending" },
              { status: "SEATED", label: "Seated" },
              { status: "COMPLETED", label: "Completed" },
              { status: "CANCELLED", label: "Cancelled" },
              { status: "NO_SHOW", label: "No Show" },
            ].map(({ status, label }) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full border ${getStatusColor(status).split(" ")[0]}`}></div>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

