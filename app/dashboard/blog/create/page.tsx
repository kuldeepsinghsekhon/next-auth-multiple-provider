import { BlogForm } from '../components/blog-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function CreateBlogPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/blog/create')
  }

  return (
    <div className="container py-6">
      <BlogForm />
    </div>
  )
}