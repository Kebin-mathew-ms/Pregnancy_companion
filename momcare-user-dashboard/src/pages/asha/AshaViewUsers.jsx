import React, { useEffect, useState } from 'react'
import { Users, MapPin, Droplets, Activity, Calendar } from 'lucide-react'

const accent = 'hsl(160, 65%, 38%)'
const accentLight = 'hsl(160, 65%, 92%)'

export default function AshaViewUsers({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user?.login_id) return
    fetch(`/api/asha/view_users?login_id=${user.login_id}`)
      .then(r => r.json())
      .then(d => { setUsers(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const getWeeks = (lmp) => {
    if (!lmp) return null
    const diff = Math.floor((new Date() - new Date(lmp)) / (1000 * 60 * 60 * 24 * 7))
    return diff >= 0 && diff <= 42 ? diff : null
  }

  const getTrimester = (weeks) => {
    if (weeks === null) return null
    if (weeks < 14) return { label: '1st Trimester', color: 'hsl(232,85%,60%)', bg: 'hsl(232,85%,94%)' }
    if (weeks < 28) return { label: '2nd Trimester', color: 'hsl(45,95%,45%)', bg: 'hsl(45,95%,90%)' }
    return { label: '3rd Trimester', color: 'hsl(352,90%,55%)', bg: 'hsl(352,90%,94%)' }
  }

  const filtered = users.filter(u =>
    `${u.Full_Name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Assigned Users</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Pregnant women in your ward — {users.length} total
          </p>
        </div>
        <input
          className="form-control"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '12px', minWidth: '220px' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading users...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No users found in your ward.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {filtered.map(u => {
            const weeks = getWeeks(u.LMP_date)
            const trimester = getTrimester(weeks)
            const daysLeft = weeks !== null ? Math.round((280 - weeks * 7)) : null
            return (
              <div key={u.Users_id} className="glass" style={{
                borderRadius: '20px', padding: '22px',
                transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
                borderLeft: trimester ? `4px solid ${trimester.color}` : '4px solid var(--border)'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-glass)' }}
              >
                {/* Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${accent}, hsl(150,65%,45%))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '18px'
                    }}>{u.Full_Name?.[0] || '?'}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{u.Full_Name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Age: {u.Age} yrs</div>
                    </div>
                  </div>
                  {trimester && (
                    <span style={{
                      padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                      background: trimester.bg, color: trimester.color, whiteSpace: 'nowrap'
                    }}>{trimester.label}</span>
                  )}
                </div>

                {/* Pregnancy info */}
                {weeks !== null && (
                  <div style={{
                    padding: '12px 14px', borderRadius: '12px', marginBottom: '12px',
                    background: accentLight, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color={accent} />
                      <span style={{ fontSize: '13px', color: accent, fontWeight: 700 }}>Week {weeks}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: accent, fontWeight: 600 }}>
                      {daysLeft > 0 ? `${daysLeft} days to due` : 'Past due'}
                    </span>
                  </div>
                )}

                {/* Health indicators */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {u.Blood_Group && (
                    <div style={{
                      padding: '5px 10px', borderRadius: '8px', background: 'hsl(352,90%,94%)',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      fontSize: '12px', color: 'hsl(352,90%,50%)', fontWeight: 600
                    }}>
                      <Droplets size={12} /> {u.Blood_Group}
                    </div>
                  )}
                  {u.Blood_Pressure && (
                    <div style={{
                      padding: '5px 10px', borderRadius: '8px', background: 'hsl(160,65%,92%)',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      fontSize: '12px', color: 'hsl(160,65%,30%)', fontWeight: 600
                    }}>
                      <Activity size={12} /> BP: {u.Blood_Pressure}
                    </div>
                  )}
                  <div style={{
                    padding: '5px 10px', borderRadius: '8px', background: 'hsl(232,85%,94%)',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', color: 'hsl(232,85%,55%)', fontWeight: 600
                  }}>
                    <MapPin size={12} /> {u.Ward_name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
