import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  LinkedInLogoIcon, 
  TwitterLogoIcon, 
  GlobeIcon,
  PersonIcon 
} from "@radix-ui/react-icons"

interface AuthorShortProfileProps {
  profile: {
    userId: string
    fullName: string
    profilePhoto?: string
    tagline: string
    profession: string
    expertise: string[]
    socialLinks?: {
      linkedin?: string
      twitter?: string  
      website?: string
    }
  }
}

export function AuthorShortProfile({ profile }: AuthorShortProfileProps) {
  const nameInitial = profile.fullName.charAt(0)

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={profile.profilePhoto} alt={profile.fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {nameInitial}
            </AvatarFallback>
          </Avatar>
          <Link 
            href={`/authors/${profile.userId}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-xl mb-1">{profile.fullName}</h3>
          </Link>
          <p className="text-muted-foreground mb-2">{profile.profession}</p>
          <p className="text-sm mb-4">{profile.tagline}</p>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {profile.expertise.map((exp, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {exp}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4 text-muted-foreground">
            {profile.socialLinks?.linkedin && (
              <Link 
                href={profile.socialLinks.linkedin}
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInLogoIcon className="h-5 w-5" />
              </Link>
            )}
            {profile.socialLinks?.twitter && (
              <Link 
                href={profile.socialLinks.twitter}
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterLogoIcon className="h-5 w-5" />
              </Link>
            )}
            {profile.socialLinks?.website && (
              <Link 
                href={profile.socialLinks.website}
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}