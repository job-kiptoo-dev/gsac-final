import React from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

const values = [
  { icon: '🎯', title: 'Impact-Driven', desc: 'Every course is designed to produce measurable outcomes — not just attendance certificates.' },
  { icon: '🌍', title: 'Africa-Rooted, Globally Relevant', desc: 'We understand the local context while delivering world-class international standards.' },
  { icon: '💡', title: 'Practitioner-Led', desc: 'All facilitators are senior practitioners with 15+ years of real-world experience in their field.' },
  { icon: '🤝', title: 'Partnership-Oriented', desc: 'We work with organizations as long-term capacity partners, not one-off training vendors.' },
  { icon: '📊', title: 'Evidence-Based', desc: 'Our curriculum is continuously refined using participant feedback, industry data, and outcome tracking.' },
  { icon: '🚀', title: 'Future-Ready', desc: 'From AI to digital transformation, we equip professionals for what comes next — not just what is.' },
]

const team = [
  { name: 'Executive Leadership', role: 'Strategic Direction & Partnerships', icon: '👔' },
  { name: 'Curriculum Team', role: 'Learning Design & Quality Assurance', icon: '📚' },
  { name: 'Faculty Network', role: '200+ Expert Practitioners', icon: '🎓' },
  { name: 'Client Success', role: 'Enrollment, Support & Follow-up', icon: '🤝' },
]

export default function AboutUs() {
  const { content } = useSite()
  const { site, stats } = content

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Who We Are
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            About Global Skills<br />Advancement Center
          </h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-6" />
          <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
            GSAC is Africa's premier capacity-building and EdTech institution — a trusted partner to governments, 
            NGOs, and corporations across the continent and beyond.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-navy py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: stats.professionals, label: 'Professionals Trained' },
            { value: stats.courses, label: 'Courses Available' },
            { value: stats.venues, label: 'Global Venues' },
            { value: stats.satisfaction, label: 'Satisfaction Rate' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-white/70 text-xs font-medium mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission / Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label"><span className="w-2 h-2 bg-gold rounded-full" /> Our Mission</div>
            <h2 className="section-title-h2 mb-5">Transforming Organizations Through Strategic Capability Building</h2>
            <div className="w-16 h-1 bg-gold rounded-full mb-6" />
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded on the belief that Africa's professional talent is its greatest competitive asset, GSAC was established 
                to bridge the growing capability gap between organizational ambition and workforce readiness.
              </p>
              <p>
                We don't deliver "training" — we deliver performance transformation. Our programs are designed 
                with a single question in mind: <em className="text-teal-deep font-semibold">What measurable change will participants achieve when they return to work?</em>
              </p>
              <p>
                From Nairobi to Dubai, from government agencies to multinational corporations, GSAC has become 
                the partner of choice for organizations serious about building future-ready teams.
              </p>
            </div>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link to="/training-categories" className="btn-primary">Explore Our Programs</Link>
              <Link to="/contact" className="btn-secondary">Partner With Us</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🏆', title: 'Award-Winning Facilitation', desc: 'Recognized by industry peers for training excellence across Africa' },
              { emoji: '🌐', title: 'Multi-Country Delivery', desc: `${stats.countries} countries served with consistent quality standards` },
              { emoji: '📜', title: 'Internationally Recognized Certs', desc: 'Certificates accepted by employers and institutions worldwide' },
              { emoji: '⚡', title: 'Rapid Results', desc: 'Participants report measurable performance improvement within 30 days' },
            ].map(card => (
              <div key={card.title} className="card p-5">
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className="font-bold text-sm text-gray-800 mb-2">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center"><span className="w-2 h-2 bg-gold rounded-full" /> Our Values</div>
            <h2 className="section-title-h2">What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="card p-6">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Structure */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center"><span className="w-2 h-2 bg-gold rounded-full" /> Our Team</div>
            <h2 className="section-title-h2">The People Behind GSAC</h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              A dedicated team of learning professionals committed to your organization's performance.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(t => (
              <div key={t.name} className="card p-6 text-center">
                <div className="text-4xl mb-3">{t.icon}</div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GSAC */}
      <section className="py-16 bg-navy">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center text-white/50"><span className="w-2 h-2 bg-gold rounded-full" /> Why Choose GSAC</div>
            <h2 className="text-3xl md:text-4xl font-black text-white">The GSAC Difference</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { num: '01', title: 'Practitioner Facilitators Only', desc: 'No academics. Every GSAC trainer has 15+ years of hands-on industry experience.' },
              { num: '02', title: 'Customizable to Your Context', desc: 'Every program can be tailored to your sector, organization size, and specific capability gap.' },
              { num: '03', title: 'Post-Training Support', desc: '6 months of support after your training — implementation coaching, resources, and Q&A access.' },
              { num: '04', title: 'Guaranteed Course Delivery', desc: 'We run the course as scheduled. No cancellations. Even with a single enrolled participant.' },
              { num: '05', title: 'Multilocation Delivery', desc: `Training at ${stats.venues} venues globally, plus virtual for teams anywhere in the world.` },
              { num: '06', title: 'Transparent Pricing', desc: 'All-inclusive pricing. No surprise fees. Invoice on registration. Flexible payment terms for organizations.' },
            ].map(item => (
              <div key={item.num} className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-2xl font-black text-gold flex-shrink-0">{item.num}</div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="section-title-h2 mb-4">Ready to Transform Your Team?</h2>
          <p className="text-gray-500 text-sm mb-8">
            Talk to a GSAC training advisor today. We'll help you identify the right programs for your organization's goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Talk to an Advisor</Link>
            <Link to="/training-categories" className="btn-secondary">Browse All Courses</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
