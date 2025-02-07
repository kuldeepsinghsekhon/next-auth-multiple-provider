'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Shield, 
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const icons = {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  Lock
}

interface NavItem {
  title: string
  href: string
  icon: keyof typeof icons
}

interface DesktopNavProps {
  items: NavItem[]
}

export function DesktopNav({ items }: DesktopNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "hidden md:flex flex-col gap-4 border-r min-h-screen p-4 transition-all duration-300",
      isCollapsed ? "w-[80px]" : "w-64"
    )}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && <h2 className="px-2 text-lg font-semibold">Dashboard</h2>}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = icons[item.icon]
            return (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        isCollapsed && "justify-center"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {!isCollapsed && item.title}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </nav>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "mt-auto",
                isCollapsed ? "justify-center" : "justify-start gap-2"
              )}
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && "Sign Out"}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">
              Sign Out
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}