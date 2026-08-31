import React, { useEffect, useState } from 'react'
import { HeartHandshake, Users, MapPin, TrendingUp } from 'lucide-react'

const accent = 'hsl(160, 65%, 38%)'
const accentLight = 'hsl(160, 65%, 92%)'

export default function AshaHome({ user }) {
  const [assignedUsers, setAssignedUsers] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.login_id) return
    Promise.all([
      fetch(`/api/asha/view_users?login_id=${user.login_id}`).then(r => r.json()),
      fetch(`/api/asha/profile?login_id=${user.login_id}`).then(r => r.json()),
    ]).then(([usersData, profileData]) => {
      setAssignedUsers(usersData.data || [])
      setProfile(profileData.data || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const getWeeks = (lmp) => {
    if (!lmp) return null
    const diff = Math.floor((new Date() - new Date(lmp)) / (1000 * 60 * 60 * 24 * 7))
    return diff >= 0 && diff <= 42 ? diff : null
  }

  const thirdTrimester = assignedUsers.filter(u => {
    const w = getWeeks(u.LMP_date)
    return w !== null && w >= 28
  })

  return (
    <div style={{ padding: '40px' }}>
      {/* Welcome */}
      <div style={{
        borderRadius: '24px', padding: '32px 36px', marginBottom: '32px',
        background: `linear-gradient(135deg, ${accent} 0%, hsl(150,65%,45%) 100%)`,
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, fontSize: '120px' }}>💚</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
          <HeartHandshake size={36} color="white" />
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '2px' }}>
              Welcome, {profile?.First_Name || user?.uname || 'ASHA Worker'}!
            </h2>
            <p style={{ opacity: 0.85, fontSize: '14px' }}>
              {profile?.Ward_name ? `Ward: ${profile.Ward_name}` : 'Your ASHA Worker Dashboard'}
            </p>
          </div>
        </div>
        <p style={{ opacity: 0.9, fontSize: '14px', marginTop: '10px' }}>
          You are responsible for the health and wellbeing of {assignedUsers.length} pregnant woman/women in your ward.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: '36px' }}>
        {[
          { label: 'Assigned Users', value: loading ? '...' : assignedUsers.length, color: accent, bg: accentLight, icon: Users },
          { label: 'In 3rd Trimester', value: loading ? '...' : thirdTrimester.length, color: 'hsl(352,90%,60%)', bg: 'hsl(352,90%,94%)', icon: HeartHandshake },
          { label: 'Ward', value: loading ? '...' : (profile?.Ward_name || '—'), color: 'hsl(232,85%,60%)', bg: 'hsl(232,85%,94%)', icon: MapPin },
        ].map(s => (
          <div key={s.label} className="glass" style={{
            flex: '1 1 180px', padding: '24px', borderRadius: '18px',
            display: 'flex', alignItems: 'center', gap: '16px',
            transition: 'transform var(--transition-normal)'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: '50px', height: '50px', borderRadius: '14px',
              background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <s.icon size={24} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming/High-Priority Users */}
      {thirdTrimester.length > 0 && (
        <div className="glass" style={{ borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="hsl(352,90%,60%)" />
            <h3 style={{ fontWeight: 700, fontSize: '17px' }}>⚠️ Third Trimester — Needs Attention</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {thirdTrimester.slice(0, 5).map(u => (
              <div key={u.Users_id} style={{
                padding: '14px 18px', borderRadius: '12px',
                background: 'hsl(352,90%,97%)', border: '1px solid hsl(352,90%,87%)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, hsl(352,90%,70%), hsl(352,90%,85%))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '14px'
                  }}>{u.Full_Name?.[0] || '?'}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{u.Full_Name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Age: {u.Age} yrs</div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: '8px',
                  background: 'hsl(352,90%,94%)', color: 'hsl(352,90%,45%)',
                  fontSize: '12px', fontWeight: 700
                }}>Week {getWeeks(u.LMP_date)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
