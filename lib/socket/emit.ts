// Helper function to emit Socket.io events from API routes
// This works when Socket.io is initialized in server.js

export function emitToRestaurant(restaurantId: string, event: string, data: any) {
  if (typeof global !== "undefined" && (global as any).io) {
    const io = (global as any).io
    io.to(`restaurant:${restaurantId}`).emit(event, data)
    console.log(`Emitted ${event} to restaurant:${restaurantId}`)
  } else {
    console.warn("Socket.io not initialized - event not emitted:", event)
  }
}

