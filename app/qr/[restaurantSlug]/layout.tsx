import { Metadata, Viewport } from "next"
import Script from "next/script"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>
}): Promise<Metadata> {
  const { restaurantSlug } = await params
  
  return {
    title: `Menu - ${restaurantSlug}`,
    description: "Digital menu powered by Restaurant Digital Suite",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "RestoDrive Menu",
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#06b6d4",
}

export default function QRMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      {/* Register Service Worker */}
      <Script id="register-sw" strategy="afterInteractive">
        {`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                  console.log('SW registered:', registration.scope)
                })
                .catch((error) => {
                  console.log('SW registration failed:', error)
                })
            })
          }
        `}
      </Script>
      {/* Add to Home Screen Prompt */}
      <Script id="pwa-install-prompt" strategy="afterInteractive">
        {`
          let deferredPrompt
          window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            deferredPrompt = e
            // Show custom install button if needed
            const installButton = document.getElementById('pwa-install-button')
            if (installButton) {
              installButton.style.display = 'block'
              installButton.addEventListener('click', () => {
                deferredPrompt.prompt()
                deferredPrompt.userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt')
                  }
                  deferredPrompt = null
                })
              })
            }
          })
        `}
      </Script>
    </>
  )
}

