'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import {QRCodeSVG} from "qrcode.react"
import { setupTwoFactor, verifyAndEnableTwoFactor, disableTwoFactor } from "@/actions/auth"

export function TwoFactorSetup() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSetup = async () => {
    try {
      setIsLoading(true)
      const secret = await setupTwoFactor()
      setSecret(secret)
      setIsPending(true)
      toast({
        title: "2FA Setup Started",
        description: "Scan the QR code with your authenticator app",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup 2FA",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    try {
      setIsLoading(true)
      await verifyAndEnableTwoFactor(verificationCode)
      setIsEnabled(true)
      setIsPending(false)
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisable = async () => {
    try {
      setIsLoading(true)
      await disableTwoFactor()
      setIsEnabled(false)
      setSecret("")
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEnabled) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Two-factor authentication is enabled for your account
        </p>
        <Button 
          variant="destructive" 
          onClick={handleDisable}
          disabled={isLoading}
        >
          Disable 2FA
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!isPending ? (
        <Button 
          onClick={handleSetup}
          disabled={isLoading}
        >
          Setup Two-Factor Authentication
        </Button>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG
                value={`otpauth://totp/${encodeURIComponent("Your App")}:${encodeURIComponent("user@email.com")}?secret=${secret}&issuer=${encodeURIComponent("Your App")}`}
                size={200}
              />
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code with your authenticator app
              </p>
              <div className="w-full max-w-xs space-y-2">
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button 
                  className="w-full"
                  onClick={handleVerify}
                  disabled={isLoading || !verificationCode}
                >
                  Verify and Enable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}