import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CurrencyPrice from '../components/common/CurrencyPrice'
import { useSite } from '../context/SiteContext'
import { useVisitor } from '../context/VisitorContext'
import { api } from '../api/index'
import { buildInvoicePayload, downloadInvoiceHtml } from '../lib/invoice'

export default function Enrollment() {
  const { courseId } = useParams()
  const { courses, content } = useSite()
  const visitor = useVisitor()
  const course = courses.find((item) => item.id === courseId || item.id === parseInt(courseId, 10))
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    format: 'In-Person',
    dietary: '',
    specialNeeds: '',
    paymentMethod: 'Bank Transfer',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [invoicePayload, setInvoicePayload] = useState(null)
  const [invoiceStatus, setInvoiceStatus] = useState('pending')

  const previewInvoice = useMemo(() => {
    if (!course) return null
    return buildInvoicePayload({ course, visitor, site: content.site, form })
  }, [content.site, course, form, visitor])

  const handleChange = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInvoiceStatus('pending')

    try {
      const { data: enrollment, error: submitError } = await api.enrollments.submit({
        courseId: course.id,
        courseTitle: course.title,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        format: form.format,
        message: `Job Title: ${form.jobTitle || 'N/A'} | Payment: ${form.paymentMethod} | Dietary: ${form.dietary || 'None'} | Special Needs: ${form.specialNeeds || 'None'} | Visitor Currency: ${visitor.currency}`,
      })
      if (submitError) throw submitError

      const payload = buildInvoicePayload({ course, visitor, site: content.site, form })
      payload.enrollmentId = enrollment?.id || null
      setInvoicePayload(payload)

      const { error: invoiceError } = await api.invoices.sendCourseInvoice(payload)
      setInvoiceStatus(invoiceError ? 'download_only' : 'emailed')

      if (invoiceError) {
        console.error(invoiceError)
      }

      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Submission failed. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Course Not Found</h2>
          <Link to="/training-categories" className="btn-primary">Browse Courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-navy mb-2">Course Registration</h1>
          <p className="text-gray-500 text-sm">Secure your place on <strong>{course.title}</strong></p>
        </div>

        <div className="card p-5 mb-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📚</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-sm leading-tight">{course.title}</h3>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span>⏱️ {course.duration}</span>
              <span>💻 {course.format}</span>
              {course.location && <span>📍 {course.location}</span>}
            </div>
          </div>
          <CurrencyPrice amount={course.price} className="text-teal-deep font-black text-lg flex-shrink-0" />
        </div>

        {submitted ? (
          <div className="card p-10 text-center">
            <div className="text-6xl mb-5">🎉</div>
            <h2 className="text-2xl font-black text-teal-deep mb-3">Registration Submitted!</h2>
            <p className="text-gray-600 text-sm mb-3 max-w-md mx-auto">
              Thank you, {form.firstName}! Your registration for <strong>{course.title}</strong> has been received.
              Our team will confirm your booking and send payment instructions within 24 hours.
            </p>
            <p className="text-gray-500 text-xs mb-4">A confirmation has been prepared for <strong>{form.email}</strong>.</p>

            <div className="max-w-lg mx-auto rounded-2xl border border-teal-dark/20 bg-teal-50/40 p-4 text-left mb-6">
              <div className="font-bold text-teal-deep mb-1">Invoice status</div>
              <div className="text-sm text-gray-700">
                {invoiceStatus === 'emailed'
                  ? 'Your invoice has been queued for automatic email delivery.'
                  : 'Your invoice is ready to download instantly below while email delivery is being finalized.'}
              </div>
              {invoicePayload ? (
                <button onClick={() => downloadInvoiceHtml(invoicePayload)} className="btn-primary mt-4">
                  Download Invoice
                </button>
              ) : null}
            </div>

            <Link to="/training-categories" className="btn-primary mx-auto">Browse More Courses</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl3 border border-gray-200 p-8 space-y-5">
            <div className="flex gap-3 mb-6">
              {['Personal Details', 'Training Preferences', 'Confirm'].map((label, index) => (
                <div key={label} className={`flex-1 text-center text-xs py-2 rounded-full font-semibold transition-colors ${step === index + 1 ? 'bg-navy text-white' : step > index + 1 ? 'bg-teal-50 text-teal-deep' : 'bg-gray-100 text-gray-500'}`}>
                  {label}
                </div>
              ))}
            </div>

            {error ? <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div> : null}

            {step === 1 ? (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">Personal Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="input-field" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Organization *</label>
                    <input name="organization" value={form.organization} onChange={handleChange} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Job Title</label>
                    <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full justify-center mt-2">Continue →</button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">Training Preferences</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Preferred Format</label>
                  <select name="format" value={form.format} onChange={handleChange} className="input-field">
                    <option>In-Person</option>
                    <option>Virtual (Online)</option>
                    <option>In-House</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Preferred Payment Method</label>
                  <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input-field">
                    <option>Bank Transfer</option>
                    <option>Mobile Money (M-Pesa)</option>
                    <option>Credit/Debit Card</option>
                    <option>Invoice to Organization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dietary Requirements (for in-person)</label>
                  <input name="dietary" value={form.dietary} onChange={handleChange} className="input-field" placeholder="e.g., Vegetarian, Halal, None" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Special Needs or Accessibility Requirements</label>
                  <textarea name="specialNeeds" value={form.specialNeeds} onChange={handleChange} rows={2} className="input-field resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">← Back</button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 justify-center">Continue →</button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">Confirm Registration</h3>
                <div className="bg-surface rounded-xl2 p-5 space-y-2">
                  {[
                    { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                    { label: 'Email', value: form.email },
                    { label: 'Organization', value: form.organization },
                    { label: 'Format', value: form.format },
                    { label: 'Payment', value: form.paymentMethod },
                    { label: 'Billing Currency', value: visitor.currency },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm gap-3">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-800 text-right">{item.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between gap-4">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <CurrencyPrice amount={course.price} className="font-black text-teal-deep text-lg" />
                  </div>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 text-xs text-teal-deep">
                  <strong>✓ Automatic invoice</strong> — once you submit, GSAC prepares your invoice immediately and attempts email delivery automatically.
                </div>
                <div className="bg-navy-50 rounded-xl p-4 text-xs text-navy">
                  <strong>✓ Guaranteed Delivery</strong> — this course proceeds with as few as one confirmed participant. Payment instructions follow after confirmation.
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">← Back</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-70">
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : 'Confirm Registration ✓'}
                  </button>
                </div>
                {previewInvoice ? (
                  <div className="text-center">
                    <button type="button" onClick={() => downloadInvoiceHtml(previewInvoice)} className="text-sm text-teal-deep font-semibold hover:underline">
                      Preview downloadable invoice before submitting
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </form>
        )}
      </div>
    </div>
  )
}
