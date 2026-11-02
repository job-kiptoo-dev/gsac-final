import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CurrencyPrice from '../components/common/CurrencyPrice'
import { categoryTile } from '../lib/categoryColors'
import { groupVenuesByRegion } from '../lib/venues'
import SocialRail from '../components/common/SocialRail'
import { useSite } from '../context/SiteContext'

/* ─── Hero ──────────────────────────────────────────────────── */
function HeroSection() {
  const { content } = useSite()
  const { site } = content
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/training-categories?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background photo with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1800&h=1000&fit=crop&q=80"
          alt="Corporate training team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/88 via-white/75 to-white/60" />
        {/* Blobs */}
        <div className="blob w-96 h-96 bg-navy top-1/4 right-1/4" style={{ opacity: 0.08 }} />
        <div className="blob w-80 h-80 bg-gold bottom-1/4 left-1/3" style={{ opacity: 0.06 }} />
      </div>

      <SocialRail site={site} />

      {/* Content card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 flex flex-col items-center xl:px-20">
        <div className="glass-card p-8 md:p-12 w-full text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold-light text-gold-deep text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
            {site.tagline}
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-navy uppercase leading-tight mb-5 animate-slide-up">
            {site.heroHeadline}
          </h1>

          {/* Orange divider */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-1.5 bg-gold rounded-full" />
          </div>

          {/* Sub text */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {site.heroSubtext}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/training-categories" className="btn-primary text-sm md:text-base px-7 py-3.5">
              EXPLORE GSAC PROGRAMS
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/contact" className="btn-secondary text-sm md:text-base px-7 py-3.5">
              SCHEDULE A STRATEGY CALL
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Find programs by skill, role, or strategic outcome..."
              className="flex-1 px-5 py-3 rounded-l-full border-2 border-teal-dark/30 focus:outline-none focus:border-teal-dark text-sm bg-white"
            />
            <button type="submit" className="bg-navy text-white px-6 py-3 rounded-r-full font-bold hover:bg-navy-dark transition-colors text-sm">
              Search
            </button>
          </form>
        </div>

        {/* Floating bottom navigation pill */}
        <div className="mt-6 glass-card px-4 py-2 flex items-center gap-1 text-xs font-semibold">
          {[
            { label: 'Clients', to: '#clients' },
            { label: 'Categories', to: '/training-categories' },
            { label: 'Formats', to: '/training-formats' },
            { label: 'Venues', to: '/training-venues' },
            { label: 'Courses', to: '/training-categories' },
            { label: 'Proof', to: '#testimonials' },
            { label: 'Results', to: '#stats' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />}
              {item.to.startsWith('#') ? (
                <a href={item.to} className={`px-2 py-1 rounded-full transition-colors ${i === 0 ? 'bg-navy text-white' : 'text-gray-600 hover:text-teal-deep'}`}>
                  {item.label}
                </a>
              ) : (
                <Link to={item.to} className="px-2 py-1 rounded-full text-gray-600 hover:text-teal-deep transition-colors">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Partners ───────────────────────────────────────────────── */
function PartnersSection() {
  const { content } = useSite()
  const { partners, stats } = content
  const doubled = [...partners, ...partners]

  return (
    <section id="clients" className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="section-label justify-center">
            <span className="w-2 h-2 bg-gold rounded-full" /> TRUSTED BY SERIOUS TEAMS
          </div>
          <h2 className="section-title-h2 mb-3">THEY TRUST US WITH PERFORMANCE. WE DELIVER.</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            When the stakes are high, top organizations don't buy "training". They buy outcomes. We build capability that shows up in KPIs.
          </p>
          <div className="flex justify-center gap-8 mt-6 flex-wrap">
            {[
              { label: 'Partners', value: stats.professionals },
              { label: 'Upskilled', value: stats.professionals },
              { label: 'Hours', value: stats.hours },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-teal-deep">{s.value}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee logos */}
        <div className="marquee-container relative">
          <div className="marquee-track animate flex items-center gap-12">
            {doubled.map((partner, i) => (
              <div key={i} className="flex-shrink-0 h-14 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 max-w-32 object-contain"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Categories ────────────────────────────────────────────── */
function CategoriesSection() {
  const { categories } = useSite()
  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label justify-center">
            <span className="w-2 h-2 bg-gold rounded-full" /> THE MASTERY TRACKS
          </div>
          <h2 className="section-title-h2 mb-3">ENGINEER YOUR COMPETITIVE EDGE</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Select your theater of operation and master it.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/training-categories/${cat.slug}`}
              className={`p-5 rounded-xl2 border-2 transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-card-hover ${categoryTile(cat.color)}`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-sm leading-tight mb-1 group-hover:underline">{cat.name}</h3>
              <div className="text-xs opacity-70">{cat.courseCount} courses</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/training-categories" className="btn-primary">
            View All Categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Course Search / Locator ───────────────────────────────── */
function CourseLocatorSection() {
  const { courses, categories } = useSite()
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('')

  const filtered = courses.filter(c =>
    c.published && (
      (query === '' || c.title.toLowerCase().includes(query.toLowerCase())) &&
      (selectedCat === '' || c.categorySlug === selectedCat)
    )
  ).slice(0, 6)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="section-label justify-center">
            <span className="w-2 h-2 bg-gold rounded-full" /> Course Locator
          </div>
          <h2 className="section-title-h2 mb-3">FIND THE COURSE THAT MOVES THE NEEDLE.</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Type a skill, role, or outcome. We'll surface the fastest path to ROI.</p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-10">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by skill, role, or topic..."
              className="input-field pl-12"
            />
          </div>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filtered.map(course => (
              <Link key={course.id} to={`/course/${course.slug}`} className="card p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <span className="tag-pill bg-teal-50 text-teal-deep text-xs">{course.category}</span>
                  <span className="text-xs text-gray-400 font-medium">{course.duration}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-800 leading-tight mb-2 group-hover:text-teal-deep transition-colors line-clamp-2">{course.title}</h3>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <CurrencyPrice amount={course.price} className="text-teal-deep font-bold text-sm" />
                  <span className="text-xs text-gray-500">{course.format}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>No courses found. Try a different search term.</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/training-categories" className="btn-secondary">
            Browse All {courses.filter(c => c.published).length}+ Courses
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Training Formats ──────────────────────────────────────── */
function FormatsSection() {
  const formats = [
    { icon: '🏫', title: 'In-Person Training', desc: 'Immersive classroom experiences at our premium venues worldwide. Network with peers and engage directly with expert facilitators.', badge: 'Most Popular', link: '/training-formats' },
    { icon: '💻', title: 'Live Virtual Training', desc: 'Interactive online sessions via Zoom or Teams. Same quality, same certificate — delivered to your screen anywhere in the world.', badge: 'Flexible', link: '/training-formats' },
    { icon: '🏢', title: 'In-House Training', desc: 'We come to you. Customized programs delivered at your premises for teams of 5+. Tailored to your organization\'s objectives.', badge: 'Custom', link: '/training-formats' },
    { icon: '🔄', title: 'Hybrid Learning', desc: 'Blend in-person and virtual elements for maximum flexibility without compromising on learning outcomes.', badge: 'Innovative', link: '/training-formats' },
  ]

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label justify-center">
            <span className="w-2 h-2 bg-gold rounded-full" /> Flexible Learning
          </div>
          <h2 className="section-title-h2 mb-3">TRAINING WITHOUT BOUNDARIES.</h2>
          <p className="text-gray-500">Your location. Your terms. Our expertise.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formats.map((f) => (
            <Link to={f.link} key={f.title} className="card p-6 text-center group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <span className="tag-pill bg-gold-light text-gold-deep text-xs mb-3 inline-block">{f.badge}</span>
              <h3 className="font-bold text-gray-800 mb-3 group-hover:text-teal-deep transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Venues ────────────────────────────────────────────────── */
function VenuesSection() {
  const { venues } = useSite()
  const groups = groupVenuesByRegion(venues)
  const cityCount = groups.reduce((n, g) => n + g.venues.length, 0)
  const countryCount = new Set(groups.flatMap(g => g.countries)).size

  return (
    <section className="py-16 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label justify-center text-white/60">
            <span className="w-2 h-2 bg-gold rounded-full" /> Global Presence
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">TRAINING VENUES</h2>
          <p className="text-white/70 text-sm">{cityCount} cities across {countryCount} countries — pick a city to see the courses running there.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map(g => (
            <div key={g.region} className="rounded-xl2 bg-white/5 border border-white/10 p-6">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="text-white font-black text-lg">{g.region}</h3>
                <span className="text-gold text-xs font-bold">{g.venues.length} {g.venues.length === 1 ? 'venue' : 'venues'}</span>
              </div>
              <p className="text-white/50 text-xs mb-4 min-h-[1rem]">{g.countries.length === 1 && g.countries[0] === g.region ? '\u00a0' : g.countries.join(' · ')}</p>
              <div className="flex flex-wrap gap-2">
                {g.venues.map(venue => (
                  <Link
                    key={venue.id}
                    to={`/training-categories?search=${encodeURIComponent(venue.name)}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-gold hover:text-navy transition-colors"
                  >
                    {venue.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/training-venues" className="btn-outline-white">
            Explore All Venues
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Latest Courses ────────────────────────────────────────── */
function LatestCoursesSection() {
  const { courses } = useSite()
  const latest = courses.filter(c => c.published).slice(0, 6)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="section-label">
              <span className="w-2 h-2 bg-gold rounded-full" /> Newly Updated Selection
            </div>
            <h2 className="section-title-h2">Our Latest Course Offerings</h2>
            <p className="text-gray-500 text-sm mt-2">Explore our most popular professional development programs</p>
          </div>
          <Link to="/training-categories" className="btn-primary">
            View All Courses
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map(course => (
            <Link key={course.id} to={`/course/${course.slug}`} className="card group">
              <div className="relative h-40 bg-gradient-to-br from-navy/10 to-navy/10 flex items-center justify-center overflow-hidden">
                <div className="text-6xl opacity-20">{
                  course.category.includes('Leadership') ? '🎯' :
                  course.category.includes('Finance') ? '💼' :
                  course.category.includes('Monitor') ? '📊' :
                  course.category.includes('Technology') ? '💻' :
                  course.category.includes('Project') ? '📋' : '📚'
                }</div>
                {course.featured && (
                  <span className="absolute top-3 left-3 tag-pill bg-gold text-navy text-xs">Featured</span>
                )}
                <span className="absolute top-3 right-3 tag-pill bg-white text-navy text-xs font-bold shadow">{course.duration}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag-pill bg-teal-50 text-teal-deep text-xs">{course.category}</span>
                  <span className="tag-pill bg-gray-100 text-gray-600 text-xs">{course.level}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-800 leading-tight mb-3 group-hover:text-teal-deep transition-colors line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gold-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/></svg>
                    {course.location}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <CurrencyPrice amount={course.price} className="text-teal-deep font-black text-base" />
                  <span className="text-xs text-teal-deep font-semibold group-hover:underline flex items-center gap-1">
                    View Details
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ──────────────────────────────────────────── */
function TestimonialsSection() {
  const { content } = useSite()
  const testimonials = content.testimonials.filter(t => t.approved)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section id="testimonials" className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label justify-center">
            <span className="w-2 h-2 bg-gold rounded-full" /> TRUST & PROOF
          </div>
          <h2 className="section-title-h2 mb-3">THE RESULTS SPEAK LOUDER THAN MARKETING.</h2>
          <p className="text-gray-500 text-sm">A few words that capture what working with us feels like.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={t.id} className={`card p-6 transition-all duration-300 ${i === active % 3 ? 'ring-2 ring-teal-dark shadow-card-hover' : ''}`}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-gold-dark fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <div className="mb-4">
                <div className="text-teal-deep font-black text-lg mb-1">"</div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length > 3 && (
          <div className="flex justify-center gap-2">
            {testimonials.slice(0, Math.ceil(testimonials.length / 3)).map((_, i) => (
              <button key={i} onClick={() => setActive(i * 3)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${active === i * 3 ? 'bg-navy' : 'bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Stats ─────────────────────────────────────────────────── */
function StatsSection() {
  const { content } = useSite()
  const { stats } = content
  const items = [
    { value: stats.professionals, label: 'Professionals Upskilled Annually', icon: '👥' },
    { value: stats.hours, label: 'Hours of Elite Instruction Delivered', icon: '⏱️' },
    { value: stats.satisfaction, label: 'Measurable Learner Satisfaction', icon: '⭐' },
    { value: stats.venues, label: 'Global Command Centers (Venues)', icon: '🌍' },
  ]

  return (
    <section id="stats" className="py-16 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label justify-center text-white/60">
            <span className="w-2 h-2 bg-white rounded-full" /> SUCCESS METRICS
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">THE NUMBERS DON'T LIE.</h2>
          <p className="text-white/70 text-sm">Key milestones and accomplishments that define our success</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{item.value}</div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wide leading-tight">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Trainer Recruitment ───────────────────────────────────── */
function TrainerSection() {
  return (
    <section className="py-16 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card bg-white/5 border-white/10 p-10 md:p-14 text-center">
          <div className="section-label justify-center text-white/60">
            <span className="w-2 h-2 bg-gold rounded-full" /> TRAINER RECRUITMENT
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">ARE YOU AN ELITE SUBJECT MATTER EXPERT?</h2>
          <div className="w-20 h-1.5 bg-gold rounded-full mx-auto my-4" />
          <h3 className="text-gold font-bold text-lg mb-4">WE WANT THE BEST. NOTHING LESS.</h3>
          <p className="text-white/70 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Join the most authoritative training network in the region. If you have the expertise to lead industry giants, we want you on our faculty. High-stakes training. Competitive compensation. Global impact.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { icon: '📅', label: 'Flexible Schedule' },
              { icon: '💰', label: 'Competitive Pay' },
              { icon: '🌱', label: 'Professional Growth' },
              { icon: '🌍', label: 'Global Impact' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 text-white/80 text-sm">
                <span>{f.icon}</span>
                <span className="font-medium">{f.label}</span>
              </div>
            ))}
          </div>
          <Link to="/trainer-recruitment" className="btn-gold">
            Apply to Join Our Faculty
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Main Home ─────────────────────────────────────────────── */
export default function Home() {
  return (
    <main>
      <HeroSection />
      <PartnersSection />
      <CategoriesSection />
      <CourseLocatorSection />
      <FormatsSection />
      <VenuesSection />
      <LatestCoursesSection />
      <TestimonialsSection />
      <StatsSection />
      <TrainerSection />
    </main>
  )
}
