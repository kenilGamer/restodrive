# Socket.io Real-Time Updates Setup

This document explains how Socket.io is set up for real-time order updates in RestoDrive.

## Architecture

Socket.io is integrated to provide real-time updates for:
- New orders created
- Order status changes
- Order updates

## Setup

### 1. Custom Server

The application uses a custom `server.js` file that wraps the Next.js server with Socket.io. This allows Socket.io to work alongside Next.js App Router.

### 2. Server-Side Events

When orders are created or updated in API routes, events are emitted to the appropriate restaurant room:

```typescript
import { emitToRestaurant } from "@/lib/socket/emit"

// Emit when order is created
emitToRestaurant(restaurantId, "order:created", { order })

// Emit when order is updated
emitToRestaurant(restaurantId, "order:updated", { order })
```

### 3. Client-Side Hooks

Components use the `useRestaurantSocket` hook to:
- Connect to Socket.io
- Join restaurant-specific rooms
- Listen for real-time events

```typescript
import { useRestaurantSocket } from "@/lib/socket/client"

const { socket, isConnected } = useRestaurantSocket(restaurantId)

// Listen for events
socket?.on("order:created", (data) => {
  // Handle new order
})
```

## Running the Application

### Development

```bash
npm run dev
```

This uses the custom server (`server.js`) which includes Socket.io.

### Production

```bash
npm run build
npm start
```

## Features

- **Real-time Order Updates**: Kitchen Display and Orders pages update instantly when orders change
- **Restaurant Rooms**: Each restaurant has its own Socket.io room for isolated updates
- **Fallback Polling**: If Socket.io connection fails, components fall back to polling every 10 seconds
- **Automatic Reconnection**: Socket.io automatically reconnects if the connection is lost

## Components Using Socket.io

1. **Kitchen Display System** (`components/kitchen/kitchen-display-system.tsx`)
   - Real-time order queue updates
   - Instant status change notifications

2. **Orders Page** (can be updated similarly)
   - Real-time order list updates
   - Status change notifications

## Environment Variables

Make sure `NEXT_PUBLIC_APP_URL` is set in your `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, set it to your production URL.

## Troubleshooting

### Socket.io not connecting

1. Make sure you're using `npm run dev` (not `next dev` directly)
2. Check that `server.js` is running
3. Verify `NEXT_PUBLIC_APP_URL` is set correctly
4. Check browser console for connection errors

### Events not received

1. Verify the restaurant ID matches
2. Check that `emitToRestaurant` is being called in API routes
3. Check server logs for emitted events
4. Verify Socket.io connection is established (check `isConnected` state)

