import React from 'react'

const icons = {
  facebook: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
  twitter: <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />,
  linkedin: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
  instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path fill="none" stroke="currentColor" strokeWidth="2" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line fill="none" stroke="currentColor" strokeWidth="2" x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
  youtube: <><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></>,
}

export default function SocialRail({ site }) {
  const links = [
    { key: 'facebook', href: site.facebook, label: 'Facebook' },
    { key: 'twitter', href: site.twitter, label: 'X / Twitter' },
    { key: 'linkedin', href: site.linkedin, label: 'LinkedIn' },
    { key: 'instagram', href: site.instagram, label: 'Instagram' },
    { key: 'youtube', href: site.youtube, label: 'YouTube' },
  ].filter((item) => item.href)

  if (!links.length) return null

  return (
    <div className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3">
      <div className="h-14 w-px bg-navy/30" />
      {links.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="w-11 h-11 rounded-full bg-white/85 backdrop-blur shadow-md border border-white/80 text-teal-deep hover:bg-navy hover:text-white transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{icons[item.key]}</svg>
        </a>
      ))}
      <div className="h-14 w-px bg-navy/30" />
    </div>
  )
}
