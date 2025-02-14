'use client'

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface SecurityEvent {
  id: string
  type: string
  ip: string
  userAgent: string
  timestamp: string
}

export function SecurityLog({ userId }: { userId: string }) {
  const [events, setEvents] = useState<SecurityEvent[]>([])

  useEffect(() => {
    // Add API call to fetch security events
  }, [userId])

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <p className="font-medium">{event.type}</p>
            <p className="text-sm text-muted-foreground">
              IP: {event.ip} • {event.userAgent}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
          </p>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No security events found
        </p>
      )}
    </div>
  )
}