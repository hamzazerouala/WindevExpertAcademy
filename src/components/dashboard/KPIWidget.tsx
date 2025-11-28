import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPIWidgetProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
}

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color 
}) => {
  const renderTrend = () => {
    if (change === undefined) return null
    
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+{change}%</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-600 text-sm">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span>{change}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-gray-600 text-sm">
          <Minus className="w-4 h-4 mr-1" />
          <span>0%</span>
        </div>
      )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {renderTrend()}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <div className={iconColorClasses[color]}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}