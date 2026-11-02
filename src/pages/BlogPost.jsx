import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

export default function BlogPost() {
  const { slug } = useParams()
  const { blogPosts } = useSite()
  const post = blogPosts.find(p => p.slug === slug)
  const related = blogPosts.filter(p => p.published && p.slug !== slug).slice(0, 3)

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Post Not Found</h2>
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white/70">{post.category}</span>
          </div>
          <span className="tag-pill bg-gold text-navy text-xs mb-4 inline-block">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{post.date ? new Date(post.date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : ''}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.image && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-10 relative z-10">
          <img src={post.image} alt={post.title} className="w-full h-72 object-cover rounded-2xl shadow-xl"
            onError={e => { e.target.style.display = 'none' }} />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-teal-50 border-l-4 border-teal-dark rounded-r-xl p-4 mb-8 text-sm text-gray-700 italic">
          {post.excerpt}
        </div>
        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
          {(post.content || post.excerpt || '').split('\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-500">Share this article:</div>
          <div className="flex gap-3">
            {[
              { label: 'LinkedIn', href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}` },
              { label: 'Twitter', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}` },
              { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-xs bg-surface text-gray-700 hover:bg-navy hover:text-white px-3 py-1.5 rounded-full font-semibold transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <Link to="/blog" className="mt-8 inline-flex items-center gap-2 text-teal-deep font-semibold text-sm hover:underline">
          ← Back to Blog
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-title-h2 mb-6">More from GSAC Blog</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="card group">
                  <div className="h-40 overflow-hidden">
                    <img src={p.image} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop' }}
                    />
                  </div>
                  <div className="p-5">
                    <span className="tag-pill bg-teal-50 text-teal-deep text-xs mb-2 inline-block">{p.category}</span>
                    <h3 className="font-bold text-sm text-gray-800 group-hover:text-teal-deep transition-colors line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
