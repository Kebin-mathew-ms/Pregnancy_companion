import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, User, Users, Calendar, MessageSquare, LogOut, Stethoscope } from 'lucide-react'

export default function DoctorSidebar({ user, onLogout }) {
  const navigate = useNavigate()

  const navItems = [
    { to: '/doctor',              name: 'Dashboard',         icon: Home,     end: true },
    { to: '/doctor/appointments', name: 'My Appointments',   icon: Calendar },
    { to: '/doctor/patients',     name: 'Patient Directory', icon: Users },
    { to: '/doctor/chat',         name: 'Patient Chat',      icon: MessageSquare },
    { to: '/doctor/profile',      name: 'My Profile',        icon: User },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  // Doctor accent: Crimson / Medical Rose
  const accent = 'hsl(340, 75%, 45%)'
  const accentLight = 'hsl(340, 75%, 93%)'

  return (
    <aside className="glass" style={{
      width: '280px', height: '100vh', position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column', padding: '30px 20px',
      borderRight: '1px solid var(--border-glass)', zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '10px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${accent} 0%, hsl(340, 85%, 60%) 100%)`,
          width: '42px', height: '42px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(200, 40, 80, 0.3)'
        }}>
          <Stethoscope size={22} color="white" />
        </div>
        <div>
          <h1 style={{
            fontSize: '22px', fontWeight: 800,
            background: `linear-gradient(135deg, ${accent} 0%, hsl(340,85%,60%) 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>MomCare</h1>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Doctor Portal</span>
        </div>
      </div>

      {/* Navigation */}
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
            background: `linear-gradient(135deg, ${accent}, hsl(340,85%,60%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Stethoscope size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{user?.uname || 'Doctor'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Medical Officer</div>
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
