"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Menu as MenuIcon, ShoppingCart, Calendar, Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface RestaurantWebsiteProps {
  restaurant: {
    id: string
    name: string
    slug: string
    description: string | null
    logo: string | null
    coverImage: string | null
    phone: string | null
    email: string | null
    website: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
    cuisineType: string[]
    priceRange: string
    openingHours: any
    primaryColor: string | null
    secondaryColor: string | null
    menus: Array<{
      id: string
      name: string
      categories: Array<{
        id: string
        name: string
        items: Array<{
          id: string
          name: string
          description: string | null
          price: number
          image: string[]
        }>
      }>
    }>
    branches?: Array<{
      id: string
      name: string
      address: string | null
      phone: string | null
    }>
  }
}

export function RestaurantWebsite({ restaurant }: RestaurantWebsiteProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const primaryColor = restaurant.primaryColor || "#DC2626"
  const secondaryColor = restaurant.secondaryColor || "#F97316"
  const menu = restaurant.menus[0]

  const formatOpeningHours = (hours: any) => {
    if (!hours || typeof hours !== "object") return null
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    return days.map((day) => {
      const dayHours = hours[day]
      if (dayHours && dayHours.open && dayHours.close) {
        return {
          day: day.charAt(0).toUpperCase() + day.slice(1),
          hours: `${dayHours.open} - ${dayHours.close}`,
        }
      }
      return { day: day.charAt(0).toUpperCase() + day.slice(1), hours: "Closed" }
    })
  }

  const openingHours = formatOpeningHours(restaurant.openingHours)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-stone-100"
            : "bg-white/95 backdrop-blur-sm border-b border-stone-100/50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {restaurant.logo && (
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  width={44}
                  height={44}
                  className="rounded-full object-cover ring-2 ring-stone-100"
                />
              )}
              <span className="text-xl font-semibold text-stone-800 tracking-tight">
                {restaurant.name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => {
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-sm font-medium text-stone-600 hover:text-stone-300 transition-colors"
              >
                Menu
              </button>
              <button
                onClick={() => {
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-sm font-medium text-stone-600 hover:text-stone-300 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-sm font-medium text-stone-600 hover:text-stone-300 transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/order/${restaurant.slug}`}>
                <Button
                  style={{ backgroundColor: primaryColor }}
                  className="text-white hover:opacity-90 transition-opacity shadow-sm"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order
                </Button>
              </Link>
              <Link href={`/qr/${restaurant.slug}`}>
                <Button variant="outline" size="sm" className="border-stone-200 hover:bg-stone-50">
                  <MenuIcon className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {restaurant.coverImage ? (
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight leading-tight">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="text-xl md:text-2xl font-light mb-8 text-stone-100 leading-relaxed max-w-2xl mx-auto">
              {restaurant.description}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {restaurant.cuisineType.map((cuisine) => (
              <Badge
                key={cuisine}
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-1.5 font-normal"
              >
                {cuisine}
              </Badge>
            ))}
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-1.5 font-normal capitalize">
              {restaurant.priceRange}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href={`/order/${restaurant.slug}`}>
              <Button
                size="lg"
                style={{ backgroundColor: secondaryColor }}
                className="text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Online
              </Button>
            </Link>
            <Link href={`/order/${restaurant.slug}?action=book`}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 px-8 py-6 text-base"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book a Table
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/80" />
        </div>
      </section>

      {/* Menu Preview Section */}
      {menu && menu.categories.length > 0 && (
        <section id="menu" className="py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-stone-800 mb-4 tracking-tight">
                Our Menu
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto font-light">
                Discover our delicious selection of dishes crafted with care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {menu.categories
                .filter((category) => category.items && category.items.length > 0)
                .slice(0, 3)
                .flatMap((category) =>
                  category.items.slice(0, 2).map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-stone-100 group"
                    >
                      {item.image && item.image.length > 0 && (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={item.image[0]}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-2 text-stone-800">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-stone-600 mb-4 line-clamp-2 font-light leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span
                            className="font-semibold text-lg"
                            style={{ color: primaryColor }}
                          >
                            {formatCurrency(item.price)}
                          </span>
                          <Link href={`/order/${restaurant.slug}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-stone-200 hover:bg-stone-50"
                            >
                              Add to Cart
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
            </div>

            <div className="text-center">
              <Link href={`/qr/${restaurant.slug}`}>
                <Button
                  size="lg"
                  style={{ backgroundColor: primaryColor }}
                  className="text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all px-8"
                >
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-stone-800 mb-4 tracking-tight">
                About {restaurant.name}
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mb-6"></div>
              {restaurant.description && (
                <p className="text-lg text-stone-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
                  {restaurant.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurant.cuisineType.length > 0 && (
                <Card className="border-stone-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                      <Star className="h-8 w-8 text-stone-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-stone-800">Cuisine</h3>
                    <p className="text-stone-600 font-light">{restaurant.cuisineType.join(", ")}</p>
                  </CardContent>
                </Card>
              )}
              <Card className="border-stone-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                    <Star className="h-8 w-8 text-stone-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-stone-800">Price Range</h3>
                  <p className="text-stone-600 font-light capitalize">{restaurant.priceRange}</p>
                </CardContent>
              </Card>
              {openingHours && (
                <Card className="border-stone-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-stone-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-stone-800">Opening Hours</h3>
                    <p className="text-sm text-stone-600 font-light">
                      {openingHours.find((h) => h.hours !== "Closed")?.hours || "Check hours"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-stone-800 mb-4 tracking-tight">
                Visit Us
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-stone-300 to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-stone-600 font-light">We'd love to hear from you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <Card className="border-stone-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-8 text-stone-800">Contact Information</h3>
                  <div className="space-y-6">
                    {restaurant.address && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 mb-1">Address</p>
                          <p className="text-stone-600 font-light leading-relaxed">
                            {restaurant.address}
                            {restaurant.city && `, ${restaurant.city}`}
                            {restaurant.state && `, ${restaurant.state}`}
                            {restaurant.zipCode && ` ${restaurant.zipCode}`}
                          </p>
                        </div>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                          <Phone className="h-5 w-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 mb-1">Phone</p>
                          <a
                            href={`tel:${restaurant.phone}`}
                            className="text-stone-600 hover:text-stone-800 transition-colors font-light"
                          >
                            {restaurant.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {restaurant.email && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                          <Mail className="h-5 w-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 mb-1">Email</p>
                          <a
                            href={`mailto:${restaurant.email}`}
                            className="text-stone-600 hover:text-stone-800 transition-colors font-light"
                          >
                            {restaurant.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {openingHours && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5" style={{ color: primaryColor }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-800 mb-3">Opening Hours</p>
                          <div className="text-sm text-stone-600 space-y-2 font-light">
                            {openingHours.map((hours) => (
                              <div key={hours.day} className="flex justify-between gap-4">
                                <span>{hours.day}</span>
                                <span className="font-medium">{hours.hours}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-stone-100 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-8 text-stone-800">Quick Actions</h3>
                  <div className="space-y-4">
                    <Link href={`/order/${restaurant.slug}`} className="block">
                      <Button
                        className="w-full text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all"
                        size="lg"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Order Online
                      </Button>
                    </Link>
                    <Link href={`/qr/${restaurant.slug}`} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-stone-200 hover:bg-stone-50"
                        size="lg"
                      >
                        <MenuIcon className="h-5 w-5 mr-2" />
                        View Digital Menu
                      </Button>
                    </Link>
                    <Link href={`/order/${restaurant.slug}?action=book`} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-stone-200 hover:bg-stone-50"
                        size="lg"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Book a Table
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-100 py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">{restaurant.name}</h3>
              {restaurant.description && (
                <p className="text-stone-400 font-light leading-relaxed">{restaurant.description}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/r/${restaurant.slug}#menu`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/r/${restaurant.slug}#about`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/r/${restaurant.slug}#contact`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Order & Book</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/order/${restaurant.slug}`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    Order Online
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/qr/${restaurant.slug}`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    View Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/order/${restaurant.slug}?action=book`}
                    className="text-stone-400 hover:text-white transition-colors font-light"
                  >
                    Book Table
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-500 text-sm font-light">
              &copy; {new Date().getFullYear()} {restaurant.name}. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-stone-600 font-light">
              Powered by <span className="font-medium text-stone-500">RestoDrive</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
