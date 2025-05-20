import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

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
      </body>
    </html>
  );
}
