import React, { useEffect, useState } from 'react'
import { Users, MapPin, Droplets, Activity } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

export default function AdminViewUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/view_users')
      .then(r => r.json())
      .then(d => { setUsers(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    `${u.Full_Name} ${u.Ward_name}`.toLowerCase().includes(search.toLowerCase())
  )

  const getWeeks = (lmp) => {
    if (!lmp) return '—'
    const now = new Date()
    const lmpDate = new Date(lmp)
    const diff = Math.floor((now - lmpDate) / (1000 * 60 * 60 * 24 * 7))
    return diff >= 0 && diff <= 42 ? `${diff}w` : '—'
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Registered Users</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>All pregnant women registered in the MomCare system.</p>
        </div>
        <input
          className="form-control"
          placeholder="Search by name or ward..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '12px', minWidth: '240px' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading users...</div>
      ) : (
        <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color={accent} />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Total: {filtered.length} users</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: accentLight }}>
                  {['#', 'Name', 'Age', 'Ward', 'Gestational Age', 'Blood Group', 'Blood Pressure'].map(h => (
                    <th key={h} style={{
                      padding: '12px 18px', textAlign: 'left', fontSize: '12px',
                      fontWeight: 700, color: accent, letterSpacing: '0.5px', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.Users_id} style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background var(--transition-fast)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px', height: '34px', borderRadius: '50%',
                          background: `linear-gradient(135deg, hsl(352,90%,70%), hsl(352,90%,85%))`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: 800, color: 'white', flexShrink: 0
                        }}>{u.Full_Name?.[0] || '?'}</div>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{u.Full_Name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '14px' }}>{u.Age ?? '—'} yrs</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: accentLight, color: accent,
                        padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content'
                      }}>
                        <MapPin size={11} />{u.Ward_name || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: 600 }}>{getWeeks(u.LMP_date)}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '13px', color: 'hsl(352,90%,50%)', fontWeight: 600
                      }}><Droplets size={13} />{u.Blood_Group || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '13px', color: 'hsl(160,65%,38%)', fontWeight: 600
                      }}><Activity size={13} />{u.Blood_Pressure || '—'}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
