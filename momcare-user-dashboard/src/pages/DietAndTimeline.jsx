import React, { useState, useEffect } from 'react'
import { Calendar, Apple, Plus, AlertCircle, Sparkles, BookOpen } from 'lucide-react'

// Default dietary recommendations based on health params
const defaultDietAdvice = {
  'Blood Pressure': {
    title: 'Hypertension Guard Diet',
    tips: [
      'Reduce sodium intake (avoid processed foods, canned soups, extra table salt).',
      'Increase potassium-rich foods (bananas, sweet potatoes, spinach, avocados).',
      'Consume magnesium-rich foods like whole grains, nuts, and seeds.',
      'Stay well hydrated; aim for 8-10 glasses of water daily.'
    ]
  },
  'Blood Sugar': {
    title: 'Gestational Diabetes Control Diet',
    tips: [
      'Focus on complex carbohydrates (brown rice, oats, whole wheat) instead of simple sugars.',
      'Incorporate lean proteins (eggs, chicken, lentils, tofu) in every meal to stabilize blood sugar.',
      'Eat small, frequent meals rather than large heavy ones.',
      'Avoid fruit juices and sugary soft drinks; opt for whole fruits in moderation.'
    ]
  },
  'Thyroid': {
    title: 'Thyroid Health Diet',
    tips: [
      'Incorporate selenium-rich foods like brazil nuts, chia seeds, and eggs.',
      'Ensure adequate iodine intake (use iodized salt, milk, yogurt).',
      'Ensure adequate vitamin D intake (sunlight exposure, fortified cereals, eggs).',
      'Limit goitrogenic foods (like raw cabbage, broccoli) unless cooked.'
    ]
  },
  'Normal': {
    title: 'Healthy Pregnancy General Diet',
    tips: [
      'Eat a colorful variety of fruits and vegetables daily for vitamins and fiber.',
      'Ensure adequate calcium intake (milk, cheese, calcium-fortified plant milks).',
      'Incorporate iron-rich foods (red meat, spinach, legumes, iron-fortified cereals) paired with Vitamin C.',
      'A healthy balance of lean proteins, complex carbs, and healthy fats (olive oil, avocados).'
    ]
  }
}

export default function DietAndTimeline({ user }) {
  const [activeTab, setActiveTab] = useState('diet') // 'diet' or 'timeline'
  const [dietPlans, setDietPlans] = useState([])
  const [timeline, setTimeline] = useState([])
  const [showAddTimeline, setShowAddTimeline] = useState(false)
  const [loadingDiet, setLoadingDiet] = useState(true)
  const [loadingTimeline, setLoadingTimeline] = useState(true)
  const [savingTimeline, setSavingTimeline] = useState(false)
  
  // Timeline Form
  const [timelineForm, setTimelineForm] = useState({
    weekNumber: '',
    milestoneTitle: '',
    description: '',
    symptoms: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load Diet plans
  const loadDiet = async () => {
    try {
      const response = await fetch(`/api/get_diet_plan?user_id=${user.user_id}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success' && Array.isArray(res.data)) {
          setDietPlans(res.data)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingDiet(false)
    }
  }

  // Load Timeline
  const loadTimeline = async () => {
    try {
      const response = await fetch(`/api/get_timeline?user_id=${user.user_id}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success' && Array.isArray(res.timeline_data)) {
          setTimeline(res.timeline_data)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTimeline(false)
    }
  }

  useEffect(() => {
    loadDiet()
    loadTimeline()
  }, [user])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setTimelineForm(prev => ({ ...prev, [id]: value }))
  }

  const handleAddTimeline = async (e) => {
    e.preventDefault()
    const { weekNumber, milestoneTitle, description, symptoms } = timelineForm

    if (!weekNumber || !milestoneTitle || !description) {
      setError('Please fill in required fields')
      return
    }

    setError('')
    setSuccess('')
    setSavingTimeline(true)

    try {
      const url = `/api/add_timeline?user_id=${encodeURIComponent(user.user_id)}` +
                  `&week_number=${encodeURIComponent(weekNumber)}` +
                  `&milestone_title=${encodeURIComponent(milestoneTitle)}` +
                  `&description=${encodeURIComponent(description)}` +
                  `&symptoms=${encodeURIComponent(symptoms)}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Connection failed')
      }

      const res = await response.json()
      if (res.status === 'success') {
        setSuccess('Timeline milestone saved successfully!')
        setTimelineForm({
          weekNumber: '',
          milestoneTitle: '',
          description: '',
          symptoms: ''
        })
        setShowAddTimeline(false)
        loadTimeline() // Reload list
      } else {
        setError(res.message || 'Failed to save milestone')
      }
    } catch (err) {
      console.error(err)
      setError('Connection failed. Server error.')
    } finally {
      setSavingTimeline(false)
    }
  }

  // Pick smart default dietary advices based on vitals
  const matchingAdvices = []
  if (user?.Thyroid_Levels === 'High' || user?.Thyroid_Levels === 'Low') {
    matchingAdvices.push(defaultDietAdvice['Thyroid'])
  }
  if (user?.Blood_Pressure && user.Blood_Pressure !== '120/80' && !user.Blood_Pressure.startsWith('11') && !user.Blood_Pressure.startsWith('12')) {
    matchingAdvices.push(defaultDietAdvice['Blood Pressure'])
  }
  // Default general advice
  if (matchingAdvices.length === 0) {
    matchingAdvices.push(defaultDietAdvice['Normal'])
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Nutrition & Path</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Diet & Timeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Check customized diet schedules and log pregnancy weekly milestone highlights.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="glass" style={{
          display: 'flex',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <button 
            onClick={() => setActiveTab('diet')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: activeTab === 'diet' ? 700 : 500,
              background: activeTab === 'diet' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'diet' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Diet Plan
          </button>
          <button 
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: activeTab === 'timeline' ? 700 : 500,
              background: activeTab === 'timeline' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'timeline' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            My Timeline
          </button>
        </div>
      </div>

      {activeTab === 'diet' ? (
        /* Diet Plan Content */
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
          
          {/* Main Diet Plans from Doctor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Apple size={20} color="var(--primary)" /> Doctor Recommended Diet Plans
              </h3>

              {loadingDiet ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading diet schedules...</div>
              ) : dietPlans.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {dietPlans.map((diet, index) => (
                    <div key={index} style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span className="badge badge-secondary">{diet.Health_Parameter}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{new Date(diet.Date).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        {diet.Diet_Recommendation}
                      </p>
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
                  No personalized diet plan logged by ASHA/Doctor yet. Review automatic recommendations.
                </div>
              )}
            </section>
          </div>

          {/* Right Side: Smart Automatic Recommendations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent)" /> Smart Vital Recommendations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {matchingAdvices.map((advice, id) => (
                  <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>
                      {advice.title}
                    </div>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {advice.tips.map((tip, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      ) : (
        /* Pregnancy Timeline Content */
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
          
          {/* Vertical Milestone Timeline */}
          <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--primary)" /> Milestone Timeline
            </h3>

            {loadingTimeline ? (
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading milestones timeline...</div>
            ) : timeline.length > 0 ? (
              <div style={{
                position: 'relative',
                paddingLeft: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {/* Visual Line */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '9px',
                  bottom: '10px',
                  width: '2px',
                  background: 'var(--primary-light)'
                }} />

                {timeline.map((t, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Node Dot */}
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      left: '-30px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      border: '4px solid white',
                      boxShadow: '0 0 0 2px var(--primary-light)'
                    }} />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800 }}>Week {t.Week_Number}: {t.Milestone_Title}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>({new Date(t.Date).toLocaleDateString()})</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                        {t.Description}
                      </p>
                      {t.Symptoms && (
                        <div style={{ marginTop: '8px', fontSize: '12px', background: 'var(--primary-light)', padding: '6px 12px', borderRadius: '8px', display: 'inline-block', color: 'var(--primary)', fontWeight: 600 }}>
                          Logged Symptoms: {t.Symptoms}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '45px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                border: '1px dashed var(--border)',
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}>
                No timeline milestones logged. Record one using the form on the right.
              </div>
            )}
          </section>

          {/* Form to Log New Timeline Entry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--secondary)" /> Record Milestone
              </h3>

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
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAddTimeline} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="weekNumber">Pregnancy Week *</label>
                  <input
                    className="form-control"
                    type="number"
                    id="weekNumber"
                    placeholder="e.g. 14"
                    value={timelineForm.weekNumber}
                    onChange={handleInputChange}
                    disabled={savingTimeline}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="milestoneTitle">Milestone Title *</label>
                  <input
                    className="form-control"
                    type="text"
                    id="milestoneTitle"
                    placeholder="e.g. First Flutter Felt"
                    value={timelineForm.milestoneTitle}
                    onChange={handleInputChange}
                    disabled={savingTimeline}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Details / Notes *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    placeholder="Describe how it felt or what changed..."
                    value={timelineForm.description}
                    onChange={handleInputChange}
                    disabled={savingTimeline}
                    required
                    style={{ resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="symptoms">Symptoms</label>
                  <input
                    className="form-control"
                    type="text"
                    id="symptoms"
                    placeholder="e.g. fatigue, cravings"
                    value={timelineForm.symptoms}
                    onChange={handleInputChange}
                    disabled={savingTimeline}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ width: '100%', padding: '12px' }}
                  disabled={savingTimeline}
                >
                  {savingTimeline ? 'Saving...' : 'Save Milestone'}
                </button>

              </form>
            </section>
          </div>

        </div>
      )}
    </div>
  )
}
