// src/context/SiteContext.jsx
// GSAC Site Context — Supabase-backed with local fallback

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../api/index'
import { supabase } from '../lib/supabase'
import { DEFAULT_VENUES, normalizeVenue } from '../lib/venues'

const SiteContext = createContext(null)

const defaultContent = {
  site: {
    name: 'Global Skills Advancement Center',
    tagline: 'SKILL EXCELLENCE IS BUSINESS ESSENTIAL',
    heroHeadline: 'ACCELERATE CAPABILITY. DELIVER MEASURABLE IMPACT. TRANSFORM YOUR ORGANIZATION FOR THE NEW ECONOMY.',
    heroSubtext: 'GSAC builds future-ready teams through hands-on learning, high-impact application, and coaching that turns new skills into measurable performance. Practical, local, and global content for immediate results.',
    phone: '+254721911847',
    email: 'partner@gsac.org',
    address: 'Bazaar Plaza, Moi Avenue, Nairobi, Kenya',
    hours: '8:00 AM - 5:00 PM EAT',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    whatsapp: '+254726954964',
  },
  stats: {
    professionals: '15,000+', hours: '50,000+', satisfaction: '98%',
    venues: '26', countries: '15', courses: '1,500+', trainers: '200+', years: '9',
  },
  partners: [
    { id: '1', name: 'African Union', logo: 'https://gsac.org/storage/logos/338715.png' },
    { id: '2', name: 'FCCPC', logo: 'https://gsac.org/storage/logos/787413.png' },
    { id: '3', name: 'PCCB', logo: 'https://gsac.org/storage/logos/852236.png' },
    { id: '4', name: 'Konza Technopolis', logo: 'https://gsac.org/storage/logos/628427.png' },
    { id: '5', name: 'Defense Space Administration', logo: 'https://gsac.org/storage/logos/768921.webp' },
    { id: '6', name: 'Water Mission Tanzania', logo: 'https://gsac.org/storage/logos/169328.png' },
    { id: '7', name: 'Kenya Wildlife Service', logo: 'https://gsac.org/storage/logos/650606.webp' },
  ],
  testimonials: [
    { id: '1', quote: "Zero fluff. Pure execution. They didn't just train our team — they upgraded how we think, communicate, and deliver. You feel the impact immediately.", name: 'Linda Obiero', role: 'HR Lead', rating: 5, approved: true },
    { id: '2', quote: "This is elite-level facilitation. The trainers are sharp, structured, and relentless about outcomes. Our managers left with tools — not notes.", name: 'Ezra Wakaba', role: 'Business Manager', rating: 5, approved: true },
    { id: '3', quote: "We got ROI — fast. The training translated into measurable improvements. If you want performance, this is where you invest.", name: 'Abdallah Mohammed', role: 'Operations Lead', rating: 5, approved: true },
    { id: '4', quote: "Exceptionally well-structured program. The facilitators brought real-world experience that made every concept immediately applicable.", name: 'Amina Hassan', role: 'Program Manager', rating: 5, approved: true },
    { id: '5', quote: "GSAC transformed our leadership team. The ripple effect on our organization's performance has been remarkable and measurable.", name: 'David Kariuki', role: 'CEO, Tech Corp', rating: 5, approved: true },
  ],
}

const defaultCategories = [
  { id: '1', name: 'Leadership & Management', slug: 'leadership-management', icon: '🎯', description: 'Develop exceptional leadership skills and strategic management capabilities', courseCount: 85, color: 'blue' },
  { id: '2', name: 'Finance & Human Resources', slug: 'finance-hr', icon: '💼', description: 'Build core operational capability across people and financial systems', courseCount: 120, color: 'gold' },
  { id: '3', name: 'Monitoring & Evaluation', slug: 'monitoring-evaluation', icon: '📊', description: 'Master M&E methodologies for data-driven decision making', courseCount: 65, color: 'green' },
  { id: '4', name: 'Technology, Innovation & Data', slug: 'technology-innovation', icon: '💻', description: 'Modernize workflows with practical tech, analytics, and AI-ready capability', courseCount: 95, color: 'purple' },
  { id: '5', name: 'Procurement & Supply Chain', slug: 'procurement-supply-chain', icon: '🔗', description: 'Increase transparency, reduce leakage, and deliver reliable value for money', courseCount: 75, color: 'teal' },
  { id: '6', name: 'Project Management', slug: 'project-management', icon: '📋', description: 'Lead projects with precision from initiation through successful closure', courseCount: 90, color: 'red' },
  { id: '7', name: 'Risk, Compliance & Quality', slug: 'risk-compliance', icon: '🛡️', description: 'Build resilient systems that protect value and keep operations audit-ready', courseCount: 55, color: 'orange' },
  { id: '8', name: 'Digital Transformation', slug: 'digital-transformation', icon: '🚀', description: 'Navigate digital disruption and lead transformation initiatives', courseCount: 70, color: 'indigo' },
  { id: '9', name: 'Health & Public Sector', slug: 'health-public-sector', icon: '🏥', description: 'Specialized training for healthcare and public service professionals', courseCount: 60, color: 'pink' },
  { id: '10', name: 'Geospatial & Remote Sensing', slug: 'geospatial', icon: '🌍', description: 'Advanced geospatial technologies and remote sensing applications', courseCount: 40, color: 'cyan' },
]

const defaultCourses = [
  { id: '1', title: 'Training on Advanced Monitoring & Evaluation Techniques', slug: 'advanced-monitoring-evaluation', category: 'Monitoring & Evaluation', categorySlug: 'monitoring-evaluation', duration: '5 Days', format: 'In-Person / Virtual', level: 'Advanced', price: 1500, featured: true, published: true, description: 'The Advanced Monitoring & Evaluation Techniques course is designed for professionals looking to deepen their understanding of M&E practices, methodologies, and applications.', outcomes: ['Master advanced M&E frameworks', 'Develop robust evaluation designs', 'Apply mixed-methods approaches', 'Build organizational M&E systems'], location: 'Nairobi, Dubai, London', nextDate: '2025-02-10' },
  { id: '2', title: 'Training on Global Leadership', slug: 'global-leadership', category: 'Leadership & Management', categorySlug: 'leadership-management', duration: '5 Days', format: 'In-Person / Virtual', level: 'Intermediate', price: 1800, featured: true, published: true, description: "Develop the strategic leadership skills needed to lead organizations in today's complex global environment.", outcomes: ['Strategic thinking frameworks', 'Cross-cultural leadership', 'Change management mastery', 'Executive communication'], location: 'Nairobi, Kigali, Dubai', nextDate: '2025-02-17' },
  { id: '3', title: 'Training on Project Management Professional', slug: 'project-management-professional', category: 'Project Management', categorySlug: 'project-management', duration: '5 Days', format: 'In-Person', level: 'Intermediate', price: 1650, featured: true, published: true, description: 'Comprehensive project management training aligned with PMI standards and best practices.', outcomes: ['PMP examination preparation', 'Agile & waterfall methodologies', 'Risk management techniques', 'Stakeholder engagement'], location: 'Nairobi, Kampala, Cape Town', nextDate: '2025-02-24' },
  { id: '4', title: 'Training on Financial Management & Reporting', slug: 'financial-management-reporting', category: 'Finance & Human Resources', categorySlug: 'finance-hr', duration: '5 Days', format: 'In-Person / Virtual', level: 'Intermediate', price: 1550, featured: false, published: true, description: 'Master financial management principles and reporting standards for organizational excellence.', outcomes: ['Financial analysis techniques', 'Budget planning & control', 'Financial reporting standards', 'Cash flow management'], location: 'Nairobi, Dar es Salaam', nextDate: '2025-03-03' },
  { id: '5', title: 'Training on AI and Machine Learning for Business', slug: 'ai-machine-learning-business', category: 'Technology, Innovation & Data', categorySlug: 'technology-innovation', duration: '5 Days', format: 'Virtual / In-Person', level: 'Intermediate', price: 2000, featured: true, published: true, description: 'Practical AI and machine learning applications for business transformation and competitive advantage.', outcomes: ['AI strategy development', 'Machine learning fundamentals', 'Data-driven decision making', 'AI implementation roadmap'], location: 'Nairobi, Dubai, Virtual', nextDate: '2025-03-10' },
  { id: '6', title: 'Training on Supply Chain & Procurement Management', slug: 'supply-chain-procurement', category: 'Procurement & Supply Chain', categorySlug: 'procurement-supply-chain', duration: '5 Days', format: 'In-Person', level: 'Intermediate', price: 1500, featured: false, published: true, description: 'Build expertise in supply chain optimization and procurement best practices for operational efficiency.', outcomes: ['Strategic sourcing techniques', 'Supplier relationship management', 'Contract management', 'Supply chain risk mitigation'], location: 'Nairobi, Mombasa', nextDate: '2025-03-17' },
]

const defaultFAQs = [
  { id: '1', category: 'About GSAC', question: 'What is Global Skills Advancement Center?', answer: 'GSAC is a premier capacity-building and EdTech institution delivering high-impact professional training across Africa and beyond. We offer 1,500+ courses across all major business functions.' },
  { id: '2', category: 'About GSAC', question: 'How can I contact GSAC?', answer: 'Phone/WhatsApp: +254721911847 | Email: partner@gsac.org | Hours: 8:00 AM - 5:00 PM EAT (24/7 for urgent inquiries).' },
  { id: '3', category: 'Registration & Payment', question: 'How do I register for a course?', answer: 'Register online, email partner@gsac.org, or call +254721911847. Our team will guide you through enrollment.' },
  { id: '4', category: 'Registration & Payment', question: 'What is the refund policy?', answer: '14+ days before: full refund. 7-13 days: 50% refund. Under 7 days: no refund, but date transfer is available.' },
  { id: '5', category: 'Certification & Support', question: 'Is a certificate issued upon completion?', answer: 'Yes — an internationally recognized GSAC Certificate of Completion. CPD points awarded where applicable.' },
  { id: '6', category: 'Online & In-House Training', question: 'Do you offer virtual training?', answer: 'Yes. Live, interactive virtual training via Zoom/Teams with the same certificate as in-person programs.' },
]

const defaultBlogPosts = [
  { id: '1', title: 'The Future of Corporate Training in Africa', slug: 'future-corporate-training-africa', excerpt: 'How EdTech and AI are reshaping professional development across the continent.', content: "Africa's professional training landscape is undergoing a seismic shift...", author: 'GSAC Team', date: '2025-01-15', category: 'Industry Insights', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', published: true },
  { id: '2', title: 'Why Monitoring & Evaluation Skills Are Critical in 2025', slug: 'monitoring-evaluation-skills-2025', excerpt: "Organizations that invest in M&E capabilities significantly outperform those that don't.", content: 'In an era defined by accountability...', author: 'GSAC Team', date: '2025-01-08', category: 'Training Tips', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', published: true },
  { id: '3', title: '10 Leadership Traits That Define High-Impact Performers', slug: 'leadership-traits-high-impact-performers', excerpt: "What separates good leaders from truly transformational ones in today's landscape.", content: 'Leadership in the 21st century demands more...', author: 'GSAC Team', date: '2024-12-20', category: 'Leadership', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', published: true },
]

function normalizeCourse(c) {
  if (!c) return c
  return { ...c, categorySlug: c.category_slug ?? c.categorySlug, nextDate: c.next_date ?? c.nextDate }
}

function normalizeCategory(c) {
  if (!c) return c
  return { ...c, courseCount: c.course_count ?? c.courseCount }
}

export function SiteProvider({ children }) {
  const useSupabase = !!supabase
  const [content, setContent] = useState(defaultContent)
  const [categories, setCategories] = useState(defaultCategories)
  const [courses, setCourses] = useState(defaultCourses)
  const [venues, setVenues] = useState(DEFAULT_VENUES)
  const [faqs, setFaqs] = useState(defaultFAQs)
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(useSupabase)
  // Track if the component is still mounted to avoid state-after-unmount
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (!useSupabase) return

    let authSubscription = null

    async function bootstrap() {
      setLoading(true)
      try {
        // Run public data fetches in parallel; auth check separately (it can fail gracefully)
        const [siteData, partnersRes, testimonialsRes, categoriesRes, coursesRes, venuesRes, faqsRes, blogRes] = await Promise.all([
          api.siteContent.get(),
          api.partners.list(),
          api.testimonials.list(),
          api.categories.list(),
          api.courses.list(),
          api.venues.list(),
          api.faqs.list(),
          api.blog.list(),
        ])

        if (!mountedRef.current) return

        setContent({
          site: siteData.site?.site_name ? {
            name: siteData.site.site_name,
            tagline: siteData.site.tagline,
            heroHeadline: siteData.site.hero_headline,
            heroSubtext: siteData.site.hero_subtext,
            phone: siteData.site.phone,
            email: siteData.site.email,
            address: siteData.site.address,
            hours: siteData.site.hours,
            facebook: siteData.site.facebook,
            twitter: siteData.site.twitter,
            linkedin: siteData.site.linkedin,
            instagram: siteData.site.instagram,
            youtube: siteData.site.youtube,
            whatsapp: siteData.site.whatsapp,
          } : defaultContent.site,
          stats: siteData.stats?.professionals
            ? siteData.stats
            : defaultContent.stats,
          partners: partnersRes.data?.length ? partnersRes.data : defaultContent.partners,
          testimonials: testimonialsRes.data?.length ? testimonialsRes.data : defaultContent.testimonials,
        })
        if (categoriesRes.data?.length) setCategories(categoriesRes.data.map(normalizeCategory))
        if (coursesRes.data?.length) setCourses(coursesRes.data.map(normalizeCourse))
        if (venuesRes.data?.length) setVenues(venuesRes.data.map(normalizeVenue))
        if (faqsRes.data?.length) setFaqs(faqsRes.data)
        if (blogRes.data?.length) setBlogPosts(blogRes.data)
      } catch (err) {
        console.error('[GSAC] Bootstrap error:', err)
      } finally {
        if (mountedRef.current) setLoading(false)
      }

      // Check current auth session separately (non-blocking)
      try {
        const currentUser = await api.auth.getUser()
        if (mountedRef.current && currentUser) setUser(currentUser)
      } catch {
        // No active session — that's fine
      }
    }

    bootstrap()

    // Auth state listener
    const { data: { subscription } } = api.auth.onAuthChange(async (event, session) => {
      if (!mountedRef.current) return
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await api.auth.getUser()
          if (mountedRef.current) setUser(profile)
        } catch {
          if (mountedRef.current) setUser(session.user)
        }
      } else if (event === 'SIGNED_OUT') {
        if (mountedRef.current) setUser(null)
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Session was refreshed — keep user data current
        if (mountedRef.current && !user) {
          try {
            const profile = await api.auth.getUser()
            if (mountedRef.current) setUser(profile)
          } catch { /* silent */ }
        }
      }
    })
    authSubscription = subscription

    return () => {
      authSubscription?.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSupabase])

  const updateContent = useCallback(async (section, data) => {
    setContent(prev => ({ ...prev, [section]: { ...prev[section], ...data } }))
    if (useSupabase && section === 'site') {
      await api.siteContent.updateSite({
        site_name: data.name, tagline: data.tagline, hero_headline: data.heroHeadline,
        hero_subtext: data.heroSubtext, phone: data.phone, email: data.email,
        address: data.address, hours: data.hours, facebook: data.facebook,
        twitter: data.twitter, linkedin: data.linkedin, instagram: data.instagram,
        youtube: data.youtube, whatsapp: data.whatsapp,
      })
    }
  }, [useSupabase])

  const updateStat = useCallback(async (key, val) => {
    setContent(prev => ({ ...prev, stats: { ...prev.stats, [key]: val } }))
    if (useSupabase) await api.siteContent.updateStats({ [key]: val })
  }, [useSupabase])

  const updateStats = useCallback(async (data) => {
    setContent(prev => ({ ...prev, stats: { ...prev.stats, ...data } }))
    if (useSupabase) await api.siteContent.updateStats(data)
  }, [useSupabase])

  const addCourse = useCallback(async (course) => {
    if (useSupabase) {
      const { data } = await api.courses.create({ title: course.title, slug: course.slug, category: course.category, category_slug: course.categorySlug, duration: course.duration, format: course.format, level: course.level, price: course.price, featured: course.featured, published: course.published, description: course.description, outcomes: course.outcomes, location: course.location, next_date: course.nextDate })
      if (data) setCourses(prev => [...prev, normalizeCourse(data)])
    } else { setCourses(prev => [...prev, { ...course, id: String(Date.now()) }]) }
  }, [useSupabase])

  const updateCourse = useCallback(async (id, data) => {
    if (useSupabase) {
      const { data: updated } = await api.courses.update(id, { title: data.title, slug: data.slug, category: data.category, category_slug: data.categorySlug, duration: data.duration, format: data.format, level: data.level, price: data.price, featured: data.featured, published: data.published, description: data.description, outcomes: data.outcomes, location: data.location, next_date: data.nextDate })
      if (updated) setCourses(prev => prev.map(c => c.id === id ? normalizeCourse(updated) : c))
    } else { setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)) }
  }, [useSupabase])

  const deleteCourse = useCallback(async (id) => {
    if (useSupabase) await api.courses.delete(id)
    setCourses(prev => prev.filter(c => c.id !== id))
  }, [useSupabase])

  const addCategory = useCallback(async (cat) => {
    if (useSupabase) {
      const { data } = await api.categories.create({ ...cat, course_count: cat.courseCount })
      if (data) setCategories(prev => [...prev, normalizeCategory(data)])
    } else { setCategories(prev => [...prev, { ...cat, id: String(Date.now()) }]) }
  }, [useSupabase])

  const updateCategory = useCallback(async (id, data) => {
    if (useSupabase) {
      const { data: updated } = await api.categories.update(id, { ...data, course_count: data.courseCount })
      if (updated) setCategories(prev => prev.map(c => c.id === id ? normalizeCategory(updated) : c))
    } else { setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)) }
  }, [useSupabase])

  const deleteCategory = useCallback(async (id) => {
    if (useSupabase) await api.categories.delete(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [useSupabase])

  const addVenue = useCallback(async (v) => {
    if (useSupabase) { const { data } = await api.venues.create(v); if (data) setVenues(prev => [...prev, normalizeVenue(data)]) }
    else { setVenues(prev => [...prev, normalizeVenue({ ...v, id: String(Date.now()) })]) }
  }, [useSupabase])

  const updateVenue = useCallback(async (id, data) => {
    if (useSupabase) { const { data: updated } = await api.venues.update(id, data); if (updated) setVenues(prev => prev.map(v => v.id === id ? normalizeVenue(updated) : v)) }
    else { setVenues(prev => prev.map(v => v.id === id ? normalizeVenue({ ...v, ...data }) : v)) }
  }, [useSupabase])

  const deleteVenue = useCallback(async (id) => {
    if (useSupabase) await api.venues.delete(id)
    setVenues(prev => prev.filter(v => v.id !== id))
  }, [useSupabase])

  const addFaq = useCallback(async (f) => {
    if (useSupabase) { const { data } = await api.faqs.create(f); if (data) setFaqs(prev => [...prev, data]) }
    else { setFaqs(prev => [...prev, { ...f, id: String(Date.now()) }]) }
  }, [useSupabase])

  const updateFaq = useCallback(async (id, data) => {
    if (useSupabase) { const { data: updated } = await api.faqs.update(id, data); if (updated) setFaqs(prev => prev.map(f => f.id === id ? updated : f)) }
    else { setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...data } : f)) }
  }, [useSupabase])

  const deleteFaq = useCallback(async (id) => {
    if (useSupabase) await api.faqs.delete(id)
    setFaqs(prev => prev.filter(f => f.id !== id))
  }, [useSupabase])

  const addBlogPost = useCallback(async (post) => {
    if (useSupabase) { const { data } = await api.blog.create(post); if (data) setBlogPosts(prev => [data, ...prev]) }
    else { setBlogPosts(prev => [{ ...post, id: String(Date.now()) }, ...prev]) }
  }, [useSupabase])

  const updateBlogPost = useCallback(async (id, data) => {
    if (useSupabase) { const { data: updated } = await api.blog.update(id, data); if (updated) setBlogPosts(prev => prev.map(p => p.id === id ? updated : p)) }
    else { setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p)) }
  }, [useSupabase])

  const deleteBlogPost = useCallback(async (id) => {
    if (useSupabase) await api.blog.delete(id)
    setBlogPosts(prev => prev.filter(p => p.id !== id))
  }, [useSupabase])

  const addTestimonial = useCallback(async (t) => {
    if (useSupabase) { const { data } = await api.testimonials.create(t); if (data) setContent(prev => ({ ...prev, testimonials: [...prev.testimonials, data] })) }
    else { setContent(prev => ({ ...prev, testimonials: [...prev.testimonials, { ...t, id: String(Date.now()) }] })) }
  }, [useSupabase])

  const updateTestimonial = useCallback(async (id, data) => {
    if (useSupabase) { const { data: updated } = await api.testimonials.update(id, data); if (updated) setContent(prev => ({ ...prev, testimonials: prev.testimonials.map(t => t.id === id ? updated : t) })) }
    else { setContent(prev => ({ ...prev, testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...data } : t) })) }
  }, [useSupabase])

  const deleteTestimonial = useCallback(async (id) => {
    if (useSupabase) await api.testimonials.delete(id)
    setContent(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }))
  }, [useSupabase])

  const addPartner = useCallback(async (p) => {
    if (useSupabase) { const { data } = await api.partners.create(p); if (data) setContent(prev => ({ ...prev, partners: [...prev.partners, data] })) }
    else { setContent(prev => ({ ...prev, partners: [...prev.partners, { ...p, id: String(Date.now()) }] })) }
  }, [useSupabase])

  const updatePartner = useCallback(async (id, data) => {
    if (useSupabase) { const { data: updated } = await api.partners.update(id, data); if (updated) setContent(prev => ({ ...prev, partners: prev.partners.map(p => p.id === id ? updated : p) })) }
    else { setContent(prev => ({ ...prev, partners: prev.partners.map(p => p.id === id ? { ...p, ...data } : p) })) }
  }, [useSupabase])

  const deletePartner = useCallback(async (id) => {
    if (useSupabase) await api.partners.delete(id)
    setContent(prev => ({ ...prev, partners: prev.partners.filter(p => p.id !== id) }))
  }, [useSupabase])

  const login = useCallback(async (email, password) => {
    if (useSupabase) {
      const result = await api.auth.login(email, password)
      // Only set user if login was fully successful (not just success flag)
      if (result.success && result.user) setUser(result.user)
      return result
    }
    // Local fallback mode
    const isAdmin = email === 'admin@gsac.org' && password === 'admin123'
    if (!isAdmin && email !== 'user@gsac.org') {
      return { success: false, error: 'Invalid credentials.' }
    }
    const u = { email, role: isAdmin ? 'admin' : 'user', name: email.split('@')[0] }
    setUser(u)
    return { success: true, user: u }
  }, [useSupabase])

  const register = useCallback(async (data) => {
    if (useSupabase) {
      const result = await api.auth.register(data)
      // needsConfirmation means email was sent — do NOT set user yet
      if (result.success && result.user && !result.needsConfirmation) {
        setUser(result.user)
      }
      return result
    }
    // Local fallback mode
    const u = { ...data, role: 'user' }
    setUser(u)
    return { success: true, needsConfirmation: false, user: u }
  }, [useSupabase])

  const logout = useCallback(async () => {
    if (useSupabase) await api.auth.logout()
    setUser(null)
  }, [useSupabase])

  return (
    <SiteContext.Provider value={{
      content, categories, courses, venues, faqs, blogPosts, user, loading, useSupabase,
      updateContent, updateStat, updateStats,
      addCourse, updateCourse, deleteCourse,
      addCategory, updateCategory, deleteCategory,
      addVenue, updateVenue, deleteVenue,
      addFaq, updateFaq, deleteFaq,
      addBlogPost, updateBlogPost, deleteBlogPost,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addPartner, updatePartner, deletePartner,
      login, register, logout,
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteProvider')
  return ctx
}
