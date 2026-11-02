import React, { useState, useEffect, useCallback } from 'react'
import { Link, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import { CATEGORY_COLOR_OPTIONS, normalizeCategoryColor } from '../../lib/categoryColors'
import { VENUE_REGIONS } from '../../lib/venues'
import { api } from '../../api/index'
import { ContactSubmissionsManager, ProfilesManager, TrainerApplicationsManager } from './AdminRecordsManagers'

/* ── Sidebar nav ── */
const sideLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/site-content', label: 'Site Content', icon: '✏️' },
  { to: '/admin/courses', label: 'Courses', icon: '📚' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/venues', label: 'Venues', icon: '📍' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { to: '/admin/partners', label: 'Partners', icon: '🤝' },
  { to: '/admin/blog', label: 'Blog Posts', icon: '📝' },
  { to: '/admin/faqs', label: 'FAQs', icon: '❓' },
  { to: '/admin/stats', label: 'Stats & Numbers', icon: '📊' },
  { to: '/admin/enrollments', label: 'Enrollments', icon: '🎓' },
  { to: '/admin/contact-submissions', label: 'Contact', icon: '✉️' },
  { to: '/admin/trainer-applications', label: 'Trainer Apps', icon: '🧑‍🏫' },
  { to: '/admin/users', label: 'Users & Roles', icon: '👤' },
]

/* ── Modal ── */
function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="font-black text-navy text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="p-5 border-t flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onSave} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ f, value, onChange }) {
  if (f.type === 'textarea')
    return <textarea name={f.name} value={value || ''} onChange={onChange} rows={3} className="input-field resize-none w-full" placeholder={f.placeholder || ''}/>
  if (f.type === 'checkbox')
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name={f.name} checked={!!value} onChange={onChange} className="w-4 h-4 accent-navy"/>
        <span className="text-sm">{f.checkLabel || f.label}</span>
      </label>
    )
  if (f.type === 'select')
    return (
      <select name={f.name} value={value || ''} onChange={onChange} className="input-field w-full">
        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  return <input name={f.name} type={f.type || 'text'} value={value || ''} onChange={onChange} className="input-field w-full" placeholder={f.placeholder || ''}/>
}

/* ── Sidebar ── */
function AdminSidebar() {
  const { logout } = useSite()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-navy text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40 transition-all duration-200`}>
      <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[64px]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-deep font-black text-xs">GS</span>
            </div>
            <div>
              <div className="font-bold text-xs">Admin Panel</div>
              <div className="text-white/50 text-xs">GSAC Training</div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} className="text-white/60 hover:text-white p-1 rounded transition-colors ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {sideLinks.map(link => (
          <NavLink key={link.to} to={link.to} end={link.end} title={collapsed ? link.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? 'bg-white/15 text-white font-semibold border-r-4 border-gold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
            }
          >
            <span className="flex-shrink-0 text-base">{link.icon}</span>
            {!collapsed && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          {!collapsed && <span>View Website</span>}
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white/60 hover:text-red-400 text-xs transition-colors w-full">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

/* ── Dashboard Home ── */
function DashboardHome() {
  const { courses, categories, venues, faqs, blogPosts, content } = useSite()
  const [enrollCount, setEnrollCount] = useState({ total: 0, pending: 0 })

  useEffect(() => {
    api.enrollments.list().then(({ data }) => {
      if (data) setEnrollCount({ total: data.length, pending: data.filter(e => e.status === 'Pending').length })
    })
  }, [])

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: '📚', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', to: '/admin/courses' },
    { label: 'Categories', value: categories.length, icon: '🗂️', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', to: '/admin/categories' },
    { label: 'Venues', value: venues.length, icon: '📍', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', to: '/admin/venues' },
    { label: 'Blog Posts', value: blogPosts.length, icon: '📝', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', to: '/admin/blog' },
    { label: 'Enrollments', value: enrollCount.total, icon: '🎓', bg: 'bg-teal-50', text: 'text-teal-deep', border: 'border-teal-dark/20', to: '/admin/enrollments' },
    { label: 'Pending', value: enrollCount.pending, icon: '⏳', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', to: '/admin/enrollments' },
  ]
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-navy">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Manage all site content and enrollments from here.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} to={s.to} className={`p-5 rounded-xl ${s.bg} border ${s.border} hover:shadow-md transition-all`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
            <div className={`text-sm font-medium ${s.text} opacity-80 mt-0.5`}>{s.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gold-dark mb-4">📋 Quick Actions</h2>
          <div className="space-y-1">
            {[
              { label: 'Add New Course', to: '/admin/courses', icon: '➕' },
              { label: 'Edit Site Content', to: '/admin/site-content', icon: '✏️' },
              { label: 'View Enrollments', to: '/admin/enrollments', icon: '🎓' },
              { label: 'Add Blog Post', to: '/admin/blog', icon: '📝' },
              { label: 'Manage Testimonials', to: '/admin/testimonials', icon: '⭐' },
              { label: 'Update Stats', to: '/admin/stats', icon: '📊' },
            ].map(a => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-deep hover:bg-teal-50 px-3 py-2.5 rounded-lg transition-colors">
                <span>{a.icon}</span> {a.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gold-dark mb-4">📢 Recent Courses</h2>
          <div className="space-y-1.5">
            {courses.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-700 truncate flex-1 mr-3">{c.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Site Content Editor ── */
function SiteContentEditor() {
  const { content, updateContent } = useSite()
  const [form, setForm] = useState({ ...content.site })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSave = async () => {
    setSaving(true)
    await updateContent('site', form)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const sections = [
    { title: 'Basic Info', fields: [
      { name:'name', label:'Site Name' },
      { name:'tagline', label:'Hero Tagline Badge' },
      { name:'heroHeadline', label:'Hero Headline', type:'textarea' },
      { name:'heroSubtext', label:'Hero Subtext', type:'textarea' },
    ]},
    { title: 'Contact Details', fields: [
      { name:'phone', label:'Phone / WhatsApp' },
      { name:'email', label:'Email Address', type:'email' },
      { name:'address', label:'Physical Address' },
      { name:'hours', label:'Business Hours' },
      { name:'whatsapp', label:'WhatsApp Number (intl format, digits only)' },
    ]},
    { title: 'Social Media URLs', fields: [
      { name:'facebook', label:'Facebook URL', type:'url' },
      { name:'twitter', label:'Twitter / X URL', type:'url' },
      { name:'linkedin', label:'LinkedIn URL', type:'url' },
      { name:'instagram', label:'Instagram URL', type:'url' },
      { name:'youtube', label:'YouTube URL', type:'url' },
    ]},
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">Site Content</h1>
          <p className="text-gray-500 text-sm mt-1">Global site information, hero text, and contact details.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={`btn-primary disabled:opacity-60 ${saved ? '!bg-green-600' : ''}`}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
      <div className="space-y-6">
        {sections.map(sec => (
          <div key={sec.title} className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gold-dark mb-5 pb-3 border-b border-gray-100">{sec.title}</h2>
            <div className="grid gap-4">
              {sec.fields.map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                  {f.type === 'textarea'
                    ? <textarea name={f.name} value={form[f.name] || ''} onChange={handleChange} rows={3} className="input-field resize-none w-full"/>
                    : <input name={f.name} type={f.type || 'text'} value={form[f.name] || ''} onChange={handleChange} className="input-field w-full"/>
                  }
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Courses Manager ── */
function CoursesManager() {
  const { courses, addCourse, updateCourse, deleteCourse, categories } = useSite()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [saving, setSaving] = useState(false)

  const blank = { title:'', slug:'', category:'', categorySlug:'', duration:'5 Days', format:'In-Person / Virtual', level:'Intermediate', price:1500, featured:false, published:true, description:'', location:'', nextDate:'', outcomesText:'' }

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => {
      const updated = { ...f, [e.target.name]: val }
      if (e.target.name === 'title') updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
      return updated
    })
  }
  const handleCategoryChange = e => {
    const cat = categories.find(c => c.name === e.target.value)
    if (cat) setForm(f => ({ ...f, category: cat.name, categorySlug: cat.slug }))
  }
  const handleSave = async () => {
    setSaving(true)
    const outcomes = (form.outcomesText || '')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
    const payload = { ...form, outcomes }
    if (modal === 'add') await addCourse(payload)
    else await updateCourse(modal.id, payload)
    setSaving(false)
    setModal(null)
  }
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return
    await deleteCourse(id)
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterCat || c.category === filterCat)
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">{courses.length} courses total.</p>
        </div>
        <button onClick={() => { setForm({ ...blank }); setModal('add') }} className="btn-primary">+ Add Course</button>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses…" className="input-field max-w-xs"/>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input-field max-w-xs">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{['Title','Category','Price','Level','Next Date','Status','Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{c.title}</div>
                  {c.featured && <span className="text-xs bg-gold-light text-gold-deep px-2 py-0.5 rounded-full">Featured</span>}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{c.category}</td>
                <td className="px-4 py-3 font-semibold text-teal-deep whitespace-nowrap">${c.price?.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.level}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.nextDate || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => { setForm({ ...c, outcomesText: (c.outcomes || []).join('\n') }); setModal(c) }} className="text-teal-deep text-xs font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No courses match your filter.</div>}
      </div>

      {modal !== null && (
        <Modal title={modal === 'add' ? 'Add New Course' : 'Edit Course'} onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          <div className="grid gap-4">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Course Title *</label>
              <input name="title" value={form.title || ''} onChange={handleChange} className="input-field w-full"/></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Slug (auto-generated)</label>
              <input name="slug" value={form.slug || ''} onChange={handleChange} className="input-field w-full"/></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} className="input-field resize-none w-full"/></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Learning Outcomes (one per line)</label>
              <textarea name="outcomesText" value={form.outcomesText || ''} onChange={handleChange} rows={4} className="input-field resize-none w-full" placeholder={'e.g.\nMaster advanced M&E frameworks\nDevelop robust evaluation designs'}/></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Location(s)</label>
              <input name="location" value={form.location || ''} onChange={handleChange} className="input-field w-full" placeholder="e.g. Nairobi, Dubai, Virtual"/></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Next Date</label>
              <input name="nextDate" type="date" value={form.nextDate || ''} onChange={handleChange} className="input-field w-full"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select name="category" value={form.category || ''} onChange={handleCategoryChange} className="input-field w-full">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Price (USD)</label>
                <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="input-field w-full"/></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Level</label>
                <select name="level" value={form.level || ''} onChange={handleChange} className="input-field w-full">
                  {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
                </select></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Duration</label>
                <input name="duration" value={form.duration || ''} onChange={handleChange} className="input-field w-full"/></div>
              <div className="col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1">Format</label>
                <input name="format" value={form.format || ''} onChange={handleChange} className="input-field w-full"/></div>
            </div>
            <div className="flex gap-5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" checked={!!form.published} onChange={handleChange} className="w-4 h-4 accent-navy"/>
                <span className="text-sm font-medium">Published (visible on site)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={!!form.featured} onChange={handleChange} className="w-4 h-4 accent-gold"/>
                <span className="text-sm font-medium">Featured on homepage</span>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ── Generic CRUD (Categories, Venues, Testimonials, Partners, Blog, FAQs) ── */
function GenericCRUD({ title, subtitle, items, fields, onAdd, onUpdate, onDelete, extraActions }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const openAdd = () => {
    const blank = {}
    fields.forEach(f => { blank[f.name] = f.default !== undefined ? f.default : '' })
    setForm(blank); setModal('add')
  }
  const openEdit = item => {
    const next = { ...item }
    fields.forEach(f => {
      if (f.type === 'select' && f.options && !f.options.includes(next[f.name])) {
        next[f.name] = f.normalize ? f.normalize(next[f.name]) : (f.default ?? f.options[0])
      }
    })
    setForm(next); setModal(item)
  }
  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }
  const handleSave = async () => {
    setSaving(true)
    if (modal === 'add') await onAdd(form)
    else await onUpdate(modal.id, form)
    setSaving(false)
    setModal(null)
  }
  const handleDelete = async id => {
    if (!window.confirm(`Delete this ${title.slice(0,-1).toLowerCase()}?`)) return
    await onDelete(id)
  }

  const tableFields = fields.filter(f => f.showInTable)
  const filtered = items.filter(item =>
    tableFields.some(f => String(item[f.name] || '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Add New</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="input-field max-w-xs mb-4"/>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {tableFields.map(f => <th key={f.name} className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">{f.label}</th>)}
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                {tableFields.map(f => (
                  <td key={f.name} className="px-4 py-3 text-gray-700">
                    {f.type === 'checkbox' ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item[f.name] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item[f.name] ? 'Yes' : 'No'}
                      </span>
                    ) : f.name === 'logo' && item[f.name] ? (
                      <img src={item[f.name]} alt={item.name || ''} className="h-8 w-20 object-contain"/>
                    ) : f.name === 'image' && item[f.name] ? (
                      <img src={item[f.name]} alt={item.name || ''} className="h-10 w-16 object-cover rounded-lg"/>
                    ) : (
                      <span className="line-clamp-1 max-w-xs block text-xs">{item[f.name] || '—'}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <button onClick={() => openEdit(item)} className="text-teal-deep text-xs font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
                    {extraActions?.(item)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No items found.</div>}
      </div>

      {modal !== null && (
        <Modal title={modal === 'add' ? `Add ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`} onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
              <Field f={f} value={form[f.name]} onChange={handleChange}/>
            </div>
          ))}
        </Modal>
      )}
    </div>
  )
}

/* ── Stats Editor ── */
function StatsEditor() {
  const { content, updateStats } = useSite()
  const [stats, setStats] = useState({ ...content.stats })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const handleChange = e => setStats(s => ({ ...s, [e.target.name]: e.target.value }))
  const handleSave = async () => {
    setSaving(true)
    await updateStats(stats)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }
  const fields = [
    { name:'professionals', label:'Professionals Upskilled Annually', placeholder:'e.g. 15,000+' },
    { name:'hours', label:'Hours of Instruction Delivered', placeholder:'e.g. 50,000+' },
    { name:'satisfaction', label:'Learner Satisfaction Rate', placeholder:'e.g. 98%' },
    { name:'venues', label:'Global Venues', placeholder:'e.g. 15+' },
    { name:'countries', label:'Countries Served', placeholder:'e.g. 20+' },
    { name:'courses', label:'Total Courses Available', placeholder:'e.g. 1,500+' },
    { name:'trainers', label:'Expert Trainers', placeholder:'e.g. 200+' },
    { name:'years', label:'Years of Excellence', placeholder:'e.g. 9' },
  ]
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">Stats & Numbers</h1>
          <p className="text-gray-500 text-sm mt-1">Edit the key statistics shown on the homepage.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={`btn-primary disabled:opacity-60 ${saved ? '!bg-green-600' : ''}`}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
            <input name={f.name} value={stats[f.name] || ''} onChange={handleChange} className="input-field w-full" placeholder={f.placeholder}/>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Enrollments Manager ── */
function EnrollmentsManager() {
  const [enrollments, setEnrollments] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await api.enrollments.list()
    setEnrollments(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    await api.enrollments.updateStatus(id, status)
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }

  const deleteEnrollment = async id => {
    if (!window.confirm('Delete this enrollment record?')) return
    await api.enrollments.delete(id)
    setEnrollments(prev => prev.filter(e => e.id !== id))
  }

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase()
    return [(e.name || ''), (e.email || ''), (e.course_title || ''), (e.organization || '')]
      .some(v => v.toLowerCase().includes(q)) && (!filterStatus || e.status === filterStatus)
  })

  const statusColour = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-600',
    Completed: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-navy">Enrollments</h1>
          <p className="text-gray-500 text-sm mt-1">All course registration requests.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-teal-50 border border-teal-dark/20 rounded-xl px-5 py-3 text-right">
            <div className="text-xs text-teal-deep font-semibold uppercase">Total</div>
            <div className="text-2xl font-black text-teal-deep">{enrollments.length}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 text-right">
            <div className="text-xs text-yellow-700 font-semibold uppercase">Pending</div>
            <div className="text-2xl font-black text-yellow-700">{enrollments.filter(e => e.status === 'Pending').length}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, course…" className="input-field max-w-xs"/>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field max-w-[160px]">
          <option value="">All Statuses</option>
          {['Pending','Confirmed','Cancelled','Completed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? <div className="text-center py-12 text-gray-400">Loading from Supabase…</div> : (
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Participant','Course','Org','Format','Date','Status','Actions'].map(h =>
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{e.name}</div>
                    <div className="text-xs text-gray-400">{e.email}</div>
                    <div className="text-xs text-gray-400">{e.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[180px]">
                    <span className="line-clamp-2 text-xs">{e.course_title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{e.organization || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{e.format || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{e.created_at ? new Date(e.created_at).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-4 py-3">
                    <select value={e.status} onChange={ev => updateStatus(e.id, ev.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColour[e.status] || 'bg-gray-100 text-gray-600'}`}>
                      {['Pending','Confirmed','Cancelled','Completed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteEnrollment(e.id)} className="text-red-400 text-xs font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-gray-400">No enrollments found.</div>}
      </div>
    </div>
  )
}

/* ── Main ── */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const {
    user,
    categories, addCategory, updateCategory, deleteCategory,
    venues, addVenue, updateVenue, deleteVenue,
    content, addTestimonial, updateTestimonial, deleteTestimonial,
    addPartner, updatePartner, deletePartner,
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    faqs, addFaq, updateFaq, deleteFaq,
  } = useSite()

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login')
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-56 p-8 transition-all duration-200">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="site-content" element={<SiteContentEditor />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="stats" element={<StatsEditor />} />
          <Route path="enrollments" element={<EnrollmentsManager />} />
          <Route path="contact-submissions" element={<ContactSubmissionsManager />} />
          <Route path="trainer-applications" element={<TrainerApplicationsManager />} />
          <Route path="users" element={<ProfilesManager />} />

          <Route path="categories" element={
            <GenericCRUD title="Categories" subtitle="Manage training categories shown across the site." items={categories}
              fields={[
                { name:'name', label:'Category Name', showInTable:true },
                { name:'slug', label:'Slug (URL key)', showInTable:true },
                { name:'icon', label:'Icon (emoji)', showInTable:true, placeholder:'e.g. 🎯' },
                { name:'description', label:'Description', type:'textarea', showInTable:false },
                { name:'courseCount', label:'Course Count (display)', type:'number', showInTable:true },
                { name:'color', label:'Colour Theme (brand accent)', type:'select', options:CATEGORY_COLOR_OPTIONS, default:'navy', normalize:normalizeCategoryColor, showInTable:true },
                { name:'published', label:'Published', type:'checkbox', default:true, checkLabel:'Show on site', showInTable:true },
              ]}
              onAdd={addCategory} onUpdate={updateCategory} onDelete={deleteCategory}
            />
          } />

          <Route path="venues" element={
            <GenericCRUD title="Venues" subtitle="Training cities shown on the Venues page, the homepage and the Venues menu. Venues are grouped by Region." items={venues}
              fields={[
                { name:'name', label:'City', showInTable:true, placeholder:'e.g. Nairobi' },
                { name:'country', label:'Country', showInTable:true, placeholder:'e.g. Kenya' },
                { name:'region', label:'Region (menu group)', type:'select', options:VENUE_REGIONS, default:'Africa', showInTable:true },
                { name:'type', label:'Type (Flagship / Regional Hub / …)', showInTable:false },
                { name:'description', label:'Description (optional)', type:'textarea', showInTable:false },
                { name:'image', label:'Image URL (optional)', type:'url', showInTable:false },
                { name:'sort_order', label:'Display Order (lower = first)', type:'number', default:100, showInTable:false },
                { name:'active', label:'Active', type:'checkbox', default:true, checkLabel:'Show on site', showInTable:true },
              ]}
              onAdd={addVenue} onUpdate={updateVenue} onDelete={deleteVenue}
            />
          } />

          <Route path="testimonials" element={
            <GenericCRUD title="Testimonials" subtitle="Client testimonials displayed on the homepage." items={content.testimonials}
              fields={[
                { name:'name', label:'Client Name', showInTable:true },
                { name:'role', label:'Role / Title', showInTable:true },
                { name:'quote', label:'Testimonial Quote', type:'textarea', showInTable:false },
                { name:'rating', label:'Rating (1–5)', type:'number', default:5, showInTable:true },
                { name:'approved', label:'Approved', type:'checkbox', default:true, checkLabel:'Show on website', showInTable:true },
                { name:'sort_order', label:'Sort Order (number)', type:'number', showInTable:false, default:0 },
              ]}
              onAdd={addTestimonial} onUpdate={updateTestimonial} onDelete={deleteTestimonial}
            />
          } />

          <Route path="partners" element={
            <GenericCRUD title="Partners" subtitle="Partner / client logos in the homepage marquee." items={content.partners}
              fields={[
                { name:'name', label:'Partner Name', showInTable:true },
                { name:'logo', label:'Logo Image URL', type:'url', showInTable:true },
                { name:'sort_order', label:'Sort Order', type:'number', showInTable:false, default:0 },
                { name:'active', label:'Active', type:'checkbox', default:true, checkLabel:'Show on site', showInTable:true },
              ]}
              onAdd={addPartner} onUpdate={updatePartner} onDelete={deletePartner}
            />
          } />

          <Route path="blog" element={
            <GenericCRUD title="Blog Posts" subtitle="Manage blog articles and industry insights." items={blogPosts}
              fields={[
                { name:'title', label:'Title', showInTable:true },
                { name:'slug', label:'Slug (URL, auto-fill from title)', showInTable:false },
                { name:'excerpt', label:'Excerpt / Summary', type:'textarea', showInTable:false },
                { name:'content', label:'Full Content', type:'textarea', showInTable:false },
                { name:'author', label:'Author', showInTable:true },
                { name:'category', label:'Category', showInTable:true },
                { name:'image', label:'Featured Image URL', type:'url', showInTable:true },
                { name:'date', label:'Publish Date', type:'date', showInTable:true },
                { name:'published', label:'Published', type:'checkbox', default:true, checkLabel:'Publish post', showInTable:true },
              ]}
              onAdd={addBlogPost} onUpdate={updateBlogPost} onDelete={deleteBlogPost}
            />
          } />

          <Route path="faqs" element={
            <GenericCRUD title="FAQs" subtitle="Frequently asked questions on the FAQs page." items={faqs}
              fields={[
                { name:'category', label:'Category', showInTable:true, placeholder:'e.g. Registration & Payment' },
                { name:'question', label:'Question', showInTable:true },
                { name:'answer', label:'Answer', type:'textarea', showInTable:false },
                { name:'sort_order', label:'Sort Order', type:'number', showInTable:false, default:0 },
                { name:'active', label:'Active', type:'checkbox', default:true, checkLabel:'Show on site', showInTable:true },
              ]}
              onAdd={addFaq} onUpdate={updateFaq} onDelete={deleteFaq}
            />
          } />
        </Routes>
      </main>
    </div>
  )
}
