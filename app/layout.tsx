import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import Navbar from "@/components/layout/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xenoforge-marketplace.vercel.app"),
  title: "XenoForge - Modern Learning Marketplace",
  description:
    "Full-stack learning marketplace built with Next.js 14, TypeScript, Prisma, and Stripe. Features role-based authentication, payment processing, subscription management, and admin dashboard. Perfect example of modern web development best practices.",
  keywords: [
    "Next.js marketplace",
    "Stripe payment integration",
    "TypeScript e-commerce",
    "Prisma database",
    "NextAuth.js authentication",
    "subscription billing",
    "admin dashboard",
    "full-stack development",
    "web development portfolio",
    "modern React patterns",
    "API route handlers",
    "webhook processing",
    "role-based access control",
    "payment processing",
    "database design",
  ],
  authors: [{ name: "XenoForge Development Team" }],
  creator: "Hereetria",
  publisher: "Hereetria",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "XenoForge - Modern Learning Marketplace | Next.js & Stripe Integration",
    description:
      "Full-stack learning marketplace demonstrating modern web development with Next.js 14, TypeScript, Prisma, Stripe payments, and role-based authentication. Perfect portfolio project showcasing enterprise-level development practices.",
    url: "https://xenoforge-marketplace.vercel.app",
    siteName: "XenoForge Marketplace",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XenoForge - Modern Learning Marketplace with Next.js and Stripe Integration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XenoForge - Modern Learning Marketplace",
    description:
      "Full-stack learning marketplace built with Next.js 14, TypeScript, Prisma, and Stripe. Showcasing modern web development best practices.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "technology",
  classification: "E-commerce, Learning Platform, Web Development",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
