import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signIn: async (email: string, password: string) => {
    try {
      // Mock authentication for demo purposes when Supabase is not configured
      if (supabaseUrl.includes('placeholder')) {
        const mockUser: User = {
          id: 'demo-user-id',
          email: email,
          full_name: 'Demo User',
          role: 'instructor',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        set({ 
          user: mockUser, 
          isAuthenticated: true,
          isLoading: false 
        })
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userData) {
          set({ 
            user: userData as User, 
            isAuthenticated: true,
            isLoading: false 
          })
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      })
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  checkAuth: async () => {
    try {
      // Mock authentication for demo purposes when Supabase is not configured
      if (supabaseUrl.includes('placeholder')) {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        })
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userData) {
          set({ 
            user: userData as User, 
            isAuthenticated: true,
            isLoading: false 
          })
        }
      } else {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      })
    }
  },
}))