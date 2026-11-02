import React, { useState } from 'react'
import { useSite } from '../context/SiteContext'
import { api } from '../api/index'

export default function Contact() {
  const { content } = useSite()
  const { site } = content
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: submitError } = await api.contact.submit(form)
      if (submitError) throw submitError
      setSent(true)
    } catch (err) {
      console.error(err)
      setError('Could not send message. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Get In Touch
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Contact GSAC</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-5" />
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Ready to invest in your team's capability? We're here to help you identify the right training solution for your organization's goals.
          </p>
        </div>
      </div>

      {/* Contact info cards */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: '📍', label: 'Address', value: site.address, href: null },
              { icon: '📞', label: 'Phone / WhatsApp', value: site.phone, href: `tel:${site.phone}` },
              { icon: '✉️', label: 'Email', value: site.email, href: `mailto:${site.email}` },
              { icon: '🕐', label: 'Business Hours', value: site.hours, href: null },
            ].map(c => (
              <div key={c.label} className="text-center p-5 bg-surface rounded-xl2">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{c.label}</div>
                {c.href ? (
                  <a href={c.href} className="text-teal-deep font-semibold text-sm hover:underline">{c.value}</a>
                ) : (
                  <div className="text-gray-700 text-sm">{c.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="section-title-h2 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">Fill out the form and our team will respond within 24 hours.</p>

              {sent ? (
                <div className="card p-10 text-center">
                  <div className="text-6xl mb-5">🎉</div>
                  <h3 className="text-xl font-black text-teal-deep mb-3">Message Sent Successfully!</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Thank you for reaching out. Our team will review your enquiry and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', organization:'', subject:'', message:'' }) }}
                    className="btn-primary mt-6 mx-auto"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-7 space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Organization</label>
                      <input name="organization" value={form.organization} onChange={handleChange} className="input-field" placeholder="Company or institution" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="input-field" placeholder="+254 7xx xxx xxx" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required className="input-field">
                      <option value="">Select a subject</option>
                      <option>Course Enquiry</option>
                      <option>In-House Training Request</option>
                      <option>Custom Program Development</option>
                      <option>Partnership Opportunity</option>
                      <option>General Enquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      className="input-field resize-none" placeholder="Tell us how we can help you..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-70">
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <>Send Message <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right column: quick actions + WhatsApp */}
            <div className="space-y-6">
              <div className="card p-7">
                <h3 className="font-black text-navy text-base mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: '💬', label: 'WhatsApp Us Now', sub: 'Instant reply during business hours', href: `https://wa.me/${site.whatsapp}`, primary: true },
                    { icon: '📧', label: 'Email Directly', sub: site.email, href: `mailto:${site.email}`, primary: false },
                    { icon: '📞', label: 'Call / SMS', sub: site.phone, href: `tel:${site.phone}`, primary: false },
                  ].map(a => (
                    <a key={a.label} href={a.href} target={a.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-4 rounded-xl2 border transition-all hover:-translate-y-0.5 ${a.primary ? 'bg-navy text-white border-teal-dark hover:bg-navy-dark' : 'bg-surface border-gray-200 hover:border-teal-dark'}`}>
                      <div className="text-2xl">{a.icon}</div>
                      <div>
                        <div className={`font-bold text-sm ${a.primary ? 'text-white' : 'text-gray-800'}`}>{a.label}</div>
                        <div className={`text-xs ${a.primary ? 'text-white/80' : 'text-gray-500'}`}>{a.sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="card p-7">
                <h3 className="font-black text-navy text-base mb-3">In-House Training?</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We deliver fully customized training programs at your premises or a venue of your choice — ideal for teams of 5 or more. Content is tailored to your industry, goals, and organizational context.
                </p>
                <ul className="space-y-2">
                  {['Fully customized to your objectives', 'Delivered at your location', 'Flexible scheduling', 'Bulk booking discounts available'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-4 h-4 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="card overflow-hidden">
                <div className="bg-navy-50 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <div className="font-bold text-navy text-sm">Bazaar Plaza, Moi Avenue</div>
                    <div className="text-gray-500 text-xs">Nairobi, Kenya</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
