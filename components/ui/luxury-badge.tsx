import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface LuxuryBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "default"
  size?: "sm" | "md"
}

export const LuxuryBadge = forwardRef<HTMLSpanElement, LuxuryBadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-semibold uppercase tracking-wider rounded-full border"
    
    const variants = {
      default: "bg-gold-400/10 text-gold-600 dark:text-gold-400 border-gold-400/20",
      success: "bg-emerald/10 text-emerald border-emerald/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      error: "bg-error/10 text-error border-error/20",
      info: "bg-info/10 text-info border-info/20",
    }
    
    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-xs",
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

LuxuryBadge.displayName = "LuxuryBadge"

