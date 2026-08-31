import React, { useEffect, useState } from 'react'
import { MessageSquare, Clock, CheckCircle, Send, ChevronDown, ChevronUp } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

export default function AdminManageComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyInputs, setReplyInputs] = useState({})
  const [expanded, setExpanded] = useState({})
  const [msg, setMsg] = useState({})

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/all_complaints')
      const data = await res.json()
      setComplaints(data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchComplaints() }, [])

  const sendReply = async (compId) => {
    const reply = replyInputs[compId]?.trim()
    if (!reply) return
    try {
      const res = await fetch(`/api/admin/reply_complaint?complaint_id=${compId}&reply=${encodeURIComponent(reply)}`)
      const data = await res.json()
      if (data.status === 'success') {
        setMsg(prev => ({ ...prev, [compId]: 'success' }))
        setReplyInputs(prev => ({ ...prev, [compId]: '' }))
        fetchComplaints()
      }
    } catch (e) { setMsg(prev => ({ ...prev, [compId]: 'error' })) }
    setTimeout(() => setMsg(prev => { const n = { ...prev }; delete n[compId]; return n }), 3000)
  }

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const pending = complaints.filter(c => c.Status === 'pending')
  const replied = complaints.filter(c => c.Status !== 'pending')

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Complaints</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Review and respond to user-submitted complaints.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: complaints.length, color: accent, bg: accentLight, icon: MessageSquare },
          { label: 'Pending', value: pending.length, color: 'hsl(45,95%,45%)', bg: 'hsl(45,95%,90%)', icon: Clock },
          { label: 'Replied', value: replied.length, color: 'hsl(160,65%,38%)', bg: 'hsl(160,65%,92%)', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} style={{
            flex: '1 1 140px', padding: '18px 22px', borderRadius: '16px', background: s.bg,
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <s.icon size={22} color={s.color} />
            <div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{loading ? '...' : s.value}</div>
              <div style={{ fontSize: '12px', color: s.color, fontWeight: 600, opacity: 0.8 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No complaints yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {complaints.map(c => {
            const isPending = c.Status === 'pending'
            const isOpen = expanded[c.Comp_id]
            return (
              <div key={c.Comp_id} className="glass" style={{ borderRadius: '18px', overflow: 'hidden' }}>
                {/* Header */}
                <div
                  onClick={() => toggle(c.Comp_id)}
                  style={{
                    padding: '18px 24px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                    background: isOpen ? accentLight : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      background: isPending ? 'hsl(45,95%,90%)' : 'hsl(160,65%,92%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isPending
                        ? <Clock size={18} color="hsl(45,95%,45%)" />
                        : <CheckCircle size={18} color="hsl(160,65%,38%)" />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{c.Full_Name || 'Unknown User'}</div>
                      <div style={{
                        fontSize: '13px', color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px'
                      }}>{c.Complaint}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                      background: isPending ? 'hsl(45,95%,90%)' : 'hsl(160,65%,92%)',
                      color: isPending ? 'hsl(45,95%,35%)' : 'hsl(160,65%,30%)'
                    }}>{c.Status}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.Date}</span>
                    {isOpen ? <ChevronUp size={16} color={accent} /> : <ChevronDown size={16} color="var(--text-secondary)" />}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <div style={{
                      padding: '14px 16px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)',
                      fontSize: '14px', lineHeight: 1.6, marginBottom: '14px', marginTop: '4px'
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Complaint:</strong>
                      <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>{c.Complaint}</p>
                    </div>

                    {c.Reply && (
                      <div style={{
                        padding: '14px 16px', borderRadius: '12px',
                        background: 'hsl(160,65%,96%)', border: '1px solid hsl(160,65%,80%)',
                        fontSize: '14px', lineHeight: 1.6, marginBottom: '14px'
                      }}>
                        <strong style={{ color: 'hsl(160,65%,30%)' }}>Your Reply:</strong>
                        <p style={{ marginTop: '4px', color: 'hsl(160,65%,30%)' }}>{c.Reply}</p>
                      </div>
                    )}

                    {/* Reply input */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <input
                        className="form-control"
                        placeholder={c.Reply ? 'Update your reply...' : 'Type your reply...'}
                        value={replyInputs[c.Comp_id] || ''}
                        onChange={e => setReplyInputs(p => ({ ...p, [c.Comp_id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && sendReply(c.Comp_id)}
                        style={{ flex: 1, minWidth: '200px', padding: '11px 16px', borderRadius: '12px' }}
                      />
                      <button onClick={() => sendReply(c.Comp_id)} style={{
                        padding: '11px 22px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        background: `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
                        color: 'white', fontWeight: 700, fontSize: '13px',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Send size={14} /> Send Reply
                      </button>
                    </div>
                    {msg[c.Comp_id] && (
                      <div style={{
                        marginTop: '10px', fontSize: '13px', fontWeight: 600,
                        color: msg[c.Comp_id] === 'success' ? 'hsl(160,65%,38%)' : 'hsl(352,90%,50%)'
                      }}>
                        {msg[c.Comp_id] === 'success' ? '✓ Reply sent successfully!' : '✗ Failed to send reply.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
