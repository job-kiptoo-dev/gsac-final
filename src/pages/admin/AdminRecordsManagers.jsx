import React from 'react'
import { api } from '../../api/index'

function useRemoteRecords(loader) {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  // Callers pass an inline arrow (`() => api.x.list()`), which is a NEW function on
  // every render. Keeping it in a ref means `refresh` stays stable, so the effect
  // below runs once on mount instead of re-fetching in an endless loop.
  const loaderRef = React.useRef(loader)
  loaderRef.current = loader

  const refresh = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await loaderRef.current()
      setItems(data || [])
    } catch (err) {
      console.error('[GSAC] Failed to load records:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  return { items, setItems, loading, refresh }
}

function StatusBadge({ value }) {
  const tone = {
    New: 'bg-blue-100 text-blue-700',
    Read: 'bg-yellow-100 text-yellow-700',
    Replied: 'bg-green-100 text-green-700',
    Archived: 'bg-gray-100 text-gray-600',
    'Under Review': 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    user: 'bg-gray-100 text-gray-700',
    admin: 'bg-teal-50 text-teal-deep',
  }
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${tone[value] || 'bg-gray-100 text-gray-700'}`}>{value}</span>
}

export function ContactSubmissionsManager() {
  const { items, setItems, loading } = useRemoteRecords(() => api.contact.list())
  const [search, setSearch] = React.useState('')

  const updateStatus = async (id, status) => {
    await api.contact.updateStatus(id, status)
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status } : item))
  }

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await api.contact.delete(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const filtered = items.filter((item) => {
    const q = search.toLowerCase()
    return [item.name, item.email, item.subject, item.message].some((field) => String(field || '').toLowerCase().includes(q))
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">Contact Submissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage incoming visitor enquiries from the contact page.</p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages…" className="input-field max-w-xs" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? <div className="text-center py-12 text-gray-400">Loading from Supabase…</div> : (
          <table className="w-full text-sm min-w-[980px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Contact', 'Organization', 'Subject', 'Message', 'Status', 'Received', 'Actions'].map((heading) => (
                  <th key={heading} className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                    <div className="text-xs text-gray-400">{item.phone || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.organization || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{item.subject || 'General enquiry'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[280px]"><span className="line-clamp-3 block">{item.message}</span></td>
                  <td className="px-4 py-3">
                    <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="input-field py-2 min-w-[130px]">
                      <option>New</option>
                      <option>Read</option>
                      <option>Replied</option>
                      <option>Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3"><button onClick={() => deleteRecord(item.id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 ? <div className="text-center py-12 text-gray-400">No contact messages found.</div> : null}
      </div>
    </div>
  )
}

export function TrainerApplicationsManager() {
  const { items, setItems, loading } = useRemoteRecords(() => api.trainerApplications.list())
  const [search, setSearch] = React.useState('')

  const updateStatus = async (id, status) => {
    await api.trainerApplications.updateStatus(id, status)
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status } : item))
  }

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this application?')) return
    await api.trainerApplications.delete(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const filtered = items.filter((item) => {
    const q = search.toLowerCase()
    return [item.name, item.email, item.expertise, item.bio].some((field) => String(field || '').toLowerCase().includes(q))
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">Trainer Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Review and update incoming faculty applications.</p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applicants…" className="input-field max-w-xs" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? <div className="text-center py-12 text-gray-400">Loading from Supabase…</div> : (
          <table className="w-full text-sm min-w-[980px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Applicant', 'Expertise', 'LinkedIn', 'Bio', 'Status', 'Received', 'Actions'].map((heading) => (
                  <th key={heading} className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                    <div className="text-xs text-gray-400">{item.phone || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.expertise || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.linkedin ? <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-deep hover:underline">Profile</a> : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[300px]"><span className="line-clamp-4 block">{item.bio}</span></td>
                  <td className="px-4 py-3">
                    <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="input-field py-2 min-w-[150px]">
                      <option>New</option>
                      <option>Under Review</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3"><button onClick={() => deleteRecord(item.id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 ? <div className="text-center py-12 text-gray-400">No trainer applications found.</div> : null}
      </div>
    </div>
  )
}

export function ProfilesManager() {
  const { items, setItems, loading } = useRemoteRecords(() => api.profiles.list())
  const [search, setSearch] = React.useState('')

  const updateRole = async (id, role) => {
    await api.profiles.update(id, { role })
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, role } : item))
  }

  const filtered = items.filter((item) => {
    const q = search.toLowerCase()
    return [item.name, item.email, item.organization, item.role].some((field) => String(field || '').toLowerCase().includes(q))
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">User Profiles</h1>
          <p className="text-gray-500 text-sm mt-1">Manage authenticated users and admin privileges.</p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="input-field max-w-xs" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? <div className="text-center py-12 text-gray-400">Loading from Supabase…</div> : (
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User', 'Organization', 'Role', 'Created'].map((heading) => (
                  <th key={heading} className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{item.name || '—'}</div>
                    <div className="text-xs text-gray-400">{item.email || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.organization || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={item.role} onChange={(e) => updateRole(item.id, e.target.value)} className="input-field py-2 max-w-[120px]">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 ? <div className="text-center py-12 text-gray-400">No users found.</div> : null}
      </div>
    </div>
  )
}
