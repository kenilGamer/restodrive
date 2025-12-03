import { 
  User, 
  Restaurant, 
  Menu, 
  Category, 
  MenuItem, 
  Order, 
  OrderItem,
  Reservation,
  Table,
  QRCode,
  Staff,
  Payment,
  Branch
} from "@prisma/client"

export type {
  User,
  Restaurant,
  Menu,
  Category,
  MenuItem,
  Order,
  OrderItem,
  Reservation,
  Table,
  QRCode,
  Staff,
  Payment,
  Branch,
}

export type MenuWithCategories = Menu & {
  categories: (Category & {
    items: (MenuItem & {
      variants?: Array<{
        id: string
        name: string
        price: number | string
      }>
      modifiers?: Array<{
        id: string
        name: string
        price: number | string
      }>
    })[]
  })[]
}

export type OrderWithItems = Order & {
  items: (OrderItem & {
    menuItem: MenuItem
  })[]
}

export type RestaurantWithRelations = Restaurant & {
  menus: Menu[]
  branches: Branch[]
  staff: Staff[]
  tables: Table[]
}

