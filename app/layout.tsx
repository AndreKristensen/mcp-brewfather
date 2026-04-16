import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
  title: "Brewfather MCP — Your brewery, inside Claude",
  description:
    "An MCP server that gives Claude direct access to your Brewfather brewery data. Browse batches, track fermentation, explore recipes, and manage inventory — all through natural conversation.",
  keywords: [
    "Brewfather",
    "MCP",
    "Claude",
    "homebrewing",
    "Model Context Protocol",
    "AI",
    "brewing assistant",
  ],
  openGraph: {
    title: "Brewfather MCP",
    description: "Your brewery, inside Claude.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brewfather MCP — Your brewery, inside Claude",
    description:
      "An MCP server that gives Claude direct access to your Brewfather brewery data.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Brewfather MCP",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "An MCP server that connects Claude to the Brewfather homebrewing platform, exposing batch management, fermentation tracking, recipe browsing, and inventory management as AI tools.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "List and filter brewing batches by status",
    "Get full batch details including gravities, volumes, and ingredients",
    "Update batch status and record measured values",
    "Retrieve latest and historical fermentation sensor readings",
    "Track brew day stages and step progress",
    "Browse fermentable, hop, yeast, and misc inventory",
    "Get detailed inventory item information",
    "Adjust inventory stock levels",
    "List recipes with style and estimated stats",
    "Get full recipe details including mash steps and fermentation profile",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <header className="sticky top-0 z-10 flex items-center justify-end px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
