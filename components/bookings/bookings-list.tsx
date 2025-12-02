"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, Users, Phone, Mail, MapPin, Edit, X, CheckCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Reservation {
  id: string
  reservationNumber: string
  date: string
  time: string
  guestCount: number
  status: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  specialRequests: string | null
  occasion: string | null
  table: {
    id: string
    number: string
    capacity: number
  } | null
  branch: {
    id: string
    name: string
  } | null
}

interface BookingsListProps {
  restaurantId: string
  initialStatus?: string
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SEATED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-orange-100 text-orange-800",
}

export function BookingsList({ restaurantId, initialStatus = "all" }: BookingsListProps) {
  const [status, setStatus] = useState(initialStatus)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        restaurantId,
        date: selectedDate,
        ...(status !== "all" && { status }),
      })

      const res = await fetch(`/api/bookings?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReservations(data.reservations || [])
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [restaurantId, status, selectedDate])

  const updateStatus = async (reservationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchReservations()
      }
    } catch (error) {
      console.error("Error updating reservation:", error)
    }
  }

  const cancelReservation = async (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return

    try {
      const res = await fetch(`/api/bookings/${reservationId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchReservations()
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="SEATED">Seated</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              No reservations found for this date.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {reservation.customerName}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {reservation.reservationNumber}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[reservation.status] || "bg-gray-100 text-gray-800"}>
                    {reservation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.guestCount} guests</span>
                    </div>
                    {reservation.table && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Table {reservation.table.number} ({reservation.table.capacity} seats)</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.customerPhone}</span>
                    </div>
                    {reservation.customerEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.customerEmail}</span>
                      </div>
                    )}
                    {reservation.occasion && (
                      <div className="text-sm">
                        <span className="font-medium">Occasion: </span>
                        {reservation.occasion}
                      </div>
                    )}
                    {reservation.specialRequests && (
                      <div className="text-sm">
                        <span className="font-medium">Special Requests: </span>
                        {reservation.specialRequests}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {reservation.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(reservation.id, "SEATED")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Seated
                    </Button>
                  )}
                  {reservation.status === "SEATED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(reservation.id, "COMPLETED")}
                    >
                      Complete
                    </Button>
                  )}
                  {!["COMPLETED", "CANCELLED"].includes(reservation.status) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelReservation(reservation.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

