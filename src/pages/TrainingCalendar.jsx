import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CurrencyPrice from '../components/common/CurrencyPrice'
import { useSite } from '../context/SiteContext'

function formatMonthKey(key) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function TrainingCalendar() {
  const { courses, categories } = useSite()
  const [selectedCat, setSelectedCat] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')

  const publishedCourses = useMemo(
    () => courses.filter((course) => course.published && course.nextDate),
    [courses]
  )

  const months = useMemo(() => {
    return Array.from(new Set(publishedCourses.map((course) => course.nextDate?.substring(0, 7)).filter(Boolean))).sort()
  }, [publishedCourses])

  const filtered = publishedCourses.filter((course) => {
    const catOk = !selectedCat || course.categorySlug === selectedCat
    const fmtOk = !selectedFormat || course.format?.toLowerCase().includes(selectedFormat.toLowerCase())
    const monthOk = !selectedMonth || course.nextDate?.startsWith(selectedMonth)
    return catOk && fmtOk && monthOk
  })

  const groupedByMonth = filtered.reduce((acc, course) => {
    const month = course.nextDate?.substring(0, 7)
    if (!month) return acc
    if (!acc[month]) acc[month] = []
    acc[month].push(course)
    return acc
  }, {})

  return (
    <div>
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Schedule
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Training Calendar</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-5" />
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Plan ahead with our full schedule of upcoming courses. Available in-person, virtual, and in-house globally.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 py-5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 items-center">
          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-dark">
            <option value="">All Categories</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
          </select>
          <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-dark">
            <option value="">All Formats</option>
            <option value="In-Person">In-Person</option>
            <option value="Virtual">Virtual</option>
            <option value="In-House">In-House</option>
          </select>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-dark">
            <option value="">All Months</option>
            {months.map((month) => <option key={month} value={month}>{formatMonthKey(month)}</option>)}
          </select>
          <span className="text-xs text-gray-500 ml-auto">{filtered.length} courses found</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 py-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(selectedMonth === month ? '' : month)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedMonth === month ? 'bg-navy text-white' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-deep'}`}
            >
              {formatMonthKey(month)}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          {Object.keys(groupedByMonth).sort().length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-lg">No courses match your filters.</p>
              <p className="text-sm mt-2">Try adjusting your filters or <Link to="/contact" className="text-teal-deep hover:underline">contact us</Link> for custom dates.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.keys(groupedByMonth).sort().map((month) => (
                <div key={month}>
                  <div className="flex items-center gap-4 mb-5">
                    <h2 className="section-title-h2">{formatMonthKey(month)}</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-500">{groupedByMonth[month].length} courses</span>
                  </div>
                  <div className="space-y-3">
                    {groupedByMonth[month].map((course) => (
                      <div key={course.id} className="bg-white rounded-xl2 border border-gray-200 p-5 flex flex-col md:flex-row gap-4 items-start md:items-center hover:shadow-card transition-shadow">
                        <div className="flex-shrink-0 w-16 text-center bg-surface rounded-xl p-2 border border-gray-100">
                          <div className="text-xs text-gray-500 uppercase">{new Date(course.nextDate).toLocaleString('en-US', { month: 'short' })}</div>
                          <div className="text-2xl font-black text-navy">{new Date(course.nextDate).getDate()}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="tag-pill bg-teal-50 text-teal-deep text-xs">{course.category}</span>
                            <span className="tag-pill bg-gray-100 text-gray-600 text-xs">{course.level}</span>
                            <span className="tag-pill bg-navy-50 text-navy text-xs">{course.duration}</span>
                          </div>
                          <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{course.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            <span>📍 {course.location || 'Multiple Venues'}</span>
                            <span>💻 {course.format}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <CurrencyPrice amount={course.price} className="text-teal-deep font-black text-lg" />
                          <div className="text-xs text-gray-400 mb-2">per participant</div>
                          <Link to={`/course/${course.slug}`} className="btn-primary text-xs px-4 py-2">
                            View & Register
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-navy text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-black text-white mb-3">Prefer Custom Dates?</h2>
          <p className="text-white/70 text-sm mb-6">We offer in-house training at your premises — scheduled around your team's availability.</p>
          <Link to="/contact" className="btn-outline-white">Request In-House Training</Link>
        </div>
      </section>
    </div>
  )
}
