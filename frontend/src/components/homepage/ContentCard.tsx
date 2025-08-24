import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Star, Share2, Bookmark, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ContentCardProps {
  id: string
  title: string
  summary: string
  category: string
  importance: number
  readingTime: number
  imageUrl?: string
  tags: string[]
  timestamp: string
  size?: 'small' | 'medium' | 'large'
  onClick: () => void
}

export function ContentCard({
  title,
  summary,
  category,
  importance,
  readingTime,
  imageUrl,
  tags,
  timestamp,
  size = 'medium',
  onClick
}: ContentCardProps) {
  const cardHeight = {
    small: 'h-[200px]',
    medium: 'h-[300px]',
    large: 'h-[400px]'
  }[size]

  return (
    <Card 
      className={cn(
        "glass-card cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1",
        cardHeight
      )}
      onClick={onClick}
    >
      {imageUrl && size !== 'small' && (
        <div className="relative h-32 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant={importance >= 7 ? "destructive" : "outline"}
            className="mb-2"
          >
            {category}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                Star
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bookmark className="mr-2 h-4 w-4" />
                Save for later
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className={cn(
          "font-semibold line-clamp-2",
          size === 'large' ? 'text-lg' : 'text-base'
        )}>
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className={cn(
          "text-muted-foreground mb-3",
          size === 'small' ? 'line-clamp-2 text-sm' : 
          size === 'medium' ? 'line-clamp-3 text-sm' : 
          'line-clamp-4'
        )}>
          {summary}
        </p>
        
        {size !== 'small' && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} min
          </span>
          <span>{timestamp}</span>
        </div>
      </CardContent>
    </Card>
  )
}