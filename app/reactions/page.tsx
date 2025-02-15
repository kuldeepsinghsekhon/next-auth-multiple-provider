import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserReactions } from "@/actions/reactions"
import { ReactionedPosts } from "./reactioned-posts"

export default async function UserReactionsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const reactions = await getUserReactions(session.user.id)

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Your Reactions</h1>
      <ReactionedPosts reactions={reactions} />
    </div>
  )
}