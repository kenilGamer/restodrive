"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Menu, 
  X, 
  ChevronRight, 
  Play, 
  Globe, 
  ShoppingCart, 
  UtensilsCrossed, 
  Calendar, 
  CreditCard, 
  BarChart3,
  Check,
  ChevronDown,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Users,
  Smartphone,
  Monitor,
  Gift,
  Package,
  UserCog,
  MessageSquare,
  Megaphone,
  Languages,
  Truck,
  QrCode,
  ChevronLeft,
  Clock,
  TrendingUp,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [faqSearch, setFaqSearch] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    
    // Detect low-end devices
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    const deviceMemory = (navigator as any).deviceMemory || 4
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
    setIsLowPerformance(hardwareConcurrency < 4 || deviceMemory < 4 || isSlowConnection || false)
    
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) return
    const testimonialsCount = 3
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonialsCount)
    }, 5000)
    return () => clearInterval(interval)
  }, [reducedMotion])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const features = [
    {
      icon: Globe,
      title: "Website Builder",
      description: "Drag-and-drop website builder with beautiful templates. No coding required.",
    },
    {
      icon: UtensilsCrossed,
      title: "Menu Management",
      description: "Easily create, edit, and organize your menu with categories, variants, and modifiers.",
    },
    {
      icon: ShoppingCart,
      title: "Online Ordering",
      description: "Accept orders online with integrated payment processing and order tracking.",
    },
    {
      icon: Calendar,
      title: "Table Booking",
      description: "Streamline reservations with smart calendar system and availability management.",
    },
    {
      icon: CreditCard,
      title: "POS & Payments",
      description: "Complete POS system with payment processing, receipts, and split orders.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track sales, popular items, peak hours, and customer behavior insights.",
    },
    {
      icon: Gift,
      title: "Loyalty Program & Rewards",
      description: "Build customer loyalty with points, rewards, and referral programs to increase repeat visits.",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track ingredients, stock levels, and automate reordering to reduce waste and optimize costs.",
    },
    {
      icon: UserCog,
      title: "Staff Management",
      description: "Schedule shifts, track hours, manage roles and permissions for efficient team operations.",
    },
    {
      icon: MessageSquare,
      title: "Customer Reviews",
      description: "Collect and display customer reviews and ratings to build trust and improve service.",
    },
    {
      icon: Megaphone,
      title: "Marketing Tools",
      description: "Email campaigns, SMS notifications, and promotional offers to engage customers effectively.",
    },
    {
      icon: Languages,
      title: "Multi-language Support",
      description: "Support multiple languages for international customers and diverse dining experiences.",
    },
    {
      icon: Truck,
      title: "Delivery Integration",
      description: "Integrate with Swiggy, Zomato, and other delivery platforms for seamless order management.",
    },
    {
      icon: QrCode,
      title: "QR Code Ordering",
      description: "Contactless ordering via QR codes at tables for a modern, hygienic dining experience.",
    },
  ]

  const templates = [
    { name: "Modern", category: "Contemporary", color: "from-blue-50 to-white" },
    { name: "Minimal", category: "Clean & Simple", color: "from-stone-50 to-white" },
    { name: "Elegant", category: "Fine Dining", color: "from-amber-50 to-white" },
    { name: "Dark Mode", category: "Bold & Modern", color: "from-gray-900 to-gray-800" },
    { name: "Cafe / Bakery", category: "Cozy & Warm", color: "from-orange-50 to-amber-50" },
    { name: "Fine Dining", category: "Luxury", color: "from-stone-100 to-white" },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹999",
      period: "/month",
      description: "Perfect for small restaurants",
      features: [
        "1 Restaurant",
        "Basic Website Builder",
        "Menu Management",
        "Online Ordering",
        "QR Code Menu",
        "Email Support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "/month",
      description: "For growing restaurants",
      features: [
        "3 Restaurants",
        "Advanced Website Builder",
        "Table Booking System",
        "POS Integration",
        "Analytics Dashboard",
        "Priority Support",
        "Custom Domain",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For restaurant chains",
      features: [
        "Unlimited Restaurants",
        "Multi-branch Management",
        "White-label Solution",
        "API Access",
        "Dedicated Account Manager",
        "24/7 Support",
        "Custom Integrations",
      ],
      popular: false,
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up in seconds with your email. No credit card required.",
    },
    {
      number: "02",
      title: "Add Restaurant Details",
      description: "Enter your restaurant information, upload logo, and set up your brand.",
    },
    {
      number: "03",
      title: "Customize Your Website",
      description: "Choose a template, customize colors, add your menu, and make it yours.",
    },
    {
      number: "04",
      title: "Publish Instantly",
      description: "Go live in minutes. Share your website URL and start accepting orders.",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Owner, Spice Garden",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
      rating: 5,
      quote: "crear transformed our restaurant's online presence. Orders increased by 300% in the first month.",
    },
    {
      name: "Priya Sharma",
      role: "Manager, The Coffee House",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
      rating: 5,
      quote: "The website builder is incredibly easy to use. We had our site live in under an hour.",
    },
    {
      name: "Amit Patel",
      role: "Founder, Fine Dining Co.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
      rating: 5,
      quote: "Best investment we made. The analytics help us understand our customers better.",
    },
  ]

  const faqs = [
    {
      question: "Do I need technical knowledge to use crear?",
      answer: "Not at all! crear is designed for restaurant owners, not developers. Our drag-and-drop builder makes it easy to create a professional website without any coding knowledge.",
    },
    {
      question: "Can I customize my website design?",
      answer: "Yes! You can choose from beautiful templates and customize colors, fonts, layouts, and more. Your website will reflect your restaurant's unique brand.",
    },
    {
      question: "How do online orders work?",
      answer: "Customers can browse your menu, add items to cart, and place orders directly through your website. Orders appear in your dashboard in real-time, and you can accept payments online or in-person.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Start with our 14-day free trial. No credit card required. Explore all features and see if crear is right for your restaurant.",
    },
    {
      question: "Can I use my own domain?",
      answer: "Absolutely! Professional and Enterprise plans include custom domain support. You can connect your existing domain or purchase a new one through us.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, UPI, net banking, and digital wallets. Payments are processed securely through Razorpay integration.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  )

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "crear",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "999",
              "priceCurrency": "INR",
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "500",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          }),
        }}
      />
      <div className="min-h-screen bg-[#F4F4F4]">
        {/* Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#111217]/95 backdrop-blur-md shadow-lg border-b border-[#111217]/50"
              : "bg-[#111217]"
          }`}
        >
          <nav className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2" aria-label="Home">
                <Image 
                  src="/creativitycoderLogo.svg" 
                  priority 
                  loading="eager" 
                  alt="Creativity Coder Solutions Logo" 
                  width={160} 
                  height={40} 
                  className="h-10 w-auto object-contain" 
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  href="#features" 
                  className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:ring-offset-2 focus:ring-offset-[#111217] rounded"
                >
                  Features
                </Link>
                <Link 
                  href="#templates" 
                  className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:ring-offset-2 focus:ring-offset-[#111217] rounded"
                >
                  Templates
                </Link>
                <Link 
                  href="#pricing" 
                  className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:ring-offset-2 focus:ring-offset-[#111217] rounded"
                >
                  Pricing
                </Link>
                <Link 
                  href="#demo" 
                  className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:ring-offset-2 focus:ring-offset-[#111217] rounded"
                >
                  Demo
                </Link>
                <Link 
                  href="/auth/login" 
                  className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:ring-offset-2 focus:ring-offset-[#111217] rounded"
                >
                  Login
                </Link>
              </div>

              {/* CTA Button */}
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/register" onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'hero_cta_click', { location: 'header' })
                  }
                }}>
                  <Button
                    className="bg-gradient-to-r from-amber-start to-amber-end hover:from-amber-end hover:to-amber-start text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-amber-start focus:ring-offset-2 focus:ring-offset-charcoal"
                  >
                    Get Started
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-stone-300 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-stone-700">
                <div className="flex flex-col gap-4 pt-4">
                  <Link 
                    href="#features" 
                    className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    href="#templates" 
                    className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Templates
                  </Link>
                  <Link 
                    href="#pricing" 
                    className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="#demo" 
                    className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Demo
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="text-sm font-medium text-stone-300 hover:text-[#FFB800] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-amber-start to-amber-end text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section - Premium Promotional Visual */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 bg-gradient-to-b from-white via-[#FFFBF0] to-[#F9F9F9] relative overflow-hidden">
          {/* Premium lighting background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-start/12 via-amber-end/8 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-amber-end/12 via-amber-start/8 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,184,0,0.1),rgba(255,138,0,0.06),transparent_70%)]"></div>
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.015]" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            {/* Trust Badges */}
            <motion.div 
              className="max-w-5xl mx-auto mb-10 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm md:text-base text-stone-600">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-stone-200/50 shadow-sm hover:shadow-md transition-all">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-amber-start" />
                  <span className="font-semibold text-stone-800">Trusted by 500+ restaurants</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-stone-200/50 shadow-sm hover:shadow-md transition-all">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-amber-start" />
                  <span className="font-semibold text-stone-800">99.9% uptime</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-stone-200/50 shadow-sm hover:shadow-md transition-all">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-start fill-amber-start" />
                  <span className="font-semibold text-stone-800">4.9/5 rating</span>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16 lg:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Badge className="mb-8 md:mb-10 bg-amber-start/10 text-amber-end border-amber-start/20 px-5 py-2 font-semibold text-sm md:text-base shadow-sm hover:shadow-md transition-shadow">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                  Premium Restaurant Website Builder
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-stone-900 mb-6 md:mb-8 tracking-tight leading-[1.1] px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                aria-label="Build Beautiful, Professional Restaurant Websites"
              >
                Build Beautiful, Professional
                <br />
                <span className="bg-gradient-to-r from-amber-start via-amber-end to-amber-start bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Restaurant Websites
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl lg:text-2xl text-stone-700 mb-10 md:mb-12 font-light leading-relaxed max-w-3xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Create stunning restaurant websites with online ordering, menu management, table booking, and more. No coding required.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/auth/register" onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'hero_cta_click', { location: 'hero_primary' })
                  }
                }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-start to-amber-end hover:from-amber-end hover:to-amber-start text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-start focus:ring-offset-2"
                  >
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400 hover:shadow-lg px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-all"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
              
              <motion.p 
                className="text-sm md:text-base text-stone-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="text-stone-800">Start 14-day free trial — No card required</span> • Cancel anytime
              </motion.p>
            </div>

            {/* 3D Device Mockups and Floating Cards */}
            <div className="mt-12 md:mt-20 max-w-7xl mx-auto relative">
              {/* Device Mockups Container */}
              <div className="relative h-[400px] sm:h-[500px] md:h-[700px] lg:h-[800px]" style={{ perspective: '1500px', perspectiveOrigin: '50% 50%' }}>
                {/* Desktop Mockup */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-4xl z-10"
                  initial={{ opacity: 0, y: 80, rotateX: reducedMotion ? 0 : 20, rotateY: 0, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, rotateX: reducedMotion ? 0 : 8, rotateY: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={!reducedMotion ? { 
                    rotateY: 8,
                    rotateX: 5,
                    scale: 1.03,
                    y: -10,
                    transition: { duration: 0.4, ease: "easeOut" }
                  } : {}}
                  aria-label="Desktop website preview"
                >
                  <div className="relative rounded-lg md:rounded-xl overflow-hidden border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]" 
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {/* Browser Chrome */}
                    <div className="bg-stone-100 px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 border-b border-stone-200" aria-hidden="true">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                    </div>
                    {/* Screen Content - Premium Restaurant Website Template */}
                    <div className="aspect-video bg-gradient-to-br from-stone-50 via-white to-stone-50 relative overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=675&fit=crop&q=90"
                        alt="Premium vegetarian restaurant website template showcasing beautiful plant-based dishes"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                      />
                      {/* Elegant overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/12"></div>
                      {/* Premium website UI elements overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                        {/* Header Navigation */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-start to-amber-end shadow-lg flex items-center justify-center ring-2 ring-white/50">
                              <UtensilsCrossed className="h-5 w-5 text-white" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-3 w-28 bg-white/95 rounded-md shadow-sm"></div>
                              <div className="h-2 w-20 bg-white/70 rounded-md"></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-8 w-16 bg-white/90 rounded-lg shadow-sm"></div>
                            <div className="h-8 w-8 bg-gradient-to-br from-amber-start to-amber-end rounded-lg shadow-sm"></div>
                          </div>
                        </div>
                        {/* Hero Content */}
                        <div className="space-y-4 max-w-md">
                          <div className="h-10 w-72 bg-white/98 rounded-xl shadow-lg border border-white/80"></div>
                          <div className="h-7 w-96 bg-white/85 rounded-lg shadow-sm"></div>
                          <div className="flex gap-3 mt-5">
                            <div className="h-11 w-36 bg-gradient-to-r from-amber-start to-amber-end rounded-xl shadow-md ring-2 ring-amber-start/20"></div>
                            <div className="h-11 w-36 bg-white/95 rounded-xl shadow-md border border-stone-200/50"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tablet Mockup - Hidden on mobile, visible on md+ */}
                <motion.div
                  className="hidden md:block absolute left-[8%] top-[18%] w-64 lg:w-80 z-20"
                  initial={{ opacity: 0, x: -80, rotateY: reducedMotion ? 0 : -35, rotateX: reducedMotion ? 0 : 10, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, rotateY: reducedMotion ? 0 : -15, rotateX: reducedMotion ? 0 : 5, scale: 1 }}
                  transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={!reducedMotion ? { 
                    rotateY: -20,
                    rotateX: 8,
                    scale: 1.08,
                    x: -5,
                    transition: { duration: 0.4, ease: "easeOut" }
                  } : {}}
                >
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-stone-50 via-white to-stone-50 relative overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=90"
                        alt="Elegant vegetarian menu template with colorful plant-based dishes"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {/* Premium menu template overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/6 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-center p-5">
                        <div className="space-y-2.5">
                          <div className="h-4 w-36 bg-white/98 rounded-md shadow-sm"></div>
                          <div className="h-3 w-28 bg-white/85 rounded-md"></div>
                          <div className="h-3 w-32 bg-white/85 rounded-md mt-4"></div>
                          <div className="h-3 w-24 bg-white/85 rounded-md"></div>
                          <div className="flex items-center gap-2.5 mt-5">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-start to-amber-end shadow-md ring-2 ring-white/60"></div>
                            <div className="h-3 w-20 bg-white/95 rounded-md shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Mockup - Hidden on mobile, visible on md+ */}
                <motion.div
                  className="hidden md:block absolute right-[8%] top-[28%] w-48 lg:w-56 z-20"
                  initial={{ opacity: 0, x: 80, rotateY: reducedMotion ? 0 : 35, rotateX: reducedMotion ? 0 : -10, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, rotateY: reducedMotion ? 0 : 15, rotateX: reducedMotion ? 0 : -5, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={!reducedMotion ? { 
                    rotateY: 20,
                    rotateX: -8,
                    scale: 1.08,
                    x: 5,
                    transition: { duration: 0.4, ease: "easeOut" }
                  } : {}}
                >
                  <div className="relative rounded-[2rem] overflow-hidden border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {/* Notch */}
                    <div className="bg-white h-6 flex items-center justify-center relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-stone-200 rounded-b-2xl"></div>
                    </div>
                    <div className="aspect-[9/16] bg-gradient-to-br from-stone-50 via-white to-stone-50 relative overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop&q=90"
                        alt="Mobile vegetarian restaurant website template preview with fresh plant-based food"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {/* Premium mobile template overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/6 via-transparent to-black/10"></div>
                      <div className="absolute inset-0 flex flex-col p-4 pt-8">
                        {/* Mobile header */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-start to-amber-end shadow-md ring-2 ring-white/60"></div>
                          <div className="h-4 w-24 bg-white/95 rounded-md shadow-sm"></div>
                          <div className="h-4 w-4 rounded bg-white/90 shadow-sm"></div>
                        </div>
                        {/* Mobile content */}
                        <div className="flex-1 space-y-3.5">
                          <div className="h-28 w-full bg-white/98 rounded-2xl shadow-lg border border-white/80"></div>
                          <div className="space-y-2">
                            <div className="h-3.5 w-full bg-white/90 rounded-md shadow-sm"></div>
                            <div className="h-3.5 w-4/5 bg-white/80 rounded-md shadow-sm"></div>
                          </div>
                          <div className="h-18 w-full bg-gradient-to-r from-amber-start/25 to-amber-end/25 rounded-xl border border-amber-start/30 shadow-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating UI Cards - Hidden on mobile, visible on md+ */}
              <div className="hidden md:block absolute inset-0 pointer-events-none z-30">
                {/* Dishes Card */}
                <motion.div
                  className="absolute left-[5%] top-[10%] w-48 lg:w-64 pointer-events-auto"
                  initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -10 }}
                  animate={(reducedMotion || isLowPerformance) ? { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    rotateY: 0
                  } : {
                    opacity: 1, 
                    y: [0, -12, 0],
                    scale: 1,
                    rotateY: [0, -1.5, 0]
                  }}
                  transition={(reducedMotion || isLowPerformance) ? {
                    opacity: { duration: 0.8, delay: 0.9 },
                    y: { duration: 0.8, delay: 0.9 },
                    scale: { duration: 0.8, delay: 0.9 },
                    rotateY: { duration: 0.8, delay: 0.9 }
                  } : {
                    opacity: { duration: 0.8, delay: 0.9 },
                    scale: { duration: 0.8, delay: 0.9 },
                    y: { 
                      duration: isLowPerformance ? 6 : 5,
                      repeat: Infinity,
                      repeatType: "reverse" as const,
                      ease: "easeInOut"
                    },
                    rotateY: {
                      duration: isLowPerformance ? 6 : 5,
                      repeat: Infinity,
                      repeatType: "reverse" as const,
                      ease: "easeInOut",
                      delay: 0.2
                    }
                  }}
                  whileHover={!(reducedMotion || isLowPerformance) ? { 
                    scale: 1.08,
                    y: -8,
                    rotateY: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    willChange: reducedMotion || isLowPerformance ? 'auto' : 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  role="article"
                  aria-label="Food photography feature"
                >
          
                   
                </motion.div>

       

             

      
              </div>

             
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-20 md:py-24 lg:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
              <motion.div 
                className="glass rounded-2xl p-8 md:p-10 border border-stone-200 bg-white hover:shadow-xl hover:-translate-y-2 hover:border-amber-start/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-start/20 to-amber-end/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-amber-start/30 group-hover:to-amber-end/30 transition-all duration-300 shadow-sm">
                  <Zap className="h-7 w-7 text-amber-start" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-end transition-colors">Quick Launch</h3>
                <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg">Get your restaurant online in minutes, not weeks. Launch fast and start accepting orders today.</p>
              </motion.div>
              <motion.div 
                className="glass rounded-2xl p-8 md:p-10 border border-stone-200 bg-white hover:shadow-xl hover:-translate-y-2 hover:border-amber-start/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-start/20 to-amber-end/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-amber-start/30 group-hover:to-amber-end/30 transition-all duration-300 shadow-sm">
                  <TrendingUp className="h-7 w-7 text-amber-start" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-end transition-colors">Market Growth</h3>
                <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg">Increase online orders by up to 300% with our proven platform designed for restaurant success.</p>
              </motion.div>
              <motion.div 
                className="glass rounded-2xl p-8 md:p-10 border border-stone-200 bg-white hover:shadow-xl hover:-translate-y-2 hover:border-amber-start/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-start/20 to-amber-end/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-amber-start/30 group-hover:to-amber-end/30 transition-all duration-300 shadow-sm">
                  <Clock className="h-7 w-7 text-amber-start" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-end transition-colors">24/7 Reliable Support</h3>
                <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg">Round-the-clock support team ready to help you succeed. We're here whenever you need us.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24 lg:py-28 bg-gradient-to-b from-stone-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12 md:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-stone-900 mb-4 md:mb-6 tracking-tight">
                Everything You Need
              </h2>
              <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-transparent via-amber-start to-transparent mx-auto mb-6 md:mb-8"></div>
              <p className="text-lg md:text-xl text-stone-700 font-light max-w-2xl mx-auto leading-relaxed">
                All-in-one platform to manage your restaurant's digital presence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card
                    className="border-2 border-stone-200 hover:shadow-2xl hover:shadow-amber-start/10 transition-all duration-300 hover:border-amber-start/40 hover:-translate-y-2 group bg-white focus-within:ring-2 focus-within:ring-amber-start focus-within:ring-offset-2 h-full"
                  >
                    <CardContent className="p-6 md:p-8 lg:p-10">
                      <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-amber-start/10 via-amber-start/5 to-stone-50 flex items-center justify-center mb-6 group-hover:from-amber-start/25 group-hover:via-amber-start/15 group-hover:to-amber-start/10 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
                        <feature.icon className="h-8 w-8 md:h-9 md:w-9 text-amber-start group-hover:text-amber-end transition-colors" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 md:mb-4 group-hover:text-amber-end transition-colors">{feature.title}</h3>
                      <p className="text-stone-700 font-light leading-relaxed mb-4 md:mb-6 text-base md:text-lg">{feature.description}</p>
                      <button className="text-sm md:text-base font-semibold text-amber-start hover:text-amber-end opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 hover:gap-3">
                        Learn More <ArrowRight className="h-4 w-4" />
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

 

        {/* Templates Section */}
        <section id="templates" className="py-20 md:py-24 lg:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12 md:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-stone-900 mb-4 md:mb-6 tracking-tight">
                Choose Your Style
              </h2>
              <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-transparent via-amber-start to-transparent mx-auto mb-6 md:mb-8"></div>
              <p className="text-lg md:text-xl text-stone-700 font-light max-w-2xl mx-auto leading-relaxed">
                Beautiful templates designed for every type of restaurant
              </p>
            </motion.div>

            {/* Masonry Layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 lg:gap-10 space-y-6 md:space-y-8">
              {templates.map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="break-inside-avoid overflow-hidden border-2 border-stone-200 hover:shadow-2xl hover:shadow-amber-start/10 transition-all duration-300 group cursor-pointer hover:-translate-y-2 relative mb-6 md:mb-8 bg-white"
                  >
                    <div className={`h-56 md:h-64 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,184,0,0.1),transparent_70%)]"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                      <div className="text-center z-10">
                        <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2">{template.name}</h3>
                        <p className="text-sm md:text-base text-stone-600 font-medium">{template.category}</p>
                      </div>
                      {/* Preview Overlay */}
                      <div className="absolute inset-0 bg-charcoal/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <Button className="bg-gradient-to-r from-amber-start to-amber-end text-white hover:scale-105 active:scale-95 transition-transform shadow-lg">
                          Preview Template
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6 md:p-8">
                      <Button variant="outline" className="w-full border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-amber-start hover:shadow-md transition-all font-semibold">
                        Preview Template
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-24 lg:py-28 bg-gradient-to-b from-stone-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12 md:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-stone-900 mb-4 md:mb-6 tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-transparent via-amber-start to-transparent mx-auto mb-6 md:mb-8"></div>
              <p className="text-lg md:text-xl text-stone-700 font-light max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                Choose the plan that's right for your restaurant
              </p>
              {/* Toggle */}
              <div className="inline-flex items-center gap-3 p-1.5 bg-white border-2 border-stone-200 rounded-xl shadow-sm">
                <button 
                  onClick={() => setPricingPeriod("monthly")}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                    pricingPeriod === "monthly"
                      ? "bg-gradient-to-r from-amber-start to-amber-end text-white shadow-md"
                      : "text-stone-700 hover:text-stone-900"
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setPricingPeriod("yearly")}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    pricingPeriod === "yearly"
                      ? "bg-gradient-to-r from-amber-start to-amber-end text-white shadow-md"
                      : "text-stone-700 hover:text-stone-900"
                  }`}
                >
                  Yearly
                  <Badge className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Save 20%</Badge>
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => {
                const monthlyPrice = plan.price === "Custom" ? "Custom" : 
                  pricingPeriod === "yearly" && plan.price !== "Custom" 
                    ? `₹${Math.round(parseInt(plan.price.replace(/[₹,]/g, "")) * 0.8)}`
                    : plan.price
                const period = plan.price === "Custom" ? "" : pricingPeriod === "yearly" ? "/year" : plan.period
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className={`relative border-2 transition-all duration-300 bg-white h-full flex flex-col ${
                        plan.popular
                          ? "border-amber-start shadow-2xl shadow-amber-start/20 scale-105 hover:scale-[1.06] md:scale-110"
                          : "border-stone-200 hover:shadow-xl hover:border-amber-start/40 hover:-translate-y-2"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-amber-start to-amber-end text-white px-5 py-1.5 text-sm font-semibold shadow-lg">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="p-8 md:p-10 pb-6">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">{plan.name}</CardTitle>
                        <CardDescription className="text-stone-600 mb-6 text-base">{plan.description}</CardDescription>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl md:text-6xl font-bold text-stone-900">{monthlyPrice}</span>
                          {period && (
                            <span className="text-stone-600 font-medium text-lg">{period}</span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 md:p-10 pt-0 flex-1 flex flex-col">
                        <ul className="space-y-4 mb-8 flex-1">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-amber-start/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-4 w-4 text-amber-start" />
                              </div>
                              <span className="text-stone-700 font-medium text-base leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/auth/register" onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).gtag) {
                            (window as any).gtag('event', 'pricing_cta_click', { plan: plan.name })
                          }
                        }}>
                          <Button
                            className={`w-full py-6 text-base md:text-lg font-semibold ${
                              plan.popular
                                ? "bg-gradient-to-r from-amber-start to-amber-end text-white hover:from-amber-end hover:to-amber-start hover:scale-105 active:scale-95 shadow-lg"
                                : "border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-amber-start hover:shadow-md"
                            } transition-all`}
                            variant={plan.popular ? "default" : "outline"}
                            size="lg"
                          >
                            Get Started
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-24 lg:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12 md:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-stone-900 mb-4 md:mb-6 tracking-tight">
                How It Works
              </h2>
              <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-transparent via-amber-start to-transparent mx-auto mb-6 md:mb-8"></div>
              <p className="text-lg md:text-xl text-stone-700 font-light max-w-2xl mx-auto leading-relaxed">
                Get your restaurant online in four simple steps
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 relative">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-amber-start via-amber-end to-transparent -z-10" style={{ width: 'calc(100% - 4rem)' }}></div>
                    )}
                    <div className="text-center">
                      <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 rounded-full bg-gradient-to-br from-amber-start/15 to-stone-50 flex items-center justify-center border-2 border-amber-start/30 hover:scale-110 hover:shadow-lg transition-all duration-300 group">
                        <span className="text-4xl md:text-5xl font-bold text-amber-start group-hover:text-amber-end transition-colors">{step.number}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 md:mb-4">{step.title}</h3>
                      <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-24 lg:py-28 bg-gradient-to-b from-stone-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12 md:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-stone-900 mb-4 md:mb-6 tracking-tight">
                Loved by Restaurant Owners
              </h2>
              <div className="h-1 w-20 md:w-24 bg-gradient-to-r from-transparent via-amber-start to-transparent mx-auto mb-6 md:mb-8"></div>
              <p className="text-lg md:text-xl text-stone-700 font-light max-w-2xl mx-auto leading-relaxed">
                Join thousands of restaurants growing their business with crear
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto relative">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="min-w-full px-4 md:px-6">
                      <Card className="border-2 border-stone-200 hover:shadow-2xl hover:shadow-amber-start/10 transition-all duration-300 bg-white hover:-translate-y-2 group">
                        <CardContent className="p-8 md:p-10 lg:p-12">
                          <div className="flex items-center gap-1 mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 md:h-6 md:w-6 fill-amber-start text-amber-start" />
                            ))}
                          </div>
                          <p className="text-stone-700 mb-8 font-light leading-relaxed italic text-lg md:text-xl lg:text-2xl">
                            "{testimonial.quote}"
                          </p>
                          <div className="flex items-center gap-4 md:gap-5">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center overflow-hidden ring-2 ring-stone-200 shadow-md">
                              <Image
                                src={testimonial.image}
                                alt={`${testimonial.name} - ${testimonial.role}`}
                                width={64}
                                height={64}
                                className="rounded-full object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="font-bold text-stone-900 text-base md:text-lg">{testimonial.name}</p>
                              <p className="text-sm md:text-base text-stone-600 font-medium">{testimonial.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 md:p-4 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-start z-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-stone-700" />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 md:p-4 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-start z-10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-stone-700" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      testimonialIndex === index
                        ? "w-10 bg-gradient-to-r from-amber-start to-amber-end shadow-md"
                        : "w-2 bg-stone-300 hover:bg-stone-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-light text-stone-900 mb-4 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent mx-auto mb-6"></div>
                <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto mb-8">
                  Everything you need to know about crear. Can't find what you're looking for? <Link href="/contact" className="text-[#FFB800] hover:text-[#FF8A00] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">Contact us</Link>.
                </p>
                
                {/* Search Input */}
                <div className="max-w-md mx-auto relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] text-stone-700"
                    aria-label="Search frequently asked questions"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-stone-600">No FAQs found matching your search.</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq, index) => {
                    const originalIndex = faqs.indexOf(faq)
                    return (
                      <div
                        key={originalIndex}
                        className={`group bg-white border rounded-2xl transition-all duration-300 ease-out overflow-hidden ${
                          openFaq === originalIndex 
                            ? "border-[#FFB800] shadow-xl shadow-[#FFB800]/10 scale-[1.01]" 
                            : "border-stone-200 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-100/50"
                        }`}
                      >
                        <button
                          onClick={() => toggleFaq(originalIndex)}
                          className="w-full p-6 md:p-7 flex items-start justify-between text-left gap-4 hover:bg-gradient-to-r hover:from-[#FFB800]/5 hover:to-transparent transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:ring-offset-2 rounded-2xl"
                          aria-expanded={openFaq === originalIndex}
                          aria-controls={`faq-answer-${originalIndex}`}
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                              openFaq === originalIndex 
                                ? "bg-[#FFB800] text-white" 
                                : "bg-stone-100 text-stone-600 group-hover:bg-[#FFB800]/20 group-hover:text-[#FFB800]"
                            }`}>
                              <span className="text-xs font-bold">
                                {openFaq === originalIndex ? "−" : "+"}
                              </span>
                            </div>
                            <span className={`text-lg md:text-xl font-semibold pr-4 transition-colors duration-200 ${
                              openFaq === originalIndex ? "text-stone-900" : "text-stone-800 group-hover:text-stone-900"
                            }`}>
                              {faq.question}
                            </span>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 transition-all duration-300 mt-1 ${
                              openFaq === originalIndex 
                                ? "transform rotate-180 text-[#FFB800]" 
                                : "text-stone-400 group-hover:text-stone-600"
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          id={`faq-answer-${originalIndex}`}
                          className={`overflow-hidden transition-all duration-300 ease-out ${
                            openFaq === originalIndex ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                          role="region"
                          aria-labelledby={`faq-question-${originalIndex}`}
                        >
                          <div className="px-6 md:px-7 pb-6 md:pb-7 pl-16 md:pl-20">
                            <div className="h-px bg-gradient-to-r from-[#FFB800]/30 via-stone-200 to-transparent mb-5"></div>
                            <p className="text-base md:text-lg text-stone-700 font-light leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Additional Help CTA */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-sm text-stone-600 font-light">Still have questions?</span>
                  <Link href="/contact" className="text-sm font-semibold text-[#FFB800] hover:text-[#FF8A00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                    Get in touch →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-[#FFB800]/10 via-[#FFB800]/5 to-stone-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-display font-light text-stone-900 mb-6 tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-stone-700 mb-10 font-light">
                Join thousands of restaurants already using crear to grow their business
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/auth/register" onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'cta_section_click', { location: 'bottom_cta' })
                  }
                }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-start to-amber-end hover:from-amber-end hover:to-amber-start text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all px-8 py-6 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-start focus:ring-offset-2"
                  >
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-[#FFB800] px-8 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#111217] text-stone-100 py-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Image 
                    src="/creativitycoderLogo.svg" 
                    alt="Creativity Coder Solutions Logo" 
                    width={120} 
                    height={30} 
                    className="h-8 w-auto object-contain" 
                  />
                </div>
                <p className="text-stone-300 font-light leading-relaxed">
                  Premium restaurant website builder. Build beautiful websites, accept orders, and grow your business.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#features" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#templates" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#demo" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Demo
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/help" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-stone-400 hover:text-[#FFB800] transition-colors font-light focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-stone-700 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-stone-400 text-sm font-light">
                  &copy; {new Date().getFullYear()} Creativity Coder Solutions. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <Link href="#" className="text-stone-400 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded" aria-label="Twitter">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-stone-400 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded" aria-label="LinkedIn">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </Link>
                  <Link href="#" className="text-stone-400 hover:text-[#FFB800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded" aria-label="Facebook">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

