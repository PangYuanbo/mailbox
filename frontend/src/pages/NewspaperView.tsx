import { useState, useEffect } from 'react'
import { HeadlineCard } from '@/components/newspaper/HeadlineCard'
import { CategoryColumn } from '@/components/newspaper/CategoryColumn'
import { Skeleton } from '@/components/ui/skeleton'
import { useEmailStore } from '@/stores/useEmailStore'
import { motion } from 'framer-motion'

const mockData = {
  headlines: [
    {
      id: '1',
      title: 'Major AI Breakthrough: GPT-5 Announced with Revolutionary Capabilities',
      summary: 'OpenAI announces GPT-5 with unprecedented reasoning abilities and multimodal understanding, marking a significant leap in artificial intelligence.',
      category: 'AI News',
      importance: 9,
      readingTime: 5,
      imageUrl: 'https://picsum.photos/400/300?random=1',
      link: 'https://example.com',
    },
    {
      id: '2',
      title: 'Tech Giants Report Record Quarterly Earnings',
      summary: 'Apple, Google, and Microsoft all exceed expectations with strong cloud and AI-driven revenue growth.',
      category: 'Finance',
      importance: 7,
      readingTime: 3,
      imageUrl: 'https://picsum.photos/400/300?random=2',
    },
  ],
  categories: [
    {
      title: 'AI News',
      color: '#3B82F6',
      articles: [
        {
          id: '3',
          title: 'New ML Framework Simplifies Model Deployment',
          summary: 'A revolutionary framework that reduces deployment time by 70%',
          importance: 6,
          readingTime: 2,
          timestamp: '2 hours ago',
        },
        {
          id: '4',
          title: 'AI Ethics Committee Releases New Guidelines',
          summary: 'Comprehensive guidelines for responsible AI development',
          importance: 7,
          readingTime: 4,
          timestamp: '5 hours ago',
        },
      ],
    },
    {
      title: 'Shopping',
      color: '#10B981',
      articles: [
        {
          id: '5',
          title: 'Black Friday Deals Preview: Best Tech Discounts',
          summary: 'Early look at this year\'s most anticipated tech deals',
          importance: 5,
          readingTime: 3,
          timestamp: '1 hour ago',
        },
      ],
    },
    {
      title: 'Events',
      color: '#F59E0B',
      articles: [
        {
          id: '6',
          title: 'Tech Conference 2024: Speaker Lineup Revealed',
          summary: 'Industry leaders to discuss future of technology',
          importance: 6,
          readingTime: 2,
          timestamp: '3 hours ago',
        },
      ],
    },
  ],
}

export function NewspaperView() {
  const { fetchEmails, fetchCategories } = useEmailStore()
  const [, setSelectedArticle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchEmails(), fetchCategories()]).finally(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Today's Headlines</h2>
        <p className="text-muted-foreground">
          Your personalized news digest for {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <>
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </>
        ) : (
          mockData.headlines.map((headline) => (
            <HeadlineCard
              key={headline.id}
              {...headline}
              onClick={() => setSelectedArticle(headline.id)}
            />
          ))
        )}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
          </>
        ) : (
          mockData.categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <CategoryColumn
                {...category}
                onArticleClick={setSelectedArticle}
                onSeeMore={() => console.log(`See more ${category.title}`)}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}