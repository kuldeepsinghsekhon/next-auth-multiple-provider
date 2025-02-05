
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import Footer from "@/components/footer"
import Header from "@/components/header"
//import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextAuth.js Example",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
}

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const session = await auth()
  return (

    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full min-h-screen w-full flex-col justify-between">
          <Header />
          <main className="mx-auto w-full  flex-auto px-4 py-4 sm:px-6 md:py-6">
    <SessionProvider session={session}>
          {children}
  </SessionProvider>
          </main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  )
}
