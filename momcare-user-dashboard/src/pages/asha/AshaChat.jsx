import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageSquare, Send, Search, CheckCircle, Clock } from 'lucide-react'

const accent = 'hsl(160, 65%, 38%)'
const accentLight = 'hsl(160, 65%, 92%)'

export default function AshaChat({ user }) {
  const [searchParams] = useSearchParams()
  const initialUserId = searchParams.get('user_id')

  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  const messagesEndRef = useRef(null)

  // 1. Fetch assigned patients
  useEffect(() => {
    const ashaLid = user?.login_id || user?.Login_id || 2
    setLoadingPatients(true)
    fetch(`/api/asha/view_users?login_id=${ashaLid}`)
      .then(r => r.json())
      .then(d => {
        const list = d.data || []
        setPatients(list)

        // Select pre-queried patient or first patient
        if (list.length > 0) {
          if (initialUserId) {
            const found = list.find(p => String(p.Login_id) === String(initialUserId) || String(p.Users_id) === String(initialUserId))
            setSelectedPatient(found || list[0])
          } else {
            setSelectedPatient(list[0])
          }
        }
      })
      .catch(err => console.error('Error loading assigned patients:', err))
      .finally(() => setLoadingPatients(false))
  }, [user, initialUserId])

  // 2. Fetch chat history for selected patient
  const fetchChatHistory = () => {
    const ashaLid = user?.login_id || user?.Login_id || 2
    if (!selectedPatient) return
    const targetLid = selectedPatient.Login_id || selectedPatient.login_id
    if (!targetLid) return

    setLoadingMessages(true)
    fetch(`/api/chatdetail?sender_id=${ashaLid}&receiver_id=${targetLid}`)
      .then(r => r.json())
      .then(d => {
        const msgs = d.data || []
        // Backend returns in DESC order, reverse for chat chronological display
        setMessages([...msgs].reverse())
      })
      .catch(err => console.error('Error loading chat:', err))
      .finally(() => setLoadingMessages(false))
  }

  useEffect(() => {
    fetchChatHistory()
  }, [selectedPatient, user])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 3. Send message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    const ashaLid = user?.login_id || user?.Login_id || 2
    if (!newMessage.trim() || !selectedPatient || sending) return

    const targetLid = selectedPatient.Login_id || selectedPatient.login_id
    if (!targetLid) return

    const textToSend = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const res = await fetch(`/api/chat?sender_id=${ashaLid}&receiver_id=${targetLid}&details=${encodeURIComponent(textToSend)}`)
      const data = await res.json()
      if (data.status === 'success') {
        fetchChatHistory()
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const filteredPatients = patients.filter(p =>
    `${p.Full_Name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Outfit, sans-serif', height: 'calc(100vh - 100px)', minHeight: '600px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Patient Messages</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Direct communication with pregnant women in your assigned ward.
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass" style={{
        flex: 1,
        minHeight: 0,
        borderRadius: '24px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)'
      }}>

        {/* Left Column: Patient Selection List */}
        <div style={{
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.5)',
          minHeight: 0,
          maxHeight: '100%',
          overflow: 'hidden'
        }}>
          {/* Search Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.7)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              ASSIGNED PATIENTS ({patients.length})
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="form-control"
                placeholder="Search patient..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '10px', fontSize: '13px', width: '100%' }}
              />
            </div>
          </div>

          {/* Patient Cards List */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {loadingPatients ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Loading patients...
              </div>
            ) : filteredPatients.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                No patients found.
              </div>
            ) : (
              filteredPatients.map(p => {
                const isSelected = selectedPatient && (selectedPatient.Users_id === p.Users_id || selectedPatient.Login_id === p.Login_id)
                return (
                  <div
                    key={p.Users_id || p.Login_id}
                    onClick={() => setSelectedPatient(p)}
                    style={{
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: isSelected ? accentLight : 'transparent',
                      borderLeft: isSelected ? `4px solid ${accent}` : '4px solid transparent',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isSelected ? accent : 'rgba(0,0,0,0.08)',
                      color: isSelected ? 'white' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {p.Full_Name?.[0] || '?'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: isSelected ? 800 : 600, fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.Full_Name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                        <span>Ward: {p.Ward_name || 'Adoor'}</span>
                        <span>•</span>
                        <span>{p.Blood_Group || 'O+'}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'rgba(255, 255, 255, 0.6)' }}>
          {selectedPatient ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.85)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${accent}, hsl(150,65%,45%))`,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedPatient.Full_Name?.[0] || '?'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{selectedPatient.Full_Name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Age: {selectedPatient.Age || 'N/A'} yrs | Blood Group: {selectedPatient.Blood_Group || 'N/A'} | BP: {selectedPatient.Blood_Pressure || 'Normal'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={fetchChatHistory}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px' }}
                >
                  Refresh Messages
                </button>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, minHeight: 0, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {loadingMessages ? (
                  <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={36} color="var(--text-secondary)" style={{ opacity: 0.4, marginBottom: '8px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>No messages yet</div>
                    <div style={{ fontSize: '13px' }}>Start the conversation with {selectedPatient.Full_Name} below.</div>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = String(m.sender_id) === String(user?.login_id || user?.Login_id || 2)
                    return (
                      <div
                        key={idx}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          padding: '12px 18px',
                          borderRadius: isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                          background: isMe ? `linear-gradient(135deg, ${accent}, hsl(150,65%,45%))` : 'white',
                          color: isMe ? 'white' : 'var(--text-primary)',
                          boxShadow: 'var(--shadow-sm)',
                          border: isMe ? 'none' : '1px solid var(--border)',
                          fontSize: '14px',
                          lineHeight: 1.5
                        }}>
                          {m.message}
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', padding: '0 4px' }}>
                          {m.date ? (m.date.split('T')[0] || m.date) : 'Just now'}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Form */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.95)',
                  flexShrink: 0
                }}
              >
                <input
                  className="form-control"
                  placeholder={`Type message to ${selectedPatient.Full_Name}...`}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '12px 18px', borderRadius: '14px', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                    background: `linear-gradient(135deg, ${accent}, hsl(150,65%,45%))`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: sending || !newMessage.trim() ? 0.6 : 1
                  }}
                >
                  <Send size={16} /> Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Select a patient from the list on the left to start chatting.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
