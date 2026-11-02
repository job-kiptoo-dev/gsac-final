import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { groupVenuesByRegion } from '../lib/venues'

function PinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a8 8 0 00-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  )
}

function VenueCard({ venue }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = venue.image && !imgFailed
  return (
    <div className="card group flex flex-col">
      {/* Photo if the admin supplied one, otherwise a brand panel */}
      <div className="relative h-32 overflow-hidden bg-navy-gradient">
        {showImage ? (
          <>
            <img
              src={venue.image}
              alt={`${venue.name}, ${venue.country}`}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute -right-3 -bottom-8 text-[8rem] leading-none font-black text-white/[0.06] select-none">
              {venue.name?.[0]}
            </div>
            <div className="absolute top-3 right-3 text-gold"><PinIcon className="w-5 h-5" /></div>
          </>
        )}
        <span className="absolute top-3 left-3 tag-pill bg-gold text-navy text-[11px]">{venue.type || 'Venue'}</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black text-navy leading-tight">{venue.name}</h3>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-deep mt-1">
          <PinIcon className="w-3.5 h-3.5" /> {venue.country}
        </div>
        {venue.description && (
          <p className="text-gray-500 text-sm leading-relaxed mt-3 flex-1">{venue.description}</p>
        )}
        <Link
          to={`/training-categories?search=${encodeURIComponent(venue.name)}`}
          className="mt-4 text-teal-deep text-xs font-bold hover:underline"
        >
          Browse courses in {venue.name} →
        </Link>
      </div>
    </div>
  )
}

export default function TrainingVenues() {
  const { venues } = useSite()
  const [region, setRegion] = useState('')
  const [query, setQuery] = useState('')

  const allGroups = useMemo(() => groupVenuesByRegion(venues), [venues])
  const totalCities = allGroups.reduce((n, g) => n + g.venues.length, 0)
  const totalCountries = new Set(allGroups.flatMap(g => g.countries)).size

  const q = query.trim().toLowerCase()
  const groups = useMemo(() =>
    allGroups
      .filter(g => !region || g.region === region)
      .map(g => ({
        ...g,
        venues: g.venues.filter(v => !q || v.name?.toLowerCase().includes(q) || v.country?.toLowerCase().includes(q)),
      }))
      .filter(g => g.venues.length > 0),
  [allGroups, region, q])

  const tabClass = (active) =>
    `px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
      active ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-deep'
    }`

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/60">
            <span className="w-2 h-2 bg-gold rounded-full" /> Where We Train
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Training Venues</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-5" />
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            {totalCities} cities across {totalCountries} countries — from Kenya to the Middle East, Asia, Europe and South America.
            Every venue is selected for comfort, connectivity and learning effectiveness.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 sticky top-[100px] z-30">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap items-center">
          <button onClick={() => setRegion('')} className={tabClass(region === '')}>All</button>
          {allGroups.map(g => (
            <button key={g.region} onClick={() => setRegion(g.region)} className={tabClass(region === g.region)}>
              {g.region} <span className="opacity-60 text-xs">({g.venues.length})</span>
            </button>
          ))}
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by city or country…"
            className="ml-auto input-field max-w-xs text-sm py-1.5 px-4"
          />
        </div>
      </div>

      {/* Venues by region */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {groups.length > 0 ? groups.map(g => (
            <div key={g.region}>
              <div className="flex items-end justify-between flex-wrap gap-2 mb-6 pb-3 border-b-2 border-gold/60">
                <h2 className="text-2xl font-black text-navy">{g.region}</h2>
                <div className="text-xs font-semibold text-gray-500">
                  {g.venues.length} {g.venues.length === 1 ? 'venue' : 'venues'}{g.countries.length === 1 && g.countries[0] === g.region ? '' : ` · ${g.countries.join(', ')}`}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {g.venues.map(venue => <VenueCard key={venue.id} venue={venue} />)}
              </div>
            </div>
          )) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">No venues found</h3>
              <p className="text-sm">Try a different city, country or region.</p>
            </div>
          )}
        </div>
      </section>

      {/* In-House Banner */}
      <section className="py-14 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-3xl font-black mb-4 text-white">Can't Travel? We Come to You.</h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            GSAC delivers in-house training at your organization's premises for groups of 5 or more — anywhere in the world. Same quality, same certificate, zero travel required.
          </p>
          <Link to="/contact" className="btn-outline-white">Request In-House Training</Link>
        </div>
      </section>
    </div>
  )
}
