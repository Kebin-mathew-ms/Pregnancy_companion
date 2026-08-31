import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Heart, 
  Home, 
  User, 
  Activity, 
  Calendar, 
  Clock, 
  MessageSquare, 
  LogOut 
} from 'lucide-react'

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard',        name: 'Dashboard',            icon: Home, end: true },
    { to: '/profile',          name: 'Maternal Profile',     icon: User },
    { to: '/growth',           name: 'Baby Growth',          icon: Activity },
    { to: '/diet-timeline',    name: 'Diet & Timeline',      icon: Calendar },
    { to: '/appointments',     name: 'Appointments & Vaccines', icon: Clock },
    { to: '/chat',             name: 'Chat & Help',          icon: MessageSquare }
  ]


  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <aside className="glass" style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      borderRight: '1px solid var(--border-glass)',
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        paddingLeft: '10px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, hsl(340, 85%, 60%) 100%)',
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(220, 60, 100, 0.3)'
        }}>
          <Heart size={22} color="white" fill="white" />
        </div>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>MomCare</h1>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Maternal Companion</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1
      }}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                fontSize: '15px',
                fontWeight: isActive ? 700 : 500,
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* User Footer Card */}
      {user && (
        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{user.Full_Name || user.uname}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Age: {user.Age || 'N/A'} yrs</div>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-outline" 
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '13px',
              borderRadius: '8px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </aside>
  )
}
