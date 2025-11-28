import React from 'react'
import { Menu, Bell, Search, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface HeaderProps {
  onMenuToggle: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user } = useAuthStore()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative ml-4 lg:ml-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.full_name || 'Utilisateur'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role || 'Role'}
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}