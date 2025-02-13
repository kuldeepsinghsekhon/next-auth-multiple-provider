'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { withAuth } from "@/lib/middleware/withAuth"

export async function getAuthorProfile(userId: string) {
    console.log('userIduserIduserIdusrId',userId)

    const authorProfile=prisma.authorProfile.findUnique({
    where: { userId }

  })
  console.log('authorProfileauthorProfileauthorProfileauthorProfileauthorProfile',authorProfile)
    return authorProfile
}


export async function getAllAuthorProfiles() {
  return prisma.authorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          // Add other required fields here
        }
      }
    }
  })
}