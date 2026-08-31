import React, { useEffect, useState } from 'react'
import { MapPin, Plus, Trash2, RefreshCw } from 'lucide-react'

const accent = 'hsl(232, 85%, 60%)'
const accentLight = 'hsl(232, 85%, 94%)'

export default function AdminManageWards() {
  const [wards, setWards] = useState([])
  const [wardName, setWardName] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)

  const fetchWards = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/getward')
      const data = await res.json()
      setWards(data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchWards() }, [])

  const addWard = async (e) => {
    e.preventDefault()
    if (!wardName.trim()) return
    try {
      const res = await fetch(`/api/admin/add_ward?ward_name=${encodeURIComponent(wardName)}`)
      const data = await res.json()
      if (data.status === 'success') {
        setMsg({ type: 'success', text: 'Ward added successfully!' })
        setWardName('')
        fetchWards()
      }
    } catch (e) { setMsg({ type: 'error', text: 'Failed to add ward.' }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const deleteWard = async (id) => {
    if (!window.confirm('Delete this ward?')) return
    try {
      const res = await fetch(`/api/admin/delete_ward?ward_id=${id}`)
      const data = await res.json()
      if (data.status === 'success') fetchWards()
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Manage Wards</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Add and manage geographic wards for ASHA worker assignments.</p>
      </div>

      {/* Add Ward Form */}
      <div className="glass" style={{ borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Plus size={20} color={accent} />
          <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Add New Ward</h3>
        </div>
        <form onSubmit={addWard} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <input
            className="form-control"
            placeholder="Enter ward name..."
            value={wardName}
            onChange={e => setWardName(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '12px' }}
          />
          <button type="submit" style={{
            padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${accent}, hsl(250,80%,65%))`,
            color: 'white', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <Plus size={16} /> Add Ward
          </button>
        </form>
        {msg && (
          <div style={{
            marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
            background: msg.type === 'success' ? 'hsl(160,65%,92%)' : 'hsl(352,90%,94%)',
            color: msg.type === 'success' ? 'hsl(160,65%,30%)' : 'hsl(352,90%,40%)',
            fontWeight: 600, fontSize: '14px'
          }}>{msg.text}</div>
        )}
      </div>

      {/* Wards Table */}
      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color={accent} />
            <span style={{ fontWeight: 700, fontSize: '16px' }}>All Wards ({wards.length})</span>
          </div>
          <button onClick={fetchWards} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accent }}>
            <RefreshCw size={18} />
          </button>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading wards...</div>
        ) : wards.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No wards found. Add one above.</div>
        ) : (
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {wards.map(w => (
                <div key={w.Ward_id} style={{
                  padding: '16px 20px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all var(--transition-fast)'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MapPin size={15} color={accent} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{w.Ward_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {w.Ward_id}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteWard(w.Ward_id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', padding: '4px',
                    borderRadius: '6px', transition: 'color var(--transition-fast)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'hsl(352,90%,55%)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
