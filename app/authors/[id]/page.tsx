import { getAuthorProfile } from '@/actions/author'
import { getBlogPostsByAuthor } from '@/actions/blog'
import { AuthorDetailedProfile } from '@/components/author-detailed-profile'
import { notFound } from 'next/navigation'

export default async function AuthorProfilePage({ params }: { params: { id: string } }) {
  const [profile, posts] = await Promise.all([
    getAuthorProfile(params.id),
    getBlogPostsByAuthor(params.id)
  ])

  if (!profile) {
    notFound()
  }

  return (
    <div className="container py-6">
      <AuthorDetailedProfile profile={profile} posts={posts} />
    </div>
  )
}