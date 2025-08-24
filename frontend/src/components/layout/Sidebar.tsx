import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Newspaper,
  Grid3x3,
  Tag,
  TrendingUp,
  Settings,
  Archive,
  Star,
  Clock,
  Filter,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  isOpen: boolean
  currentView: string
  onViewChange: (view: string) => void
  categories: Array<{
    id: string
    name: string
    count: number
    color: string
    icon?: string
  }>
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'newspaper', label: 'Newspaper View', icon: Newspaper },
  { id: 'homepage', label: 'Homepage View', icon: Grid3x3 },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'archive', label: 'Archive', icon: Archive },
]

export function Sidebar({ isOpen, currentView, onViewChange, categories }: SidebarProps) {
  return (
    <aside
      className={cn(
        "glass-sidebar transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onViewChange(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2 px-4">
              <h2 className="text-lg font-semibold">Categories</h2>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => onViewChange(`category-${category.id}`)}
                >
                  <div className="flex items-center">
                    <Tag 
                      className="mr-2 h-4 w-4" 
                      style={{ color: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="px-3 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onViewChange('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}