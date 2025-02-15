'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

const REACTION_TYPES = [
  { type: 'ALL', label: 'All Reactions' },
  { type: 'STAR', label: 'Starred', value: 4 },
  { type: 'HEART', label: 'Loved', value: 3 },
  { type: 'LIKE', label: 'Liked', value: 2 },
  { type: 'SMILE', label: 'Smiled', value: 1 }
]

export function ReactionedPosts({ reactions }) {
  const getFilteredReactions = (type: string) => {
    if (type === 'ALL') return reactions
    return reactions.filter(r => r.type === type)
  }

  return (
    <Tabs defaultValue="ALL">
      <TabsList>
        {REACTION_TYPES.map(({ type, label }) => (
          <TabsTrigger key={type} value={type}>
            {label} ({getFilteredReactions(type).length})
          </TabsTrigger>
        ))}
      </TabsList>

      {REACTION_TYPES.map(({ type, label }) => (
        <TabsContent key={type} value={type}>
          <div className="grid gap-4">
            {getFilteredReactions(type).map((reaction) => (
              <Card key={reaction.id}>
                <CardHeader>
                  <CardTitle>
                    <Link 
                      href={`/blog/${reaction.post.slug}`}
                      className="hover:underline"
                    >
                      {reaction.post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>
                      By {reaction.post.author.authorProfile?.fullName}
                      {reaction.post.author.authorProfile?.reactionScore && (
                        <span className="ml-2">
                          (Score: {reaction.post.author.authorProfile.reactionScore})
                        </span>
                      )}
                    </div>
                    <div>
                      Reacted {formatDistanceToNow(new Date(reaction.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}