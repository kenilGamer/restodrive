import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  UtensilsCrossed, 
  QrCode, 
  ShoppingCart, 
  Calendar, 
  BarChart3,
  Sparkles,
  Check,
  Star,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Globe
} from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const features = [
    {
      name: "Digital Menu Builder",
      description: "Create stunning, professional menus with intuitive drag-and-drop tools. Update prices and items instantly.",
      icon: UtensilsCrossed,
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      name: "QR Code Menus",
      description: "Generate beautiful, branded QR codes for contactless dining. Track scans and customer engagement.",
      icon: QrCode,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      name: "Online Ordering",
      description: "Accept orders seamlessly with real-time notifications. Manage delivery and pickup with ease.",
      icon: ShoppingCart,
      gradient: "from-emerald-400 to-cyan-500",
    },
    {
      name: "Table Bookings",
      description: "Streamline reservations with automated confirmations and reminders. Reduce no-shows significantly.",
      icon: Calendar,
      gradient: "from-violet-400 to-purple-500",
    },
    {
      name: "Business Analytics",
      description: "Gain insights into sales trends, popular items, and customer behavior with beautiful dashboards.",
      icon: BarChart3,
      gradient: "from-orange-400 to-red-500",
    },
  ]

  const stats = [
    { value: "1,000+", label: "Restaurants", icon: Globe },
    { value: "50K+", label: "Orders Daily", icon: TrendingUp },
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "4.9/5", label: "Rating", icon: Star },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Owner, The Golden Spoon",
      content: "RestoDrive transformed our restaurant operations. Our customers love the QR menus, and we've seen a 40% increase in online orders.",
      rating: 5,
      accent: "cyan",
    },
    {
      name: "Marcus Rodriguez",
      role: "Manager, Bella Vista",
      content: "The analytics dashboard is a game-changer. We can now make data-driven decisions about our menu and pricing.",
      rating: 5,
      accent: "purple",
    },
    {
      name: "Emily Watson",
      role: "Chef & Owner, Artisan Kitchen",
      content: "Setting up was incredibly easy. Within an hour, we had our menu live and were accepting orders. Simply brilliant.",
      rating: 5,
      accent: "pink",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      {/* Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur-md opacity-50"></div>
                <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                RestoDrive
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative pt-40 pb-32 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-sm mb-8 group hover:border-cyan-400/50 transition-all">
              <Zap className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-cyan-300">Trusted by 1,000+ restaurants worldwide</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-orbitron font-black leading-tight mb-8">
              <span className="block text-white">Elevate Your</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Restaurant Empire
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
              The all-in-one platform that transforms how you manage menus, orders, bookings, and insights. 
              <span className="text-cyan-400"> Experience the future</span> of restaurant management.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth/register">
                <Button 
                  size="lg" 
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 px-10 py-7 text-lg font-semibold shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/20 hover:border-cyan-500/50 hover:text-cyan-400 px-10 py-7 text-lg font-semibold bg-black/50 backdrop-blur-sm transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-400" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-8 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all">
                  <stat.icon className="h-8 w-8 text-cyan-400" />
                </div>
                <div className="text-4xl md:text-5xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-32 px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-orbitron font-black text-white mb-6">
              Everything You Need,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nothing You Don't
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Powerful features designed to simplify your operations and delight your customers
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="group relative bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                {/* Glowing Edge Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-32 px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-orbitron font-black text-white mb-6">
              Built for
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Scale</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Enterprise-grade infrastructure meets intuitive design
            </p>
          </div>
          
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>
            <div className="relative grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-orbitron font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  99.9%
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-orbitron font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  &lt; 100ms
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-orbitron font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  24/7
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-orbitron font-black text-white mb-6">
              Loved by Restaurant
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Owners</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Join thousands of restaurants already transforming their operations
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 group"
              >
                {testimonial.accent === "cyan" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                {testimonial.accent === "purple" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                {testimonial.accent === "pink" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                
                <div className="relative">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-cyan-400 text-cyan-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-white font-orbitron">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-40 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[150px]"></div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-black text-white mb-8">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Restaurant?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            Join the future of restaurant management. Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 px-12 py-8 text-lg font-semibold shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_rgba(6,182,212,0.7)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/20 hover:border-cyan-500/50 hover:text-cyan-400 px-12 py-8 text-lg font-semibold bg-black/50 backdrop-blur-sm transition-all"
              >
                Sign In to Account
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            No credit card required • Cancel anytime • 14-day free trial
          </p>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-black/50 backdrop-blur-xl py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur-md opacity-50"></div>
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                RestoDrive
              </span>
            </div>
            <div className="text-center md:text-right text-sm text-gray-500">
              <p>&copy; 2024 RestoDrive. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
