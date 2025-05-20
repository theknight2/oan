import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://openalpha.ai"),
  title: "OpenΑlpha",
  description: "OpenΑlpha is an advanced AI assistant with MCP integration for tools access.",
  icons: {
    icon: [
      {
        url: "/alpha-logo.svg",
        href: "/alpha-logo.svg",
      }
    ],
    apple: "/alpha-logo.svg",
  },
  openGraph: {
    siteName: "OpenΑlpha",
    url: "https://openalpha.ai",
    images: [
      {
        url: "/alpha-logo.svg",
        width: 100,
        height: 100,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenΑlpha",
    description: "OpenΑlpha is an advanced AI assistant with MCP integration for tools access.",
    images: ["/alpha-logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/alpha-logo.svg" />
      </head>
      <body className={`${inter.className}`}>
        <Providers>
          <div className="flex h-dvh w-full">
            <main className="flex-1 flex flex-col relative">
              <div className="flex-1 flex justify-center">
                {children}
              </div>
            </main>
          </div>
        </Providers>
        <Analytics />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="1373896a-fb20-4c9d-b718-c723a2471ae5" />
      </body>
    </html>
  );
}
