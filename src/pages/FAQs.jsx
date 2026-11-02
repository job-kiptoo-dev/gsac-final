import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-xl transition-all ${open ? 'border-teal-dark bg-teal-50/30' : 'border-gray-200 bg-white hover:border-teal-dark/40'}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 text-left">
        <span className={`font-semibold text-sm pr-4 ${open ? 'text-teal-deep' : 'text-gray-800'}`}>{faq.question}</span>
        <svg className={`w-5 h-5 flex-shrink-0 transition-transform text-teal-deep ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-teal-dark/20 pt-4">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

export default function FAQs() {
  const { faqs } = useSite()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')

  const categories = [...new Set(faqs.map(f => f.category).filter(Boolean))]
  const filtered = faqs.filter(f => {
    const q = search.toLowerCase()
    const matchQ = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    const matchC = !selectedCat || f.category === selectedCat
    return matchQ && matchC
  })

  const grouped = filtered.reduce((acc, faq) => {
    const cat = faq.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  return (
    <div>
      <div className="bg-navy py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Help Center
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-6" />
          <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">
            Everything you need to know about GSAC programs, registration, payments, certificates, and support.
          </p>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search FAQs…"
            className="w-full max-w-lg px-5 py-3 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/60 text-sm backdrop-blur"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="bg-white border-b py-4 px-6">
        <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
          <button onClick={() => setSelectedCat('')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${!selectedCat ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-teal-50'}`}>
            All Topics
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setSelectedCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedCat === c ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-teal-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-sm">Try different keywords</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="text-lg font-black text-gold-dark mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-gold rounded-full inline-block" />
                  {cat}
                </h2>
                <div className="space-y-3">
                  {items.map(faq => <FAQItem key={faq.id} faq={faq} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-14 bg-navy rounded-2xl p-8 text-center text-white">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-black text-white mb-3">Still Have Questions?</h3>
          <p className="text-white/70 text-sm mb-6">Our team responds within 2 hours during business hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-outline-white text-sm px-5 py-2.5">Contact Us</Link>
            <a href="https://wa.me/254726954964" target="_blank" rel="noopener noreferrer"
              className="bg-teal hover:bg-teal-dark text-navy text-sm font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
