import { create } from 'zustand'
import { emailApi, categoryApi } from '@/lib/api'
import type { Email, Category, AnalyzedContent } from '@/lib/api'

interface EmailState {
  emails: Email[]
  categories: Category[]
  analyzedContent: AnalyzedContent[]
  selectedEmail: Email | null
  loading: boolean
  error: string | null
  
  fetchEmails: () => Promise<void>
  fetchCategories: () => Promise<void>
  selectEmail: (email: Email | null) => void
  analyzeEmail: (id: string) => Promise<void>
}

export const useEmailStore = create<EmailState>((set, get) => ({
  emails: [],
  categories: [],
  analyzedContent: [],
  selectedEmail: null,
  loading: false,
  error: null,
  
  fetchEmails: async () => {
    set({ loading: true, error: null })
    try {
      const emails = await emailApi.getEmails()
      set({ emails, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch emails', loading: false })
      console.error('Error fetching emails:', error)
    }
  },
  
  fetchCategories: async () => {
    try {
      const categories = await categoryApi.getCategories()
      set({ categories })
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  },
  
  selectEmail: (email) => {
    set({ selectedEmail: email })
  },
  
  analyzeEmail: async (id) => {
    try {
      await emailApi.analyzeEmail(id)
      const { fetchEmails } = get()
      await fetchEmails()
    } catch (error) {
      console.error('Error analyzing email:', error)
    }
  },
}))