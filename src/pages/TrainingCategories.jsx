import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CurrencyPrice from '../components/common/CurrencyPrice'
import { useSite } from '../context/SiteContext'
import { categoryTile } from '../lib/categoryColors'

export default function TrainingCategories() {
  const { categories, courses } = useSite()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCat, setSelectedCat] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  const published = courses.filter(c => c.published)

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase()
    return published.filter(c =>
      (!q || c.title.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q)) &&
      (!selectedCat || c.categorySlug === selectedCat) &&
      (!selectedLevel || c.level === selectedLevel)
    )
  }, [published, search, selectedCat, selectedLevel])

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Our Expertise
          </div>
          <h1 className="text-4xl font-black text-white mb-4">All Training Categories</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-6" />
          <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
            {published.length}+ professional courses across {categories.length} high-impact disciplines. Find your path to mastery.
          </p>
          <div className="flex max-w-lg mx-auto">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by skill, topic or city…"
              className="flex-1 px-5 py-3 rounded-l-full border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white text-sm backdrop-blur"
            />
            <button className="bg-gold text-navy px-6 py-3 rounded-r-full font-bold hover:bg-gold/90 transition-colors text-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="bg-white border-b py-5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedCat('')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!selectedCat ? 'bg-navy text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-deep'}`}>
              All ({published.length})
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.slug)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCat === cat.slug ? 'bg-navy text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-deep'}`}>
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-surface border-b py-3 px-6">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap items-center">
          <span className="text-xs font-semibold text-gray-500">Filter:</span>
          <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="input-field max-w-[150px] text-sm py-1.5">
            <option value="">All Levels</option>
            {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
          </select>
          {(search || selectedCat || selectedLevel) && (
            <button onClick={() => { setSearch(''); setSelectedCat(''); setSelectedLevel('') }}
              className="text-xs text-teal-deep font-semibold hover:underline ml-2">
              Clear all filters ×
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400 font-medium">{filteredCourses.length} courses found</span>
        </div>
      </div>

      {/* Category Cards (when no search/filter) */}
      {!search && !selectedCat && !selectedLevel && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-title-h2 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map(cat => (
                <Link key={cat.id} to={`/training-categories/${cat.slug}`}
                  className={`p-5 rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer group ${categoryTile(cat.color)}`}>
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-xs leading-tight mb-1 group-hover:underline">{cat.name}</h3>
                  <div className="text-xs opacity-70">{cat.courseCount || published.filter(c => c.categorySlug === cat.slug).length} courses</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Courses Grid */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          {selectedCat && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{categories.find(c => c.slug === selectedCat)?.icon}</span>
              <h2 className="section-title-h2">{categories.find(c => c.slug === selectedCat)?.name}</h2>
            </div>
          )}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-xl font-bold mb-2">No courses match your search</h3>
              <p className="text-sm mb-4">Try different keywords or browse all categories</p>
              <button onClick={() => { setSearch(''); setSelectedCat(''); setSelectedLevel('') }} className="btn-secondary">Clear Filters</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <Link key={course.id} to={`/course/${course.slug}`} className="card group">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="tag-pill bg-teal-50 text-teal-deep text-xs">{course.category}</span>
                      <span className="text-xs text-gray-400">{course.duration}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-800 group-hover:text-teal-deep transition-colors mb-2 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{course.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="tag-pill bg-gray-100 text-gray-600 text-xs">{course.level}</span>
                      {course.format?.split('/').slice(0,1).map(f => (
                        <span key={f} className="tag-pill bg-gray-100 text-gray-600 text-xs">{f.trim()}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <CurrencyPrice amount={course.price} className="text-teal-deep font-black" />
                      {course.nextDate && (
                        <span className="text-xs text-gray-400">
                          📅 {new Date(course.nextDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
