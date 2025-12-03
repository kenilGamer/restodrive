/**
 * Loyalty Program Configuration
 * Centralized configuration for points, tiers, and rewards
 */

export const LOYALTY_CONFIG = {
  // Points earning rate (points per rupee spent)
  POINTS_PER_RUPEE: 1,

  // Minimum order amount to earn points (in rupees)
  MIN_ORDER_AMOUNT_FOR_POINTS: 100,

  // Points expiration (in days)
  POINTS_EXPIRATION_DAYS: 365,

  // Tier thresholds (points required)
  TIER_THRESHOLDS: {
    BRONZE: 0,
    SILVER: 500,
    GOLD: 2000,
    PLATINUM: 5000,
  },

  // Tier benefits (discount percentage)
  TIER_BENEFITS: {
    BRONZE: {
      name: "Bronze",
      discount: 0,
      pointsMultiplier: 1.0,
      description: "Get started and earn points on every order",
    },
    SILVER: {
      name: "Silver",
      discount: 5,
      pointsMultiplier: 1.1,
      description: "5% discount + 10% bonus points",
    },
    GOLD: {
      name: "Gold",
      discount: 10,
      pointsMultiplier: 1.2,
      description: "10% discount + 20% bonus points",
    },
    PLATINUM: {
      name: "Platinum",
      discount: 15,
      pointsMultiplier: 1.5,
      description: "15% discount + 50% bonus points",
    },
  },

  // Points redemption
  REDEMPTION: {
    // Points required per rupee discount
    POINTS_PER_RUPEE_DISCOUNT: 10,
    // Minimum points required to redeem
    MIN_POINTS_TO_REDEEM: 100,
    // Maximum discount percentage from points
    MAX_DISCOUNT_PERCENTAGE: 50,
  },

  // Referral rewards
  REFERRAL: {
    // Points for referrer when referred customer makes first order
    REFERRER_POINTS: 100,
    // Points for referred customer on signup
    REFERRED_POINTS: 50,
    // Points for referred customer on first order
    REFERRED_FIRST_ORDER_BONUS: 100,
  },

  // Birthday bonus
  BIRTHDAY_BONUS: {
    POINTS: 200,
    DAYS_VALID: 30, // Valid for 30 days after birthday
  },
} as const

/**
 * Calculate points earned for an order
 */
export function calculatePointsEarned(orderTotal: number, tier: string = "BRONZE"): number {
  if (orderTotal < LOYALTY_CONFIG.MIN_ORDER_AMOUNT_FOR_POINTS) {
    return 0
  }

  const basePoints = Math.floor(orderTotal * LOYALTY_CONFIG.POINTS_PER_RUPEE)
  const multiplier = LOYALTY_CONFIG.TIER_BENEFITS[tier as keyof typeof LOYALTY_CONFIG.TIER_BENEFITS]?.pointsMultiplier || 1.0

  return Math.floor(basePoints * multiplier)
}

/**
 * Calculate discount from points redemption
 */
export function calculateDiscountFromPoints(points: number, orderTotal: number): number {
  const maxDiscountFromPoints = Math.floor((points / LOYALTY_CONFIG.REDEMPTION.POINTS_PER_RUPEE_DISCOUNT))
  const maxDiscountPercentage = (orderTotal * LOYALTY_CONFIG.REDEMPTION.MAX_DISCOUNT_PERCENTAGE) / 100

  return Math.min(maxDiscountFromPoints, maxDiscountPercentage)
}

/**
 * Get tier based on total points
 */
export function getTierFromPoints(points: number): "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" {
  if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.PLATINUM) {
    return "PLATINUM"
  }
  if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD) {
    return "GOLD"
  }
  if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER) {
    return "SILVER"
  }
  return "BRONZE"
}

/**
 * Generate unique referral code
 */
export function generateReferralCode(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${cleanName}${random}`
}

