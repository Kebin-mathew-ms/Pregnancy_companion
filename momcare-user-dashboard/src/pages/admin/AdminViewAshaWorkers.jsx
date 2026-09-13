import React, { useEffect, useState } from 'react'
import { UserCheck, MapPin, Phone, Mail, RefreshCw } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

export default function AdminViewAshaWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/view_ashaworkers')
      .then(r => r.json())
      .then(d => { setWorkers(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = workers.filter(w => {
    const fn = w.First_Name || w.first_name || ''
    const ln = w.Last_Name || w.last_name || ''
    const pl = w.Place || w.place || ''
    return `${fn} ${ln} ${pl}`.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>ASHA Workers</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>All registered ASHA health workers in the system.</p>
        </div>
        <input
          className="form-control"
          placeholder="Search by name or place..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '12px', minWidth: '240px' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading ASHA workers...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No ASHA workers found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map((w, i) => {
            const firstName = w.First_Name || w.first_name || 'ASHA'
            const lastName = w.Last_Name || w.last_name || 'Worker'
            const place = w.Place || w.place || '—'
            const phone = w.Phone || w.phone || '—'
            const email = w.Email || w.email || '—'
            const wardId = w.Ward_id || w.ward_id || '—'

            const details = [
              { id: 'place', icon: MapPin, label: place },
              { id: 'phone', icon: Phone, label: phone },
              { id: 'email', icon: Mail, label: email },
            ]

            return (
              <div key={w.Asha_id || w.asha_id || i} className="glass" style={{
                borderRadius: '20px', padding: '24px',
                transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-glass)' }}
              >
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: `linear-gradient(135deg, hsl(160,65%,38%), hsl(150,65%,45%))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <UserCheck size={24} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{firstName} {lastName}</div>
                    <div style={{ fontSize: '12px', color: 'hsl(160,65%,38%)', fontWeight: 600 }}>ASHA Worker</div>
                  </div>
                </div>
                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {details.map(({ id, icon: Icon, label }) => (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Icon size={14} color={accent} />
                      <span>{label}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: '8px', padding: '6px 12px', borderRadius: '8px',
                    background: accentLight, color: accent, fontSize: '12px', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content'
                  }}>
                    <MapPin size={12} /> Ward ID: {wardId}
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
