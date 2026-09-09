import React, { useEffect, useState } from 'react'
import { Stethoscope, Mail, Phone, MapPin, Award, UserCheck } from 'lucide-react'

const accent = 'hsl(340, 75%, 45%)'
const accentLight = 'hsl(340, 75%, 93%)'

export default function DoctorProfile({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lid = user?.login_id || user?.Login_id || 4
    fetch(`/api/doctor/profile?login_id=${lid}`)
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setProfile(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  return (
    <div style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'Outfit, sans-serif' }}>
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Doctor Profile</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Your verified medical practitioner details and clinical credentials.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading profile...</div>
      ) : (
        <div className="glass" style={{ borderRadius: '24px', padding: '36px', maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: `linear-gradient(135deg, ${accent}, hsl(340,85%,60%))`,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(200,40,80,0.25)'
            }}>
              <Stethoscope size={36} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
                Dr. {profile?.First_Name} {profile?.Last_Name}
              </h3>
              <span className="badge" style={{ marginTop: '6px', background: accentLight, color: accent, fontWeight: 700 }}>
                {profile?.Specialization || 'Obstetrician & Gynecologist'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            {[
              { label: 'Specialization', value: profile?.Specialization, icon: Award },
              { label: 'Hospital / Clinic Location', value: profile?.Place, icon: MapPin },
              { label: 'Phone Number', value: profile?.Phone, icon: Phone },
              { label: 'Email Address', value: profile?.Email, icon: Mail },
              { label: 'Account Type', value: 'Verified Doctor / Medical Consultant', icon: UserCheck },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', background: accentLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <row.icon size={18} color={accent} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{row.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {row.value || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
