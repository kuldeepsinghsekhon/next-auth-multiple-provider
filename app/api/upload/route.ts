import { NextResponse } from 'next/server'
import { uploadToVercelBlob } from '@/lib/storage/vercel-blob'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const url = await uploadToVercelBlob(file)
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}