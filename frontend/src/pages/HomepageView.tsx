import { useState, useEffect } from 'react'
import { MasonryGrid } from '@/components/homepage/MasonryGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Filter, 
  SortAsc, 
  LayoutGrid, 
  List,
  RefreshCw
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'

const mockItems = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i}`,
  title: `Article Title ${i + 1}: Important News and Updates`,
  summary: `This is a summary of article ${i + 1}. It contains important information about various topics including technology, science, and current events.`,
  category: ['AI News', 'Tech', 'Finance', 'Shopping', 'Events'][Math.floor(Math.random() * 5)],
  importance: Math.floor(Math.random() * 10) + 1,
  readingTime: Math.floor(Math.random() * 10) + 1,
  imageUrl: Math.random() > 0.3 ? `https://picsum.photos/400/${300 + Math.floor(Math.random() * 200)}?random=${i}` : undefined,
  tags: ['technology', 'innovation', 'future', 'development'].slice(0, Math.floor(Math.random() * 4) + 1),
  timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
  content: `Full content of article ${i + 1}...`,
}))

export function HomepageView() {
  const [items, setItems] = useState(mockItems)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('importance')
  const [filterCategory, setFilterCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const handleSort = (value: string) => {
    setSortBy(value)
    const sorted = [...items].sort((a, b) => {
      if (value === 'importance') return b.importance - a.importance
      if (value === 'recent') return 0
      return a.readingTime - b.readingTime
    })
    setItems(sorted)
  }

  const handleFilter = (value: string) => {
    setFilterCategory(value)
    if (value === 'all') {
      setItems(mockItems)
    } else {
      setItems(mockItems.filter(item => item.category === value))
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setItems([...mockItems].sort(() => Math.random() - 0.5))
      setIsLoading(false)
    }, 1000)
  }

  const categories = ['all', 'AI News', 'Tech', 'Finance', 'Shopping', 'Events']

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Explore</h2>
          <p className="text-muted-foreground">
            Discover personalized content from your subscriptions
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[140px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="importance">Importance</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="reading">Reading Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={handleFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {filterCategory !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          <Badge variant="secondary">
            {filterCategory}
            <button
              onClick={() => handleFilter('all')}
              className="ml-2 hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MasonryGrid
            items={items}
            onItemClick={(id) => console.log('Clicked:', id)}
          />
        </motion.div>
      )}
    </div>
  )
}