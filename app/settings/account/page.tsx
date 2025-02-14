import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAuthorProfile } from "@/actions/author"
import { EditAuthorProfileForm } from "./edit-author-profile-form"

export default async function ProfileSettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const profile = await getAuthorProfile(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Author Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your author profile information.
        </p>
      </div>
      <EditAuthorProfileForm profile={profile} />
    </div>
  )
}