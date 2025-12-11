import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Sora } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Restaurant Digital Suite - RestoDrive",
  description: "All-in-one platform for restaurants to manage QR menus, online orders, table bookings, and POS operations",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#06b6d4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${sora.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider session={null}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
