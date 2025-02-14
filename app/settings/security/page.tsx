import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChangePasswordForm } from "./change-password-form"
import { PasskeysSetup } from "./passkeys-setup"
import { TwoFactorSetup } from "./two-factor-setup"
import { SecurityLog } from "./security-log"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  ShieldCheckIcon, ActivityLogIcon } from "@radix-ui/react-icons"
import{FaKey} from "react-icons/fa"
import { IoShieldCheckmark } from "react-icons/io5";

export default async function SecurityPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and authentication methods
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaKey className="h-5 w-5" />
              Password
            </CardTitle>
            <CardDescription>
              Change your password or set up password alternatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IoShieldCheckmark className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TwoFactorSetup />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityLogIcon className="h-5 w-5" />
              Security Log
            </CardTitle>
            <CardDescription>
              Review your recent security activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityLog userId={session.user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}