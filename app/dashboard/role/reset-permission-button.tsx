'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/admin/ui/use-toast"
import { reInitializePermissions } from "@/actions/permissions"
import { useState } from "react"

export function ResetPermissionsButton() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
  
    const handleReset = async () => {
      try {
        setLoading(true)
        await reInitializePermissions()
        toast({
          title: "Success",
          description: "Permissions have been reinitialized"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reinitialize permissions",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Button 
        variant="destructive" 
        onClick={handleReset}
        disabled={loading}
      >
        {loading ? 'Resetting...' : 'Reset Permissions'}
      </Button>
    )
  }