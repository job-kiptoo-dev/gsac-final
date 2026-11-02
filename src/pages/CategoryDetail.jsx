import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CurrencyPrice from '../components/common/CurrencyPrice'
import { useSite } from '../context/SiteContext'
import { categoryHero } from '../lib/categoryColors'

export default function CategoryDetail() {
  const { slug } = useParams()
  const { categories, courses } = useSite()
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const [format, setFormat] = useState('')

  const category = categories.find(c => c.slug === slug)
  const categoryCourses = useMemo(() =>
    courses.filter(c => c.published && c.categorySlug === slug),
    [courses, slug]
  )

  const filtered = categoryCourses.filter(c => {
    const q = search.toLowerCase()
    return (
      (!q || c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)) &&
      (!level || c.level === level) &&
      (!format || c.format?.toLowerCase().includes(format.toLowerCase()))
    )
  })

  if (!category) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Category Not Found</h2>
        <Link to="/training-categories" className="btn-primary">All Categories</Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className={`bg-gradient-to-br ${categoryHero(category.color)} py-16 px-6`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-4">
            <Link to="/training-categories" className="hover:text-white">All Categories</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-5xl flex-shrink-0">{category.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{category.name}</h1>
              <p className="text-white/80 text-sm max-w-2xl leading-relaxed mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                <span>📚 {categoryCourses.length} courses available</span>
                <span>💻 In-Person & Virtual</span>
                <span>🏅 Internationally Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b py-4 px-6 sticky top-[105px] z-30">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap items-center">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses…" className="input-field max-w-xs text-sm py-2 px-4" />
          <select value={level} onChange={e => setLevel(e.target.value)} className="input-field max-w-[140px] text-sm py-2">
            <option value="">All Levels</option>
            {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={format} onChange={e => setFormat(e.target.value)} className="input-field max-w-[160px] text-sm py-2">
            <option value="">All Formats</option>
            <option value="In-Person">In-Person</option>
            <option value="Virtual">Virtual</option>
          </select>
          <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} courses</span>
        </div>
      </div>

      {/* Courses */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-xl font-bold mb-2">No courses match your filter</h3>
              <button onClick={() => { setSearch(''); setLevel(''); setFormat('') }} className="btn-secondary mt-4">Clear filters</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <Link key={course.id} to={`/course/${course.slug}`} className="card group">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="tag-pill bg-teal-50 text-teal-deep text-xs">{course.level}</span>
                      <span className="text-xs text-gray-400">{course.duration}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-800 group-hover:text-teal-deep transition-colors mb-2 line-clamp-2 leading-snug">
                      {course.title.replace(/^Training on /i, '')}
                    </h3>
                    {course.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.format?.split('/').map(f => (
                        <span key={f} className="tag-pill bg-gray-100 text-gray-600 text-xs">{f.trim()}</span>
                      ))}
                      {course.location && (
                        <span className="tag-pill bg-gray-100 text-gray-600 text-xs">📍 {course.location.split(',')[0]}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <CurrencyPrice amount={course.price} className="text-teal-deep font-black" />
                      <span className="text-xs text-teal-deep font-semibold group-hover:underline flex items-center gap-1">
                        Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title-h2 mb-6">Other Training Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.filter(c => c.slug !== slug).map(cat => (
              <Link key={cat.id} to={`/training-categories/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-gray-200 hover:border-teal-dark hover:bg-teal-50 text-sm font-medium text-gray-700 hover:text-teal-deep transition-all">
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
