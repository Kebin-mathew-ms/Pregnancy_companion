import React, { useState, useEffect } from 'react'
import { Plus, Check, TrendingUp, AlertCircle, Compass } from 'lucide-react'

// Fruits mapping for pregnancy weeks size comparison
const fruitSizes = [
  { week: 4, name: 'Poppy Seed', size: '0.2 cm', color: '#ffb3ba' },
  { week: 8, name: 'Raspberry', size: '1.6 cm', color: '#ffdfba' },
  { week: 12, name: 'Lime', size: '5.4 cm', color: '#ffffba' },
  { week: 16, name: 'Avocado', size: '11.6 cm', color: '#baffc9' },
  { week: 20, name: 'Banana', size: '25.6 cm', color: '#bae1ff' },
  { week: 24, name: 'Cantaloupe', size: '30.0 cm', color: '#e8c4ff' },
  { week: 28, name: 'Eggplant', size: '37.6 cm', color: '#ffd3e8' },
  { week: 32, name: 'Squash', size: '42.4 cm', color: '#d0f4de' },
  { week: 36, name: 'Honeydew', size: '47.4 cm', color: '#fcf6bd' },
  { week: 40, name: 'Watermelon', size: '51.2 cm', color: '#ff9999' }
]

function getFruitForWeek(week) {
  let matched = fruitSizes[0]
  for (let f of fruitSizes) {
    if (week >= f.week) {
      matched = f
    }
  }
  return matched
}

export default function BabyGrowth({ user }) {
  const [records, setRecords] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form Fields
  const [formData, setFormData] = useState({
    pregnancyWeek: '',
    babySizeCm: '',
    movementDescription: '',
    hormonalChanges: '',
    emotionalState: ''
  })

  // Load Records
  const loadRecords = async () => {
    try {
      const response = await fetch(`/api/get_growth_records?user_id=${user.user_id}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success' && Array.isArray(res.records)) {
          setRecords(res.records)
        }
      }
    } catch (err) {
      console.error('Failed to load growth records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [user])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { pregnancyWeek, babySizeCm, movementDescription, hormonalChanges, emotionalState } = formData

    if (!pregnancyWeek || !babySizeCm) {
      setError('Please fill in week and size')
      return
    }

    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const url = `/api/baby_growth?user_id=${encodeURIComponent(user.user_id)}` +
                  `&pregnancy_week=${encodeURIComponent(pregnancyWeek)}` +
                  `&baby_week=${encodeURIComponent(babySizeCm)}` + // Stored as Baby_size in DB
                  `&movement_description=${encodeURIComponent(movementDescription)}` +
                  `&hormonal_changes=${encodeURIComponent(hormonalChanges)}` +
                  `&emotional_state=${encodeURIComponent(emotionalState)}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Connection failed')
      }

      const res = await response.json()
      if (res.status === 'success') {
        setSuccess('Growth entry added successfully!')
        setFormData({
          pregnancyWeek: '',
          babySizeCm: '',
          movementDescription: '',
          hormonalChanges: '',
          emotionalState: ''
        })
        setShowAddForm(false)
        loadRecords() // Reload list
      } else {
        setError(res.message || 'Failed to add record')
      }
    } catch (err) {
      console.error(err)
      setError('Error connecting to Server.')
    } finally {
      setSaving(false)
    }
  }

  // Fruit display for current week (if logged)
  const currentWeekNum = records.length > 0 ? records[0].pregnancy_week : 12
  const fruitInfo = getFruitForWeek(currentWeekNum)

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '10px' }}>Tracker</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Baby Growth & Milestones</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Monitor your baby's physical developments, fetal movements, and maternal emotional logs.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          {showAddForm ? 'View Records' : 'Log Daily Stats'}
        </button>
      </div>

      {showAddForm ? (
        /* Logger Form */
        <div className="glass" style={{ padding: '35px', borderRadius: '24px', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Log New Weekly Growth Entry</h3>
          
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'hsl(0, 100%, 96%)',
              border: '1px solid hsl(0, 100%, 88%)',
              color: 'hsl(0, 100%, 40%)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pregnancyWeek">Pregnancy Week *</label>
                <input
                  className="form-control"
                  type="number"
                  id="pregnancyWeek"
                  placeholder="e.g. 16"
                  value={formData.pregnancyWeek}
                  onChange={handleInputChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="babySizeCm">Estimated Size (in cm) *</label>
                <input
                  className="form-control"
                  type="number"
                  step="0.1"
                  id="babySizeCm"
                  placeholder="e.g. 11.5"
                  value={formData.babySizeCm}
                  onChange={handleInputChange}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="movementDescription">Fetal Movements</label>
              <textarea
                className="form-control"
                id="movementDescription"
                rows="2"
                placeholder="Describe baby kicks, flutters, or movements..."
                value={formData.movementDescription}
                onChange={handleInputChange}
                disabled={saving}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="hormonalChanges">Hormonal Notes</label>
                <input
                  className="form-control"
                  type="text"
                  id="hormonalChanges"
                  placeholder="e.g. Nausea, mild headaches"
                  value={formData.hormonalChanges}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="emotionalState">Emotional Log</label>
                <input
                  className="form-control"
                  type="text"
                  id="emotionalState"
                  placeholder="e.g. Happy, slightly anxious"
                  value={formData.emotionalState}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: '160px', padding: '14px', marginTop: '10px' }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Entry'}
            </button>

          </form>
        </div>
      ) : (
        /* Dashboard Trackers List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Fruit Visualizer Summary */}
          <section className="glass" style={{
            padding: '30px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            background: `linear-gradient(135deg, ${fruitInfo.color}33 0%, rgba(255,255,255,0.7) 100%)`
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              background: fruitInfo.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '38px'
            }}>
              👶
            </div>
            <div>
              <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 600 }}>Your Baby is the Size of a:</h3>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0' }}>
                {fruitInfo.name}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Estimated length: <strong>{fruitInfo.size}</strong> (Week {currentWeekNum})
              </p>
            </div>
          </section>

          {/* Records History */}
          <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--primary)" /> Growth Logs History
            </h3>

            {loading ? (
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading growth history...</div>
            ) : records.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {records.map((r, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                        Week {r.pregnancy_week}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                        Size: {r.baby_week}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '4px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Movement Description</span>
                        <p style={{ fontSize: '13px', marginTop: '2px' }}>{r.movement_description || 'No movement logged.'}</p>
                      </div>
                      <div style={{ width: '120px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Hormonal</span>
                        <p style={{ fontSize: '13px', marginTop: '2px' }}>{r.hormonal_changes || 'None'}</p>
                      </div>
                      <div style={{ width: '120px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Emotional Log</span>
                        <p style={{ fontSize: '13px', marginTop: '2px' }}>{r.emotional || 'None'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed var(--border)',
                borderRadius: '16px',
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}>
                No growth logs recorded. Click "Log Daily Stats" to log your first record.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
