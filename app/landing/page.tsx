import { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Restaurant Website Builder | Create Your Restaurant Website in Minutes - crear",
  description: "Build beautiful, professional restaurant websites with online ordering, menu management, table booking, and more. No coding required. Start your 14-day free trial today.",
  keywords: ["restaurant website builder", "online ordering system", "restaurant menu management", "table booking", "restaurant POS", "QR code menu"],
  openGraph: {
    title: "Restaurant Website Builder | Create Your Restaurant Website in Minutes",
    description: "Build beautiful, professional restaurant websites with online ordering, menu management, table booking, and more. No coding required.",
    type: "website",
    siteName: "crear",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Website Builder | Create Your Restaurant Website in Minutes",
    description: "Build beautiful, professional restaurant websites with online ordering, menu management, table booking, and more.",
  },
  alternates: {
    canonical: "/landing",
  },
}

export default function LandingPageRoute() {
  return <LandingPage />
}

