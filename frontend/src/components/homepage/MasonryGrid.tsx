import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentCard } from './ContentCard'

interface Item {
  id: string
  title: string
  summary: string
  category: string
  importance: number
  readingTime: number
  imageUrl?: string
  tags: string[]
  timestamp: string
  content?: string
}

interface MasonryGridProps {
  items: Item[]
  onItemClick: (id: string) => void
}

export function MasonryGrid({ items, onItemClick }: MasonryGridProps) {
  const [columns, setColumns] = useState(3)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 1024) setColumns(2)
      else if (width < 1536) setColumns(3)
      else setColumns(4)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const getColumns = () => {
    const cols: Item[][] = Array.from({ length: columns }, () => [])
    
    items.forEach((item, index) => {
      const columnIndex = index % columns
      cols[columnIndex].push(item)
    })
    
    return cols
  }

  const columnItems = getColumns()

  return (
    <div 
      ref={containerRef}
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      <AnimatePresence>
        {columnItems.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {column.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  delay: (columnIndex + itemIndex) * 0.05,
                  duration: 0.3 
                }}
              >
                <ContentCard
                  {...item}
                  onClick={() => onItemClick(item.id)}
                  size={item.importance >= 8 ? 'large' : 
                        item.importance >= 5 ? 'medium' : 'small'}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}