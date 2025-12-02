"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

export const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-gradient-to-b from-gold-400 to-gold-500 text-black-300 shadow-gold-sm hover:shadow-gold-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-gold-400",
      secondary: "bg-black-300 text-gold-400 border border-gold-400/40 hover:bg-black-200 hover:border-gold-400/60 focus:ring-gold-400",
      ghost: "bg-transparent text-current hover:bg-champagne-300/20 dark:hover:bg-graphite-400/20 focus:ring-gold-400",
      destructive: "bg-error text-white hover:bg-error-dark focus:ring-error",
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

LuxuryButton.displayName = "LuxuryButton"

