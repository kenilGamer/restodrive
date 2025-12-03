import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  image?: string[]
  variantId?: string
  modifiers?: Array<{
    id: string
    name: string
    price: number
  }>
  specialInstructions?: string
}

interface CartStore {
  items: CartItem[]
  restaurantId: string | null
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setRestaurant: (restaurantId: string) => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const state = get()
        const existingItem = state.items.find(
          (i) =>
            i.id === item.id &&
            i.variantId === item.variantId &&
            JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
        )

        if (existingItem) {
          set({
            items: state.items.map((i) =>
              i.id === existingItem.id &&
              i.variantId === existingItem.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...state.items, item] })
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [], restaurantId: null })
      },

      setRestaurant: (restaurantId) => {
        const state = get()
        // Clear cart if switching restaurants
        if (state.restaurantId && state.restaurantId !== restaurantId) {
          set({ items: [], restaurantId })
        } else {
          set({ restaurantId })
        }
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: "restodrive-cart",
      // Only persist cart items and restaurant ID
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId,
      }),
    }
  )
)

