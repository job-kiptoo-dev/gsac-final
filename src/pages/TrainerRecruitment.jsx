import React, { useState } from 'react'
import { api } from '../api/index'

export default function TrainerRecruitment() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', expertise: '', linkedin: '', bio: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: submitError } = await api.trainerApplications.submit(form)
      if (submitError) throw submitError
      setSent(true)
    } catch (err) {
      console.error(err)
      setError('Submission failed. Please try again or email us at partner@gsac.org.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Join Our Faculty
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Are You a World-Class Subject Matter Expert?</h1>
          <div className="w-20 h-1.5 bg-gold rounded-full mx-auto mb-5" />
          <h2 className="text-gold font-bold text-xl mb-4">WE SEEK PRACTITIONERS WHO TRANSFORM. NOT JUST TEACH.</h2>
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Join Africa's most impactful professional training network. If you have the expertise to elevate industry leaders, GSAC wants you delivering results for our clients.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title-h2 mb-3">Why Join the GSAC Faculty?</h2>
            <p className="text-gray-500 text-sm">High-impact training. Competitive remuneration. Continental reach.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📅', title: 'Flexible Scheduling', desc: 'Choose your own availability. Deliver training on your terms — weekdays, weekends, or fully virtual from any location.' },
              { icon: '💰', title: 'Competitive Compensation', desc: 'We offer industry-leading rates for qualified professionals with demonstrable subject matter expertise.' },
              { icon: '🌱', title: 'Professional Growth', desc: 'Access our continental network, peer learning communities, and continuous development resources.' },
              { icon: '🌍', title: 'Continental Impact', desc: 'Train professionals from leading institutions across Africa and internationally — and build your legacy.' },
              { icon: '📚', title: 'Curriculum Support', desc: 'Our instructional design team helps you develop and refine world-class training materials.' },
              { icon: '🎯', title: 'Clients Ready for You', desc: 'We handle all marketing, business development, and logistics. Your focus: delivering exceptional outcomes.' },
              { icon: '🤝', title: 'Faculty Community', desc: 'Join a network of elite practitioners who share expertise, collaborate, and amplify each other\'s impact.' },
              { icon: '🏆', title: 'Brand Elevation', desc: "Associate your name with one of Africa's most trusted professional training institutions." },
            ].map(b => (
              <div key={b.title} className="card p-5">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-sm text-gray-800 mb-2">{b.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Form */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="section-title-h2 mb-4">Who We're Looking For</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                We're assembling a faculty of the world's most capable practitioners — professionals who don't just understand their domain, but can transform how others apply it in their organizations.
              </p>
              <ul className="space-y-3">
                {[
                  'Minimum 5 years of real-world industry experience in your domain',
                  'Proven facilitation, coaching, or instructional experience',
                  'Deep, specialized expertise in one or more training areas',
                  'Strong communication and executive presentation skills',
                  'Relevant professional qualifications or certifications preferred',
                  'Ability to customize content for different industries and seniority levels',
                  'Demonstrable commitment to participant learning outcomes',
                  'Availability for at least two courses per quarter',
                ].map(req => (
                  <li key={req} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {req}
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-5 bg-navy rounded-xl2 text-white">
                <h4 className="font-bold text-sm mb-2">Our Faculty Selection Process</h4>
                <ol className="space-y-2 text-xs text-white/80">
                  {[
                    'Submit your application below',
                    'Our faculty team reviews your profile within 5 business days',
                    'Selected applicants are invited for a capability demonstration',
                    'Approved trainers receive onboarding and curriculum briefing',
                    'You begin delivering to GSAC clients',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-xs flex-shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-xl3 border border-gray-200 p-7">
              <h3 className="font-black text-teal-deep text-lg mb-5">Apply to Join the GSAC Faculty</h3>
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h4 className="font-bold text-teal-deep text-lg mb-2">Application Submitted!</h4>
                  <p className="text-gray-500 text-sm">Thank you for your interest in joining the GSAC faculty. Our team will review your application and reach out within 5 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  {[
                    { name:'name', label:'Full Name', type:'text', required:true },
                    { name:'email', label:'Email Address', type:'email', required:true },
                    { name:'phone', label:'Phone Number', type:'tel', required:true },
                    { name:'expertise', label:'Area(s) of Expertise', type:'text', required:true, placeholder:'e.g., Project Management, Financial Management, Leadership' },
                    { name:'linkedin', label:'LinkedIn Profile URL', type:'url', required:false },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}{f.required && ' *'}</label>
                      <input
                        name={f.name} type={f.type} value={form[f.name]}
                        onChange={e => setForm(frm => ({ ...frm, [e.target.name]: e.target.value }))}
                        required={f.required} className="input-field" placeholder={f.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Professional Bio *</label>
                    <textarea
                      name="bio" value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      required rows={4} className="input-field resize-none"
                      placeholder="Summarize your professional background, key qualifications, and what makes you an exceptional facilitator..."
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-70">
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
