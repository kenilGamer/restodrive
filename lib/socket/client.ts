"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
        path: "/api/socket",
        transports: ["websocket", "polling"],
      })

      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id)
        setIsConnected(true)
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
        setIsConnected(false)
      })
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // socket?.disconnect()
    }
  }, [])

  return { socket, isConnected }
}

export function useRestaurantSocket(restaurantId: string | null) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !restaurantId || !isConnected) return

    // Join restaurant room
    socket.emit("join:restaurant", restaurantId)

    return () => {
      socket.emit("leave:restaurant", restaurantId)
    }
  }, [socket, restaurantId, isConnected])

  return { socket, isConnected }
}

