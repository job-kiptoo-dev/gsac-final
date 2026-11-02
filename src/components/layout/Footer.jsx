import React from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import logo from '../../assets/logo.png'


export default function Footer() {
  const { content, categories } = useSite()
  const { site } = content

  return (
    <footer className="bg-navy text-white">
      {/* Top divider bar */}
      <div className="h-1 bg-gold w-full" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* <div className="w-12 h-12 rounded-full flex items-center justify-center"> */}
 <img
                src={logo}
                alt="GSAC Logo"
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />          
                  {/* </div> */}
              <div>
                <div className="text-white font-black text-sm leading-tight">Global Skills</div>
                <div className="text-white/60 text-xs">Advancement Center</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              A premier capacity-building and EdTech partner that empowers organizations and professionals with transformative, high-impact training across Africa and beyond.
            </p>
            <div className="flex gap-3">
              {[
                { href: site.facebook, icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/> },
                { href: site.twitter, icon: <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/> },
                { href: site.linkedin, icon: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></> },
                { href: site.instagram, icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="none" stroke="currentColor" strokeWidth="2" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line fill="none" stroke="currentColor" strokeWidth="2" x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Training Calendar', to: '/training-calendar' },
                { label: 'Training Categories', to: '/training-categories' },
                { label: 'Training Venues', to: '/training-venues' },
                { label: 'Training Formats', to: '/training-formats' },
                { label: 'About GSAC', to: '/about' },
                { label: 'Blog & Insights', to: '/blog' },
                { label: 'FAQs', to: '/faqs' },
                { label: 'Join Our Faculty', to: '/trainer-recruitment' },
                { label: 'Contact Us', to: '/contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-gold text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Training Areas</h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 8).map(cat => (
                <li key={cat.id}>
                  <Link to={`/training-categories/${cat.slug}`}
                    className="text-white/70 hover:text-gold text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-navy rounded-full flex-shrink-0" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact GSAC</h3>
            <div className="space-y-4">
              {[
                { icon: '📍', label: 'Headquarters', value: site.address },
                { icon: '📞', label: 'Phone / WhatsApp', value: site.phone, href: `tel:${site.phone}` },
                { icon: '✉️', label: 'Email', value: site.email, href: `mailto:${site.email}` },
                { icon: '🕐', label: 'Office Hours', value: site.hours },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{c.icon}</span>
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-wide">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} className="text-white/80 text-sm hover:text-gold transition-colors">{c.value}</a>
                    ) : (
                      <div className="text-white/80 text-sm">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${site.whatsapp?.replace(/\D/g, '')}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 bg-teal hover:bg-teal-dark text-navy text-sm font-bold px-4 py-2.5 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Global Skills Advancement Center. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span>Empowering Organizations. Advancing Careers.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
