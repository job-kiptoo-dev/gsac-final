import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

export default function Blog() {
  const { blogPosts } = useSite()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')

  const published = blogPosts.filter(p => p.published)
  const cats = [...new Set(published.map(p => p.category).filter(Boolean))]

  const filtered = published.filter(p => {
    const q = search.toLowerCase()
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
    const matchC = !selectedCat || p.category === selectedCat
    return matchQ && matchC
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      <div className="bg-navy py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-label justify-center text-white/50">
            <span className="w-2 h-2 bg-gold rounded-full" /> Insights & Ideas
          </div>
          <h1 className="text-4xl font-black text-white mb-4">GSAC Blog</h1>
          <div className="w-16 h-1.5 bg-gold rounded-full mx-auto mb-5" />
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Thought leadership on professional development, leadership, AI for business, and workforce transformation across Africa.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex gap-3 flex-wrap items-center">
          <button onClick={() => setSelectedCat('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!selectedCat ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-teal-50'}`}>
            All
          </button>
          {cats.map(c => (
            <button key={c} onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedCat === c ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-teal-50'}`}>
              {c}
            </button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…" className="ml-auto input-field max-w-xs text-sm py-1.5 px-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📝</div>
            <h3 className="text-xl font-bold mb-2">No posts found</h3>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="block mb-12 group">
                <div className="grid lg:grid-cols-2 gap-8 items-center card p-0 overflow-hidden">
                  <div className="h-64 lg:h-full overflow-hidden">
                    <img src={featured.image} alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop' }}
                    />
                  </div>
                  <div className="p-8">
                    <span className="tag-pill bg-gold-light text-gold-deep text-xs mb-3 inline-block">{featured.category}</span>
                    <h2 className="text-2xl font-black text-navy mb-3 group-hover:text-teal-deep transition-colors">{featured.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>By {featured.author}</span>
                      <span>{featured.date ? new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="card group">
                    <div className="h-44 overflow-hidden">
                      <img src={post.image} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop' }}
                      />
                    </div>
                    <div className="p-5">
                      <span className="tag-pill bg-teal-50 text-teal-deep text-xs mb-2 inline-block">{post.category}</span>
                      <h3 className="font-bold text-sm text-gray-800 mb-2 group-hover:text-teal-deep transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                        <span>{post.author}</span>
                        <span>{post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
