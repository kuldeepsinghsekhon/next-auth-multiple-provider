import { Providers } from './providers'
import { SessionProvider } from 'next-auth/react'
import { DesktopNav } from './components/desktop-nav'
import { MobileNav } from './components/mobile-nav'
import { auth } from "@/auth"
import { redirect } from 'next/navigation'
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard"
  },
  {
    title: "Blog Posts",
    href: "/dashboard/blog",
    icon: "FileText"
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: "Users"
  },
  {
    title: "Roles",
    href: "/dashboard/role",
    icon: "Shield"
  },
  {
    title: "Permissions",
    href: "/dashboard/role/permissions",
    icon: "Lock"
  }
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  return (
    <Providers>
      <SessionProvider session={session}>
        <div className="flex min-h-screen">
          <DesktopNav items={navItems} />
          <MobileNav items={navItems} />
          <main className="flex-1 px-4 md:px-6 pt-4 pb-8 md:ml-14">
            {children}
          </main>
        </div>
      </SessionProvider>
    </Providers>
  )
}