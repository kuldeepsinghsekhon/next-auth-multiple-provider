
//import { useSession } from "next-auth/react"
import { PermissionWrapper } from "@/components/PermissionWrapper"
import { Suspense } from 'react'
import { DashboardStats } from './components/dashboard-stats'
import { getDashboardStats } from '@/actions/dashboard'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats stats={stats} />
      </Suspense>
    </div>
  )
}