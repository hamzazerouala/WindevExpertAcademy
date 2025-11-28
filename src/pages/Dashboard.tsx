import React, { useEffect, useState } from 'react'
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react'
import { KPIWidget } from '@/components/dashboard/KPIWidget'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { supabase } from '@/lib/supabase'
import { DashboardStats, RevenueData } from '@/types/database'

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    publishedCourses: 0,
    completionRate: 0,
    newEnrollmentsThisMonth: 0
  })

  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch revenue data
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('status', 'completed')

      // Fetch course data
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, is_published')

      // Fetch enrollment data
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select('id, user_id, progress_percentage, enrolled_at, is_active')

      // Calculate stats
      const totalRevenue = revenueData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0
      const totalCourses = coursesData?.length || 0
      const publishedCourses = coursesData?.filter(course => course.is_published).length || 0
      const totalStudents = new Set(enrollmentsData?.map(e => e.user_id)).size || 0
      const activeStudents = enrollmentsData?.filter(e => e.is_active).length || 0
      const completionRate = enrollmentsData?.length > 0 
        ? (enrollmentsData.filter(e => e.progress_percentage >= 100).length / enrollmentsData.length) * 100 
        : 0

      // Monthly revenue (current month)
      const currentMonth = new Date().getMonth()
      const monthlyRevenue = revenueData
        ?.filter(t => new Date(t.created_at).getMonth() === currentMonth)
        .reduce((sum, transaction) => sum + transaction.amount, 0) || 0

      // New enrollments this month
      const newEnrollmentsThisMonth = enrollmentsData
        ?.filter(e => new Date(e.enrolled_at).getMonth() === currentMonth).length || 0

      setStats({
        totalRevenue,
        monthlyRevenue,
        totalStudents,
        activeStudents,
        totalCourses,
        publishedCourses,
        completionRate: Math.round(completionRate * 10) / 10,
        newEnrollmentsThisMonth
      })

      // Generate mock revenue chart data for the last 6 months
      const mockRevenueData: RevenueData[] = [
        { month: 'Jan', revenue: 12500, enrollments: 45 },
        { month: 'Fév', revenue: 15800, enrollments: 62 },
        { month: 'Mar', revenue: 18200, enrollments: 78 },
        { month: 'Avr', revenue: 22100, enrollments: 95 },
        { month: 'Mai', revenue: 19800, enrollments: 82 },
        { month: 'Jun', revenue: monthlyRevenue || 25600, enrollments: newEnrollmentsThisMonth || 108 }
      ]
      setRevenueData(mockRevenueData)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIWidget
          title="Revenus mensuels"
          value={`€${stats.monthlyRevenue.toLocaleString()}`}
          change={12.5}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <KPIWidget
          title="Étudiants actifs"
          value={stats.activeStudents}
          change={8.2}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <KPIWidget
          title="Cours publiés"
          value={stats.publishedCourses}
          change={0}
          icon={<BookOpen className="w-6 h-6" />}
          color="orange"
        />
        <KPIWidget
          title="Taux de complétion"
          value={`${stats.completionRate}%`}
          change={-2.1}
          icon={<CheckCircle className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouvelle inscription</p>
                <p className="text-xs text-gray-500">Marie Dupont s'est inscrite à "React Avancé"</p>
              </div>
              <span className="text-xs text-gray-400">Il y a 2h</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cours complété</p>
                <p className="text-xs text-gray-500">Jean Martin a terminé "JavaScript Basics"</p>
              </div>
              <span className="text-xs text-gray-400">Il y a 4h</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau ticket</p>
                <p className="text-xs text-gray-500">Support requis pour "Python Fundamentals"</p>
              </div>
              <span className="text-xs text-gray-400">Il y a 6h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Alertes</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-800">3 tickets de support non lus</span>
            </div>
            <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
              Voir
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800">Mise à jour du système prévue ce soir</span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Détails
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}