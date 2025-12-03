import { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "crear - Premium Restaurant Website Builder | Create Your Restaurant Website",
  description: "Build beautiful, professional restaurant websites in minutes. Online ordering, menu management, table booking, POS integration, and more. Start free.",
  openGraph: {
    title: "crear - Premium Restaurant Website Builder",
    description: "Build beautiful, professional restaurant websites in minutes.",
    type: "website",
  },
}

export default function LandingPageRoute() {
  return <LandingPage />
}

