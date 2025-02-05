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