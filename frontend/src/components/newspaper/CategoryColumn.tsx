import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface Article {
  id: string
  title: string
  summary: string
  importance: number
  readingTime: number
  timestamp: string
}

interface CategoryColumnProps {
  title: string
  color: string
  articles: Article[]
  onArticleClick: (id: string) => void
  onSeeMore: () => void
}

export function CategoryColumn({
  title,
  color,
  articles,
  onArticleClick,
  onSeeMore
}: CategoryColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="glass-card h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              {title}
            </CardTitle>
            <Badge variant="secondary">
              {articles.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-3">
            <div className="space-y-3">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card 
                    className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                    onClick={() => onArticleClick(article.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        {article.importance >= 7 && (
                          <Badge variant="destructive" className="shrink-0">
                            <TrendingUp className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readingTime} min
                        </span>
                        <span>{article.timestamp}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <Button
              variant="ghost"
              className="w-full mt-3"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onSeeMore()
              }}
            >
              See More
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}