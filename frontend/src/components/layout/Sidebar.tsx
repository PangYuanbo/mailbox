import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Newspaper,
  Grid3x3,
  TrendingUp,
  Settings,
  Archive,
  Star,
  Clock,
  Filter,
  Sparkles,
  Inbox,
  Send
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'

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
  { id: 'dashboard', label: 'Dashboard', icon: Home, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'newspaper', label: 'Newspaper', icon: Newspaper, gradient: 'from-purple-500 to-pink-500' },
  { id: 'homepage', label: 'Homepage', icon: Grid3x3, gradient: 'from-green-500 to-emerald-500' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, gradient: 'from-orange-500 to-red-500' },
  { id: 'starred', label: 'Starred', icon: Star, gradient: 'from-yellow-500 to-orange-500' },
  { id: 'recent', label: 'Recent', icon: Clock, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'archive', label: 'Archive', icon: Archive, gradient: 'from-gray-500 to-gray-600' },
]

const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: -320,
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
}

export function Sidebar({ isOpen, currentView, onViewChange, categories }: SidebarProps) {
  return (
    <AnimatePresence>
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={cn(
          "sidebar-modern lg:translate-x-0 lg:opacity-100",
          !isOpen && "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"
        )}
      >
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Ready to help</p>
                </div>
              </div>
              <Button className="w-full mt-2 btn-primary text-sm">
                Ask AI
              </Button>
            </div>

            {/* Navigation */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Navigation
              </h2>
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 group transition-all",
                        currentView === item.id && "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900"
                      )}
                      onClick={() => onViewChange(item.id)}
                    >
                      <div className={cn(
                        "p-1.5 rounded-lg transition-all",
                        currentView === item.id 
                          ? `bg-gradient-to-r ${item.gradient}` 
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                      )}>
                        <item.icon className={cn(
                          "h-3.5 w-3.5",
                          currentView === item.id ? "text-white" : "text-gray-600 dark:text-gray-400"
                        )} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {currentView === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg -z-10"
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categories
                </h2>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg">
                  <Filter className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => onViewChange(`category-${category.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-background"
                          style={{ 
                            backgroundColor: category.color,
                            boxShadow: `0 0 8px ${category.color}40`
                          }}
                        />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                      >
                        {category.count}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Quick Stats */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50">
                  <Inbox className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">124</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Total</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/50">
                  <Send className="h-4 w-4 text-green-600 dark:text-green-400 mb-1" />
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">89</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Processed</p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 group"
                onClick={() => onViewChange('settings')}
              >
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                  <Settings className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-medium">Settings</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </motion.aside>
    </AnimatePresence>
  )
}