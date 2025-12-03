# Restaurant Digital Suite 🍽️

> **An all-in-one SaaS platform for restaurants to manage QR menus, online orders, table bookings, and POS operations.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Performance Optimizations](#performance-optimizations)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Restaurant Digital Suite is a comprehensive SaaS platform that empowers restaurants to digitize their entire operations. It combines six essential modules into one seamless system:

- **Digital Menu Builder** - Create, edit, and publish beautiful digital menus with drag-and-drop simplicity
- **QR Code Menus** - Generate branded QR codes that instantly connect customers to your menu
- **Online Ordering** - Accept and manage orders from customers with real-time kitchen integration
- **Table Reservations** - Streamline booking management with smart calendar and availability systems
- **POS Operations** - Handle in-house orders, billing, and payment processing
- **Business Analytics** - Track sales, popular items, peak hours, and customer behavior

---

## ✨ Features

### Core Modules

#### 1. Digital Menu Builder
- ✅ Visual menu editor with drag-and-drop
- ✅ Category and item management
- ✅ Variants and modifiers support
- ✅ Image upload and management
- ✅ Menu versioning (active/inactive)
- ⏳ Drag-and-drop reordering (in progress)
- ⏳ AI-powered description generator (planned)

#### 2. QR Menu System
- ✅ QR code generation
- ✅ Public menu view (`/qr/[restaurantSlug]`)
- ✅ Scan analytics tracking
- ✅ Branded QR codes with customization
- ✅ QR code PNG download functionality
- ✅ Download & share buttons in customer menu
- ✅ Offline mode (PWA)
- ✅ Light/Dark theme toggle

#### 3. Online Ordering
- ✅ Order creation and management
- ✅ Order status tracking
- ✅ Payment integration (Razorpay)
- ✅ Order items with modifiers
- ✅ Customer-facing ordering flow (`/order/[restaurantSlug]`)
- ✅ Persistent cart system with Zustand
- ✅ Order tracking page (`/order/track/[orderId]`)

#### 4. Table Bookings
- ✅ Reservation creation and management
- ✅ Availability checking
- ✅ Table booking system
- ✅ Visual calendar view (month/week/day modes)
- ⏳ Auto-reminders (planned)
- ⏳ Floor plan visualization (planned)

#### 5. POS Dashboard
- ✅ Order management
- ✅ Payment processing
- ✅ Staff management
- ⏳ Receipt printing (planned)
- ⏳ Split orders (planned)
- ⏳ Multi-branch support (planned)

#### 6. Business Analytics
- ✅ Sales analytics with charts
- ✅ Popular items tracking
- ✅ Peak hours analysis
- ✅ Customer analytics
- ✅ Payment methods breakdown
- ⏳ Custom report builder (planned)
- ⏳ Data export (PDF/Excel) (planned)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TanStack Query** - Data fetching

### Backend
- **Next.js API Routes** - Server-side API
- **Prisma ORM** - Database ORM
- **PostgreSQL 15+** - Database
- **NextAuth.js** - Authentication
- **Socket.io** - Real-time communication

### Services
- **Supabase** - PostgreSQL hosting
- **Razorpay** - Payment processing
- **Cloudinary** - Image storage (planned)
- **Resend** - Email service (planned)
- **Twilio** - SMS service (planned)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (or Supabase account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restodrive
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   See [Environment Variables](#environment-variables) section for required variables.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Or push schema (for development)
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
restodrive/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── menus/           # Menu management
│   │   ├── orders/          # Order management
│   │   ├── bookings/       # Reservation management
│   │   ├── analytics/       # Analytics endpoints
│   │   └── ...
│   ├── dashboard/           # Dashboard pages
│   │   ├── menu/            # Menu builder
│   │   ├── orders/          # Order management
│   │   ├── bookings/       # Table bookings
│   │   ├── analytics/       # Analytics dashboard
│   │   └── ...
│   ├── auth/                # Authentication pages
│   ├── qr/                  # Public QR menu pages
│   ├── order/               # Customer ordering pages
│   │   ├── [restaurantSlug]/ # Ordering flow
│   │   └── track/           # Order tracking
│   └── ...
├── components/              # React components
│   ├── dashboard/           # Dashboard components
│   ├── menu/                # Menu builder components
│   ├── orders/              # Order components
│   ├── ordering/           # Customer ordering components
│   ├── analytics/           # Analytics components
│   └── ui/                  # UI components (shadcn)
├── lib/                     # Utility libraries
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # Prisma client
│   ├── prisma/             # Prisma utilities
│   └── utils.ts            # Helper functions
├── store/                   # State management
│   └── cart-store.ts       # Cart state (Zustand)
├── prisma/                  # Prisma schema
│   └── schema.prisma        # Database schema
├── docs/                    # Documentation
│   ├── IMPLEMENTATION_STATUS.md
│   └── PERFORMANCE_OPTIMIZATIONS.md
├── migrations/              # SQL migrations
└── scripts/                 # Utility scripts
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# Optional: Email/SMS services
RESEND_API_KEY="your-resend-api-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
```

See `ENV_SETUP_INSTRUCTIONS.md` for detailed setup instructions.

---

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your connection strings from Project Settings → Database
3. Update `DATABASE_URL` and `DIRECT_URL` in `.env`
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE restodrive;
   ```
3. Update connection strings in `.env`
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Apply Performance Indexes

After setting up the database, apply performance indexes:

```bash
node scripts/apply-indexes.js
```

Or manually run the SQL in `migrations/add-dashboard-indexes.sql`

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/sessions` - Get user sessions

### Menus
- `GET /api/menus` - Get all menus
- `POST /api/menus` - Create menu
- `PUT /api/menus/[menuId]` - Update menu
- `DELETE /api/menus/[menuId]` - Delete menu

### Orders
- `GET /api/orders` - Get orders (with filters)
- `POST /api/orders` - Create order
- `GET /api/orders/[orderId]` - Get order details
- `PUT /api/orders/[orderId]/status` - Update order status

### Analytics
- `GET /api/analytics/sales` - Get sales analytics
- `GET /api/analytics/items` - Get popular items
- `GET /api/analytics/peak-hours` - Get peak hours analysis
- `GET /api/analytics/customers` - Get customer analytics

See `BLUEPRINT.md` for complete API documentation.

---

## ⚡ Performance Optimizations

The application has been optimized for performance:

- ✅ **Query Optimization**: Reduced database queries by 85-90%
- ✅ **Next.js Caching**: Implemented strategic caching (10s-60s)
- ✅ **Database Indexes**: Composite indexes for fast queries
- ✅ **Query Consolidation**: Single SQL queries instead of multiple
- ✅ **Early Returns**: Optimized data fetching patterns

**Performance Metrics:**
- Dashboard load time: **0.5-1s** (was 5-6.5s)
- Query reduction: **85-90%**
- Database load: **Significantly reduced**

See `docs/PERFORMANCE_OPTIMIZATIONS.md` for detailed information.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Environment Setup for Production

- Set `NEXTAUTH_URL` to your production domain
- Use production database connection strings
- Configure payment gateway keys
- Set up email/SMS services

---

## 📖 Documentation

- **[BLUEPRINT.md](./BLUEPRINT.md)** - Complete product blueprint
- **[IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md)** - Current implementation status
- **[PERFORMANCE_OPTIMIZATIONS.md](./docs/PERFORMANCE_OPTIMIZATIONS.md)** - Performance optimizations guide
- **[ENV_SETUP_INSTRUCTIONS.md](./ENV_SETUP_INSTRUCTIONS.md)** - Environment setup guide
- **[TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)** - Common issues and solutions

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate   # Run migrations
npx prisma studio    # Open Prisma Studio
npx prisma db push   # Push schema changes

# Linting
npm run lint         # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)
- Follow Next.js App Router conventions

---

## 🗺️ Roadmap

### Phase 1: Core Feature Completion (Current)
- [ ] Drag-and-drop menu reordering
- [x] Customer-facing ordering flow ✅
- [x] Enhanced QR menu (theme toggle, PWA, download/share) ✅
- [x] QR code PNG download functionality ✅
- [x] Table booking calendar view ✅

### Phase 2: Advanced Features
- [ ] AI Food Description Generator
- [ ] Bulk menu import/export
- [ ] Advanced analytics
- [ ] Customer accounts & loyalty

### Phase 3: Enterprise Features
- [ ] Multi-branch management
- [ ] Advanced POS features
- [ ] Inventory management
- [ ] Accounting integration

See `docs/IMPLEMENTATION_STATUS.md` for detailed roadmap.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Prisma](https://www.prisma.io/)

---

## 📞 Support

For support, email support@restodrive.com or open an issue in the repository.

---

**Made with ❤️ for restaurants worldwide**
