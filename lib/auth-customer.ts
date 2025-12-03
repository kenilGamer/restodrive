import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const customerAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Customer Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid credentials")
        }

        // Try email/password login
        if (credentials.email && credentials.password) {
          const customer = await (db as any).customer.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          })

          if (!customer || !customer.password) {
            throw new Error("Invalid email or password")
          }

          if (!customer.isActive || customer.isBlocked) {
            throw new Error("Account is blocked or inactive")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            customer.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Note: lastLoginAt is updated by the login API, so we don't update it here to avoid duplicate queries

          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            role: "CUSTOMER",
          }
        }

        // Try phone/password login
        if (credentials.phone && credentials.password) {
          // Normalize phone number
          let normalizedPhone = credentials.phone.replace(/\D/g, "")
          // Remove leading country code (91 for India) if present
          if (normalizedPhone.startsWith("91") && normalizedPhone.length > 10) {
            normalizedPhone = normalizedPhone.substring(2)
          }
          
          // Try exact match first
          let customer = await (db as any).customer.findUnique({
            where: { phone: normalizedPhone },
          })
          
          // If not found, try with country code prefix
          if (!customer && normalizedPhone.length === 10) {
            customer = await (db as any).customer.findUnique({
              where: { phone: `91${normalizedPhone}` },
            })
          }
          
          // If still not found, try without country code
          if (!customer && credentials.phone.replace(/\D/g, "").startsWith("91")) {
            customer = await (db as any).customer.findUnique({
              where: { phone: normalizedPhone },
            })
          }

          if (!customer || !customer.password) {
            throw new Error("Invalid phone or password")
          }

          if (!customer.isActive || customer.isBlocked) {
            throw new Error("Account is blocked or inactive")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            customer.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid phone or password")
          }

          // Note: lastLoginAt is updated by the login API, so we don't update it here to avoid duplicate queries

          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            role: "CUSTOMER",
          }
        }

        throw new Error("Email/phone and password required")
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/customer/login",
    signOut: "/customer/logout",
    error: "/customer/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "CUSTOMER"
        token.phone = (user as any).phone
      }

      // Handle OAuth sign in
      if (account?.provider === "google" && account?.access_token) {
        // Find or create customer from Google account
        const email = token.email
          if (email) {
          let customer = await (db as any).customer.findUnique({
            where: { email },
          })

          if (!customer) {
            // Create new customer from Google account
            const { generateReferralCode } = await import("./loyalty-config")
            const referralCode = generateReferralCode(token.name || "CUSTOMER")

            customer = await (db as any).customer.create({
              data: {
                email,
                name: token.name || "Customer",
                emailVerified: true,
                emailVerifiedAt: new Date(),
                referralCode,
                loyaltyPoints: 0,
                loyaltyTier: "BRONZE",
              },
            })
          }

          token.id = customer.id
          token.role = "CUSTOMER"
          token.phone = customer.phone

          // Update last login (only for OAuth, not for credentials since login API handles it)
          await (db as any).customer.update({
            where: { id: customer.id },
            data: { lastLoginAt: new Date() },
          })
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        ;(session.user as any).phone = token.phone as string | undefined
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects for customer auth
      // If redirecting to signin, use customer login page
      if (url.includes("/api/auth/signin") || url.includes("/auth/login")) {
        return `${baseUrl}/customer/login`
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_CUSTOMER_SECRET || process.env.NEXTAUTH_SECRET,
}

