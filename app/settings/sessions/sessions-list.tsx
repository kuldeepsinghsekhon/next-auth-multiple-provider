'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MapModal } from "./map-modal"
import { toast } from "@/components/ui/use-toast"
import { revokeSession } from "@/actions/sessions"

interface SessionsListProps {
  sessions: Array<{
    id: string
    userAgent: string
    ipAddress: string
    location?: {
      city?: string
      country?: string
      latitude?: number
      longitude?: number
    }
    lastActive: Date
  }>
  currentSessionId: string
}

export function SessionsList({ sessions, currentSessionId }: SessionsListProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId)
      toast({
        title: "Session revoked",
        description: "The session has been terminated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {session.id === currentSessionId && (
                      <Badge>Current</Badge>
                    )}
                    <span>{session.userAgent}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.ipAddress}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {session.location ? (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedLocation({
                      latitude: session.location!.latitude!,
                      longitude: session.location!.longitude!
                    })}
                  >
                    {session.location.city}, {session.location.country}
                  </Button>
                ) : (
                  "Unknown"
                )}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(session.lastActive, { addSuffix: true })}
              </TableCell>
              <TableCell>
                {session.id !== currentSessionId && (
                  <Button
                    variant="ghost"
                    onClick={() => handleRevoke(session.id)}
                  >
                    Revoke
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MapModal
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        location={selectedLocation}
      />
    </>
  )
}