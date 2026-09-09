import React, { useEffect, useState } from 'react'
import { Users, Droplets, Activity, MapPin, Calendar, Search } from 'lucide-react'

const accent = 'hsl(340, 75%, 45%)'
const accentLight = 'hsl(340, 75%, 93%)'

export default function DoctorPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/view_users')
      .then(r => r.json())
      .then(d => { setPatients(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = patients.filter(p =>
    `${p.Full_Name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Patient Directory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Registered pregnant women directory and health vitals — {patients.length} total
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-control"
            placeholder="Search patient name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '12px', fontSize: '13px', minWidth: '240px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading patients...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No patients found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(p => (
            <div key={p.Users_id} className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${accent}, hsl(340,85%,60%))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '18px'
                }}>
                  {p.Full_Name?.[0] || 'P'}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{p.Full_Name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Age: {p.Age || 'N/A'} yrs | LMP: {p.LMP_date ? (p.LMP_date.split('T')[0] || p.LMP_date) : 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '6px 12px', borderRadius: '8px', background: 'hsl(352,90%,94%)',
                  fontSize: '12px', color: 'hsl(352,90%,50%)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Droplets size={13} /> {p.Blood_Group || 'O+'}
                </div>
                <div style={{
                  padding: '6px 12px', borderRadius: '8px', background: accentLight,
                  fontSize: '12px', color: accent, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Activity size={13} /> BP: {p.Blood_Pressure || '120/80'}
                </div>
                <div style={{
                  padding: '6px 12px', borderRadius: '8px', background: 'hsl(232,85%,94%)',
                  fontSize: '12px', color: 'hsl(232,85%,55%)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <MapPin size={13} /> {p.Ward_name || 'Ward'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
