import React, { useEffect, useState } from 'react'
import { Stethoscope, Plus, Trash2, Phone, Mail, MapPin } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

const emptyForm = { first_name: '', last_name: '', place: '', phone: '', email: '', specialization: '' }

export default function AdminManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState(null)

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/view_doctors')
      const data = await res.json()
      setDoctors(data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDoctors() }, [])

  const addDoctor = async (e) => {
    e.preventDefault()
    if (!Object.values(form).every(v => v.trim())) {
      setMsg({ type: 'error', text: 'All fields are required.' })
      return
    }
    const params = new URLSearchParams(form)
    try {
      const res = await fetch(`/api/admin/add_doctor?${params}`)
      const data = await res.json()
      if (data.status === 'success') {
        setMsg({ type: 'success', text: 'Doctor added successfully!' })
        setForm(emptyForm)
        setShowForm(false)
        fetchDoctors()
      }
    } catch (e) { setMsg({ type: 'error', text: 'Failed to add doctor.' }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const deleteDoctor = async (id) => {
    if (!window.confirm('Remove this doctor?')) return
    await fetch(`/api/admin/delete_doctor?doc_id=${id}`)
    fetchDoctors()
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Manage Doctors</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Add and manage specialist doctors visible to pregnant users.</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: showForm ? 'var(--border)' : `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
          color: showForm ? 'var(--text-primary)' : 'white',
          fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass" style={{ borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '20px' }}>New Doctor Details</h3>
          {msg && (
            <div style={{
              marginBottom: '16px', padding: '12px 16px', borderRadius: '10px',
              background: msg.type === 'success' ? 'hsl(160,65%,92%)' : 'hsl(352,90%,94%)',
              color: msg.type === 'success' ? 'hsl(160,65%,30%)' : 'hsl(352,90%,40%)', fontWeight: 600, fontSize: '14px'
            }}>{msg.text}</div>
          )}
          <form onSubmit={addDoctor}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {[
                { key: 'first_name', placeholder: 'First Name' },
                { key: 'last_name', placeholder: 'Last Name' },
                { key: 'place', placeholder: 'Place / City' },
                { key: 'phone', placeholder: 'Phone Number' },
                { key: 'email', placeholder: 'Email Address' },
                { key: 'specialization', placeholder: 'Specialization' },
              ].map(f => (
                <input key={f.key} className="form-control" placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ padding: '12px 16px', borderRadius: '12px' }}
                />
              ))}
            </div>
            <button type="submit" style={{
              padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
              color: 'white', fontWeight: 700, fontSize: '14px'
            }}>Save Doctor</button>
          </form>
        </div>
      )}

      {/* Doctors List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No doctors found. Add one above.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
          {doctors.map(doc => (
            <div key={doc.Doc_id} className="glass" style={{
              borderRadius: '18px', padding: '22px',
              transition: 'transform var(--transition-normal)'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Stethoscope size={22} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Dr. {doc.First_Name} {doc.Last_Name}</div>
                    <div style={{ fontSize: '12px', background: accentLight, color: accent, padding: '2px 8px', borderRadius: '6px', fontWeight: 600, display: 'inline-block', marginTop: '3px' }}>
                      {doc.Specialization}
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteDoctor(doc.Doc_id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', borderRadius: '6px'
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'hsl(352,90%,55%)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                ><Trash2 size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { icon: MapPin, v: doc.Place }, { icon: Phone, v: doc.Phone }, { icon: Mail, v: doc.Email }
                ].map(({ icon: Icon, v }) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Icon size={13} color={accent} />{v}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
