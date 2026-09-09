import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Heart, Clock, Activity, Shield, Award, FileText, ArrowRight, ExternalLink } from 'lucide-react'

export default function DashboardOverview({ user }) {
  const [pregnancyStats, setPregnancyStats] = useState({
    weeks: 0,
    days: 0,
    edd: 'N/A',
    daysRemaining: 0,
    progressPercentage: 0,
    trimester: 1
  })
  const [recentGrowth, setRecentGrowth] = useState(null)
  const [nextAppointment, setNextAppointment] = useState(null)
  const [govtPosts, setGovtPosts] = useState([])

  useEffect(() => {
    if (user && user.LMP_date) {
      const lmp = new Date(user.LMP_date)
      const today = new Date()
      
      // Difference in time
      const diffTime = today.getTime() - lmp.getTime()
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
      
      const weeks = Math.floor(diffDays / 7)
      const days = diffDays % 7
      
      // EDD: LMP + 280 days
      const eddDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000)
      const eddFormatted = eddDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      const remainingTime = eddDate.getTime() - today.getTime()
      const daysRemaining = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)))
      
      const progressPercentage = Math.min(100, Math.round((diffDays / 280) * 100))
      
      // Calculate Trimester
      let trimester = 1
      if (weeks > 12 && weeks <= 26) trimester = 2
      else if (weeks > 26) trimester = 3

      setPregnancyStats({
        weeks,
        days,
        edd: eddFormatted,
        daysRemaining,
        progressPercentage,
        trimester
      })
    }
  }, [user])

  // Fetch recent growth records and appointments
  useEffect(() => {
    if (user && user.user_id) {
      // Recent growth
      fetch(`/api/get_growth_records?user_id=${user.user_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.records && data.records.length > 0) {
            setRecentGrowth(data.records[0]) // Get latest
          }
        })
        .catch(err => console.error('Error fetching growth records:', err))

      // Recent appointment
      fetch(`/api/check_appointment?user_id=${user.user_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.appointments && data.appointments.length > 0) {
            setNextAppointment(data.appointments[0])
          }
        })
        .catch(err => console.error('Error fetching appointments:', err))
    }

    // Fetch Government Schemes / Posts
    fetch('/api/view_posts')
      .then(res => res.json())
      .then(data => {
        const posts = data.post || data.records || data.data || []
        setGovtPosts(posts.slice(0, 3)) // top 3 schemes for overview
      })
      .catch(err => console.error('Error fetching govt posts:', err))
  }, [user])

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Welcome Banner */}
      <header className="glass" style={{
        padding: '30px 40px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, hsl(352, 90%, 93%) 0%, hsl(197, 85%, 93%) 100%)',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Dashboard Overview</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Hello, {user?.Full_Name || 'Mom'}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Here is your personalized pregnancy companion report for today.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '12px 24px',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)'
        }}>
          <Calendar size={24} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Estimated Due Date</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{pregnancyStats.edd}</div>
          </div>
        </div>
      </header>

      {/* Main Trackers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        
        {/* Gestational Age Tracker Card */}
        <section className="glass" style={{
          padding: '30px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Gestational Age</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Weeks since LMP</p>
            </div>
            <div style={{
              background: 'var(--primary-light)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={20} color="var(--primary)" fill="var(--primary)" />
            </div>
          </div>

          <div style={{ margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '54px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{pregnancyStats.weeks}</span>
              <span style={{ fontSize: '20px', fontWeight: 700 }}>Weeks</span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-secondary)', marginLeft: '8px' }}>{pregnancyStats.days}</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Days</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Pregnancy Progress</span>
              <span>{pregnancyStats.progressPercentage}%</span>
            </div>
            <div style={{
              height: '10px',
              background: 'var(--border)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${pregnancyStats.progressPercentage}%`,
                background: 'linear-gradient(90deg, var(--primary) 0%, hsl(340, 85%, 60%) 100%)',
                borderRadius: '5px',
                transition: 'width 1s ease-in-out'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              <span>LMP</span>
              <span>Trimester {pregnancyStats.trimester}</span>
              <span>40 Weeks</span>
            </div>
          </div>
        </section>

        {/* Due Date Countdown Card */}
        <section className="glass" style={{
          padding: '30px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Due Date Countdown</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Days until birth</p>
            </div>
            <div style={{
              background: 'var(--secondary-light)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={20} color="var(--secondary)" />
            </div>
          </div>

          <div style={{ margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '54px', fontWeight: 900, color: 'var(--secondary)', lineHeight: 1 }}>{pregnancyStats.daysRemaining}</span>
              <span style={{ fontSize: '20px', fontWeight: 700 }}>Days Left</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.5)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontSize: '13px',
            fontWeight: 500
          }}>
            <Award size={18} color="var(--accent)" />
            <span>Currently in <strong>Trimester {pregnancyStats.trimester}</strong> of pregnancy</span>
          </div>
        </section>
      </div>

      {/* Maternal Vitals & Recent Updates Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        
        {/* Maternal Vitals Card */}
        <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--primary)" /> Maternal Vitals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Blood Pressure</span>
              <span style={{ fontWeight: 700 }}>{user?.Blood_Pressure || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Thyroid Level</span>
              <span style={{ fontWeight: 700 }}>
                <span className={`badge ${user?.Thyroid_Levels === 'Normal' ? 'badge-primary' : 'badge-accent'}`}>
                  {user?.Thyroid_Levels || 'N/A'}
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Blood Group</span>
              <span style={{ fontWeight: 700 }}>{user?.Blood_Group || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Maternal Age</span>
              <span style={{ fontWeight: 700 }}>{user?.Age || 'N/A'} years</span>
            </div>
            
          </div>
        </section>

        {/* Next Appointment Card */}
        <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="var(--secondary)" /> Next Appointment
          </h3>
          {nextAppointment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                background: 'var(--secondary-light)',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(14, 165, 233, 0.15)'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--secondary)' }}>Date & Schedule</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {new Date(nextAppointment.next_appointment).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Last Appointment Logged:</span>
                <p style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>
                  {nextAppointment.last_appointment ? new Date(nextAppointment.last_appointment).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'None'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              height: '130px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '16px',
              border: '1px dashed var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              No upcoming appointments found.
            </div>
          )}
        </section>

        {/* Recent Baby Growth Card */}
        <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="hsl(45, 95%, 45%)" /> Recent Baby Growth
          </h3>
          {recentGrowth ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Week</span>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>Week {recentGrowth.pregnancy_week}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Estimated Size</span>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{recentGrowth.baby_week}</div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Fetal Movement</span>
                <p style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px', color: 'var(--text-primary)' }}>
                  {recentGrowth.movement_description || 'None recorded'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              height: '130px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '16px',
              border: '1px dashed var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              No baby growth data logged yet.
            </div>
          )}
        </section>

      </div>

      {/* Active Government Schemes Highlights Section */}
      <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={22} color="var(--primary)" /> Government Welfare Schemes
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Official Kerala State and Central Government cash assistance & health benefits.
            </p>
          </div>
          <Link to="/schemes" className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View All Schemes <ArrowRight size={14} />
          </Link>
        </div>

        {govtPosts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {govtPosts.map(post => (
              <div key={post.Kg_id || post.Post_name} style={{
                background: 'rgba(255, 255, 255, 0.6)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    {post.Post_name}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.Description}
                  </p>
                </div>
                {post.Links ? (
                  <a href={post.Links} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    Learn More <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Available via ASHA worker</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No active government schemes listed.
          </div>
        )}
      </section>

    </div>
  )
}
