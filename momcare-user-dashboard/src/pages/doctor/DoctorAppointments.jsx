import React, { useEffect, useState } from 'react'
import { Calendar, User, Clock, FileText, CheckCircle, Search } from 'lucide-react'

const accent = 'hsl(340, 75%, 45%)'
const accentLight = 'hsl(340, 75%, 93%)'

export default function DoctorAppointments({ user }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const lid = user?.login_id || user?.Login_id || 4
    fetch(`/api/doctor/appointments?login_id=${lid}`)
      .then(r => r.json())
      .then(d => { setAppointments(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const filtered = appointments.filter(a =>
    `${a.Full_Name}`.toLowerCase().includes(search.toLowerCase()) ||
    `${a.Previous_appointment_notes}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>My Appointments</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Clinical consultations and checkup logs scheduled for your patients — {appointments.length} total
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-control"
            placeholder="Search patient or notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '12px', fontSize: '13px', minWidth: '240px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No matching appointments found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filtered.map(a => (
            <div key={a.Appointment_id} className="glass" style={{ borderRadius: '20px', padding: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: accentLight, color: accent, fontWeight: 800, fontSize: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {a.Full_Name?.[0] || 'P'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{a.Full_Name || 'Patient'}</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Age: {a.Age || 'N/A'} yrs | Blood Group: <strong>{a.Blood_Group || 'O+'}</strong> | BP: <strong>{a.Blood_Pressure || 'Normal'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '8px 16px', borderRadius: '12px', background: accentLight, color: accent,
                  fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Calendar size={15} /> Scheduled: {a.Next_appointment_date || 'TBD'}
                </div>
              </div>

              {/* Consultation Notes */}
              <div style={{
                background: 'rgba(255,255,255,0.7)',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} color={accent} /> Clinical Notes & Observations:
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                  {a.Previous_appointment_notes || 'Routine antenatal examination.'}
                </p>
              </div>

              {a.Notifications && (
                <div style={{ fontSize: '12px', color: accent, fontWeight: 600, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={13} /> Recommendation: {a.Notifications}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
