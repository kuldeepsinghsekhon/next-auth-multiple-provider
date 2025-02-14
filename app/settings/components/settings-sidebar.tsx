'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import {
  PersonIcon,
  GearIcon,
  LockClosedIcon,
  BellIcon,
  FileTextIcon,
  LayoutIcon,
 // PaletteIcon,
  BookmarkIcon
} from "@radix-ui/react-icons"

const settingsNav = [
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/settings/profile",
        icon: PersonIcon,
      },
      {
        title: "Account Settings",
        href: "/settings/account",
        icon: GearIcon,
      },
      {
        title: "Security",
        href: "/settings/security",
        icon: LockClosedIcon,
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
        icon: BellIcon,
      },
    ],
  },
  {
    title: "Author",
    items: [
      {
        title: "Author Profile",
        href: "/settings/account",
        icon: FileTextIcon,
      },
      {
        title: "Blog Settings",
        href: "/settings/blog",
        icon: LayoutIcon,
      },
    ],
  },
  {
    title: "Appearance",
    items: [
      {
        title: "Theme",
        href: "/settings/theme",
        icon: LayoutIcon,
      },
      {
        title: "Preferences",
        href: "/settings/preferences",
        icon: BookmarkIcon,
      },
    ],
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 space-y-8">
      {settingsNav.map((group) => (
        <div key={group.title}>
          <h3 className="px-2 text-sm font-semibold text-muted-foreground mb-2">
            {group.title}
          </h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}