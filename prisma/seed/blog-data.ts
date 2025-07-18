export const BLOG_CATEGORIES = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Backend', slug: 'backend' }
  ]
  
  export const BLOG_TAGS = [
    { name: 'Tutorial', slug: 'tutorial' },
    { name: 'Guide', slug: 'guide' },
    { name: 'Tips', slug: 'tips' },
    { name: 'Advance', slug: 'advance' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Best Practices', slug: 'best-practices' },
    { name: 'Performance', slug: 'performance' }
  ]

  export const AUTHOR_PROFILES = [
    {
      email: 'superadmin@example.com', // Placeholder for user email
      fullName: 'Super Admin',
      profilePhoto: 'https://example.com/photo-superadmin.jpg',
      tagline: 'Leading the way in tech innovation.',
      qualifications: 'MBA in Technology Management',
      profession: 'Chief Technology Officer at TechCorp',
      expertise: ['Leadership', 'Innovation', 'Tech Strategy'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/superadmin',
        twitter: 'https://twitter.com/superadmin',
        website: 'https://superadmin.com'
      },
      workExperience: [
        {
          company: 'TechCorp',
          title: 'Chief Technology Officer',
          duration: '2010-present',
          industry: 'Tech',
          achievements: ['Led company to IPO', 'Developed new tech strategy']
        }
      ],
      education: [
        {
          institution: 'Harvard Business School',
          degree: 'MBA',
          field: 'Technology Management'
        }
      ],
      skills: {
        core: ['Leadership', 'Innovation'],
        technical: ['Tech Strategy'],
        soft: ['Public Speaking', 'Mentorship']
      },
      publications: {
        books: ['Tech Leadership'],
        guestPosts: ['https://example.com/guest-post-superadmin'],
        talks: ['https://example.com/talk-superadmin']
      },
      personalBrand: {
        mission: 'Driving tech innovation for a better future',
        philosophy: 'Leading with vision and integrity'
      },
      contactInfo: {
        freelance: false,
        consultation: ['Tech Strategy Consulting'],
        preferredMethod: 'LinkedIn'
      },
      additionalInfo: {
        volunteerWork: ['Mentoring at tech bootcamps'],
        hobbies: ['Travel', 'Photography'],
        languages: ['English', 'French']
      }
    },
    {
      email: 'admin@example.com', // Placeholder for user email
      fullName: 'Admin User',
      profilePhoto: 'https://example.com/photo-admin.jpg',
      tagline: 'Expert in software development and project management.',
      qualifications: 'PhD in Computer Science',
      profession: 'Senior Software Engineer at Google',
      expertise: ['Cybersecurity', 'Renewable Energy', 'UX Design'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/adminuser',
        twitter: 'https://twitter.com/adminuser',
        website: 'https://adminuser.com'
      },
      workExperience: [
        {
          company: 'Google',
          title: 'Senior Software Engineer',
          duration: '2015-present',
          industry: 'Tech',
          achievements: ['Developed AI models', 'Led a team of 10 engineers']
        }
      ],
      education: [
        {
          institution: 'MIT',
          degree: 'PhD',
          field: 'Computer Science'
        }
      ],
      skills: {
        core: ['Machine Learning', 'Content Marketing'],
        technical: ['Python', 'React'],
        soft: ['Public Speaking', 'Leadership']
      },
      publications: {
        books: ['AI Ethics'],
        guestPosts: ['https://example.com/guest-post-admin'],
        talks: ['https://example.com/talk-admin']
      },
      personalBrand: {
        mission: 'Empowering startups through ethical AI practices',
        philosophy: 'Sharing knowledge on AI and ethics'
      },
      contactInfo: {
        freelance: true,
        consultation: ['Career coaching', 'Technical reviews'],
        preferredMethod: 'Email'
      },
      additionalInfo: {
        volunteerWork: ['Mentoring at coding bootcamps'],
        hobbies: ['Travel', 'Photography'],
        languages: ['English', 'Spanish']
      }
    },
    {
      email: 'testuser@example.com', // Placeholder for user email
      fullName: 'Test User',
      profilePhoto: 'https://example.com/photo-testuser.jpg',
      tagline: 'Passionate about testing and quality assurance.',
      qualifications: 'Certified QA Engineer',
      profession: 'QA Engineer at TestCorp',
      expertise: ['Automated Testing', 'Manual Testing', 'Quality Assurance'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/testuser',
        twitter: 'https://twitter.com/testuser',
        website: 'https://testuser.com'
      },
      workExperience: [
        {
          company: 'TestCorp',
          title: 'QA Engineer',
          duration: '2018-present',
          industry: 'Tech',
          achievements: ['Implemented automated testing framework', 'Reduced bugs by 30%']
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'BSc',
          field: 'Computer Science'
        }
      ],
      skills: {
        core: ['Automated Testing', 'Manual Testing'],
        technical: ['Selenium', 'JIRA'],
        soft: ['Attention to Detail', 'Problem Solving']
      },
      publications: {
        books: ['QA Best Practices'],
        guestPosts: ['https://example.com/guest-post-testuser'],
        talks: ['https://example.com/talk-testuser']
      },
      personalBrand: {
        mission: 'Ensuring software quality through rigorous testing',
        philosophy: 'Quality is not an act, it is a habit'
      },
      contactInfo: {
        freelance: true,
        consultation: ['QA Consulting'],
        preferredMethod: 'Email'
      },
      additionalInfo: {
        volunteerWork: ['Teaching coding to kids'],
        hobbies: ['Gaming', 'Cooking'],
        languages: ['English', 'German']
      }
    }
  ]

  export const SAMPLE_POSTS = [

     {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-nextjs-14',
      content: `
  # Getting Started with Next.js 14
  
  \`\`\`typescript
  // Example code
  const Page = async () => {
    return <div>Hello Next.js 14!</div>
  }
  \`\`\`
  
  ![Next.js Architecture](https://picsum.photos/800/400)
  
  Check out this intro video:
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
      `,
      excerpt: 'Learn how to build modern web applications with Next.js 14',
      coverImage: 'https://picsum.photos/1200/630',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      categories: ['nextjs', 'javascript'],
      tags: ['tutorial', 'guide']
    },
    {
        title: 'Advanced TypeScript Patterns in Next.js',
        slug: 'advanced-typescript-patterns-nextjs',
        content: `
    # Advanced TypeScript Patterns in Next.js
    
    Learn how to use advanced TypeScript patterns in your Next.js applications.
    
    ## Generic Components
    
    \`\`\`typescript
    type DataFetcherProps<T> = {
      url: string;
      render: (data: T) => React.ReactNode;
      fallback?: React.ReactNode;
    };
    
    async function DataFetcher<T>({ url, render, fallback }: DataFetcherProps<T>) {
      const data = await fetch(url).then(res => res.json());
      return render(data);
    }
    
    // Usage Example
    interface User {
      id: string;
      name: string;
      email: string;
    }
    
    <DataFetcher<User[]>
      url="/api/users"
      render={users => users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      fallback={<div>Loading users...</div>}
    />
    \`\`\`
    
    ## Advanced Server Actions
    
    \`\`\`typescript
    import { z } from "zod";
    import { createSafeAction } from "@/lib/safe-action";
    
    const input = z.object({
      title: z.string().min(1).max(255),
      content: z.string(),
      publishedAt: z.date().optional(),
      tags: z.array(z.string())
    });
    
    const output = z.object({
      post: z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string()
      })
    });
    
    export const createPost = createSafeAction(input, output, async (data) => {
      // Validation is automatically handled
      const post = await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          publishedAt: data.publishedAt,
          tags: {
            connect: data.tags.map(id => ({ id }))
          }
        }
      });
    
      return { post };
    });
    
    // Usage in Component
    'use client';
    
    import { useAction } from '@/hooks/use-action';
    
    export function CreatePostForm() {
      const { execute, result, error } = useAction(createPost);
    
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await execute({
            title: formData.get('title'),
            content: formData.get('content'),
            tags: formData.getAll('tags')
          });
        }}>
          {/* Form fields */}
        </form>
      );
    }
    \`\`\`
    
    ## Custom Hook Pattern
    
    \`\`\`typescript
    import { useState, useEffect, useCallback } from 'react';
    
    interface UseAsyncState<T> {
      data: T | null;
      loading: boolean;
      error: Error | null;
    }
    
    function useAsync<T>(
      asyncFn: () => Promise<T>,
      immediate = true
    ): UseAsyncState<T> & { execute: () => Promise<void> } {
      const [state, setState] = useState<UseAsyncState<T>>({
        data: null,
        loading: immediate,
        error: null,
      });
    
      const execute = useCallback(async () => {
        setState(prevState => ({ ...prevState, loading: true }));
        try {
          const data = await asyncFn();
          setState({ data, loading: false, error: null });
        } catch (error) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }, [asyncFn]);
    
      useEffect(() => {
        if (immediate) {
          execute();
        }
      }, [execute, immediate]);
    
      return { ...state, execute };
    }
    
    // Usage Example
    function UserProfile({ userId }: { userId: string }) {
      const { data: user, loading, error } = useAsync(
        () => fetch(\`/api/users/\${userId}\`).then(res => res.json())
      );
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;
      if (!user) return null;
    
      return <div>{user.name}</div>;
    }
    \`\`\`
    `,
        excerpt: 'Deep dive into advanced TypeScript patterns and their practical applications in Next.js',
        coverImage: 'https://picsum.photos/seed/typescript/1200/630',
        categories: ['nextjs', 'javascript'],
        tags: ['tutorial', 'guide']
      }
    // ... more sample posts
  ]
  export const SAMPLE_COMMENTS = [
    {
      content: "Great introduction to Next.js! Very helpful for beginners.",
      replies: [
        {
          content: "Totally agree! The examples are very clear.",
        },
        {
          content: "Would love to see more advanced topics covered.",
        }
      ]
    },
    {
      content: "This helped me understand the new app router better.",
      replies: [
        {
          content: "The routing examples are particularly useful.",
        }
      ]
    }
  ]
  export const SAMPLE_REACTIONS = [
  { type: 'CLAP' },
  { type: 'LOVE' },
  { type: 'CELEBRATE' },
  { type: 'INSIGHTFUL' }
]