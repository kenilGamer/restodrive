// Simple user agent parser
export function parseUserAgent(userAgent: string) {
  if (!userAgent) {
    return {
      device: "Unknown Device",
      browser: "Unknown Browser",
      os: "Unknown OS",
    }
  }

  const ua = userAgent.toLowerCase()

  // Detect OS
  let os = "Unknown OS"
  if (ua.includes("windows")) {
    if (ua.includes("windows nt 10.0")) os = "Windows 10/11"
    else if (ua.includes("windows nt 6.3")) os = "Windows 8.1"
    else if (ua.includes("windows nt 6.2")) os = "Windows 8"
    else if (ua.includes("windows nt 6.1")) os = "Windows 7"
    else os = "Windows"
  } else if (ua.includes("mac os x") || ua.includes("macintosh")) {
    os = "macOS"
  } else if (ua.includes("linux")) {
    os = "Linux"
  } else if (ua.includes("android")) {
    os = "Android"
  } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    os = ua.includes("ipad") ? "iPadOS" : "iOS"
  }

  // Detect Browser
  let browser = "Unknown Browser"
  if (ua.includes("edg/")) {
    browser = "Edge"
  } else if (ua.includes("chrome/") && !ua.includes("edg/")) {
    browser = "Chrome"
  } else if (ua.includes("firefox/")) {
    browser = "Firefox"
  } else if (ua.includes("safari/") && !ua.includes("chrome/")) {
    browser = "Safari"
  } else if (ua.includes("opera/") || ua.includes("opr/")) {
    browser = "Opera"
  }

  // Detect Device
  let device = "Desktop"
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone") || ua.includes("ipod")) {
    device = "Mobile"
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    device = "Tablet"
  } else if (ua.includes("windows") || ua.includes("mac") || ua.includes("linux")) {
    device = "Desktop"
  }

  return {
    device,
    browser,
    os,
  }
}

