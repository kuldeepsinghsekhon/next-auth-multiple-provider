import { put } from '@vercel/blob'
import { auth } from '@/auth'

export async function uploadToVercelBlob(file: File) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const filename = `${Date.now()}-${file.name}`
  const { url } = await put(filename, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN
  })

  return url
}