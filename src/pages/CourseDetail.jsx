import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CurrencyPrice from '../components/common/CurrencyPrice'
import { useSite } from '../context/SiteContext'
import { api } from '../api/index'

export default function CourseDetail() {
  const { slug } = useParams()
  const { courses, content } = useSite()
  const { site } = content
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [enquiryError, setEnquiryError] = useState('')

  const course = courses.find(c => c.slug === slug)
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Course Not Found</h2>
        <Link to="/training-categories" className="btn-primary">Browse Courses</Link>
      </div>
    </div>
  )

  const related = courses.filter(c => c.categorySlug === course.categorySlug && c.slug !== slug && c.published).slice(0, 3)

  const handleEnquiry = async (e) => {
    e.preventDefault()
    setEnquiryError('')
    setSending(true)
    try {
      const { error } = await api.contact.submit({
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        organization: '',
        subject: `Course Enquiry: ${course.title}`,
        message: enquiryForm.message || `I'm interested in the "${course.title}" course. Please send me more information.`,
      })
      if (error) throw error
      setSent(true)
      setEnquiryForm({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => { setShowEnquiry(false); setSent(false) }, 2500)
    } catch (err) {
      console.error(err)
      setEnquiryError('Something went wrong sending your enquiry. Please try again or contact us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Breadcrumb + header */}
      <div className="bg-navy py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-4 flex-wrap">
            <Link to="/training-categories" className="hover:text-white">Categories</Link>
            <span>/</span>
            <Link to={`/training-categories/${course.categorySlug}`} className="hover:text-white">{course.category}</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{course.title}</span>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="tag-pill bg-white/20 text-white text-xs">{course.category}</span>
                <span className="tag-pill bg-white/20 text-white text-xs">{course.level}</span>
                {course.featured && <span className="tag-pill bg-gold text-navy text-xs">Featured</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{course.title}</h1>
              <p className="text-white/70 leading-relaxed mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-5 text-sm text-white/80">
                <span className="flex items-center gap-2">⏱️ <strong>{course.duration}</strong></span>
                <span className="flex items-center gap-2">💻 <strong>{course.format}</strong></span>
                {course.location && <span className="flex items-center gap-2">📍 <strong>{course.location}</strong></span>}
                {course.nextDate && <span className="flex items-center gap-2">📅 Next: <strong>{new Date(course.nextDate).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</strong></span>}
              </div>
            </div>
            {/* Booking card */}
            <div className="glass-card bg-white p-6">
              <CurrencyPrice amount={course.price} className="text-3xl font-black text-teal-deep mb-1 block" />
              <div className="text-gray-500 text-xs mb-5">per participant · All inclusive</div>
              <div className="space-y-3">
                <Link to={`/enroll/${course.id}`} className="btn-primary w-full justify-center">
                  Register Now
                </Link>
                <button onClick={() => setShowEnquiry(true)} className="btn-secondary w-full justify-center">
                  Enquiry
                </button>
                <button onClick={() => downloadBrochure(course, site)} className="flex items-center gap-2 w-full justify-center text-sm text-gray-600 hover:text-teal-deep transition-colors py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Brochure
                </button>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2"><span className="text-teal-deep">✓</span> Certificate of Completion</div>
                <div className="flex items-center gap-2"><span className="text-teal-deep">✓</span> 6-Month Post-Training Support</div>
                <div className="flex items-center gap-2"><span className="text-teal-deep">✓</span> Course Materials Included</div>
                <div className="flex items-center gap-2"><span className="text-teal-deep">✓</span> Guaranteed Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Outcomes */}
          {course.outcomes && course.outcomes.length > 0 && (
            <div className="card p-6">
              <h2 className="section-title-h2 mb-5">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.outcomes.map((o, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="card p-6">
            <h2 className="section-title-h2 mb-4">Course Overview</h2>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Who should attend */}
          <div className="card p-6">
            <h2 className="section-title-h2 mb-4">Who Should Attend</h2>
            <p className="text-gray-600 leading-relaxed">
              This course is designed for professionals at all levels who are looking to enhance their skills in {course.category}. It is suitable for managers, team leaders, supervisors, and individual contributors seeking measurable improvement.
            </p>
          </div>

          {/* Delivery Info */}
          <div className="card p-6">
            <h2 className="section-title-h2 mb-5">Training Delivery</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: '🏫', label: 'In-Person', desc: `Available at multiple venues including ${course.location || 'Nairobi'}` },
                { icon: '💻', label: 'Virtual', desc: 'Live online sessions via Zoom/Teams with full interaction' },
                { icon: '🏢', label: 'In-House', desc: 'Delivered at your premises, fully customized to your team' },
                { icon: '📅', label: 'Duration', desc: course.duration + ' of intensive, practical training' },
              ].map(d => (
                <div key={d.label} className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{d.icon}</span>
                  <div>
                    <div className="font-bold text-sm text-gray-800">{d.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Course info */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-800 mb-4">Course Information</h3>
            <dl className="space-y-3 text-sm">
              {[
                { dt: 'Category', dd: course.category },
                { dt: 'Level', dd: course.level },
                { dt: 'Duration', dd: course.duration },
                { dt: 'Format', dd: course.format },
                { dt: 'Language', dd: 'English' },
                { dt: 'Certificate', dd: 'Yes, upon completion' },
              ].map(f => (
                <div key={f.dt} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <dt className="text-gray-500">{f.dt}</dt>
                  <dd className="font-semibold text-gray-800 text-right">{f.dd}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Contact */}
          <div className="bg-navy rounded-xl2 p-5 text-white">
            <h3 className="font-bold text-white mb-3">Need Help?</h3>
            <p className="text-white/80 text-xs mb-4">Our team is here to help you with any questions about this course.</p>
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 text-white text-sm font-semibold mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.62 12 19.79 19.79 0 011.58 3.43 2 2 0 013.55 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              {site.phone}
            </a>
            <button onClick={() => setShowEnquiry(true)} className="btn-outline-white text-xs w-full justify-center py-2">
              Send Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-title-h2 mb-6">Related Courses</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(c => (
                <Link key={c.id} to={`/course/${c.slug}`} className="card p-5 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag-pill bg-teal-50 text-teal-deep text-xs">{c.category}</span>
                    <span className="text-xs text-gray-400">{c.duration}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-800 group-hover:text-teal-deep transition-colors mb-2 line-clamp-2">{c.title}</h3>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <CurrencyPrice amount={c.price} className="text-teal-deep font-bold" />
                    <span className="text-xs text-teal-deep font-semibold group-hover:underline">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl3 shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-black text-gold-dark">Course Enquiry</h2>
              <button onClick={() => setShowEnquiry(false)}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {sent ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-teal-deep text-lg mb-2">Enquiry Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquiry} className="p-5 space-y-4">
                <p className="text-xs text-gray-500 -mt-1">Enquiring about: <strong className="text-gray-700">{course.title}</strong></p>
                {enquiryError ? <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{enquiryError}</div> : null}
                {['Full Name', 'Email Address', 'Phone Number', 'Message'].map((label, i) => {
                  const names = ['name', 'email', 'phone', 'message']
                  return (
                    <div key={label}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                      {label === 'Message' ? (
                        <textarea name={names[i]} value={enquiryForm[names[i]]} onChange={e => setEnquiryForm(f => ({...f, [names[i]]: e.target.value}))} rows={3} className="input-field resize-none" />
                      ) : (
                        <input name={names[i]} type={label.includes('Email') ? 'email' : label.includes('Phone') ? 'tel' : 'text'} value={enquiryForm[names[i]]} onChange={e => setEnquiryForm(f => ({...f, [names[i]]: e.target.value}))} className="input-field" required={!label.includes('Message')} />
                      )}
                    </div>
                  )
                })}
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-60">
                  {sending ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function downloadBrochure(course, site) {
  const outcomes = (course.outcomes || [])
    .map((o) => `<li style="margin-bottom:6px;">${o}</li>`)
    .join('')
  const nextDate = course.nextDate
    ? new Date(course.nextDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Contact us for the next available date'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${course.title} - GSAC Brochure</title>
<style>
  body { font-family: Arial, sans-serif; background:#f7f8fa; color:#1f2937; margin:0; padding:32px; }
  .wrap { max-width:760px; margin:0 auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 16px 40px rgba(15,23,42,0.08); }
  .header { background:#0B1F3A; color:#fff; padding:32px; }
  .header h1 { margin:0 0 8px; font-size:26px; }
  .content { padding:32px; }
  .box { border:1px solid #e5e7eb; border-radius:16px; padding:20px; margin-bottom:20px; }
  .muted { color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
  ul { padding-left:20px; }
  .footer { padding:0 32px 32px; color:#6b7280; font-size:13px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>${course.title}</h1>
      <p style="margin:0;color:rgba(255,255,255,.75);">${course.category || ''} · ${course.level || ''} · ${course.duration || ''}</p>
    </div>
    <div class="content">
      <div class="box">
        <div class="muted">Overview</div>
        <p>${course.description || ''}</p>
      </div>
      <div class="box">
        <div class="muted">Format &amp; Delivery</div>
        <p>${course.format || ''}${course.location ? ` · Available at ${course.location}` : ''}</p>
        <p>Next start date: <strong>${nextDate}</strong></p>
      </div>
      ${outcomes ? `<div class="box"><div class="muted">What You'll Learn</div><ul>${outcomes}</ul></div>` : ''}
      <div class="box">
        <div class="muted">Investment</div>
        <p>USD ${Number(course.price || 0).toLocaleString()} per participant, all-inclusive (certificate, materials, and 6-month post-training support).</p>
      </div>
    </div>
    <div class="footer">
      ${site?.name || 'GSAC'} · ${site?.address || ''}<br />
      For registration or questions, contact ${site?.email || ''} or ${site?.phone || ''}.
    </div>
  </div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${course.slug || 'course'}-brochure.html`
  anchor.click()
  URL.revokeObjectURL(url)
}
