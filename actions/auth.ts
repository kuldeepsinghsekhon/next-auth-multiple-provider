'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSecret, verifyToken } from "@/lib/totp"
import { revalidatePath } from "next/cache"

export async function setupTwoFactor() {
  const session = await auth()
  if (!session?.user) throw new Error("Not authenticated")

  const secret = generateSecret()
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      twoFactorPending: true
    }
  })

  return secret
}

export async function verifyAndEnableTwoFactor(token: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Not authenticated")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true }
  })

  if (!user?.twoFactorSecret) throw new Error("2FA not initialized")

  const isValid = verifyToken(token, user.twoFactorSecret)
  if (!isValid) throw new Error("Invalid verification code")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: true,
      twoFactorPending: false
    }
  })

  revalidatePath('/settings/security')
  return true
}

export async function disableTwoFactor() {
  const session = await auth()
  if (!session?.user) throw new Error("Not authenticated")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorPending: false
    }
  })

  revalidatePath('/settings/security')
  return true
}