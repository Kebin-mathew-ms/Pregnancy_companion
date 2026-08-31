import React, { useEffect, useState } from 'react'
import { HeartHandshake, MapPin, Phone, Mail, User, Venus } from 'lucide-react'

const accent = 'hsl(160, 65%, 38%)'
const accentLight = 'hsl(160, 65%, 92%)'

export default function AshaProfile({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.login_id) return
    fetch(`/api/asha/profile?login_id=${user.login_id}`)
      .then(r => r.json())
      .then(d => { setProfile(d.data || null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading profile...</div>
  )
  if (!profile) return (
    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Profile not found.</div>
  )

  const details = [
    { icon: User,          label: 'Full Name',    value: `${profile.First_Name} ${profile.Last_Name}` },
    { icon: Venus,         label: 'Gender',       value: profile.Gender || '—' },
    { icon: MapPin,        label: 'Place',        value: profile.Place || '—' },
    { icon: Phone,         label: 'Phone',        value: profile.Phone || '—' },
    { icon: Mail,          label: 'Email',        value: profile.Email || '—' },
    { icon: MapPin,        label: 'Ward',         value: profile.Ward_name || '—' },
  ]

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>My Profile</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your ASHA worker details and ward assignment.</p>
      </div>

      {/* Profile card */}
      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', maxWidth: '680px' }}>
        {/* Banner */}
        <div style={{
          padding: '32px 36px',
          background: `linear-gradient(135deg, ${accent} 0%, hsl(150,65%,45%) 100%)`,
          display: 'flex', alignItems: 'center', gap: '20px'
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0
          }}>
            <HeartHandshake size={34} color="white" />
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{profile.First_Name} {profile.Last_Name}</div>
            <div style={{ opacity: 0.85, fontSize: '14px', marginTop: '4px' }}>ASHA Community Health Worker</div>
            <div style={{
              marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '4px 12px',
              fontSize: '12px', fontWeight: 600
            }}>
              <MapPin size={12} /> {profile.Ward_name || 'Unassigned Ward'}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '28px 36px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '18px', color: 'var(--text-secondary)' }}>
            PERSONAL DETAILS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                padding: '16px 18px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={17} color={accent} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.4px' }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
