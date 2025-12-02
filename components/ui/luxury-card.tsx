import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface LuxuryCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined"
  hover?: boolean
}

export const LuxuryCard = forwardRef<HTMLDivElement, LuxuryCardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const baseStyles = "rounded-xl transition-all duration-300 ease-out"
    
    const variants = {
      default: "bg-champagne-300 dark:bg-black-300 border border-gold-400/20",
      elevated: "bg-white dark:bg-graphite-400 shadow-lg dark:shadow-dark-lg border border-gold-400/10",
      outlined: "bg-transparent border-2 border-gold-400/30",
    }
    
    const hoverStyles = hover 
      ? "hover:-translate-y-1 hover:shadow-gold-md dark:hover:shadow-dark-xl"
      : ""

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

LuxuryCard.displayName = "LuxuryCard"

