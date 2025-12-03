"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Monitor
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
      rating: 5,
      quote: "crear transformed our restaurant's online presence. Orders increased by 300% in the first month.",
    },
    {
      name: "Priya Sharma",
      role: "Manager, The Coffee House",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 5,
      quote: "The website builder is incredibly easy to use. We had our site live in under an hour.",
    },
    {
      name: "Amit Patel",
      role: "Founder, Fine Dining Co.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
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

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1A1A1A] }`}
      >
        <nav className="container mx-auto px-4 md:px-6 lg:px-8 py-4 ">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
             
                <Image src="/creativitycoderLogo.svg" priority loading="eager" alt="logo" width={40} height={40} className="w-32 object-contain text-black rounded-lg p-2 " />

            
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-stone-300 hover:text-amber-600 transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-sm font-medium text-stone-300 hover:text-amber-600 transition-colors">
                Templates
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-stone-300 hover:text-amber-600 transition-colors">
                Pricing
              </Link>
              <Link href="#demo" className="text-sm font-medium text-stone-300 hover:text-amber-600 transition-colors">
                Demo
              </Link>
              <Link href="/auth/login" className="text-sm font-medium text-stone-300 hover:text-amber-600 transition-colors">
                Login
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/register">
                <Button
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-stone-900" />
              ) : (
                <Menu className="h-6 w-6 text-stone-900" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-stone-100">
              <div className="flex flex-col gap-4 pt-4">
                <Link href="#features" className="text-sm font-medium text-stone-700">Features</Link>
                <Link href="#templates" className="text-sm font-medium text-stone-700">Templates</Link>
                <Link href="#pricing" className="text-sm font-medium text-stone-700">Pricing</Link>
                <Link href="#demo" className="text-sm font-medium text-stone-700">Demo</Link>
                <Link href="/auth/login" className="text-sm font-medium text-stone-700">Login</Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-stone-50 via-white to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-50 text-amber-700 border-amber-200 px-4 py-1.5">
              <Sparkles className="h-3 w-3 mr-2" />
              Premium Restaurant Website Builder
            </Badge>
            <h1 className="text-5xl md:text-7xl font-light text-stone-900 mb-6 tracking-tight leading-tight">
              Create Your Restaurant
              <br />
              <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent font-semibold">
                Website in Minutes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-700 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
              Build beautiful, professional restaurant websites with online ordering, menu management, table booking, and more. No coding required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all px-8 py-6 text-lg"
                >
                  Create Your Restaurant Website
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400 px-8 py-6 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-stone-600">
              <span className="font-medium text-stone-700">14-day free trial</span> • No credit card required • Cancel anytime
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white group hover:shadow-amber-100/50 transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-stone-50 via-white to-amber-50/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"></div>
                <div className="text-center relative z-10">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Monitor className="h-16 w-16 text-amber-600" />
                  </div>
                  <p className="text-stone-600 text-sm font-medium">Website Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
              Everything You Need
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto">
              All-in-one platform to manage your restaurant's digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-stone-200 hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-300 hover:border-amber-300 hover:-translate-y-1 group bg-white"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-50/50 to-stone-50 flex items-center justify-center mb-6 group-hover:from-amber-100 group-hover:via-amber-50 group-hover:to-amber-50 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <feature.icon className="h-8 w-8 text-amber-600 group-hover:text-amber-700 transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3 group-hover:text-amber-700 transition-colors">{feature.title}</h3>
                  <p className="text-stone-700 font-light leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
                Beautiful Websites, Effortlessly
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto">
                See how your restaurant website will look on desktop and mobile
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Desktop Mockup */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
                  <div className="bg-stone-900 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-stone-100 to-white flex items-center justify-center">
                    <Monitor className="h-16 w-16 text-stone-300" />
                  </div>
                </div>
              </div>

              {/* Mobile Mockup */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-stone-900 max-w-xs mx-auto">
                  <div className="bg-stone-900 h-8 flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-stone-700"></div>
                  </div>
                  <div className="aspect-[9/16] bg-gradient-to-br from-stone-100 to-white flex items-center justify-center">
                    <Smartphone className="h-12 w-12 text-stone-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
              Choose Your Style
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto">
              Beautiful templates designed for every type of restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="overflow-hidden border-stone-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                  <div className="text-center z-10">
                    <h3 className="text-xl font-semibold text-stone-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-stone-600">{template.category}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400">
                    Preview Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto mb-8">
              Choose the plan that's right for your restaurant
            </p>
            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 bg-stone-100 rounded-lg">
              <button className="px-4 py-2 rounded-md bg-white text-stone-900 font-medium shadow-sm">
                Monthly
              </button>
              <button className="px-4 py-2 rounded-md text-stone-700 font-medium">
                Yearly
                <Badge className="ml-2 bg-amber-600 text-white text-xs">Save 20%</Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 bg-white ${
                  plan.popular
                    ? "border-amber-500 shadow-2xl shadow-amber-100/50 scale-105 hover:scale-[1.06]"
                    : "border-stone-200 hover:shadow-xl hover:border-amber-200 hover:-translate-y-1"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="p-8 pb-6">
                  <CardTitle className="text-2xl font-semibold text-stone-900 mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-stone-600 mb-4">{plan.description}</CardDescription>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-light text-stone-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-stone-600 font-light">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-amber-600" />
                        </div>
                        <span className="text-stone-700 font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto">
              Get your restaurant online in four simple steps
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-amber-300 to-transparent -z-10"></div>
                  )}
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-50 to-stone-50 flex items-center justify-center border-2 border-amber-200">
                      <span className="text-3xl font-light text-amber-600">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-3">{step.title}</h3>
                    <p className="text-stone-600 font-light leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
                Loved by Restaurant Owners
              </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto">
              Join thousands of restaurants growing their business with crear
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-stone-200 hover:shadow-2xl hover:shadow-amber-100/30 transition-all duration-300 bg-white hover:-translate-y-1 group">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-stone-600 mb-6 font-light leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{testimonial.name}</p>
                      <p className="text-sm text-stone-600 font-light">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-stone-700 font-light max-w-2xl mx-auto">
                Everything you need to know about crear. Can't find what you're looking for? <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">Contact us</Link>.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`group bg-white border rounded-2xl transition-all duration-300 ease-out overflow-hidden ${
                    openFaq === index 
                      ? "border-amber-300 shadow-xl shadow-amber-100/50 scale-[1.01]" 
                      : "border-stone-200 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-100/50"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 md:p-7 flex items-start justify-between text-left gap-4 hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent transition-all duration-200 group"
                    aria-expanded={openFaq === index}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        openFaq === index 
                          ? "bg-amber-500 text-white" 
                          : "bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-600"
                      }`}>
                        <span className="text-xs font-bold">
                          {openFaq === index ? "−" : "+"}
                        </span>
                      </div>
                      <span className={`text-lg md:text-xl font-semibold pr-4 transition-colors duration-200 ${
                        openFaq === index ? "text-stone-900" : "text-stone-800 group-hover:text-stone-900"
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-all duration-300 mt-1 ${
                        openFaq === index 
                          ? "transform rotate-180 text-amber-600" 
                          : "text-stone-400 group-hover:text-stone-600"
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 md:px-7 pb-6 md:pb-7 pl-16 md:pl-20">
                      <div className="h-px bg-gradient-to-r from-amber-200 via-stone-200 to-transparent mb-5"></div>
                      <p className="text-base md:text-lg text-stone-700 font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Help CTA */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                <span className="text-sm text-stone-600 font-light">Still have questions?</span>
                <Link href="/contact" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                  Get in touch →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-amber-50/50 to-stone-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light text-stone-300 mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-stone-700 mb-10 font-light">
              Join thousands of restaurants already using crear to grow their business
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transition-all px-8 py-6 text-lg"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400 px-8 py-6 text-lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-stone-100 py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">crear</span>
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
                  <Link href="#features" className="text-stone-400 hover:text-white transition-colors font-light">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="text-stone-400 hover:text-white transition-colors font-light">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-stone-400 hover:text-white transition-colors font-light">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="text-stone-400 hover:text-white transition-colors font-light">
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
                  <Link href="/about" className="text-stone-400 hover:text-white transition-colors font-light">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-stone-400 hover:text-white transition-colors font-light">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-stone-400 hover:text-white transition-colors font-light">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-stone-400 hover:text-white transition-colors font-light">
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
                  <Link href="/help" className="text-stone-400 hover:text-white transition-colors font-light">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-stone-400 hover:text-white transition-colors font-light">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-stone-400 hover:text-white transition-colors font-light">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-stone-400 hover:text-white transition-colors font-light">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-stone-400 text-sm font-light">
                &copy; {new Date().getFullYear()} crear. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-stone-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-stone-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link href="#" className="text-stone-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

