import React, { useState, useEffect } from 'react'
import { User, ShieldAlert, Award, Calendar, Heart, ShieldCheck } from 'lucide-react'

export default function MaternalProfile({ user, onProfileUpdate }) {
  const [profile, setProfile] = useState(null)
  const [wards, setWards] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    lmpDate: '',
    bloodGroup: '',
    bloodPressure: '',
    thyroidLevels: '',
    wardId: '',
    password: '' // Required by backend api to update
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load profile and wards
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Profile
        const profRes = await fetch(`/api/view_profile?user_id=${user.user_id}`)
        let profileData = null
        if (profRes.ok) {
          const profJson = await profRes.json()
          if (profJson.status === 'success' && profJson.data?.length > 0) {
            profileData = profJson.data[0]
            setProfile(profileData)
          }
        }

        // Fetch Wards
        const wardRes = await fetch('/api/getward')
        if (wardRes.ok) {
          const wardJson = await wardRes.json()
          if (wardJson.status === 'success') {
            setWards(wardJson.data)
          }
        }

        // Populate fields
        const activeData = profileData || user
        setFormData({
          fullName: activeData.Full_Name || '',
          age: activeData.Age || '',
          lmpDate: activeData.LMP_date ? activeData.LMP_date.substring(0, 10) : '',
          bloodGroup: activeData.Blood_Group || 'O+',
          bloodPressure: activeData.Blood_Pressure || '120/80',
          thyroidLevels: activeData.Thyroid_Levels || 'Normal',
          wardId: activeData.Ward_id || '',
          password: ''
        })

      } catch (err) {
        console.error('Failed to load profile details:', err)
        setError('Error connecting to Flask backend')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { fullName, age, lmpDate, bloodGroup, bloodPressure, thyroidLevels, wardId, password } = formData

    if (!fullName || !age || !wardId) {
      setError('Please fill in all required fields')
      return
    }
    if (!password) {
      setError('Please enter your account password to authorize changes')
      return
    }

    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const url = `/api/add_health_data?username=${encodeURIComponent(user.uname)}` +
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
        throw new Error('Connection failed')
      }

      const res = await response.json()
      if (res.status === 'success') {
        setSuccess('Profile updated successfully!')
        setFormData(prev => ({ ...prev, password: '' }))
        
        // Update application state
        const updatedUser = {
          ...user,
          Full_Name: fullName,
          Age: age,
          LMP_date: lmpDate,
          Blood_Group: bloodGroup,
          Blood_Pressure: bloodPressure,
          Thyroid_Levels: thyroidLevels,
          Ward_id: wardId
        }
        onProfileUpdate(updatedUser)
        setProfile(updatedUser)
      } else {
        setError(res.message || 'Verification failed. Please check your password.')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to save changes. Make sure server is running.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Loading profile details...</div>
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-secondary" style={{ marginBottom: '10px' }}>Settings</span>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Maternal Profile</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          View or update your health parameters, LMP dates, and medical records.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '30px',
        alignItems: 'start',
        flexWrap: 'wrap'
      }}>
        
        {/* Left Side: Summary Card */}
        <div className="glass" style={{
          padding: '30px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center'
        }}>
          {/* Avatar Icon */}
          <div style={{
            background: 'var(--primary-light)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <User size={38} color="var(--primary)" />
          </div>

          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{profile?.Full_Name || user.Full_Name}</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Username: {user.uname}
            </span>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

          {/* Mini Details */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={18} color="var(--primary)" />
              <span style={{ fontSize: '14px' }}>Blood Group: <strong>{profile?.Blood_Group || 'O+'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color="var(--secondary)" />
              <span style={{ fontSize: '14px' }}>LMP Date: <strong>{profile?.LMP_date ? new Date(profile.LMP_date).toLocaleDateString() : 'N/A'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={18} color="var(--primary)" />
              <span style={{ fontSize: '14px' }}>Blood Pressure: <strong>{profile?.Blood_Pressure || 'N/A'}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side: Update Profile Form */}
        <div className="glass" style={{ padding: '35px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Update Health Parameters</h3>

          {/* Messages */}
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
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'hsl(142, 70%, 95%)',
              border: '1px solid hsl(142, 70%, 85%)',
              color: 'hsl(142, 70%, 25%)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <ShieldCheck size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="age">Age</label>
                <input
                  className="form-control"
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="lmpDate">LMP Date</label>
                <input
                  className="form-control"
                  type="date"
                  id="lmpDate"
                  value={formData.lmpDate}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wardId">Local Ward</label>
                <select
                  className="form-control"
                  id="wardId"
                  value={formData.wardId}
                  onChange={handleChange}
                  disabled={saving}
                  required
                >
                  <option value="">
                    {wards.length === 0 ? '-- Loading Wards... --' : '-- Select Local Ward --'}
                  </option>
                  {wards.map(w => {
                    const id = w.Ward_id ?? w.ward_id ?? w.id;
                    const name = w.Ward_name ?? w.ward_name ?? w.name ?? `Ward ${id}`;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
                <select
                  className="form-control"
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bloodPressure">Blood Pressure</label>
                <input
                  className="form-control"
                  type="text"
                  id="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="thyroidLevels">Thyroid Level</label>
                <select
                  className="form-control"
                  id="thyroidLevels"
                  value={formData.thyroidLevels}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '10px 0' }} />

            <div className="form-group">
              <label className="form-label" htmlFor="password" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Confirm Password to Authorize Changes
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="Enter current password"
                value={formData.password}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ padding: '14px', width: '160px', alignSelf: 'flex-start', marginTop: '10px' }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </form>
        </div>

      </div>

    </div>
  )
}
