import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Courses } from '@/pages/Courses'
import { Finance } from '@/pages/Finance'
import { Students } from '@/pages/Students'
import { Support } from '@/pages/Support'
import { Forum } from '@/pages/Forum'
import { Settings } from '@/pages/Settings'
import { useAuthStore } from '@/stores/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/students" element={<Students />} />
          <Route path="/support" element={<Support />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App