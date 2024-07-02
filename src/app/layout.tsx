"use client";

import { Header } from "@/components/common/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          {/* (57 & 73) Header Height || (24) Footer Height */}
          <main className="">
            {children}
          </main>
          <Toaster
            closeButton
            duration={3500}
            position="top-right"
            richColors
          />
        </Providers>
      </body>

      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script id="gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
      </Script>
    </html>
  );
}
