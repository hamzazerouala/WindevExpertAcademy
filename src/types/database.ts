export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'instructor' | 'admin'
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  instructor_id: string
  title: string
  description?: string
  price: number
  currency: string
  is_published: boolean
  category?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  estimated_hours?: number
  thumbnail_url?: string
  welcome_message?: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: any // JSON content
  order_index: number
  video_url?: string
  duration_minutes?: number
  is_free_preview: boolean
  resources?: string[]
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  enrolled_at: string
  completed_at?: string
  is_active: boolean
}

export interface Transaction {
  id: string
  user_id: string
  course_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'refunded' | 'failed'
  payment_method: string
  stripe_payment_intent_id?: string
  refund_reason?: string
  refund_amount?: number
  refunded_at?: string
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  course_id?: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  resolution_notes?: string
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface ForumCategory {
  id: string
  name: string
  description?: string
  order_index: number
  is_active: boolean
}

export interface ForumPost {
  id: string
  category_id: string
  user_id: string
  title: string
  content: string
  is_pinned: boolean
  is_locked: boolean
  reported_count: number
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalRevenue: number
  monthlyRevenue: number
  totalStudents: number
  activeStudents: number
  totalCourses: number
  publishedCourses: number
  completionRate: number
  newEnrollmentsThisMonth: number
}

export interface RevenueData {
  month: string
  revenue: number
  enrollments: number
}

export interface CourseStats {
  courseId: string
  title: string
  enrollments: number
  completionRate: number
  revenue: number
  averageRating: number
}