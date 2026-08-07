import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/SideBar";
import Navbar from "./components/NavBar";

import ReduxProvider from "@/store/provider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toon Nest",
  description: "Read your favorite webtoons",
  icons: {
    icon: "/favicon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="https://api.stripe.com" />
      </head>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <ReduxProvider>
            <div className="flex h-screen flex-col">
              <Navbar />

              <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </div>
            </div>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
