import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  TrendingUp, 
  Activity,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Calendar,
  FileText
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi, summaryApi } from '@/lib/api'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: analyticsApi.getOverview,
  })

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['analytics-trends'],
    queryFn: () => analyticsApi.getTrends(7),
  })

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['daily-summary'],
    queryFn: () => summaryApi.getDailySummary(),
  })

  const stats = [
    {
      title: 'Total Emails',
      value: overview?.total_emails || 0,
      change: '+12%',
      trend: 'up',
      icon: Mail,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
    },
    {
      title: 'Processed',
      value: overview?.processed_emails || 0,
      change: '+23%',
      trend: 'up',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    },
    {
      title: 'This Week',
      value: overview?.emails_this_week || 0,
      change: '-5%',
      trend: 'down',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
    },
    {
      title: 'Success Rate',
      value: `${overview?.processing_rate?.toFixed(1) || 0}%`,
      change: '+8%',
      trend: 'up',
      icon: Activity,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your emails today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="modern-card border-0 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : 'secondary'}
                    className={cn(
                      "font-semibold",
                      stat.trend === 'up' 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                    )}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  {overviewLoading ? (
                    <Skeleton className="h-9 w-24" />
                  ) : (
                    <p className="text-3xl font-bold">{stat.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="modern-card h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Category Distribution</CardTitle>
                  <CardDescription>Email breakdown by categories</CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {overview?.category_distribution?.map((cat: any) => (
                    <div key={cat.category} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ 
                              backgroundColor: cat.color,
                              boxShadow: `0 0 12px ${cat.color}60`
                            }}
                          />
                          <span className="font-medium">{cat.category}</span>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {cat.count} emails
                        </span>
                      </div>
                      <div className="relative h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.count / overview.total_emails) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})`
                          }}
                        />
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="modern-card h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                  <CardDescription>Last 7 days email trends</CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {trends?.daily_trends?.map((day: any, index: number) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-800 group-hover:scale-110 transition-transform">
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {day.count} emails received
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        {day.count}
                      </Badge>
                    </motion.div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity data available
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="modern-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/10 dark:via-purple-950/10 dark:to-indigo-950/10 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">AI Daily Summary</CardTitle>
                  <CardDescription>Intelligent insights from today's emails</CardDescription>
                </div>
              </div>
              <Button className="btn-primary">
                Generate New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {summaryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            ) : summary ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: summary?.content_markdown || '' }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-muted-foreground">No summary available yet</p>
                <Button className="mt-4 btn-secondary">
                  Generate Summary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}