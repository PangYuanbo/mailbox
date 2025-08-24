import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { 
  Mail, TrendingUp, Calendar, Clock, Search, Filter, 
  Star, Archive, Trash2, ChevronRight, Sparkles,
  BarChart3, Users, Activity, DollarSign, ArrowUpRight,
  ArrowDownRight, MoreHorizontal, Bell, Settings
} from 'lucide-react'

interface EmailItem {
  id: string
  sender: string
  subject: string
  preview: string
  time: string
  category: string
  isRead: boolean
  isStarred: boolean
  avatar?: string
}

const mockEmails: EmailItem[] = [
  {
    id: '1',
    sender: 'TechCrunch',
    subject: 'AI Startup Raises $50M in Series B',
    preview: 'A revolutionary AI company has secured major funding to expand their operations...',
    time: '2 hours ago',
    category: 'Tech News',
    isRead: false,
    isStarred: true,
    avatar: 'https://ui-avatars.com/api/?name=TC&background=0ea5e9&color=fff'
  },
  {
    id: '2',
    sender: 'Product Hunt',
    subject: 'Top 10 Products of the Week',
    preview: 'Discover this week\'s most innovative products that are changing the game...',
    time: '5 hours ago',
    category: 'Products',
    isRead: false,
    isStarred: false,
    avatar: 'https://ui-avatars.com/api/?name=PH&background=f97316&color=fff'
  },
  {
    id: '3',
    sender: 'AWS Newsletter',
    subject: 'New Features in AWS Lambda',
    preview: 'AWS Lambda now supports container images up to 10GB, enabling more complex...',
    time: '1 day ago',
    category: 'Cloud',
    isRead: true,
    isStarred: false,
    avatar: 'https://ui-avatars.com/api/?name=AWS&background=6366f1&color=fff'
  }
]

const stats = [
  {
    title: 'Total Emails',
    value: '2,459',
    change: '+12.5%',
    trend: 'up',
    icon: Mail,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Unread',
    value: '142',
    change: '-8.2%',
    trend: 'down',
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Categories',
    value: '18',
    change: '+2',
    trend: 'up',
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Saved Time',
    value: '4.5h',
    change: '+23%',
    trend: 'up',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
]

const categories = [
  { name: 'Tech News', count: 45, color: 'bg-blue-500' },
  { name: 'Products', count: 32, color: 'bg-purple-500' },
  { name: 'Cloud', count: 28, color: 'bg-green-500' },
  { name: 'AI/ML', count: 24, color: 'bg-pink-500' },
  { name: 'Security', count: 19, color: 'bg-red-500' }
]

export function ModernDashboard() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Smart Email Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's your email intelligence summary.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-xs ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Emails</CardTitle>
                    <CardDescription>Your latest subscription updates</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="h-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {mockEmails.map((email) => (
                          <div
                            key={email.id}
                            className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                              !email.isRead ? 'bg-blue-50/50 border-blue-200' : 'bg-white hover:bg-gray-50'
                            } ${selectedEmail === email.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedEmail(email.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={email.avatar} />
                                <AvatarFallback>{email.sender[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">{email.sender}</h4>
                                  <div className="flex items-center gap-2">
                                    {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                    <span className="text-xs text-muted-foreground">{email.time}</span>
                                  </div>
                                </div>
                                <p className="font-medium text-sm mt-1">{email.subject}</p>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{email.preview}</p>
                                <div className="flex items-center justify-between mt-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {email.category}
                                  </Badge>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <Archive className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="unread">
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>142 unread emails</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="starred">
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>23 starred emails</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="archived">
                    <div className="text-center py-8 text-muted-foreground">
                      <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>156 archived emails</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium">Top Trending Topic</p>
                  <p className="text-xs text-muted-foreground mt-1">AI and Machine Learning news up 45% this week</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium">Time Saved</p>
                  <p className="text-xs text-muted-foreground mt-1">You saved 4.5 hours with smart summaries</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium">Priority Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">3 important emails need your attention</p>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Email distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{category.count}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <Button className="w-full" variant="outline">
                  View All Categories
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Compose
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Contacts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}