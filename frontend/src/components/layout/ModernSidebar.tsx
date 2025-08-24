import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Home, Newspaper, TrendingUp, Star, Clock, Archive,
  Settings, ChevronLeft, ChevronRight, Sparkles, FolderOpen,
  Hash, Plus, MoreHorizontal
} from 'lucide-react'

interface Category {
  id: string
  name: string
  count: number
  color: string
}

interface ModernSidebarProps {
  isOpen: boolean
  currentView: string
  onViewChange: (view: string) => void
  categories: Category[]
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'newspaper', label: 'Newspaper View', icon: Newspaper },
  { id: 'homepage', label: 'Homepage View', icon: TrendingUp },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'archive', label: 'Archive', icon: Archive },
]

export function ModernSidebar({ isOpen, currentView, onViewChange, categories }: ModernSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300",
        !isOpen && "-translate-x-full md:translate-x-0"
      )}
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 p-4">
          {/* AI Assistant Section */}
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 p-4 text-white">
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="h-24 w-24" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <p className="text-sm opacity-90">
                Your smart email companion is analyzing patterns...
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-3 bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                View Insights
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    currentView === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={currentView === `category-${category.id}` ? 'secondary' : 'ghost'}
                  className="w-full justify-between group"
                  onClick={() => onViewChange(`category-${category.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {category.count}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle category options
                      }}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Storage Info */}
          <div className="mt-auto">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-xs text-muted-foreground">2.4 GB / 5 GB</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: '48%' }}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onViewChange('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </ScrollArea>
    </aside>
  )
}