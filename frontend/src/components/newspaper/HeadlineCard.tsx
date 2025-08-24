import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Star, ExternalLink, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeadlineCardProps {
  title: string
  summary: string
  category: string
  importance: number
  readingTime: number
  imageUrl?: string
  link?: string
  isStarred?: boolean
  onToggleStar?: () => void
  onClick?: () => void
}

export function HeadlineCard({
  title,
  summary,
  category,
  importance,
  readingTime,
  imageUrl,
  link,
  isStarred = false,
  onToggleStar,
  onClick
}: HeadlineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className="glass-card cursor-pointer overflow-hidden h-full"
        onClick={onClick}
      >
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge 
              className="absolute top-2 left-2"
              variant={importance >= 7 ? "destructive" : "secondary"}
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              {importance}/10
            </Badge>
          </div>
        )}
        
        <CardHeader className={!imageUrl ? 'pb-3' : 'pt-3 pb-3'}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Badge variant="outline" className="mb-2">
                {category}
              </Badge>
              <CardTitle className="line-clamp-2 text-lg">
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onToggleStar?.()
              }}
            >
              <Star 
                className={cn(
                  "h-4 w-4",
                  isStarred ? "fill-yellow-400 text-yellow-400" : ""
                )}
              />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="line-clamp-3 mb-3">
            {summary}
          </CardDescription>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
            
            {link && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  window.open(link, '_blank')
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}