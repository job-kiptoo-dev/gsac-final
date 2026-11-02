import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import { useVisitor } from '../../context/VisitorContext'

/* ── simple keyword scorer ── */
function scoreCourse(course, query) {
  const hay = `${course.title} ${course.category} ${course.description || ''} ${(course.outcomes || []).join(' ')}`.toLowerCase()
  return query.toLowerCase().split(/\s+/).filter(Boolean)
    .reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0)
}

function getSmartReply({ query, courses, faqs, site, formatPrice }) {
  const q = query.trim().toLowerCase()
  if (!q) return { text: 'Ask me about courses, pricing, certificates, training formats, venues, or how to enroll. I can also recommend the best program for your team.', suggestions: [] }

  const matchFaq = faqs.find(f => {
    const hay = `${f.question} ${f.answer} ${f.category || ''}`.toLowerCase()
    return q.split(/\s+/).some(t => t.length > 2 && hay.includes(t))
  })

  const scored = courses
    .filter(c => c.published)
    .map(c => ({ c, s: scoreCourse(c, q) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map(x => x.c)

  if (/invoice|payment|price|cost|fee|ksh|usd|dollar|kes/.test(q))
    return { text: `Course prices are displayed in your local currency automatically — KES for Kenya, USD for all other countries. An invoice is generated and emailed to you instantly on enrollment.`, suggestions: scored }

  if (/certif|qualify/.test(q))
    return { text: 'Every GSAC course awards an internationally recognized Certificate of Completion. CPD/CPE points are also awarded where applicable. The certificate can be verified online.', suggestions: scored }

  if (/virtual|online|zoom|teams|remote/.test(q))
    return { text: 'Yes — all courses are available via live virtual delivery (Zoom / Microsoft Teams). Same expert facilitator, same certificate, same outcomes. You can attend from anywhere in the world.', suggestions: scored }

  if (/in.house|corporate|team|group|bespoke|custom/.test(q))
    return { text: `GSAC delivers in-house training at your premises for groups of 5 or more — fully customized to your organization's goals. Contact ${site.email} or WhatsApp ${site.phone} to discuss.`, suggestions: scored }

  if (/venue|location|where|countr|cit(y|ies)|nairobi|mombasa|dubai|london|kigali|kampala|cape ?town|accra/.test(q))
    return { text: 'GSAC runs in-person training in 26 cities across 15 countries — including Nairobi, Mombasa, Kigali, Kampala, Dar es Salaam, Johannesburg, Cape Town, Accra, Dubai, London and more. Check the Training Venues page for the full list.', suggestions: scored }

  if (/refund|cancel|withdraw/.test(q))
    return { text: 'Cancellations 14+ days before: full refund. 7–13 days: 50% refund. Under 7 days: no refund, but you can transfer your place to a colleague or defer to a future date.', suggestions: scored }

  if (/contact|advisor|call|whatsapp|email|reach/.test(q))
    return { text: `Reach GSAC at ${site.phone}, email ${site.email}, or WhatsApp for instant response. Our advisors work 8 AM–5 PM EAT, Monday to Friday.`, suggestions: scored }

  if (matchFaq)
    return { text: matchFaq.answer, suggestions: scored }

  if (scored.length)
    return { text: `Here are our top matching courses for "${query}". Click any to see full details and register.`, suggestions: scored }

  return { text: `I couldn't find an exact match for "${query}". Try rephrasing — or browse all categories. You can also call ${site.phone} or WhatsApp for personalised guidance.`, suggestions: [] }
}

/* ── Advisor flow ── */
const ADVISOR_STEPS = [
  { key: 'role', q: "What is your current job role or industry?" },
  { key: 'goal', q: "What skill or outcome are you looking to achieve from this training?" },
  { key: 'format', q: "Which format suits you? (In-Person / Virtual / In-House)" },
  { key: 'timeline', q: "When would you ideally like to start? (e.g. this month, next quarter)" },
]

export default function FloatingAssistant() {
  const { content, faqs, courses, categories } = useSite()
  const { site } = content
  const visitor = useVisitor()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('chat') // 'chat' | 'advisor'
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! 👋 I'm your GSAC AI Assistant. I can help you find the right course, answer questions, or walk you through enrollment. What are you looking for?` }
  ])
  const [isTyping, setIsTyping] = useState(false)

  // Advisor
  const [advStep, setAdvStep] = useState(0)
  const [advData, setAdvData] = useState({})
  const advInputRef = useRef(null)

  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, isTyping])

  const pushMessage = (role, text, suggestions = []) => {
    setMessages(prev => [...prev, { role, text, suggestions }])
  }

  const handleSend = (text) => {
    const q = (text || input).trim()
    if (!q) return
    setInput('')
    pushMessage('user', q)
    setIsTyping(true)
    setTimeout(() => {
      const reply = getSmartReply({ query: q, courses, faqs, site, formatPrice: visitor.formatPrice })
      setMessages(prev => [...prev, { role: 'assistant', text: reply.text, suggestions: reply.suggestions }])
      setIsTyping(false)
    }, 600)
  }

  const handleAdvisorAnswer = (answer) => {
    const step = ADVISOR_STEPS[advStep]
    const updated = { ...advData, [step.key]: answer }
    setAdvData(updated)
    pushMessage('user', answer)

    if (advStep < ADVISOR_STEPS.length - 1) {
      setAdvStep(s => s + 1)
      setTimeout(() => {
        pushMessage('assistant', ADVISOR_STEPS[advStep + 1].q)
        advInputRef.current?.focus()
      }, 400)
    } else {
      // Generate recommendation
      setIsTyping(true)
      setTimeout(() => {
        const roleKw = updated.role || ''
        const goalKw = updated.goal || ''
        const query = `${roleKw} ${goalKw}`.trim()

        const scored = courses
          .filter(c => c.published)
          .map(c => ({ c, s: scoreCourse(c, query) }))
          .filter(x => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 3)
          .map(x => x.c)

        const rec = scored.length
          ? `Based on your profile, here are our top recommendations for a ${updated.role} looking to ${updated.goal}:`
          : `Thank you! Based on your profile (${updated.role}, goal: ${updated.goal}, format: ${updated.format}), our advisors will prepare a personalised learning path. Contact us at ${site.phone} or ${site.email} to discuss further.`

        setMessages(prev => [...prev, { role: 'assistant', text: rec, suggestions: scored }])
        setIsTyping(false)
        setMode('chat')
        setAdvStep(0)
        setAdvData({})
      }, 1200)
    }
  }

  const startAdvisor = () => {
    setMode('advisor')
    setAdvStep(0)
    setAdvData({})
    setMessages([{ role: 'assistant', text: `🧭 Let's find your perfect course! I'll ask you ${ADVISOR_STEPS.length} quick questions.\n\n${ADVISOR_STEPS[0].q}` }])
  }

  const quickReplies = [
    "What courses do you offer?",
    "How do I enroll?",
    "Do you offer virtual training?",
    "How much do courses cost?",
    "What certificate will I get?",
  ]

  return (
    <>
      {/* Floating launcher */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && (
          <>
            <button
              onClick={() => { setOpen(true); startAdvisor() }}
              className="flex items-center gap-2 bg-gold text-navy text-xs font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-gold/90 hover:scale-105 transition-all"
            >
              🧭 Course Advisor
            </button>
            <button
              onClick={() => { setOpen(true); setMode('chat') }}
              className="w-14 h-14 bg-navy rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-navy-dark transition-all"
              aria-label="Open AI Chat"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </button>
          </>
        )}

        {open && (
          <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: 520 }}>
            {/* Header */}
            <div className="bg-navy px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {mode === 'advisor' ? '🧭' : '🤖'}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{mode === 'advisor' ? 'Course Advisor' : 'GSAC Assistant'}</div>
                  <div className="text-white/70 text-xs">AI-powered · Always available</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => mode === 'advisor' ? setMode('chat') : startAdvisor()}
                  className="text-white/70 hover:text-white text-xs bg-white/10 px-2.5 py-1 rounded-full transition-colors"
                >
                  {mode === 'advisor' ? '💬 Chat' : '🧭 Advisor'}
                </button>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[88%] space-y-2">
                    <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-navy text-white rounded-br-none'
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.suggestions?.length > 0 && (
                      <div className="space-y-1.5">
                        {msg.suggestions.map(course => (
                          <Link
                            key={course.id}
                            to={`/course/${course.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-start justify-between gap-2 bg-white border border-teal-dark/20 hover:border-teal-dark/50 hover:bg-teal-50/30 rounded-xl px-3 py-2 transition-all group"
                          >
                            <div>
                              <div className="text-xs font-semibold text-gray-800 group-hover:text-teal-deep line-clamp-2 leading-tight">{course.title}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{course.duration} · {course.level}</div>
                            </div>
                            <div className="text-xs font-bold text-teal-deep flex-shrink-0">{visitor.formatPrice(course.price)}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <span className="w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <span className="w-2 h-2 bg-navy rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies (chat mode, first message only) */}
            {mode === 'chat' && messages.length <= 1 && (
              <div className="px-3 py-2 border-t border-gray-100 bg-white flex flex-wrap gap-1.5 flex-shrink-0">
                {quickReplies.map(r => (
                  <button
                    key={r}
                    onClick={() => handleSend(r)}
                    className="text-xs bg-teal-50 text-teal-deep px-2.5 py-1 rounded-full font-medium hover:bg-navy hover:text-white transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
              {mode === 'advisor' ? (
                <>
                  <input
                    ref={advInputRef}
                    type="text"
                    placeholder="Type your answer…"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-dark"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAdvisorAnswer(e.target.value.trim())
                        e.target.value = ''
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      const inp = e.currentTarget.previousSibling
                      if (inp.value.trim()) { handleAdvisorAnswer(inp.value.trim()); inp.value = '' }
                    }}
                    className="bg-gold text-navy p-2 rounded-xl hover:bg-gold/90 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about GSAC…"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-dark"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="bg-navy text-white p-2 rounded-xl hover:bg-navy-dark disabled:opacity-40 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
