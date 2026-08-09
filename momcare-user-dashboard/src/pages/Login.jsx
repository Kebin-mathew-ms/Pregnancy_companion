import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Lock, User, AlertCircle } from 'lucide-react'

// Helper to convert Python str(dict) output to standard JSON
function parsePythonDict(str) {
  if (!str) return null
  try {
    // Basic formatting replacement
    let cleaned = str
      .replace(/'/g, '"')
      .replace(/: None/g, ': null')
      .replace(/: True/g, ': true')
      .replace(/: False/g, ': false')
    return JSON.parse(cleaned)
  } catch (e) {
    // Fallback if it is already standard JSON
    try {
      return JSON.parse(str)
    } catch {
      throw new Error("Unable to parse response from server")
    }
  }
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const response = await fetch(`/api/loginn?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      if (!response.ok) {
        throw new Error('Server connection failed')
      }
      
      const rawText = await response.text()
      const data = parsePythonDict(rawText)

      if (data && data.status === 'success') {
        // Collect user details
        const userData = {
          login_id: data.login_data?.[0]?.login_id,
          user_id: data.user_id,
          uname: username,
          Full_Name: data.user_data?.[0]?.Full_Name || username,
          Age: data.user_data?.[0]?.Age,
          Ward_id: data.user_data?.[0]?.Ward_id,
          LMP_date: data.user_data?.[0]?.LMP_date,
          Blood_Group: data.user_data?.[0]?.Blood_Group,
          Blood_Pressure: data.user_data?.[0]?.Blood_Pressure,
          Thyroid_Levels: data.user_data?.[0]?.Thyroid_Levels
        }
        
        onLogin(userData)
        navigate('/')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, hsl(352, 90%, 95%) 0%, hsl(197, 85%, 95%) 100%)',
      padding: '20px',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Brand Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, hsl(340, 85%, 60%) 100%)',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(220, 60, 100, 0.25)'
          }}>
            <Heart size={32} color="white" fill="white" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Welcome to MomCare</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Maternal Health Companion Dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'hsl(0, 100%, 96%)',
            border: '1px solid hsl(0, 100%, 88%)',
            color: 'hsl(0, 100%, 40%)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '24px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Username
              </span>
            </label>
            <input
              className="form-control"
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} /> Password
              </span>
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          Don't have a profile yet?{' '}
          <Link to="/register" style={{
            color: 'var(--primary)',
            fontWeight: 700,
            textDecoration: 'none'
          }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  )
}
