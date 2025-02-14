'use server'

import { prisma } from "@/lib/prisma"

export async function getSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { lastActive: 'desc' }
  })
}

export async function revokeSession(sessionId: string) {
  return prisma.session.delete({
    where: { id: sessionId }
  })
}