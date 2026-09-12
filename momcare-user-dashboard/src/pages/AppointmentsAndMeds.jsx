import React, { useState, useEffect } from 'react'
import { Calendar, Plus, AlertCircle, ShieldAlert, Heart, Activity } from 'lucide-react'

export default function AppointmentsAndMeds({ user }) {
  const [appointments, setAppointments] = useState([])
  const [medicalNotes, setMedicalNotes] = useState([])
  const [infoContent, setInfoContent] = useState(null)
  
  // Forms
  const [showAddApp, setShowAddApp] = useState(false)
  const [appForm, setAppForm] = useState({
    lastAppointment: '',
    nextAppointment: ''
  })
  const [showNotesForm, setShowNotesForm] = useState(false)
  const [notesForm, setNotesForm] = useState({
    prevNotes: '',
    nextDate: '',
    notification: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Load Data
  const loadData = async () => {
    try {
      // Load appointments
      const appRes = await fetch(`/api/check_appointment?user_id=${user.user_id}`)
      if (appRes.ok) {
        const appJson = await appRes.json()
        if (appJson.status === 'success' && Array.isArray(appJson.appointments)) {
          setAppointments(appJson.appointments)
        }
      }

      // Load checkup notes / observations
      const notesRes = await fetch(`/api/view_appoinments?user_id=${user.user_id}`)
      if (notesRes.ok) {
        const notesJson = await notesRes.json()
        if (notesJson.status === 'success' && Array.isArray(notesJson.data)) {
          setMedicalNotes(notesJson.data)
        }
      }

      // Load meds & vaccines info
      const infoRes = await fetch(`/api/get_informative_content?user_id=${user.user_id}`)
      if (infoRes.ok) {
        const infoJson = await infoRes.json()
        if (infoJson.status === 'success' && infoJson.data?.length > 0) {
          setInfoContent(infoJson.data[0]) // Get latest record
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleAppChange = (e) => {
    const { id, value } = e.target
    setAppForm(prev => ({ ...prev, [id]: value }))
  }

  const handleNotesChange = (e) => {
    const { id, value } = e.target
    setNotesForm(prev => ({ ...prev, [id]: value }))
  }

  // Submit appointment tracker (/api/appointment_tracker)
  const handleAppSubmit = async (e) => {
    e.preventDefault()
    const { lastAppointment, nextAppointment } = appForm
    if (!lastAppointment || !nextAppointment) {
      setError('Please fill in both dates')
      return
    }

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const url = `/api/appointment_tracker?user_id=${user.user_id}` +
                  `&last_appointment=${encodeURIComponent(lastAppointment)}` +
                  `&next_appointment=${encodeURIComponent(nextAppointment)}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'success') {
        setSuccess('Appointment registered successfully!')
        setAppForm({ lastAppointment: '', nextAppointment: '' })
        setShowAddApp(false)
        loadData()
      } else {
        setError(data.message || 'Failed to record dates')
      }
    } catch (err) {
      setError('Connection failure')
    } finally {
      setSubmitting(false)
    }
  }

  // Submit checkup notes (/api/submit_appointment)
  const handleNotesSubmit = async (e) => {
    e.preventDefault()
    const { prevNotes, nextDate, notification } = notesForm
    if (!prevNotes || !nextDate || !notification) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const url = `/api/submit_appointment?user_id=${user.user_id}` +
                  `&prev_notes=${encodeURIComponent(prevNotes)}` +
                  `&next_date=${encodeURIComponent(nextDate)}` +
                  `&notification=${encodeURIComponent(notification)}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'success') {
        setSuccess('Appointment checkup notes added!')
        setNotesForm({ prevNotes: '', nextDate: '', notification: '' })
        setShowNotesForm(false)
        loadData()
      } else {
        setError(data.message || 'Failed to submit notes')
      }
    } catch (err) {
      setError('Connection failure')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge badge-secondary" style={{ marginBottom: '10px' }}>Clinical Log</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Appointments & Medical Inventory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Schedule and track medical appointments, vaccine records, and daily supplement logs.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={() => { setShowAddApp(!showAddApp); setShowNotesForm(false); }}>
            <Plus size={16} /> Track Dates
          </button>
          <button className="btn btn-primary" onClick={() => { setShowNotesForm(!showNotesForm); setShowAddApp(false); }}>
            <Plus size={16} /> Log Checkup Notes
          </button>
        </div>
      </div>

      {/* Forms Area */}
      {(showAddApp || showNotesForm) && (
        <div className="glass" style={{ padding: '30px', borderRadius: '24px', maxWidth: '600px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'hsl(0, 100%, 96%)',
              border: '1px solid hsl(0, 100%, 88%)',
              color: 'hsl(0, 100%, 40%)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {showAddApp && (
            <form onSubmit={handleAppSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Register Appointment Dates</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="lastAppointment">Last Appointment Date *</label>
                <input
                  className="form-control"
                  type="date"
                  id="lastAppointment"
                  value={appForm.lastAppointment}
                  onChange={handleAppChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nextAppointment">Next Scheduled Appointment *</label>
                <input
                  className="form-control"
                  type="date"
                  id="nextAppointment"
                  value={appForm.nextAppointment}
                  onChange={handleAppChange}
                  required
                  disabled={submitting}
                />
              </div>
              <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Saving...' : 'Register Appointment'}
              </button>
            </form>
          )}

          {showNotesForm && (
            <form onSubmit={handleNotesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Record Checkup Notes</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="prevNotes">Doctor's Observations / Previous Notes *</label>
                <textarea
                  className="form-control"
                  id="prevNotes"
                  rows="3"
                  placeholder="Notes from your last checkup..."
                  value={notesForm.prevNotes}
                  onChange={handleNotesChange}
                  required
                  disabled={submitting}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nextDate">Next Checkup Target Date *</label>
                <input
                  className="form-control"
                  type="date"
                  id="nextDate"
                  value={notesForm.nextDate}
                  onChange={handleNotesChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="notification">Reminder Message *</label>
                <input
                  className="form-control"
                  type="text"
                  id="notification"
                  placeholder="e.g. Scans, Blood Test"
                  value={notesForm.notification}
                  onChange={handleNotesChange}
                  required
                  disabled={submitting}
                />
              </div>
              <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Saving...' : 'Log Checkup Notes'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Grid of details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Appointments List */}
        <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="var(--primary)" /> Appointment Logs
          </h3>

          {loading ? (
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading logs...</div>
          ) : appointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {appointments.map((app, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>NEXT CHECKUP DATE</span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {new Date(app.next_appointment).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>LAST LOGGED DATE</span>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {app.last_appointment ? new Date(app.last_appointment).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '16px',
              border: '1px dashed var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              No appointment dates tracked yet.
            </div>
          {/* Logged Checkup Notes */}
          <div style={{ marginTop: '28px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-secondary)' }}>
              Logged Checkup Notes & Clinical Observations
            </h4>
            {medicalNotes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {medicalNotes.map((note, idx) => (
                  <div key={idx} style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                        Checkup Note #{note.Appointment_id || idx + 1}
                      </span>
                      {note.Next_appointment_date && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Next: {new Date(note.Next_appointment_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                      {note.Previous_appointment_notes}
                    </p>
                    {note.Notifications && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--secondary)', fontWeight: 600 }}>
                        Recommendation: {note.Notifications}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No clinical observations logged yet. Click "+ Log Checkup Notes" above to add one.
              </div>
            )}
          </div>
        </section>

        {/* Meds & Vaccine Stocks */}
        <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--secondary)" /> Meds & Vaccine Logs
          </h3>

          {loading ? (
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading records...</div>
          ) : infoContent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Tablets Inventory Card */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Prescribed Tablets Inventory</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Iron</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>{infoContent.Iron_medicine_count || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Calcium</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--secondary)' }}>{infoContent.Calcium_tablets_count || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Folic Acid</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{infoContent.Folic_acid_tablets_count || 0}</div>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

              {/* Vaccine Logs */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tetanus Toxoid (TT) Vaccines</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>TT 1st Dose Vaccine</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: infoContent.First_tt_vaccine_date ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {infoContent.First_tt_vaccine_date ? new Date(infoContent.First_tt_vaccine_date).toLocaleDateString() : 'Pending'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>TT 2nd Dose Vaccine</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: infoContent.Second_tt_vaccine_date ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {infoContent.Second_tt_vaccine_date ? new Date(infoContent.Second_tt_vaccine_date).toLocaleDateString() : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

              {/* Anganwadi Food supply */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Anganwadi Food Supplies</span>
                <span className={`badge ${infoContent.Food_from_anganwadi === 'Yes' ? 'badge-primary' : 'badge-accent'}`}>
                  {infoContent.Food_from_anganwadi || 'No'}
                </span>
              </div>

            </div>
          ) : (
            <div style={{
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--border)',
              borderRadius: '16px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              textAlign: 'center',
              padding: '20px'
            }}>
              No vaccine logs or tablet inventories have been registered for your profile yet by your ASHA worker.
            </div>
          )}
        </section>

      </div>

    </div>
  )
}
