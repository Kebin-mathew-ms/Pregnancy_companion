import React, { useEffect, useState } from 'react'
import { FileText, Plus, Trash2, ExternalLink, Calendar } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

export default function AdminManagePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ post_name: '', description: '', links: '' })
  const [msg, setMsg] = useState(null)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/view_posts')
      const data = await res.json()
      setPosts(data.post || data.records || data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPosts() }, [])

  const addPost = async (e) => {
    e.preventDefault()
    if (!form.post_name.trim() || !form.description.trim()) {
      setMsg({ type: 'error', text: 'Post name and description are required.' })
      return
    }
    const params = new URLSearchParams(form)
    try {
      const res = await fetch(`/api/admin/add_govt_post?${params}`)
      const data = await res.json()
      if (data.status === 'success') {
        setMsg({ type: 'success', text: 'Post published successfully!' })
        setForm({ post_name: '', description: '', links: '' })
        setShowForm(false)
        fetchPosts()
      }
    } catch (e) { setMsg({ type: 'error', text: 'Failed to publish post.' }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const deletePost = async (id) => {
    if (!window.confirm('Delete this government post?')) return
    await fetch(`/api/admin/delete_govt_post?post_id=${id}`)
    fetchPosts()
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Government Posts</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Publish Kerala government scheme announcements for pregnant users.</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: showForm ? 'var(--border)' : `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
          color: showForm ? 'var(--text-primary)' : 'white',
          fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && (
        <div className="glass" style={{ borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '20px' }}>Publish New Post</h3>
          {msg && (
            <div style={{
              marginBottom: '14px', padding: '12px 16px', borderRadius: '10px',
              background: msg.type === 'success' ? 'hsl(160,65%,92%)' : 'hsl(352,90%,94%)',
              color: msg.type === 'success' ? 'hsl(160,65%,30%)' : 'hsl(352,90%,40%)', fontWeight: 600, fontSize: '14px'
            }}>{msg.text}</div>
          )}
          <form onSubmit={addPost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input className="form-control" placeholder="Post / Scheme title"
              value={form.post_name} onChange={e => setForm(p => ({ ...p, post_name: e.target.value }))}
              style={{ padding: '12px 16px', borderRadius: '12px' }} />
            <textarea className="form-control" placeholder="Description..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={4} style={{ padding: '12px 16px', borderRadius: '12px', resize: 'vertical' }} />
            <input className="form-control" placeholder="Link URL (optional)"
              value={form.links} onChange={e => setForm(p => ({ ...p, links: e.target.value }))}
              style={{ padding: '12px 16px', borderRadius: '12px' }} />
            <button type="submit" style={{
              padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
              color: 'white', fontWeight: 700, fontSize: '14px', alignSelf: 'flex-start'
            }}>Publish Post</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No posts yet. Publish one above.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(p => (
            <div key={p.Kg_id} className="glass" style={{
              borderRadius: '18px', padding: '24px',
              transition: 'transform var(--transition-normal)'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <FileText size={18} color={accent} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{p.Post_name}</div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {p.Description}
                  </p>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {p.Datetime && (
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {p.Datetime?.split('T')[0] || p.Datetime}
                      </span>
                    )}
                    {p.Links && (
                      <a href={p.Links} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '12px', color: accent, textDecoration: 'none', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <ExternalLink size={12} /> View Link
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={() => deletePost(p.Kg_id)} style={{
                  background: 'hsl(352,90%,94%)', border: 'none', cursor: 'pointer',
                  color: 'hsl(352,90%,50%)', padding: '8px 12px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600
                }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
