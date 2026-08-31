import React, { useEffect, useState } from 'react'
import { Users, UserCheck, Stethoscope, MessageSquare, MapPin, TrendingUp, AlertCircle } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="glass" style={{
      borderRadius: '20px', padding: '28px 24px',
      display: 'flex', alignItems: 'center', gap: '20px',
      flex: '1 1 200px', minWidth: '180px',
      transition: 'transform var(--transition-normal)',
      cursor: 'default'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: `0 4px 14px ${color}33`
      }}>
        <Icon size={26} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value ?? '—'}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: null, asha: null, doctors: null, complaints: null, wards: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, ashaRes, doctorsRes, complaintsRes, wardsRes] = await Promise.all([
          fetch('/api/admin/view_users').then(r => r.json()),
          fetch('/api/view_ashaworkers').then(r => r.json()),
          fetch('/api/view_doctors').then(r => r.json()),
          fetch('/api/admin/all_complaints').then(r => r.json()),
          fetch('/api/getward').then(r => r.json()),
        ])
        setStats({
          users:      usersRes.data?.length ?? 0,
          asha:       ashaRes.data?.length ?? 0,
          doctors:    doctorsRes.data?.length ?? 0,
          complaints: complaintsRes.data?.length ?? 0,
          wards:      wardsRes.data?.length ?? 0,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Admin Dashboard
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Overview of the MomCare platform statistics
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon={Users}        label="Total Users"       value={loading ? '...' : stats.users}       color="hsl(352,90%,60%)" bg="hsl(352,90%,94%)" />
        <StatCard icon={UserCheck}    label="ASHA Workers"      value={loading ? '...' : stats.asha}        color="hsl(160,65%,38%)" bg="hsl(160,65%,92%)" />
        <StatCard icon={Stethoscope}  label="Doctors"           value={loading ? '...' : stats.doctors}     color={accent}           bg={accentLight} />
        <StatCard icon={MapPin}       label="Wards"             value={loading ? '...' : stats.wards}       color="hsl(45,95%,45%)"  bg="hsl(45,95%,90%)" />
        <StatCard icon={MessageSquare} label="Complaints"       value={loading ? '...' : stats.complaints}  color="hsl(197,85%,40%)" bg="hsl(197,85%,92%)" />
      </div>

      {/* Quick Tips */}
      <div className="glass" style={{ borderRadius: '20px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <TrendingUp size={22} color={accent} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Actions Guide</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {[
            { title: 'Manage Wards', desc: 'Add or remove geographic wards for ASHA assignment', icon: MapPin },
            { title: 'ASHA Workers', desc: 'View all registered ASHA workers and their wards', icon: UserCheck },
            { title: 'Manage Doctors', desc: 'Add specialist doctors available to users', icon: Stethoscope },
            { title: 'View Users', desc: 'See all registered pregnant women in the system', icon: Users },
            { title: 'Govt. Posts', desc: 'Publish and manage Kerala government schemes', icon: AlertCircle },
            { title: 'Complaints', desc: 'Review and reply to user-submitted complaints', icon: MessageSquare },
          ].map(tip => (
            <div key={tip.title} style={{
              padding: '16px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)',
              display: 'flex', gap: '12px', alignItems: 'flex-start'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <tip.icon size={18} color={accent} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '3px' }}>{tip.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
