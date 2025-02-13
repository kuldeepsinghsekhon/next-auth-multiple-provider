import React from 'react'

interface AuthorDetailedProfileProps {
  profile: {
    fullName: string
    profilePhoto: string
    tagline: string
    qualifications?: string
    profession: string
    expertise: string[]
    socialLinks?: {
      linkedin?: string
      twitter?: string
      website?: string
    }
    workExperience?: {
      company: string
      title: string
      duration: string
      industry: string
      achievements: string[]
    }[]
    education?: {
      institution: string
      degree: string
      field: string
    }[]
    skills?: {
      core: string[]
      technical: string[]
      soft: string[]
    }
    publications?: {
      books?: string[]
      guestPosts?: string[]
      talks?: string[]
    }
    personalBrand?: {
      mission: string
      philosophy: string
    }
    contactInfo?: {
      freelance: boolean
      consultation: string[]
      preferredMethod: string
    }
    additionalInfo?: {
      volunteerWork?: string[]
      hobbies?: string[]
      languages?: string[]
    }
  }
}

export function AuthorDetailedProfile({ profile }: AuthorDetailedProfileProps) {
  return (
    <div className="author-detailed-profile">
      <img src={profile.profilePhoto} alt={profile.fullName} className="profile-photo" />
      <h2>{profile.fullName}</h2>
      <p>{profile.tagline}</p>
      {profile.qualifications && <p>Qualifications: {profile.qualifications}</p>}
      <p>Profession: {profile.profession}</p>
      <ul>
        {profile.expertise.map((expertise, index) => (
          <li key={index}>{expertise}</li>
        ))}
      </ul>
      <div className="social-links">
        {profile.socialLinks?.linkedin && (
          <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {profile.socialLinks?.twitter && (
          <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
        {profile.socialLinks?.website && (
          <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
            Website
          </a>
        )}
      </div>
      <h3>Work Experience</h3>
      <ul>
        {profile.workExperience?.map((experience, index) => (
          <li key={index}>
            <p>{experience.company} - {experience.title} ({experience.duration})</p>
            <p>Industry: {experience.industry}</p>
            <ul>
              {experience.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h3>Education</h3>
      <ul>
        {profile.education?.map((edu, index) => (
          <li key={index}>
            <p>{edu.institution} - {edu.degree} in {edu.field}</p>
          </li>
        ))}
      </ul>
      <h3>Skills</h3>
      <ul>
        <li>Core: {profile.skills?.core.join(', ')}</li>
        <li>Technical: {profile.skills?.technical.join(', ')}</li>
        <li>Soft: {profile.skills?.soft.join(', ')}</li>
      </ul>
      <h3>Publications & Contributions</h3>
      <ul>
        <li>Books: {profile.publications?.books?.join(', ')}</li>
        <li>Guest Posts: {profile.publications?.guestPosts?.join(', ')}</li>
        <li>Talks: {profile.publications?.talks?.join(', ')}</li>
      </ul>
      <h3>Personal Branding</h3>
      <p>Mission: {profile.personalBrand?.mission}</p>
      <p>Philosophy: {profile.personalBrand?.philosophy}</p>
      <h3>Contact & Collaboration</h3>
      <p>Freelance: {profile.contactInfo?.freelance ? 'Available' : 'Not Available'}</p>
      <p>Consultation: {profile.contactInfo?.consultation.join(', ')}</p>
      <p>Preferred Contact Method: {profile.contactInfo?.preferredMethod}</p>
      <h3>Additional Information</h3>
      <ul>
        <li>Volunteer Work: {profile.additionalInfo?.volunteerWork?.join(', ')}</li>
        <li>Hobbies: {profile.additionalInfo?.hobbies?.join(', ')}</li>
        <li>Languages: {profile.additionalInfo?.languages?.join(', ')}</li>
      </ul>
    </div>
  )
}