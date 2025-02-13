import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaBook,
  FaBullhorn,
  FaHandshake,
  FaUser
} from 'react-icons/fa'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ... keep existing interface ...

export function AuthorDetailedProfile({ profile }: AuthorDetailedProfileProps) {
  const initials = profile.fullName.split(' ').map(n => n[0]).join('')

  return (
    <div className="container mx-auto py-8">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg" />
        <div className="absolute -bottom-16 left-8 flex items-end space-x-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={profile.profilePhoto} alt={profile.fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{profile.fullName}</h1>
            <p className="text-muted-foreground">{profile.profession}</p>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUser className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{profile.tagline}</p>
            {profile.qualifications && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Qualifications</h3>
                <p>{profile.qualifications}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {profile.expertise.map((exp, i) => (
                <Badge key={i} variant="secondary">{exp}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaHandshake className="h-5 w-5" />
              Connect
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-2xl hover:text-blue-600">
                <FaLinkedin />
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-2xl hover:text-blue-400">
                <FaTwitter />
              </a>
            )}
            {profile.socialLinks?.website && (
              <a href={profile.socialLinks.website}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-2xl hover:text-gray-600">
                <FaGlobe />
              </a>
            )}
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBriefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.workExperience?.map((exp, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <p className="text-muted-foreground">
                  {exp.company} • {exp.duration}
                </p>
                <p className="text-sm mb-2">Industry: {exp.industry}</p>
                <ul className="list-disc list-inside text-sm">
                  {exp.achievements.map((achievement, j) => (
                    <li key={j}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaGraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.education?.map((edu, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaCode className="h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.core.map((skill, i) => (
                    <Badge key={i}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.technical.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.soft.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBook className="h-5 w-5" />
              Publications & Talks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.publications?.books && profile.publications.books.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Books</h3>
                <ul className="list-disc list-inside">
                  {profile.publications.books.map((book, i) => (
                    <li key={i}>{book}</li>
                  ))}
                </ul>
              </div>
            )}
            {profile.publications?.talks && profile.publications.talks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Conference Talks</h3>
                <ul className="list-disc list-inside">
                  {profile.publications.talks.map((talk, i) => (
                    <li key={i}>{talk}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}