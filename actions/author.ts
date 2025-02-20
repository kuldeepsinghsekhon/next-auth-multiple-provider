'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { withAuth } from "@/lib/middleware/withAuth"
export interface AuthorProfile {
  userId: string
  fullName: string
  profilePhoto?: string
  tagline: string
  qualifications?: string
  profession: string
  expertise: string[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    website?: string
  }
  // Add other fields
}
export async function getAuthorProfile(userId: string) {

    const authorProfile=prisma.authorProfile.findUnique({
    where: { userId }

  })
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
export async function updateAuthorProfile(data: AuthorProfile) {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return prisma.authorProfile.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data
    }
  })
}