'use client'

import { useSession } from "next-auth/react"
import { PermissionWrapper } from "@/components/PermissionWrapper"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }
 

  return (
    <div className="space-y-4">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <pre className="bg-gray-100 p-4 rounded">

    </pre>
    
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add New Product
      </button>
 
  </div>
  )
}