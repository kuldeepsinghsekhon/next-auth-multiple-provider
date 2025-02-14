'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { TagInput } from '@/components/ui/tag-input'
import { AvtarImageUpload } from '@/components/avtar-image-upload'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PersonIcon, 
  PlusIcon, 
  TrashIcon, 
  DragHandleDots2Icon 
} from "@radix-ui/react-icons"
import { toast } from "@/components/ui/use-toast"
import { updateAuthorProfile } from "@/actions/author"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const profileSchema = z.object({
  // Basic Info
  fullName: z.string().min(2, "Name must be at least 2 characters")
    .describe("Your full name or pen name that will be displayed publicly"),
  profilePhoto: z.string().url().optional()
    .describe("URL to your professional profile photo"),
  tagline: z.string().max(160, "Tagline must be less than 160 characters")
    .describe("A brief description that appears under your name (max 160 characters)"),
  qualifications: z.string().optional()
    .describe("Your academic qualifications or certifications"),
  profession: z.string()
    .describe("Your current job title or professional role"),
  
  // Work Experience
  workExperience: z.array(z.object({
    company: z.string(),
    title: z.string(),
    duration: z.string(),
    industry: z.string(),
    achievements: z.array(z.string())
  })),

  // Education
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string()
  })),

  // Skills
  skills: z.object({
    core: z.array(z.string()),
    technical: z.array(z.string()),
    soft: z.array(z.string())
  }),

  // Publications
  publications: z.object({
    books: z.array(z.string()),
    guestPosts: z.array(z.string()),
    talks: z.array(z.string())
  }),

  // Social & Contact
  socialLinks: z.object({
    linkedin: z.string().url().optional()
      .describe("Your LinkedIn profile URL"),
    twitter: z.string().url().optional()
      .describe("Your Twitter/X profile URL"),
    github: z.string().url().optional()
      .describe("Your GitHub profile URL"),
    youtube: z.string().url().optional()
      .describe("Your YouTube channel URL"),
    instagram: z.string().url().optional()
      .describe("Your Instagram profile URL"),
    facebook: z.string().url().optional()
      .describe("Your Facebook profile URL"),
    website: z.string().url().optional()
      .describe("Your personal website URL")
  }).optional(),
  
  // Additional Info
  personalBrand: z.object({
    mission: z.string(),
    philosophy: z.string()
  }),
  contactInfo: z.object({
    freelance: z.boolean(),
    consultation: z.array(z.string()),
    preferredMethod: z.string()
  }),
  additionalInfo: z.object({
    volunteerWork: z.array(z.string()),
    hobbies: z.array(z.string()),
    languages: z.array(z.string())
  })
})

interface AuthorProfileFormProps {
  profile?: {
    fullName?: string
    profilePhoto?: string
    tagline?: string
    qualifications?: string
    profession?: string
    expertise?: string[]
    socialLinks?: {
      linkedin?: string
      twitter?: string
      github?: string
      website?: string
    }
    workExperience?: Array<{
      company: string
      title: string
      duration: string
      industry: string
      achievements: string[]
    }>
    education?: Array<{
      institution: string
      degree: string
      field: string
    }>
    skills?: {
      core: string[]
      technical: string[]
      soft: string[]
    }
    publications?: {
      books: string[]
      guestPosts: string[]
      talks: string[]
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
      volunteerWork: string[]
      hobbies: string[]
      languages: string[]
    }
  }
}

export function EditAuthorProfileForm({ profile }: AuthorProfileFormProps) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...profile,
      socialLinks: profile?.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        youtube: '',
        instagram: '',
        facebook: '',
        website: ''
      }
    }
  })

  const { fields: workFields, append: appendWork, remove: removeWork } = 
    useFieldArray({ control: form.control, name: "workExperience" })
  
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = 
    useFieldArray({ control: form.control, name: "education" })

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    try {
      await updateAuthorProfile(data)
      toast({
        title: "Profile updated",
        description: "Your author profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PersonIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="profilePhoto"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AvtarImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      name={form.watch('fullName')}
                    />
                  </FormControl>
                  <FormDescription className="text-center">
                    Upload a profile photo (recommended size: 400x400)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    A brief description that appears under your name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaBriefcase className="h-5 w-5" />
                Work Experience
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendWork({
                  company: '',
                  title: '',
                  duration: '',
                  industry: '',
                  achievements: []
                })}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workFields.map((field, index) => (
              <div key={field.id} className="relative p-4 border rounded-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => removeWork(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Add other work experience fields */}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaGraduationCap className="h-5 w-5" />
                Education
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendEdu({
                  institution: '',
                  degree: '',
                  field: ''
                })}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {eduFields.map((field, index) => (
              <div key={field.id} className="relative p-4 border rounded-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => removeEdu(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`education.${index}.field`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills & Expertise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaCode className="h-5 w-5" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="skills.core"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Core Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add core skills..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills.technical"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add technical skills..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills.soft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soft Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add soft skills..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Publications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBook className="h-5 w-5" />
              Publications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="publications.books"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Books</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add books..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="publications.guestPosts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Posts</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add guest posts..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="publications.talks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talks</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add talks..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Personal Brand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBullhorn className="h-5 w-5" />
              Personal Brand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="personalBrand.mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission Statement</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalBrand.philosophy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Philosophy</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaHandshake className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contactInfo.freelance"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Available for Freelance</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactInfo.consultation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Services</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add consultation services..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactInfo.preferredMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUser className="h-5 w-5" />
              Social Links
            </CardTitle>
            <CardDescription>
              Add your social media profiles to help readers connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="socialLinks.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/in/..." />
                    </FormControl>
                    <FormDescription>
                      Your LinkedIn profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter/X</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://twitter.com/..." />
                    </FormControl>
                    <FormDescription>
                      Your Twitter/X profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://github.com/..." />
                    </FormControl>
                    <FormDescription>
                      Your GitHub profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormDescription>
                      Your personal website or blog URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PersonIcon className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="additionalInfo.volunteerWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volunteer Work</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add volunteer work..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalInfo.hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hobbies</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add hobbies..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalInfo.languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add languages..."
                      tags={field.value}
                      setTags={(tags) => field.onChange(tags)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Save Profile
        </Button>
      </form>
    </Form>
  )
}