import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Activity, ShieldAlert, ArrowLeft } from 'lucide-react'

export default function Register() {
  const [wards, setWards] = useState([])
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    age: '',
    lmpDate: '',
    bloodGroup: 'O+',
    bloodPressure: '120/80',
    thyroidLevels: 'Normal',
    wardId: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch Wards for dropdown
  useEffect(() => {
    async function loadWards() {
      try {
        const response = await fetch('/api/getward')
        if (response.ok) {
          const res = await response.json()
          if (res.status === 'success' && Array.isArray(res.data)) {
            setWards(res.data)
            if (res.data.length > 0) {
              setFormData(prev => ({ ...prev, wardId: res.data[0].Ward_id }))
            }
          }
        }
      } catch (err) {
        console.error('Failed to load wards:', err)
      }
    }
    loadWards()
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, password, fullName, age, lmpDate, bloodGroup, bloodPressure, thyroidLevels, wardId } = formData

    if (!username || !password || !fullName || !age || !wardId) {
      setError('Please fill in all required fields')
      return
    }

    setError('')
    setLoading(true)

    try {
      const url = `/api/add_health_data?username=${encodeURIComponent(username)}` +
                  `&password=${encodeURIComponent(password)}` +
                  `&full_name=${encodeURIComponent(fullName)}` +
                  `&age=${encodeURIComponent(age)}` +
                  `&lmp_date=${encodeURIComponent(lmpDate)}` +
                  `&blood_group=${encodeURIComponent(bloodGroup)}` +
                  `&blood_pressure=${encodeURIComponent(bloodPressure)}` +
                  `&thyroid_levels=${encodeURIComponent(thyroidLevels)}` +
                  `&ward_id=${encodeURIComponent(wardId)}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Server connection error')
      }

      const res = await response.json()
      if (res.status === 'success') {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(res.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      setError('Connection failed. Please make sure Flask server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, hsl(352, 90%, 95%) 0%, hsl(197, 85%, 95%) 100%)',
      padding: '40px 20px',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Back Link */}
        <Link to="/login" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, hsl(340, 85%, 60%) 100%)',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={24} color="white" fill="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Create Maternal Profile</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>MomCare Registration</p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{
            background: 'hsl(142, 70%, 95%)',
            border: '1px solid hsl(142, 70%, 85%)',
            color: 'hsl(142, 70%, 25%)',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Profile Created Successfully! Redirecting to Login...
          </div>
        )}

        {/* Error Alert */}
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
            fontWeight: 500,
            marginBottom: '24px'
          }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input
                className="form-control"
                type="text"
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="age">Age *</label>
              <input
                className="form-control"
                type="number"
                id="age"
                placeholder="Age in years"
                value={formData.age}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username *</label>
              <input
                className="form-control"
                type="text"
                id="username"
                placeholder="Choose username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password *</label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="lmpDate">LMP Date (Last Period) *</label>
              <input
                className="form-control"
                type="date"
                id="lmpDate"
                value={formData.lmpDate}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="wardId">Local Ward *</label>
              <select
                className="form-control"
                id="wardId"
                value={formData.wardId}
                onChange={handleChange}
                disabled={loading || success}
                required
              >
                {wards.map(w => (
                  <option key={w.Ward_id} value={w.Ward_id}>{w.Ward_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px'
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
              <select
                className="form-control"
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={loading || success}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bloodPressure">BP (Syst/Diast)</label>
              <input
                className="form-control"
                type="text"
                id="bloodPressure"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={handleChange}
                disabled={loading || success}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="thyroidLevels">Thyroid Level</label>
              <select
                className="form-control"
                id="thyroidLevels"
                value={formData.thyroidLevels}
                onChange={handleChange}
                disabled={loading || success}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: '100%', padding: '14px', marginTop: '16px' }}
            disabled={loading || success}
          >
            {loading ? 'Creating Profile...' : 'Register Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
