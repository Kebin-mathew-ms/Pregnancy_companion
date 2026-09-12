import React, { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, MessageCircle, HelpCircle, ShieldAlert, ArrowLeft } from 'lucide-react'

export default function ChatAndHelp({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('chatbot') // 'chatbot', 'messages', 'complaints'
  
  // Gemini Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your MomCare AI pregnancy assistant. Ask me anything about diet, symptoms, or health recommendations!' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)
  const chatEndRef = useRef(null)

  // Direct Messaging State
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [directMessages, setDirectMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Complaints State
  const [complaints, setComplaints] = useState([])
  const [newComplaint, setNewComplaint] = useState('')
  const [loadingComplaints, setLoadingComplaints] = useState(false)
  const [submittingComplaint, setSubmittingComplaint] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (activeSubTab === 'chatbot') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, activeSubTab])

  // Fetch doctors and ASHA workers as contacts
  useEffect(() => {
    async function loadContacts() {
      try {
        const docRes = await fetch('/api/view_doctors')
        let docList = []
        if (docRes.ok) {
          const docJson = await docRes.json()
          if (docJson.status === 'success' && Array.isArray(docJson.data)) {
            docList = docJson.data.map(d => ({
              id: d.Doc_id,
              name: `Dr. ${d.First_Name} ${d.Last_Name}`,
              role: d.Specialization || 'Gynaecologist',
              loginId: d.Login_id || d.Doc_id
            }))
          }
        }
        
        const ashaRes = await fetch('/api/view_ashaworkers')
        let ashaList = []
        if (ashaRes.ok) {
          const ashaJson = await ashaRes.json()
          if (ashaJson.status === 'success' && Array.isArray(ashaJson.data)) {
            ashaList = ashaJson.data.map(a => ({
              id: a.Asha_id,
              name: `${a.First_Name} ${a.Last_Name}`,
              role: 'ASHA Worker',
              loginId: a.Login_id
            }))
          }
        }
        setContacts([...docList, ...ashaList])
      } catch (err) {
        console.error('Failed to load contacts:', err)
      }
    }
    
    if (activeSubTab === 'messages') {
      loadContacts()
    }
  }, [activeSubTab])

  // Fetch direct chat details
  const loadDirectMessages = async (contact) => {
    setLoadingMessages(true)
    try {
      const response = await fetch(`/api/chatdetail?sender_id=${user.login_id}&receiver_id=${contact.loginId}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success' && Array.isArray(res.data)) {
          // Reorder history (newest to oldest or oldest to newest)
          const sorted = [...res.data].reverse()
          setDirectMessages(sorted)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    if (selectedContact) {
      loadDirectMessages(selectedContact)
    }
  }, [selectedContact])

  // Fetch Complaints
  const loadComplaints = async () => {
    setLoadingComplaints(true)
    try {
      const response = await fetch(`/api/view_complaints?user_id=${user.user_id}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success' && Array.isArray(res.data)) {
          setComplaints(res.data)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingComplaints(false)
    }
  }

  useEffect(() => {
    if (activeSubTab === 'complaints') {
      loadComplaints()
    }
  }, [activeSubTab, user])

  // Gemini Send
  const handleGeminiSend = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userText = chatInput.trim()
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }])
    setChatInput('')
    setLoadingChat(true)

    try {
      const response = await fetch(`/api/chatbot?chat=${encodeURIComponent(userText)}`)
      if (!response.ok) {
        throw new Error('Connection failed')
      }
      const data = await response.json()
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.response || 'I couldn\'t process that request.' }])
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to Gemini. Please try again.' }])
    } finally {
      setLoadingChat(false)
    }
  }

  // Send Direct Message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedContact) return

    const messageText = messageInput.trim()
    setMessageInput('')

    try {
      const url = `/api/chat?sender_id=${user.login_id}&receiver_id=${selectedContact.loginId}&details=${encodeURIComponent(messageText)}`
      const response = await fetch(url)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success') {
          // Optimistic update
          setDirectMessages(prev => [...prev, { sender_id: user.login_id, message: messageText, date: new Date().toISOString() }])
          loadDirectMessages(selectedContact) // reload
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // File Complaint
  const handleAddComplaint = async (e) => {
    e.preventDefault()
    if (!newComplaint.trim()) return

    setSubmittingComplaint(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/submit_complaint?user_id=${user.user_id}&complaint=${encodeURIComponent(newComplaint.trim())}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success') {
          setSuccess('Complaint filed successfully!')
          setNewComplaint('')
          loadComplaints()
        } else {
          setError('Failed to file complaint')
        }
      }
    } catch (err) {
      setError('Connection failed')
    } finally {
      setSubmittingComplaint(false)
    }
  }

  // Delete Complaint
  const handleDeleteComplaint = async (id) => {
    try {
      const response = await fetch(`/api/delete_complaint?complaint_id=${id}`)
      if (response.ok) {
        const res = await response.json()
        if (res.status === 'success') {
          loadComplaints()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'Outfit, sans-serif', height: 'calc(100vh - 120px)' }}>
      
      {/* Tab Selectors */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Support Hub</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Chat & Help Desk</h2>
        </div>

        <div className="glass" style={{ display: 'flex', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setActiveSubTab('chatbot')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: activeSubTab === 'chatbot' ? 700 : 500,
              background: activeSubTab === 'chatbot' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'chatbot' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            MomCare AI
          </button>
          <button 
            onClick={() => setActiveSubTab('messages')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: activeSubTab === 'messages' ? 700 : 500,
              background: activeSubTab === 'messages' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'messages' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Direct Messages
          </button>
          <button 
            onClick={() => setActiveSubTab('complaints')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: activeSubTab === 'complaints' ? 700 : 500,
              background: activeSubTab === 'complaints' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'complaints' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Complaints
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        
        {activeSubTab === 'chatbot' && (
          /* Gemini AI Chatbot */
          <div className="glass" style={{ flex: 1, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px 30px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(90deg, var(--primary-light) 0%, transparent 100%)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>MomCare Gemini Assistant</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>AI-Powered Health Assistant</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {chatMessages.map((m, idx) => (
                <div key={idx} style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: m.sender === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.9)',
                  color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '14px 20px',
                  borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '15px',
                  lineHeight: 1.4,
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border)'
                }}>
                  {m.text}
                </div>
              ))}
              {loadingChat && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '14px 20px',
                  borderRadius: '18px 18px 18px 4px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)'
                }}>
                  Typing suggestions...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleGeminiSend} style={{ padding: '20px 30px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
              <input
                className="form-control"
                type="text"
                placeholder="Ask about pregnancy vitamins, exercise, or body changes..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={loadingChat}
                style={{ borderRadius: '24px' }}
              />
              <button className="btn btn-primary" type="submit" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }} disabled={loadingChat}>
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {activeSubTab === 'messages' && (
          /* Direct Messages with Doctors / ASHA Workers */
          <div style={{ flex: 1, display: 'flex', gap: '30px', minHeight: 0 }}>
            {/* Contacts Sidebar */}
            <div className="glass" style={{ width: '280px', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '15px' }}>
                Assigned Contacts
              </div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px' }}>
                {contacts.length > 0 ? contacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: selectedContact?.loginId === c.loginId ? 'var(--primary-light)' : 'transparent',
                      color: selectedContact?.loginId === c.loginId ? 'var(--primary)' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{c.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.role}</span>
                  </button>
                )) : (
                  <div style={{ padding: '20px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No medical contacts assigned yet.
                  </div>
                )}
              </div>
            </div>

            {/* Chat Frame */}
            {selectedContact ? (
              <div className="glass" style={{ flex: 1, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px 30px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageCircle size={20} color="var(--secondary)" />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{selectedContact.name}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedContact.role}</span>
                  </div>
                </div>

                {/* Message Log */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {loadingMessages ? (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading message log...</div>
                  ) : directMessages.length > 0 ? (
                    directMessages.map((m, idx) => {
                      const isMe = String(m.sender_id) === String(user.login_id)
                      return (
                        <div key={idx} style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          background: isMe ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.9)',
                          color: isMe ? 'white' : 'var(--text-primary)',
                          padding: '12px 18px',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          boxShadow: 'var(--shadow-sm)',
                          fontSize: '14px',
                          border: isMe ? 'none' : '1px solid var(--border)'
                        }}>
                          {m.message}
                        </div>
                      )
                    })
                  ) : (
                    <div style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: '14px'
                    }}>
                      Send a message to initiate conversation with {selectedContact.name}.
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} style={{ padding: '20px 30px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={{ borderRadius: '24px' }}
                  />
                  <button className="btn btn-secondary" type="submit" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass" style={{
                flex: 1,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}>
                Select an ASHA worker or doctor from the sidebar to chat.
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'complaints' && (
          /* Complaints Board */
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', minHeight: 0 }}>
            {/* Complaints History List */}
            <div className="glass" style={{ borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} color="var(--primary)" /> Filed Complaints
              </h3>
              
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loadingComplaints ? (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading history...</div>
                ) : complaints.length > 0 ? (
                  complaints.map((c) => (
                    <div key={c.Comp_id} style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`badge ${c.Reply === 'pending' ? 'badge-accent' : 'badge-primary'}`}>
                          Status: {c.Reply === 'pending' ? 'Pending' : 'Resolved'}
                        </span>
                        <button
                          onClick={() => handleDeleteComplaint(c.Comp_id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'hsl(0, 100%, 40%)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        >
                          Withdraw
                        </button>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>
                        {c.Complaint_id}
                      </p>
                      {c.Reply !== 'pending' && (
                        <div style={{
                          background: 'rgba(14, 165, 233, 0.08)',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          borderLeft: '4px solid var(--secondary)',
                          fontSize: '13px',
                          marginTop: '4px'
                        }}>
                          <strong>Reply:</strong> {c.Reply}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '14px'
                  }}>
                    No active complaints filed.
                  </div>
                )}
              </div>
            </div>

            {/* New Complaint Form */}
            <div className="glass" style={{ borderRadius: '24px', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>File a Complaint</h3>
              
              {success && (
                <div style={{
                  background: 'hsl(142, 70%, 95%)',
                  color: 'hsl(142, 70%, 25%)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}>
                  {success}
                </div>
              )}

              {error && (
                <div style={{
                  background: 'hsl(0, 100%, 96%)',
                  color: 'hsl(0, 100%, 40%)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleAddComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="newComplaint">Details of Complaint *</label>
                  <textarea
                    className="form-control"
                    id="newComplaint"
                    rows="4"
                    placeholder="Provide details about your query or administrative complaint..."
                    value={newComplaint}
                    onChange={(e) => setNewComplaint(e.target.value)}
                    disabled={submittingComplaint}
                    required
                    style={{ resize: 'vertical', minHeight: '120px' }}
                  />
                </div>
                <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={submittingComplaint}>
                  {submittingComplaint ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
