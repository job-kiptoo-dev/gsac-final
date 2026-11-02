import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gsac.org').replace(/\/$/, '')

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) element.setAttribute(key, value)
  })
}

function upsertLink(selector, attrs) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) element.setAttribute(key, value)
  })
}

function setJsonLd(id, data) {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function removeJsonLd(id) {
  const script = document.getElementById(id)
  if (script) script.remove()
}

export default function SEOManager() {
  const location = useLocation()
  const { content, courses, categories, faqs, blogPosts } = useSite()
  const pathname = location.pathname
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`
  const course = useMemo(() => courses.find((item) => pathname === `/course/${item.slug}`), [courses, pathname])
  const category = useMemo(() => categories.find((item) => pathname === `/training-categories/${item.slug}`), [categories, pathname])
  const post = useMemo(() => blogPosts.find((item) => pathname === `/blog/${item.slug}`), [blogPosts, pathname])
  const site = content.site

  useEffect(() => {
    const defaults = {
      title: 'Global Skills Advancement Center | Corporate Training, Professional Courses & Capacity Building',
      description: 'GSAC delivers professional training, corporate learning, in-house programs, virtual courses, and capability building for organizations across Kenya, Africa, and international markets.',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1800&h=1000&fit=crop&q=80',
      type: 'website',
    }

    let meta = { ...defaults }

    if (pathname === '/training-calendar') {
      meta = {
        ...meta,
        title: 'Training Calendar | Upcoming GSAC Courses, Workshops & Certification Programs',
        description: 'View upcoming GSAC training dates, formats, locations, and professional development programs across leadership, finance, M&E, technology, project management, and more.',
      }
    } else if (pathname === '/training-categories') {
      meta = {
        ...meta,
        title: 'Training Categories | GSAC Professional Courses by Discipline',
        description: 'Explore GSAC training categories including leadership, finance, HR, M&E, technology, procurement, digital transformation, and public sector learning programs.',
      }
    } else if (category) {
      meta = {
        ...meta,
        title: `${category.name} Courses | GSAC Professional Training`,
        description: category.description || defaults.description,
        type: 'article',
      }
    } else if (course) {
      meta = {
        ...meta,
        title: `${course.title} | GSAC Course Details`,
        description: course.description || defaults.description,
        type: 'article',
      }
    } else if (pathname === '/training-venues') {
      meta = {
        ...meta,
        title: 'Training Venues | GSAC Locations Across Africa & Beyond',
        description: 'Discover GSAC training venues in 26 cities across 15 countries — Nairobi, Mombasa, Kigali, Kampala, Johannesburg, Cape Town, Accra, Dubai, Singapore, London and more.',
      }
    } else if (pathname === '/training-formats') {
      meta = {
        ...meta,
        title: 'Training Formats | In-Person, Virtual, Hybrid & In-House Learning',
        description: 'Choose the best training format for your organization: in-person workshops, virtual live learning, hybrid delivery, or customized in-house programs.',
      }
    } else if (pathname === '/about') {
      meta = {
        ...meta,
        title: 'About GSAC | Global Skills Advancement Center',
        description: 'Learn about Global Skills Advancement Center, our mission, client impact, training philosophy, and our work building future-ready teams across Africa.',
      }
    } else if (pathname === '/contact') {
      meta = {
        ...meta,
        title: 'Contact GSAC | Talk to a Training Advisor',
        description: 'Contact GSAC for course registration, customized in-house training, partnership enquiries, virtual programs, and professional learning support.',
      }
    } else if (pathname === '/faqs') {
      meta = {
        ...meta,
        title: 'FAQs | GSAC Training, Registration, Certificates & Support',
        description: 'Answers to common GSAC questions about registration, payments, certificates, course formats, in-house training, and learner support.',
      }
    } else if (pathname === '/blog') {
      meta = {
        ...meta,
        title: 'GSAC Blog | Training Insights, Leadership, AI & Workforce Development',
        description: 'Read insights on professional development, monitoring and evaluation, AI for business, leadership, and capability building across Africa.',
      }
    } else if (post) {
      meta = {
        ...meta,
        title: `${post.title} | GSAC Blog`,
        description: post.excerpt || defaults.description,
        image: post.image || defaults.image,
        type: 'article',
      }
    }

    document.title = meta.title
    upsertMeta('meta[name="description"]', { name: 'description', content: meta.description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: meta.description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: meta.type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: meta.image })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: meta.image })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: pathname.startsWith('/admin') || pathname === '/login' ? 'noindex,nofollow' : 'index,follow,max-image-preview:large' })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: 'GSAC, professional training, Kenya corporate training, Africa capacity building, leadership courses, monitoring and evaluation training, AI for business training, project management courses' })
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Global Skills Advancement Center' })
    upsertMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'KE' })
    upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Nairobi, Kenya' })
    upsertMeta('meta[name="DC.title"]', { name: 'DC.title', content: meta.title })
    upsertMeta('meta[name="DC.description"]', { name: 'DC.description', content: meta.description })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': ['EducationalOrganization', 'Organization'],
      name: site.name,
      url: SITE_URL,
      email: site.email,
      telephone: site.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address,
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      sameAs: [site.facebook, site.twitter, site.linkedin, site.instagram, site.youtube].filter(Boolean),
      areaServed: ['Kenya', 'East Africa', 'Africa', 'Global'],
      slogan: site.tagline,
    }

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/training-categories?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }

    setJsonLd('gsac-org-schema', organizationSchema)
    setJsonLd('gsac-website-schema', websiteSchema)

    if (course) {
      setJsonLd('gsac-page-schema', {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        provider: {
          '@type': 'Organization',
          name: site.name,
          sameAs: SITE_URL,
        },
        courseMode: course.format,
        educationalLevel: course.level,
        inLanguage: 'en',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: Number(course.price || 0),
          availability: 'https://schema.org/InStock',
          url: canonical,
        },
      })
    } else if (pathname === '/faqs') {
      setJsonLd('gsac-page-schema', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.slice(0, 12).map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      })
    } else if (post) {
      setJsonLd('gsac-page-schema', {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: post.author || site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: site.name,
        },
        mainEntityOfPage: canonical,
      })
    } else if (category) {
      setJsonLd('gsac-page-schema', {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.name} Courses`,
        description: category.description,
        url: canonical,
      })
    } else {
      removeJsonLd('gsac-page-schema')
    }

    return () => {
      if (!course && !post && !category && pathname !== '/faqs') removeJsonLd('gsac-page-schema')
    }
  }, [canonical, categories, category, content.site, course, faqs, pathname, post, site.name, site.email, site.phone, site.address, site.facebook, site.twitter, site.linkedin, site.instagram, site.youtube, site.tagline])

  return null
}
