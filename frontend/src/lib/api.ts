import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Email {
  id: string
  subject: string
  sender_email: string
  sender_name?: string
  received_at: string
  processed: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
  description?: string
}

export interface AnalyzedContent {
  id: string
  email_id: string
  category: string
  importance_score: number
  title_optimized: string
  summary: string
  content_markdown: string
  key_points: string[]
  tags: string[]
  images: Array<{
    url: string
    alt: string
    caption?: string
  }>
  important_links: string[]
  reading_time: number
  sentiment: 'positive' | 'neutral' | 'negative'
  action_items: string[]
  created_at: string
}

export interface DailySummary {
  id: string
  date: string
  content_markdown: string
  total_emails: number
  categories_summary: Record<string, any>
  created_at: string
}

export interface UserPreference {
  id: string
  category_weights: Record<string, number>
  layout_preference: 'newspaper' | 'homepage'
  theme: 'light' | 'dark'
  notification_settings: Record<string, any>
}

export const emailApi = {
  getEmails: async (params?: { skip?: number; limit?: number; processed?: boolean }) => {
    const response = await api.get<Email[]>('/emails', { params })
    return response.data
  },
  
  getEmail: async (id: string) => {
    const response = await api.get<Email>(`/emails/${id}`)
    return response.data
  },
  
  analyzeEmail: async (id: string) => {
    const response = await api.post(`/emails/${id}/analyze`)
    return response.data
  },
}

export const categoryApi = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },
  
  createCategory: async (data: Omit<Category, 'id'>) => {
    const response = await api.post<Category>('/categories', data)
    return response.data
  },
  
  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await api.put<Category>(`/categories/${id}`, data)
    return response.data
  },
  
  deleteCategory: async (id: string) => {
    await api.delete(`/categories/${id}`)
  },
}

export const summaryApi = {
  getDailySummary: async (date?: string) => {
    const response = await api.get<DailySummary>('/summaries/daily', {
      params: date ? { summary_date: date } : undefined
    })
    return response.data
  },
  
  generateSummary: async (date?: string) => {
    const response = await api.post('/summaries/generate', null, {
      params: date ? { summary_date: date } : undefined
    })
    return response.data
  },
}

export const analyticsApi = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview')
    return response.data
  },
  
  getTrends: async (days: number = 30) => {
    const response = await api.get('/analytics/trends', {
      params: { days }
    })
    return response.data
  },
}

export const preferencesApi = {
  getPreferences: async () => {
    const response = await api.get<UserPreference>('/preferences')
    return response.data
  },
  
  updatePreferences: async (data: Partial<UserPreference>) => {
    const response = await api.put<UserPreference>('/preferences', data)
    return response.data
  },
}

export default api