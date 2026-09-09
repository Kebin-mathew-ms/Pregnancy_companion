import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, Calendar, Users, Activity, Clock, ArrowRight } from 'lucide-react'

const accent = 'hsl(340, 75%, 45%)'
const accentLight = 'hsl(340, 75%, 93%)'

export default function DoctorHome({ user }) {
  const [profile, setProfile] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lid = user?.login_id || user?.Login_id || 4
    // Profile
    fetch(`/api/doctor/profile?login_id=${lid}`)
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setProfile(d.data) })
      .catch(e => console.error(e))

    // Appointments
    fetch(`/api/doctor/appointments?login_id=${lid}`)
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setAppointments(d.data || []) })
      .catch(e => console.error(e))

    // Patients
    fetch('/api/admin/view_users')
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setPatients(d.data || []) })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="animate-fade-in" style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Header Banner */}
      <header className="glass" style={{
        padding: '30px 40px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, hsl(340, 75%, 94%) 0%, hsl(197, 85%, 94%) 100%)',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '10px', background: accent, color: 'white' }}>
            Doctor Portal
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Welcome, Dr. {profile ? `${profile.First_Name} ${profile.Last_Name}` : user?.uname}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Specialization: <strong>{profile?.Specialization || 'Obstetrics & Gynaecology'}</strong> | Location: {profile?.Place || 'Hospital'}
          </p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '12px 24px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid var(--border-glass)'
        }}>
          <Stethoscope size={30} color={accent} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{appointments.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Appointments</div>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Scheduled Appointments', value: appointments.length, icon: Calendar, color: accent, bg: accentLight },
          { label: 'Registered Pregnant Women', value: patients.length, icon: Users, color: 'hsl(232, 85%, 60%)', bg: 'hsl(232, 85%, 94%)' },
          { label: 'Active Clinical Checkups', value: appointments.filter(a => a.Next_appointment_date).length, icon: Clock, color: 'hsl(160, 65%, 38%)', bg: 'hsl(160, 65%, 92%)' },
        ].map(m => (
          <div key={m.label} className="glass" style={{
            padding: '22px 26px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px', background: m.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <m.icon size={24} color={m.color} />
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: m.color, lineHeight: 1 }}>{loading ? '...' : m.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments List */}
      <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={22} color={accent} /> Scheduled Patient Consultations
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Antenatal appointments assigned to Dr. {profile?.First_Name || 'Doctor'}
            </p>
          </div>
          <Link to="/doctor/appointments" className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View All Appointments <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No scheduled consultations found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {appointments.map(a => (
              <div key={a.Appointment_id} style={{
                background: 'rgba(255, 255, 255, 0.6)',
                padding: '20px 24px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: accentLight, color: accent, fontWeight: 800, fontSize: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {a.Full_Name?.[0] || 'P'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{a.Full_Name || 'Patient'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Blood Group: {a.Blood_Group || 'O+'} | BP: {a.Blood_Pressure || '120/80'} | Age: {a.Age || 'N/A'} yrs
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: accent }}>
                      Next Visit: {a.Next_appointment_date || 'Scheduled'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {a.Notifications || 'Routine Checkup'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
