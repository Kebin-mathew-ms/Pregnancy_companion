import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

// Sidebars
import Sidebar from './components/Sidebar'
import AdminSidebar from './components/AdminSidebar'
import AshaSidebar from './components/AshaSidebar'

// User pages
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardOverview from './pages/DashboardOverview'
import MaternalProfile from './pages/MaternalProfile'
import BabyGrowth from './pages/BabyGrowth'
import DietAndTimeline from './pages/DietAndTimeline'
import AppointmentsAndMeds from './pages/AppointmentsAndMeds'
import ChatAndHelp from './pages/ChatAndHelp'
import GovtSchemes from './pages/GovtSchemes'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminManageWards from './pages/admin/AdminManageWards'
import AdminViewAshaWorkers from './pages/admin/AdminViewAshaWorkers'
import AdminManageDoctors from './pages/admin/AdminManageDoctors'
import AdminViewUsers from './pages/admin/AdminViewUsers'
import AdminManagePosts from './pages/admin/AdminManagePosts'
import AdminManageComplaints from './pages/admin/AdminManageComplaints'

// ASHA Worker pages
import AshaHome from './pages/asha/AshaHome'
import AshaProfile from './pages/asha/AshaProfile'
import AshaViewUsers from './pages/asha/AshaViewUsers'
import AshaChat from './pages/asha/AshaChat'

// ─── Layout: Regular User ───────────────────────────────
function DashboardLayout({ user, onLogout }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.utype === 'admin') return <Navigate to="/admin" replace />
  if (user.utype === 'asha') return <Navigate to="/asha" replace />
  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content"><Outlet /></main>
    </div>
  )
}

// ─── Layout: Admin ──────────────────────────────────────
function AdminLayout({ user, onLogout }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.utype !== 'admin') return <Navigate to="/" replace />
  return (
    <div className="dashboard-container">
      <AdminSidebar user={user} onLogout={onLogout} />
      <main className="main-content"><Outlet /></main>
    </div>
  )
}

// ─── Layout: ASHA Worker ────────────────────────────────
function AshaLayout({ user, onLogout }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.utype !== 'asha') return <Navigate to="/" replace />
  return (
    <div className="dashboard-container">
      <AshaSidebar user={user} onLogout={onLogout} />
      <main className="main-content"><Outlet /></main>
    </div>
  )
}

// ─── Root Redirect based on utype ───────────────────────
function RootRedirect({ user }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.utype === 'admin') return <Navigate to="/admin" replace />
  if (user.utype === 'asha') return <Navigate to="/asha" replace />
  return <Navigate to="/dashboard" replace />
}

// ─── Login redirect by role ────────────────────────────
function LoginRedirect({ user, onLogin }) {
  if (user) {
    if (user.utype === 'admin') return <Navigate to="/admin" replace />
    if (user.utype === 'asha') return <Navigate to="/asha" replace />
    return <Navigate to="/dashboard" replace />
  }
  return <Login onLogin={onLogin} />
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cachedUser = localStorage.getItem('momcare_user')
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser)
        setUser(parsedUser)

        // Only refresh profile for regular users
        if (parsedUser.utype === 'user' && parsedUser.user_id) {
          fetch(`/api/view_profile?user_id=${parsedUser.user_id}`)
            .then(res => res.json())
            .then(data => {
              if (data.status === 'success' && data.data?.length > 0) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>Loading MomCare...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth ── */}
        <Route path="/login" element={<LoginRedirect user={user} onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/" element={<RootRedirect user={user} />} />

        {/* ── Regular User Dashboard ── */}
        <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<DashboardOverview user={user} />} />
          <Route path="/profile" element={<MaternalProfile user={user} onProfileUpdate={handleLogin} />} />
          <Route path="/growth" element={<BabyGrowth user={user} />} />
          <Route path="/diet-timeline" element={<DietAndTimeline user={user} />} />
          <Route path="/appointments" element={<AppointmentsAndMeds user={user} />} />
          <Route path="/schemes" element={<GovtSchemes user={user} />} />
          <Route path="/chat" element={<ChatAndHelp user={user} />} />
        </Route>

        {/* ── Admin Dashboard ── */}
        <Route element={<AdminLayout user={user} onLogout={handleLogout} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminViewUsers />} />
          <Route path="/admin/asha" element={<AdminViewAshaWorkers />} />
          <Route path="/admin/doctors" element={<AdminManageDoctors />} />
          <Route path="/admin/wards" element={<AdminManageWards />} />
          <Route path="/admin/posts" element={<AdminManagePosts />} />
          <Route path="/admin/complaints" element={<AdminManageComplaints />} />
        </Route>

        {/* ── ASHA Worker Dashboard ── */}
        <Route element={<AshaLayout user={user} onLogout={handleLogout} />}>
          <Route path="/asha" element={<AshaHome user={user} />} />
          <Route path="/asha/profile" element={<AshaProfile user={user} />} />
          <Route path="/asha/users" element={<AshaViewUsers user={user} />} />
          <Route path="/asha/chat" element={<AshaChat user={user} />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
