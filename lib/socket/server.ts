import { Server as HTTPServer } from "http"
import { Server as SocketIOServer } from "socket.io"

let io: SocketIOServer | null = null

export function initializeSocketIO(httpServer: HTTPServer) {
  if (io) {
    return io
  }

  io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Join restaurant room
    socket.on("join:restaurant", (restaurantId: string) => {
      socket.join(`restaurant:${restaurantId}`)
      console.log(`Socket ${socket.id} joined restaurant:${restaurantId}`)
    })

    // Leave restaurant room
    socket.on("leave:restaurant", (restaurantId: string) => {
      socket.leave(`restaurant:${restaurantId}`)
      console.log(`Socket ${socket.id} left restaurant:${restaurantId}`)
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  return io
}

export function getSocketIO(): SocketIOServer | null {
  return io
}

// Helper function to emit events to a restaurant room
export function emitToRestaurant(restaurantId: string, event: string, data: any) {
  if (io) {
    io.to(`restaurant:${restaurantId}`).emit(event, data)
  }
}

