"use client"

/**
 * HeroDeviceShowcase Component
 * 
 * A premium device mockup showcase with background hero image, 3D device mockups,
 * and floating feature cards. Fully accessible, performant, and responsive.
 */

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface DeviceImage {
  src: string
  alt: string
  priority?: boolean
}

export interface FeatureCard {
  id: string
  title: string
  subtitle: string
  image?: string
  badge?: string
}

export interface ThemeTokens {
  colors: {
    amberStart: string
    amberEnd: string
    cardBg: string
    uiBorder: string
  }
}

export interface HeroDeviceShowcaseProps {
  images: {
    hero: DeviceImage
    tablet?: DeviceImage
    phone?: DeviceImage
    featureCards?: FeatureCard[]
  }
  reducedMotion?: boolean
  themeTokens?: Partial<ThemeTokens>
  className?: string
}

interface TransformConfig {
  x?: number
  y?: number
  rotateX?: number
  rotateY?: number
  scale?: number
}

interface BackgroundHeroProps {
  image: DeviceImage
  className?: string
}

interface DeviceMockupProps {
  type: "desktop" | "tablet" | "mobile"
  image: DeviceImage
  reducedMotion: boolean
  delay: number
  className?: string
  initialTransform?: TransformConfig
  animateTransform?: TransformConfig
  hoverTransform?: TransformConfig
}

interface FeatureCardProps {
  card: FeatureCard
  reducedMotion: boolean
  delay: number
  themeTokens: ThemeTokens
  isMobile?: boolean
  index?: number
  isLowPerformance?: boolean
}

// ============================================================================
// Default Values
// ============================================================================

const defaultThemeTokens: ThemeTokens = {
  colors: {
    amberStart: "#FFB800",
    amberEnd: "#FF8A00",
    cardBg: "rgba(255, 255, 255, 0.9)",
    uiBorder: "rgba(231, 229, 228, 0.5)",
  },
}

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * BackgroundHero - Background image layer with blur and desaturation
 */
function BackgroundHero({ image, className = "" }: BackgroundHeroProps) {
  if (!image?.src) return null

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Image
        src={image.src}
        alt={image.alt || "Hero background"}
        fill
        className="object-cover"
        priority={image.priority}
        loading={image.priority ? undefined : "lazy"}
        sizes="100vw"
        style={{
          filter: "saturate(0.7) blur(20px)",
          transform: "scale(1.1)",
          willChange: "auto",
        }}
      />
      {/* Overlay for better card readability - More opaque on LG */}
      <div className="absolute inset-0 bg-white/40 lg:bg-white/50" />
    </div>
  )
}

/**
 * DeviceMockup - Reusable device wrapper component
 */
function DeviceMockup({
  type = "desktop",
  image,
  reducedMotion = false,
  delay = 0,
  className = "",
  initialTransform = {},
  animateTransform = {},
  hoverTransform = {},
}: DeviceMockupProps) {
  const isMobile = type === "mobile"
  const isTablet = type === "tablet"
  const isDesktop = type === "desktop"

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ 
        transformStyle: "preserve-3d",
        willChange: reducedMotion ? "auto" : "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      initial={{
        opacity: 0,
        y: initialTransform.y ?? 60,
        x: initialTransform.x ?? 0,
        rotateX: reducedMotion ? 0 : (initialTransform.rotateX ?? 0),
        rotateY: reducedMotion ? 0 : (initialTransform.rotateY ?? 0),
        scale: initialTransform.scale ?? 0.9,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
        rotateX: reducedMotion ? 0 : (animateTransform.rotateX ?? 0),
        rotateY: reducedMotion ? 0 : (animateTransform.rotateY ?? 0),
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        !reducedMotion && Object.keys(hoverTransform).length > 0
          ? {
              ...hoverTransform,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      aria-label={`${type} website preview`}
      role="img"
    >
      <div
        className={`relative overflow-hidden border border-stone-200 bg-white ${
          isMobile ? "rounded-[2rem]" : isTablet ? "rounded-xl lg:rounded-2xl" : "rounded-lg md:rounded-xl lg:rounded-2xl"
        } lg:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08)]`}
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
          contain: "layout style paint",
        }}
      >
        {/* Browser Chrome (Desktop) or Notch (Mobile) */}
        {isDesktop ? (
          <div
            className="bg-stone-100 px-3 md:px-4 lg:px-5 py-2 md:py-3 lg:py-4 flex items-center gap-2 lg:gap-3 border-b border-stone-200"
            aria-hidden="true"
          >
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-green-500" />
          </div>
        ) : isMobile ? (
          <div className="bg-white h-6 lg:h-7 flex items-center justify-center relative" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 lg:w-20 h-5 lg:h-6 bg-stone-200 rounded-b-2xl" />
          </div>
        ) : null}

        {/* Screen Content */}
        <div
          className={`bg-gradient-to-br from-stone-50 via-white to-stone-50 relative overflow-hidden ${
            isMobile ? "aspect-[9/16]" : isTablet ? "aspect-[4/3]" : "aspect-video"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt || `${type} mockup`}
            fill
            className="object-cover"
            loading="lazy"
            sizes={
              isMobile ? "(max-width: 768px) 100vw, 192px" : isTablet ? "(max-width: 1024px) 100vw, 320px" : "100vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/12" />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * FeatureCard - Floating feature card component (keyboard accessible)
 */
function FeatureCardComponent({
  card,
  reducedMotion = false,
  delay = 0,
  themeTokens = defaultThemeTokens,
  isMobile = false,
  index = 0,
  isLowPerformance = false,
}: FeatureCardProps) {
  const { title, subtitle, image, badge } = card
  const { amberStart, amberEnd, cardBg, uiBorder } = themeTokens.colors

  // Floating animation (disabled when reducedMotion or low performance)
  // Reduce animation amplitude and duration for better performance
  const shouldAnimate = !reducedMotion && !isLowPerformance
  const animationAmplitude = isLowPerformance ? 3 : 6
  const animationDuration = isLowPerformance ? 8 : 6
  
  const floatingAnimation = shouldAnimate
    ? {
        opacity: 1,
        y: [-animationAmplitude, 0, -animationAmplitude],
        scale: 1,
        rotateY: [0, -1, 0],
      }
    : { opacity: 1, y: 0, scale: 1, rotateY: 0 }

  const floatingTransition = shouldAnimate
    ? {
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: {
          duration: animationDuration,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
        rotateY: {
          duration: animationDuration,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
          delay: 0.2,
        },
      }
    : {
        opacity: { duration: 0.6, delay },
        y: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        rotateY: { duration: 0.6, delay },
      }

  // Position classes for desktop (mobile uses grid) - Better spacing on LG
  const positionClasses = isMobile
    ? ""
    : [
        "absolute",
        index === 0 && "left-[4%] lg:left-[3%] top-[8%] lg:top-[6%]",
        index === 1 && "right-[4%] lg:right-[3%] top-[12%] lg:top-[10%]",
        index === 2 && "left-[12%] lg:left-[10%] bottom-[12%] lg:bottom-[10%]",
        index === 3 && "right-[12%] lg:right-[10%] bottom-[8%] lg:bottom-[6%]",
      ]
        .filter(Boolean)
        .join(" ")

  return (
    <motion.div
      className={`${positionClasses} ${isMobile ? "" : "w-48 md:w-56 lg:w-72 xl:w-80"} pointer-events-auto focus:outline-none focus:ring-2 focus:ring-offset-2`}
      style={{
        ...(isMobile ? {} : { transformStyle: "preserve-3d" }),
        "--tw-ring-color": amberStart,
        willChange: shouldAnimate ? "transform" : "auto",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={floatingAnimation}
      transition={floatingTransition}
      whileHover={
        shouldAnimate
          ? {
              scale: 1.04,
              y: -6,
              rotateY: index % 2 === 0 ? -6 : 6,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      role="article"
      aria-label={`${title} feature`}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          e.currentTarget.click()
        }
      }}
    >
      <div
        className={`relative overflow-hidden rounded-lgcard ${reducedMotion ? 'backdrop-blur-sm' : 'backdrop-blur-md lg:backdrop-blur-lg'} lg:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.6)]`}
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${uiBorder}`,
          boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)",
          willChange: reducedMotion ? 'auto' : 'transform',
          contain: 'layout style paint',
        }}
      >
        {/* Image */}
        {image && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={image}
              alt={`${title} - ${subtitle}`}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 288px, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            {badge && (
              <div
                className="absolute top-3 lg:top-4 right-3 lg:right-4 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r rounded-lg lg:rounded-xl shadow-sm lg:shadow-md"
                style={{
                  backgroundImage: `linear-gradient(to right, ${amberStart}, ${amberEnd})`,
                }}
              >
                <span className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-wide">{badge}</span>
              </div>
            )}
          </div>
        )}

        {/* Content - Larger padding and text on LG */}
        <div className={`${image ? "p-4 lg:p-5 xl:p-6" : "p-5 lg:p-6 xl:p-7"} bg-gradient-to-b from-white/98 to-white/95`}>
          <h3 className={`font-bold text-stone-900 mb-1 lg:mb-1.5 ${isMobile ? "text-xs" : "text-sm lg:text-base xl:text-lg"}`}>{title}</h3>
          <p className={`text-stone-600 leading-relaxed ${isMobile ? "text-[10px]" : "text-xs lg:text-sm xl:text-base"}`}>{subtitle}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function HeroDeviceShowcase({
  images,
  reducedMotion: forcedReducedMotion,
  themeTokens: customThemeTokens,
  className = "",
}: HeroDeviceShowcaseProps) {
  const themeTokens: ThemeTokens = {
    colors: {
      ...defaultThemeTokens.colors,
      ...customThemeTokens?.colors,
    },
  }

  const [reducedMotion, setReducedMotion] = useState(forcedReducedMotion ?? false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  // Detect prefers-reduced-motion and device performance
  useEffect(() => {
    if (forcedReducedMotion !== undefined) {
      setReducedMotion(forcedReducedMotion)
      return
    }

    if (typeof window === "undefined") return

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleChange)

    // Detect low-end devices (hardware concurrency, device memory)
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    const deviceMemory = (navigator as any).deviceMemory || 4
    const isLowEnd = hardwareConcurrency < 4 || deviceMemory < 4
    
    // Check for slow connection
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
    
    setIsLowPerformance(isLowEnd || isSlowConnection || false)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [forcedReducedMotion])

  // Limit cards: Reduce on low-performance devices
  const maxCards = isLowPerformance ? 2 : 4
  const desktopCards = images.featureCards?.slice(0, maxCards) || []
  const mobileCards = images.featureCards?.slice(0, 2) || []

  // Animation delays (staggered)
  const getCardDelay = (index: number) => 0.6 + index * 0.08

  // Use reduced motion if low performance
  const effectiveReducedMotion = reducedMotion || isLowPerformance

  return (
    <div className={`mt-12 md:mt-20 lg:mt-24 max-w-7xl lg:max-w-[90rem] xl:max-w-[100rem] mx-auto relative ${className}`} role="region" aria-label="Device showcase">
      {/* Background Hero Image - More subtle on LG for better clarity */}
      <BackgroundHero image={images.hero} className="-z-10 lg:opacity-90" />

      {/* Device Mockups Container */}
      <div
        className="relative h-[400px] sm:h-[500px] md:h-[700px] lg:h-[900px] xl:h-[1000px]"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Desktop Mockup - Centered, Larger on LG */}
        <DeviceMockup
          type="desktop"
          image={images.hero}
          reducedMotion={effectiveReducedMotion}
          delay={0.6}
          className="left-1/2 -translate-x-1/2 top-0 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl z-10"
          initialTransform={{ y: 60, rotateX: 15 }}
          animateTransform={{ rotateX: 6 }}
          hoverTransform={{ rotateY: 6, rotateX: 4, scale: 1.02, y: -8 }}
        />

        {/* Tablet Mockup - Left Side, Better Positioned on LG */}
        {images.tablet && (
          <DeviceMockup
            type="tablet"
            image={images.tablet}
            reducedMotion={effectiveReducedMotion}
            delay={0.68}
            className="hidden md:block left-[6%] lg:left-[4%] top-[16%] lg:top-[14%] w-64 lg:w-80 xl:w-96 z-20"
            initialTransform={{ x: -60, rotateY: -25, rotateX: 8, scale: 0.9 }}
            animateTransform={{ rotateY: -12, rotateX: 4 }}
            hoverTransform={{ rotateY: -15, rotateX: 6, scale: 1.05, x: -4 }}
          />
        )}

        {/* Phone Mockup - Right Side, Better Positioned on LG */}
        {images.phone && (
          <DeviceMockup
            type="mobile"
            image={images.phone}
            reducedMotion={effectiveReducedMotion}
            delay={0.76}
            className="hidden md:block right-[6%] lg:right-[4%] top-[26%] lg:top-[24%] w-48 lg:w-56 xl:w-64 z-20"
            initialTransform={{ x: 60, rotateY: 25, rotateX: -8, scale: 0.9 }}
            animateTransform={{ rotateY: 12, rotateX: -4 }}
            hoverTransform={{ rotateY: 15, rotateX: -6, scale: 1.05, x: 4 }}
          />
        )}
      </div>

      {/* Floating Cards - Desktop (3-4 cards) - Enhanced spacing on LG */}
      {desktopCards.length > 0 && (
        <div className="hidden md:block absolute inset-0 pointer-events-none z-30 lg:px-8 xl:px-12">
          {desktopCards.map((card, index) => (
            <FeatureCardComponent
              key={card.id || `card-${index}`}
              card={card}
              reducedMotion={effectiveReducedMotion}
              delay={getCardDelay(index)}
              themeTokens={themeTokens}
              index={index}
              isLowPerformance={isLowPerformance}
            />
          ))}
        </div>
      )}

      {/* Mobile Grid - Mobile Only (1-2 cards) */}
      {mobileCards.length > 0 && (
        <div className="md:hidden mt-8 grid grid-cols-2 gap-4">
          {mobileCards.map((card, index) => (
            <FeatureCardComponent
              key={card.id || `card-${index}`}
              card={card}
              reducedMotion={effectiveReducedMotion}
              delay={getCardDelay(index)}
              themeTokens={themeTokens}
              isMobile={true}
              index={index}
              isLowPerformance={isLowPerformance}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Export subcomponents for potential reuse
export { DeviceMockup, FeatureCardComponent as FeatureCard, BackgroundHero }
