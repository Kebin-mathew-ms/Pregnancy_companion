import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, User, Users, LogOut, HeartHandshake } from 'lucide-react'

export default function AshaSidebar({ user, onLogout }) {
  const navigate = useNavigate()

  const navItems = [
    { to: '/asha',         name: 'Dashboard',      icon: Home,   end: true },
    { to: '/asha/profile', name: 'My Profile',     icon: User },
    { to: '/asha/users',   name: 'Assigned Users', icon: Users },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  // ASHA accent: teal/green
  const accent = 'hsl(160, 65%, 38%)'
  const accentLight = 'hsl(160, 65%, 92%)'

  return (
    <aside className="glass" style={{
      width: '280px', height: '100vh', position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column', padding: '30px 20px',
      borderRight: '1px solid var(--border-glass)', zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '10px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${accent} 0%, hsl(150, 65%, 45%) 100%)`,
          width: '42px', height: '42px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(40, 160, 100, 0.3)'
        }}>
          <HeartHandshake size={22} color="white" />
        </div>
        <div>
          <h1 style={{
            fontSize: '22px', fontWeight: 800,
            background: `linear-gradient(135deg, ${accent} 0%, hsl(150,65%,45%) 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>MomCare</h1>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>ASHA Worker Portal</span>
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
            background: `linear-gradient(135deg, ${accent}, hsl(150,65%,45%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <HeartHandshake size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{user?.uname || 'ASHA Worker'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ASHA Worker</div>
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
