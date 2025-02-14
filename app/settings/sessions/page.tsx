import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionsList } from "./sessions-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonitorIcon } from "@radix-ui/react-icons"
import { getSessions } from "@/actions/sessions"

export default async function SessionsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")
  
  const sessions = await getSessions(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Active Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions across devices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MonitorIcon className="h-5 w-5" />
            Device Sessions
          </CardTitle>
          <CardDescription>
            Review and manage your active sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionsList 
            sessions={sessions} 
            currentSessionId={session.sessionId} 
          />
        </CardContent>
      </Card>
    </div>
  )
}