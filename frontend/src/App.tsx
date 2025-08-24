import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ModernNavbar } from '@/components/layout/ModernNavbar'
import { ModernSidebar } from '@/components/layout/ModernSidebar'
import { Dashboard } from '@/pages/Dashboard'
import { NewspaperView } from '@/pages/NewspaperView'
import { HomepageView } from '@/pages/HomepageView'
import { useEmailStore } from '@/stores/useEmailStore'
import { ModernDashboard } from '@/pages/ModernDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const mockCategories = [
  { id: '1', name: 'AI News', count: 23, color: '#3B82F6' },
  { id: '2', name: 'Shopping', count: 15, color: '#10B981' },
  { id: '3', name: 'Events', count: 8, color: '#F59E0B' },
  { id: '4', name: 'Tech', count: 31, color: '#8B5CF6' },
  { id: '5', name: 'Finance', count: 12, color: '#EF4444' },
]

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const { fetchEmails, fetchCategories } = useEmailStore()

  useEffect(() => {
    fetchEmails()
    fetchCategories()
  }, [])

  const handleViewChange = (view: string) => {
    setCurrentView(view)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        unreadCount={5}
      />
      
      <div className="flex">
        <ModernSidebar
          isOpen={sidebarOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
          categories={mockCategories}
        />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <ModernDashboard />}
            {currentView === 'newspaper' && <NewspaperView />}
            {currentView === 'homepage' && <HomepageView />}
            {currentView === 'trending' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Trending Content</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            )}
            {currentView === 'starred' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Starred Items</h2>
                <p className="text-muted-foreground">Your starred content will appear here</p>
              </div>
            )}
            {currentView === 'recent' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Recent Emails</h2>
                <p className="text-muted-foreground">Recently received emails</p>
              </div>
            )}
            {currentView === 'archive' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Archive</h2>
                <p className="text-muted-foreground">Archived content</p>
              </div>
            )}
            {currentView === 'settings' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-muted-foreground">Application settings</p>
              </div>
            )}
            {currentView.startsWith('category-') && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Category View</h2>
                <p className="text-muted-foreground">
                  Viewing category: {currentView.replace('category-', '')}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App