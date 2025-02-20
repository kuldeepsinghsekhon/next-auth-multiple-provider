

import type { Metadata } from "next"

//import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'


export const metadata: Metadata = {
  title: "Blogs Example",
  description:
"blogs"}

export default async function RootLayout({ children }: React.PropsWithChildren) {
    const session = await auth()
    if (session?.user) {
      // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
      // filter out sensitive data before passing to client.
      session.user = {
        name: session.user.name,
        id: session.user.id,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        permissions:session.user.permissions
      }
    }
  return (

          <main className="mx-auto w-full  flex-auto px-4 py-4 sm:px-6 md:py-6">
    <h1>Blog</h1>
    <SessionProvider session={session}>
          {children}
  </SessionProvider>
          </main>

  )
}
