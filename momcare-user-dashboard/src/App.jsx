import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

// Page Placeholders (to be implemented)
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardOverview from './pages/DashboardOverview'
import MaternalProfile from './pages/MaternalProfile'
import BabyGrowth from './pages/BabyGrowth'
import DietAndTimeline from './pages/DietAndTimeline'
import AppointmentsAndMeds from './pages/AppointmentsAndMeds'
import ChatAndHelp from './pages/ChatAndHelp'

// Layout component wrapping dashboard pages
function DashboardLayout({ user, onLogout }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on startup and refresh from server
  useEffect(() => {
    const cachedUser = localStorage.getItem('momcare_user')
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser)
        setUser(parsedUser)
        
        // Fetch fresh profile from backend
        if (parsedUser.user_id) {
          fetch(`/api/view_profile?user_id=${parsedUser.user_id}`)
            .then(res => res.json())
            .then(data => {
              if (data.status === 'success' && data.data && data.data.length > 0) {
                const dbUser = data.data[0]
                const updatedUser = {
                  ...parsedUser,
                  Full_Name: dbUser.Full_Name,
                  Age: dbUser.Age,
                  Ward_id: dbUser.Ward_id,
                  LMP_date: dbUser.LMP_date,
                  Blood_Group: dbUser.Blood_Group,
                  Blood_Pressure: dbUser.Blood_Pressure,
                  Thyroid_Levels: dbUser.Thyroid_Levels
                }
                setUser(updatedUser)
                localStorage.setItem('momcare_user', JSON.stringify(updatedUser))
              }
            })
            .catch(err => console.error('Error refreshing profile:', err))
        }
      } catch (e) {
        console.error('Error parsing cached user:', e)
        localStorage.removeItem('momcare_user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('momcare_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('momcare_user')
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}>Loading MomCare...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" replace /> : <Register />} 
        />

        {/* Dashboard Pages */}
        <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<DashboardOverview user={user} />} />
          <Route path="/profile" element={<MaternalProfile user={user} onProfileUpdate={handleLogin} />} />
          <Route path="/growth" element={<BabyGrowth user={user} />} />
          <Route path="/diet-timeline" element={<DietAndTimeline user={user} />} />
          <Route path="/appointments" element={<AppointmentsAndMeds user={user} />} />
          <Route path="/chat" element={<ChatAndHelp user={user} />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
