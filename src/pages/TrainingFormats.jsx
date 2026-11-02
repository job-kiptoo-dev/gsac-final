import React from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

const formats = [
  {
    icon: '🏫', title: 'In-Person Training', badge: 'Most Popular',
    desc: 'Immersive classroom learning at our premium venues across Africa and beyond. The richest learning experience — direct facilitator interaction, peer networking, and hands-on exercises.',
    features: ['Expert facilitator in the room', 'Peer networking & collaboration', 'Printed course materials', 'Catered breaks & lunch', 'Certificate ceremony', 'Post-training support'],
    ideal: 'Organizations seeking maximum engagement, team alignment, and networking opportunities.',
    locations: 'Nairobi, Kigali, Kampala, Dubai, Cape Town, Accra, Dar es Salaam',
  },
  {
    icon: '💻', title: 'Live Virtual Training', badge: 'Most Flexible',
    desc: 'Fully live, interactive online training via Zoom or Microsoft Teams. Same expert facilitator, same outcomes, same internationally recognized certificate — delivered to your screen.',
    features: ['Live facilitator (not recorded)', 'Interactive Q&A sessions', 'Digital course materials', 'Breakout room exercises', 'Same certificate as in-person', 'Session recordings available'],
    ideal: 'Remote professionals, international participants, or anyone unable to travel.',
    locations: 'Anywhere with internet connection',
  },
  {
    icon: '🏢', title: 'In-House / Corporate Training', badge: 'Best Value for Teams',
    desc: "We come to you. GSAC delivers fully customized programs at your premises for teams of 5+. The content is tailored to your organization's specific goals, challenges, and KPIs.",
    features: ['Delivered at your location', 'Content tailored to your org', 'Group rates from 5 participants', 'Pre-training needs assessment', 'Post-training impact report', 'Ongoing coaching available'],
    ideal: 'Companies wanting to upskill entire departments or align teams around common capabilities.',
    locations: 'Your premises, anywhere worldwide',
  },
  {
    icon: '🔄', title: 'Hybrid Learning', badge: 'Innovative',
    desc: 'Blend in-person and virtual elements for maximum flexibility. Some team members attend at the venue while others join virtually — all with the same quality experience and certificate.',
    features: ['Simultaneous in-person + virtual', 'Flexible for distributed teams', 'All participants get same cert', 'HD video & audio setup', 'Collaborative digital tools', 'Recording for absentees'],
    ideal: 'Distributed teams with some local and some remote members.',
    locations: 'GSAC venues + virtual join option',
  },
]

export default function TrainingFormats() {
  const { content } = useSite()
  const { site } = content

  return (
    <div>
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> How We Deliver
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Training Formats</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-5" />
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Four flexible delivery models designed to fit your schedule, location, and budget — without compromising on quality or outcomes.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {formats.map((f, i) => (
            <div key={f.title} className={`grid lg:grid-cols-2 gap-8 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{f.icon}</span>
                  <div>
                    <span className="tag-pill bg-gold-light text-gold-deep text-xs mb-1 inline-block">{f.badge}</span>
                    <h2 className="text-2xl font-black text-navy">{f.title}</h2>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-5">{f.desc}</p>
                <div className="bg-teal-50 border border-teal-dark/20 rounded-xl p-4 mb-5">
                  <div className="text-xs font-bold text-teal-deep mb-1">📍 Delivery Locations</div>
                  <div className="text-sm text-gray-700">{f.locations}</div>
                </div>
                <div className="bg-surface rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Ideal For</div>
                  <p className="text-sm text-gray-700">{f.ideal}</p>
                </div>
              </div>
              <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">What's Included</h3>
                  <ul className="space-y-2.5">
                    {f.features.map(feat => (
                      <li key={feat} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/contact`} className="btn-primary w-full justify-center mt-6">
                    Enquire About This Format
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="section-title-h2">Format Comparison</h2>
            <p className="text-gray-500 text-sm mt-2">Choose what works best for your team's situation</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-600 uppercase">Feature</th>
                  {['In-Person', 'Virtual', 'In-House', 'Hybrid'].map(h => (
                    <th key={h} className="text-center px-4 py-3 text-xs font-bold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Same Certificate', '✅', '✅', '✅', '✅'],
                  ['Live Facilitator', '✅', '✅', '✅', '✅'],
                  ['Customizable Content', '➖', '➖', '✅', '✅'],
                  ['Travel Required', '✅', '❌', '❌', 'Partial'],
                  ['Group Discount', '➖', '➖', '✅', '✅'],
                  ['Course Materials', '✅', 'Digital', '✅', '✅'],
                  ['Networking', '✅', 'Limited', 'Team only', 'Partial'],
                  ['Recording Available', '❌', '✅', '✅', '✅'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-700">{row[0]}</td>
                    {row.slice(1).map((cell, i) => (
                      <td key={i} className="px-4 py-3 text-center text-sm">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-4">Not Sure Which Format to Choose?</h2>
          <p className="text-white/80 text-sm mb-8">
            Our advisors will assess your team size, budget, and goals — and recommend the best delivery approach for maximum ROI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-outline-white">Talk to an Advisor</Link>
            <a href={`https://wa.me/${site.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
              className="bg-white text-navy font-bold px-6 py-3 rounded-full hover:bg-white/90 transition-colors inline-flex items-center gap-2">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
