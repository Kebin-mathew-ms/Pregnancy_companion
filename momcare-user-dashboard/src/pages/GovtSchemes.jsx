import React, { useEffect, useState } from 'react'
import { FileText, ExternalLink, Calendar, ShieldCheck, Search, Download } from 'lucide-react'

export default function GovtSchemes({ user }) {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/view_posts')
      .then(res => res.json())
      .then(data => {
        const list = data.post || data.records || data.data || []
        setSchemes(list)
      })
      .catch(err => console.error('Error fetching government posts:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredSchemes = schemes.filter(s =>
    (s.Post_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.Description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fade-in" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Header Banner */}
      <header className="glass" style={{
        padding: '30px 40px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, hsl(230, 85%, 94%) 0%, hsl(340, 85%, 94%) 100%)',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '10px', background: 'var(--primary)', color: 'white' }}>
            Official Welfare & Benefits
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Government Schemes & Financial Aid
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Kerala State and Central Government maternal health schemes, cash assistance, and nutritional support.
          </p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '12px 20px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid var(--border-glass)'
        }}>
          <ShieldCheck size={28} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>{schemes.length} Active</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Verified Schemes</div>
          </div>
        </div>
      </header>

      {/* Search Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px'
        }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-control"
            placeholder="Search scheme name or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '44px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '14px',
              fontSize: '14px',
              width: '100%'
            }}
          />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Showing {filteredSchemes.length} of {schemes.length} schemes
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', fontSize: '15px' }}>
          Loading government schemes...
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '60px', borderRadius: '20px', color: 'var(--text-secondary)' }}>
          <FileText size={40} color="var(--text-secondary)" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Schemes Found</h3>
          <p style={{ fontSize: '14px' }}>No government posts match your search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredSchemes.map((scheme) => (
            <article
              key={scheme.Kg_id || scheme.Post_name}
              className="glass"
              style={{
                borderRadius: '20px',
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {scheme.Post_name}
                    </h3>
                    {scheme.Datetime && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={12} /> {scheme.Datetime?.split('T')[0] || scheme.Datetime}
                      </div>
                    )}
                  </div>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '20px'
                }}>
                  {scheme.Description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)'
              }}>
                {scheme.File ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={14} /> Document attached
                  </span>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Kerala Health Mission</span>
                )}

                {scheme.Links ? (
                  <a
                    href={scheme.Links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ExternalLink size={14} /> Official Link
                  </a>
                ) : (
                  <span className="badge badge-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Contact ASHA Worker
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
