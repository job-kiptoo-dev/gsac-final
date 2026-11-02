import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import { groupVenuesByRegion } from '../../lib/venues'
import logo from '../../assets/logo.png'

/* ─────────────────────────────────────────────────────────────
   Header: utility bar + main nav with full-width mega-menus
   (Training Categories, Venues) — layout inspired by
   zoetalentsolutions.com: bold column headings, links beneath.
   ───────────────────────────────────────────────────────────── */

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'

const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_PATH} /></svg>
)

const Chevron = ({ open }) => (
  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

/* Underline-on-hover style shared by every top-level item */
const itemBase =
  'relative h-16 inline-flex items-center gap-1 px-2.5 text-sm font-semibold whitespace-nowrap transition-colors ' +
  "after:content-[''] after:absolute after:left-2.5 after:right-2.5 after:bottom-0 after:h-[3px] after:rounded-t after:bg-gold " +
  'after:origin-left after:scale-x-0 after:transition-transform after:duration-200'
const itemIdle = 'text-navy hover:text-teal-deep hover:after:scale-x-100'
const itemActive = 'text-teal-deep after:scale-x-100'

/* ── Mega panel shell ── */
function MegaPanel({ children, footer, onEnter, onLeave }) {
  return (
    <div
      className="mega-panel absolute left-0 right-0 top-full bg-white border-t-2 border-gold shadow-2xl z-50"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="max-w-screen-xl mx-auto px-6 py-8 max-h-[calc(100vh-10rem)] overflow-y-auto">{children}</div>
      <div className="bg-navy-50 border-t border-navy/10">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap text-sm">{footer}</div>
      </div>
    </div>
  )
}

/* ── Training Categories mega-menu ── */
function CategoriesMega({ categories, courses, onClose, onEnter, onLeave }) {
  const byCat = useMemo(() => {
    const map = {}
    courses.filter(c => c.published).forEach(c => { (map[c.categorySlug] ||= []).push(c) })
    return map
  }, [courses])

  return (
    <MegaPanel
      onEnter={onEnter}
      onLeave={onLeave}
      footer={
        <>
          <span className="text-gray-500">Not sure where to start? We'll recommend the right programme for your team.</span>
          <div className="flex items-center gap-5 font-bold">
            <Link to="/training-categories" onClick={onClose} className="text-navy hover:text-teal-deep">Browse all courses →</Link>
            <Link to="/contact" onClick={onClose} className="text-gold-dark hover:text-navy">Request in-house training →</Link>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-9">
        {categories.map(cat => {
          const list = byCat[cat.slug] || []
          const shown = list.slice(0, 4)
          const total = list.length || Number(cat.courseCount) || 0
          return (
            <div key={cat.id} className="min-w-0">
              <Link
                to={`/training-categories/${cat.slug}`}
                onClick={onClose}
                className="group flex items-center gap-2.5 pb-2.5 mb-3 border-b-2 border-gold/50 hover:border-gold transition-colors"
              >
                <span className="w-8 h-8 flex-shrink-0 rounded-lg bg-teal-50 flex items-center justify-center text-base">{cat.icon}</span>
                <span className="text-sm font-extrabold leading-tight text-navy group-hover:text-teal-deep transition-colors">{cat.name}</span>
              </Link>

              {shown.length > 0 ? (
                <ul className="space-y-0.5">
                  {shown.map(course => (
                    <li key={course.id}>
                      <Link
                        to={`/course/${course.slug}`}
                        onClick={onClose}
                        className="block py-1 text-[13px] leading-snug text-gray-600 hover:text-teal-deep hover:translate-x-0.5 transition line-clamp-2"
                      >
                        {course.title.replace(/^Training on /i, '')}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                cat.description && <p className="text-xs leading-relaxed text-gray-400 line-clamp-3">{cat.description}</p>
              )}

              <Link
                to={`/training-categories/${cat.slug}`}
                onClick={onClose}
                className="inline-block mt-2 text-xs font-bold text-gold-dark hover:text-navy transition-colors"
              >
                {total > shown.length ? `View all ${total} courses →` : 'Browse category →'}
              </Link>
            </div>
          )
        })}
      </div>
    </MegaPanel>
  )
}

/* Which regions share a column in the Venues menu (keeps column heights balanced) */
const VENUE_COLUMNS = [['Kenya'], ['Africa'], ['Middle East', 'Asia'], ['Europe', 'South America', 'North America']]

/* ── Venues mega-menu ── */
function VenuesMega({ venues, onClose, onEnter, onLeave }) {
  const groups = useMemo(() => groupVenuesByRegion(venues), [venues])
  const byRegion = Object.fromEntries(groups.map(g => [g.region, g]))
  const known = VENUE_COLUMNS.flat()
  const columns = VENUE_COLUMNS
    .map((regions, i) => [...regions, ...(i === VENUE_COLUMNS.length - 1 ? groups.map(g => g.region).filter(r => !known.includes(r)) : [])])
    .map(regions => regions.filter(r => byRegion[r]))
    .filter(regions => regions.length > 0)
  const cities = groups.reduce((n, g) => n + g.venues.length, 0)
  const countries = new Set(groups.flatMap(g => g.countries)).size

  return (
    <MegaPanel
      onEnter={onEnter}
      onLeave={onLeave}
      footer={
        <>
          <span className="text-gray-500">{cities} cities · {countries} countries</span>
          <Link to="/training-venues" onClick={onClose} className="font-bold text-navy hover:text-teal-deep">View all venues →</Link>
        </>
      }
    >
      <div className="flex gap-10">
        {columns.map((regions, i) => (
          <div key={i} className={`space-y-7 min-w-0 ${regions.includes('Africa') ? 'flex-[2]' : 'flex-1'}`}>
            {regions.map(region => {
              const g = byRegion[region]
              const wide = g.venues.length > 8
              return (
                <div key={region}>
                  <Link
                    to="/training-venues"
                    onClick={onClose}
                    className="group flex items-center justify-between pb-2.5 mb-3 border-b-2 border-gold/50 hover:border-gold transition-colors"
                  >
                    <span className="text-sm font-extrabold text-navy group-hover:text-teal-deep transition-colors">{g.region}</span>
                    <span className="text-[11px] font-semibold text-gray-400">{g.venues.length}</span>
                  </Link>
                  <ul className={wide ? 'grid grid-cols-2 gap-x-6' : ''}>
                    {g.venues.map(v => (
                      <li key={v.id}>
                        <Link
                          to={`/training-categories?search=${encodeURIComponent(v.name)}`}
                          onClick={onClose}
                          className="flex items-baseline gap-1.5 py-1 text-[13px] text-gray-700 hover:text-teal-deep hover:translate-x-0.5 transition"
                        >
                          <span className="font-medium truncate">{v.name}</span>
                          {v.country && v.country !== g.region && <span className="text-[11px] text-gray-400 truncate">{v.country}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </MegaPanel>
  )
}

/* ── Plain links (no dropdown) ── */
const staticNavItems = [
  { label: 'Training Calendar', to: '/training-calendar' },
  { label: 'Training Formats', to: '/training-formats' },
  { label: 'About Us', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenu, setOpenMenu] = useState(null)          // null | 'categories' | 'venues'
  const [mobileSection, setMobileSection] = useState(null) // null | 'categories' | 'venues'

  const { content, user, logout, categories, courses, venues } = useSite()
  const { site } = content
  const navigate = useNavigate()
  const location = useLocation()
  const navRef = useRef(null)
  const timer = useRef(null)

  const visibleCategories = useMemo(() => categories.filter(c => c.published !== false), [categories])
  const whatsapp = `https://wa.me/${site.whatsapp?.replace(/\D/g, '')}`

  // Close everything when clicking outside or pressing Escape
  useEffect(() => {
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false); setSearchOpen(false); setOpenMenu(null)
      }
    }
    const onKey = (e) => { if (e.key === 'Escape') { setOpenMenu(null); setSearchOpen(false) } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [])

  // Close menus after navigating
  useEffect(() => { setOpenMenu(null); setMobileOpen(false) }, [location.pathname, location.search])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/training-categories?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const open = (name) => { clearTimeout(timer.current); setOpenMenu(name) }
  const scheduleClose = () => { timer.current = setTimeout(() => setOpenMenu(null), 160) }
  const keepOpen = () => clearTimeout(timer.current)
  const closeNow = () => setOpenMenu(null)

  const renderTrigger = (name, label) => (
    <div key={name} className="h-16" onMouseEnter={() => open(name)} onMouseLeave={scheduleClose}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={openMenu === name}
        onClick={() => setOpenMenu(o => (o === name ? null : name))}
        className={`${itemBase} ${openMenu === name ? itemActive : itemIdle}`}
      >
        {label}
        <Chevron open={openMenu === name} />
      </button>
    </div>
  )

  const mobileRow = 'w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-navy hover:text-teal-deep hover:bg-teal-50 rounded-lg transition-colors'
  const mobileLink = 'flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-teal-deep hover:bg-teal-50 rounded-lg transition-colors'

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full">

      {/* ── UTILITY BAR ── */}
      <div className="bg-navy text-white text-xs min-h-9 flex items-center">
        <div className="w-full max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-white/80 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="text-gold">●</span>
              <span>{site.address}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="text-gold">●</span>
              <span>{site.hours}</span>
            </span>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <a href={`tel:${site.phone}`} className="hidden md:flex items-center gap-1.5 text-white/90 hover:text-gold transition-colors">
              <span className="font-medium">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className="hidden md:flex items-center gap-1.5 text-white/90 hover:text-gold transition-colors">
              <span>{site.email}</span>
            </a>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gold hover:text-white font-semibold transition-colors">Admin Panel</Link>
                  )}
                  <span className="text-white/40">|</span>
                  <span className="text-white/80 hidden sm:inline">Hi, {user.name}</span>
                  <button onClick={logout} className="text-white/90 hover:text-gold transition-colors">Logout</button>
                </>
              ) : (
                <Link to="/login" className="text-gold font-semibold hover:text-white transition-colors">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <nav className="relative bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src={logo}
                alt="GSAC Logo"
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <div className="text-navy font-black text-base leading-tight">GSAC</div>
                <div className="hidden 2xl:block text-gray-400 text-xs leading-none">Global Skills Advancement Center</div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden xl:flex items-center flex-1 justify-center">
              {renderTrigger('categories', 'Training Categories')}
              {renderTrigger('venues', 'Venues')}
              {staticNavItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemIdle}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* SEARCH */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(s => !s)}
                  className="p-2 text-navy hover:text-teal-deep hover:bg-teal-50 rounded-lg transition-colors"
                  aria-label="Search courses"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search courses or cities…"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-dark focus:outline-none"
                        autoFocus
                      />
                      <button type="submit" className="mt-2 w-full bg-navy text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-navy-700 transition-colors">
                        Search
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* CONSULTANT / WHATSAPP */}
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with a consultant on WhatsApp"
                title="Chat with a consultant on WhatsApp"
                className="hidden lg:flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-navy text-sm font-bold px-3 2xl:px-4 py-2 rounded-lg transition-colors"
              >
                <WhatsAppIcon className="w-[18px] h-[18px]" />
                <span className="hidden 2xl:inline">Chat with us</span>
              </a>

              {/* CTA */}
              <Link to="/training-categories" className="hidden md:inline-flex items-center bg-gold hover:bg-gold/90 text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                Enroll Now
              </Link>

              {/* MOBILE HAMBURGER */}
              <button
                onClick={() => setMobileOpen(s => !s)}
                className="xl:hidden p-2 text-navy hover:text-teal-deep hover:bg-teal-50 rounded-lg transition-colors"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen
                  ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── MEGA PANELS (desktop) ── */}
        <div className="hidden xl:block">
          {openMenu === 'categories' && (
            <CategoriesMega categories={visibleCategories} courses={courses} onClose={closeNow} onEnter={keepOpen} onLeave={scheduleClose} />
          )}
          {openMenu === 'venues' && (
            <VenuesMega venues={venues} onClose={closeNow} onEnter={keepOpen} onLeave={scheduleClose} />
          )}
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">

              {/* Categories accordion */}
              <div>
                <button onClick={() => setMobileSection(s => (s === 'categories' ? null : 'categories'))} className={mobileRow} aria-expanded={mobileSection === 'categories'}>
                  Training Categories <Chevron open={mobileSection === 'categories'} />
                </button>
                {mobileSection === 'categories' && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gold/60 pl-3">
                    <Link to="/training-categories" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-xs font-bold text-gold-dark hover:underline">
                      All Categories →
                    </Link>
                    {visibleCategories.map(cat => (
                      <Link key={cat.id} to={`/training-categories/${cat.slug}`} onClick={() => setMobileOpen(false)} className={mobileLink}>
                        <span>{cat.icon}</span><span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Venues accordion */}
              <div>
                <button onClick={() => setMobileSection(s => (s === 'venues' ? null : 'venues'))} className={mobileRow} aria-expanded={mobileSection === 'venues'}>
                  Venues <Chevron open={mobileSection === 'venues'} />
                </button>
                {mobileSection === 'venues' && (
                  <div className="ml-4 mt-1 border-l-2 border-gold/60 pl-3">
                    <Link to="/training-venues" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-xs font-bold text-gold-dark hover:underline">
                      All Venues →
                    </Link>
                    {groupVenuesByRegion(venues).map(g => (
                      <div key={g.region} className="mb-2">
                        <div className="px-3 pt-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-navy/60">{g.region}</div>
                        <div className="flex flex-wrap gap-1.5 px-3">
                          {g.venues.map(v => (
                            <Link
                              key={v.id}
                              to={`/training-categories?search=${encodeURIComponent(v.name)}`}
                              onClick={() => setMobileOpen(false)}
                              className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-deep transition-colors"
                            >
                              {v.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Plain links */}
              {staticNavItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'text-teal-deep bg-teal-50' : 'text-navy hover:text-teal-deep hover:bg-teal-50'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Mobile CTAs */}
              <div className="pt-2 border-t border-gray-100 flex gap-2 flex-wrap">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal text-navy text-sm font-bold px-4 py-2.5 rounded-lg"
                >
                  <WhatsAppIcon /> Chat with us
                </a>
                <Link
                  to="/training-categories"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center bg-gold text-navy text-sm font-bold px-4 py-2.5 rounded-lg"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
