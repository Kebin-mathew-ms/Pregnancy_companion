import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Heart, Home, Users, UserCheck, Stethoscope,
  FileText, MessageSquare, MapPin, LogOut, Shield
} from 'lucide-react'

export default function AdminSidebar({ user, onLogout }) {
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin',            name: 'Dashboard',       icon: Home,         end: true },
    { to: '/admin/users',      name: 'View Users',      icon: Users },
    { to: '/admin/asha',       name: 'ASHA Workers',    icon: UserCheck },
    { to: '/admin/doctors',    name: 'Manage Doctors',  icon: Stethoscope },
    { to: '/admin/wards',      name: 'Manage Wards',    icon: MapPin },
    { to: '/admin/posts',      name: 'Govt. Posts',     icon: FileText },
    { to: '/admin/complaints', name: 'Complaints',      icon: MessageSquare },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  // Admin accent: indigo/blue
  const accent = 'hsl(232, 85%, 60%)'
  const accentLight = 'hsl(232, 85%, 94%)'

  return (
    <aside className="glass" style={{
      width: '280px', height: '100vh', position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column', padding: '30px 20px',
      borderRight: '1px solid var(--border-glass)', zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '10px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${accent} 0%, hsl(250, 80%, 65%) 100%)`,
          width: '42px', height: '42px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(100, 80, 220, 0.3)'
        }}>
          <Shield size={22} color="white" />
        </div>
        <div>
          <h1 style={{
            fontSize: '22px', fontWeight: 800,
            background: `linear-gradient(135deg, ${accent} 0%, hsl(250,80%,65%) 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>MomCare</h1>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '13px 16px', fontSize: '14px',
                fontWeight: isActive ? 700 : 500, borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? accent : 'var(--text-secondary)',
                background: isActive ? accentLight : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{user?.uname || 'Admin'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Administrator</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline"
          style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: '8px' }}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  )
}
