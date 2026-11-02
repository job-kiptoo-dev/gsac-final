// src/api/index.js
// ─────────────────────────────────────────────────────────────
// GSAC Supabase API — all database operations in one place
// ─────────────────────────────────────────────────────────────

import { supabase, sb } from '../lib/supabase'

export const api = {

  // ─── AUTH ───────────────────────────────────────────────────

  auth: {
    /**
     * Sign in with email + password.
     * Returns { success, user, error }
     */
    async login(email, password) {
      if (!supabase) {
        return { success: false, error: 'Supabase is not configured.' }
      }

      const { data, error } = await sb(s =>
        s.auth.signInWithPassword({ email, password })
      )

      if (error) {
        console.error('[Auth] Login error:', error.message)
        return { success: false, error: error.message }
      }

      // data.user can be null if email not confirmed yet
      if (!data?.user) {
        return {
          success: false,
          error: 'Login failed. Please check your credentials or confirm your email.',
        }
      }

      // Fetch profile row to get the role field
      const { data: profile } = await sb(s =>
        s.from('profiles').select('*').eq('id', data.user.id).single()
      )

      return {
        success: true,
        user: { ...data.user, ...(profile || {}) },
      }
    },

    /**
     * Register a new user.
     * Handles both "email confirmation required" and "auto-confirm" Supabase setups.
     * Returns { success, user, needsConfirmation, error }
     */
    async register({ name, email, password, organization }) {
      if (!supabase) {
        return { success: false, error: 'Supabase is not configured.' }
      }

      const { data, error } = await sb(s =>
        s.auth.signUp({
          email,
          password,
          options: {
            data: { name, organization: organization || '' },
          },
        })
      )

      if (error) {
        console.error('[Auth] Register error:', error.message)
        return { success: false, error: error.message }
      }

      // When email confirmation is enabled in Supabase:
      //   data.user exists but data.user.identities is [] (not yet confirmed)
      //   data.session is null
      // When email confirmation is DISABLED (auto-confirm):
      //   data.user exists with identities populated
      //   data.session exists
      const needsConfirmation =
        data?.user?.identities !== undefined &&
        data.user.identities.length === 0

      if (needsConfirmation) {
        // User was created but needs to confirm email before they can log in
        return {
          success: true,
          needsConfirmation: true,
          user: null,
          message: 'Registration successful! Please check your email to confirm your account before signing in.',
        }
      }

      if (!data?.user) {
        return {
          success: false,
          error: 'Registration failed. Please try again.',
        }
      }

      return {
        success: true,
        needsConfirmation: false,
        user: data.user,
      }
    },

    /** Sign out the current user */
    async logout() {
      if (!supabase) return
      await sb(s => s.auth.signOut())
    },

    /**
     * Get the currently authenticated user with their profile.
     * Returns null if not logged in.
     */
    async getUser() {
      if (!supabase) return null
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) return null

        const { data: profile } = await sb(s =>
          s.from('profiles').select('*').eq('id', data.user.id).single()
        )

        return { ...data.user, ...(profile || {}) }
      } catch {
        return null
      }
    },

    /**
     * Subscribe to auth state changes.
     * Always returns a subscription object that can be unsubscribed safely.
     */
    onAuthChange(callback) {
      if (!supabase) {
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
      return supabase.auth.onAuthStateChange(callback)
    },
  },

  // ─── SITE CONTENT ────────────────────────────────────────────

  siteContent: {
    async get() {
      const [contentRes, statsRes] = await Promise.all([
        sb(s => s.from('site_content').select('*').eq('id', 1).single()),
        sb(s => s.from('stats').select('*').eq('id', 1).single()),
      ])
      return {
        site: contentRes.data || {},
        stats: statsRes.data || {},
      }
    },
    async updateSite(data) {
      return sb(s =>
        s.from('site_content')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', 1)
      )
    },
    async updateStats(data) {
      return sb(s =>
        s.from('stats')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', 1)
      )
    },
  },

  // ─── PARTNERS ────────────────────────────────────────────────

  partners: {
    async list() {
      return sb(s => s.from('partners').select('*').eq('active', true).order('sort_order'))
    },
    async listAll() {
      return sb(s => s.from('partners').select('*').order('sort_order'))
    },
    async create(data) {
      return sb(s => s.from('partners').insert(data).select().single())
    },
    async update(id, data) {
      return sb(s => s.from('partners').update(data).eq('id', id).select().single())
    },
    async delete(id) {
      return sb(s => s.from('partners').delete().eq('id', id))
    },
  },

  // ─── TESTIMONIALS ────────────────────────────────────────────

  testimonials: {
    async list() {
      return sb(s =>
        s.from('testimonials').select('*').eq('approved', true).order('sort_order')
      )
    },
    async listAll() {
      return sb(s => s.from('testimonials').select('*').order('sort_order'))
    },
    async create(data) {
      return sb(s => s.from('testimonials').insert(data).select().single())
    },
    async update(id, data) {
      return sb(s => s.from('testimonials').update(data).eq('id', id).select().single())
    },
    async delete(id) {
      return sb(s => s.from('testimonials').delete().eq('id', id))
    },
  },

  // ─── CATEGORIES ──────────────────────────────────────────────

  categories: {
    async list() {
      return sb(s =>
        s.from('categories').select('*').eq('published', true).order('sort_order')
      )
    },
    async listAll() {
      return sb(s => s.from('categories').select('*').order('sort_order'))
    },
    async getBySlug(slug) {
      return sb(s => s.from('categories').select('*').eq('slug', slug).single())
    },
    async create(data) {
      return sb(s => s.from('categories').insert(data).select().single())
    },
    async update(id, data) {
      return sb(s => s.from('categories').update(data).eq('id', id).select().single())
    },
    async delete(id) {
      return sb(s => s.from('categories').delete().eq('id', id))
    },
  },

  // ─── COURSES ─────────────────────────────────────────────────

  courses: {
    async list({ featured, categorySlug, search, published = true } = {}) {
      return sb(s => {
        let q = s.from('courses').select('*')
        if (published !== null && published !== undefined) q = q.eq('published', published)
        if (featured !== undefined) q = q.eq('featured', featured)
        if (categorySlug) q = q.eq('category_slug', categorySlug)
        if (search) {
          q = q.or(
            `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
          )
        }
        return q.order('next_date', { ascending: true, nullsFirst: false })
      })
    },
    async getBySlug(slug) {
      return sb(s => s.from('courses').select('*').eq('slug', slug).single())
    },
    async getById(id) {
      return sb(s => s.from('courses').select('*').eq('id', id).single())
    },
    async create(data) {
      return sb(s =>
        s.from('courses')
          .insert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single()
      )
    },
    async update(id, data) {
      return sb(s =>
        s.from('courses')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()
      )
    },
    async delete(id) {
      return sb(s => s.from('courses').delete().eq('id', id))
    },
  },

  // ─── VENUES ──────────────────────────────────────────────────

  venues: {
    async list() {
      return sb(s => s.from('venues').select('*').eq('active', true).order('sort_order'))
    },
    async listAll() {
      return sb(s => s.from('venues').select('*').order('sort_order'))
    },
    async create(data) {
      return sb(s => s.from('venues').insert(data).select().single())
    },
    async update(id, data) {
      return sb(s => s.from('venues').update(data).eq('id', id).select().single())
    },
    async delete(id) {
      return sb(s => s.from('venues').delete().eq('id', id))
    },
  },

  // ─── FAQS ────────────────────────────────────────────────────

  faqs: {
    async list() {
      return sb(s => s.from('faqs').select('*').eq('active', true).order('sort_order'))
    },
    async listAll() {
      return sb(s => s.from('faqs').select('*').order('sort_order'))
    },
    async create(data) {
      return sb(s => s.from('faqs').insert(data).select().single())
    },
    async update(id, data) {
      return sb(s => s.from('faqs').update(data).eq('id', id).select().single())
    },
    async delete(id) {
      return sb(s => s.from('faqs').delete().eq('id', id))
    },
  },

  // ─── BLOG POSTS ──────────────────────────────────────────────

  blog: {
    async list({ page = 0, size = 12 } = {}) {
      return sb(s =>
        s.from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
          .range(page * size, (page + 1) * size - 1)
      )
    },
    async listAll() {
      return sb(s =>
        s.from('blog_posts').select('*').order('date', { ascending: false })
      )
    },
    async getBySlug(slug) {
      return sb(s => s.from('blog_posts').select('*').eq('slug', slug).single())
    },
    async create(data) {
      return sb(s =>
        s.from('blog_posts')
          .insert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single()
      )
    },
    async update(id, data) {
      return sb(s =>
        s.from('blog_posts')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()
      )
    },
    async delete(id) {
      return sb(s => s.from('blog_posts').delete().eq('id', id))
    },
  },

  // ─── ENROLLMENTS ─────────────────────────────────────────────

  enrollments: {
    async submit({ courseId, courseTitle, name, email, phone, organization, format, message }) {
      return sb(s =>
        s.from('enrollments')
          .insert({
            course_id: courseId || null,
            course_title: courseTitle,
            name,
            email,
            phone,
            organization,
            format,
            message,
            status: 'Pending',
          })
          .select()
          .single()
      )
    },
    async list({ status, page = 0, size = 50 } = {}) {
      return sb(s => {
        let q = s.from('enrollments').select('*, courses(title, slug, price)')
        if (status) q = q.eq('status', status)
        return q
          .order('created_at', { ascending: false })
          .range(page * size, (page + 1) * size - 1)
      })
    },
    async updateStatus(id, status) {
      return sb(s =>
        s.from('enrollments').update({ status }).eq('id', id).select().single()
      )
    },
    async delete(id) {
      return sb(s => s.from('enrollments').delete().eq('id', id))
    },
  },

  // ─── INVOICES ────────────────────────────────────────────────

  invoices: {
    async sendCourseInvoice(payload) {
      if (!supabase) {
        return { data: { success: false, emailed: false, reason: 'supabase_not_configured' }, error: new Error('Supabase functions not configured') }
      }
      try {
        return await supabase.functions.invoke('send-course-invoice', { body: payload })
      } catch (error) {
        return { data: null, error }
      }
    },
  },

  // ─── CONTACT ─────────────────────────────────────────────────

  contact: {
    async submit({ name, email, phone, organization, subject, message }) {
      return sb(s =>
        s.from('contact_submissions')
          .insert({
            name,
            email,
            phone,
            organization,
            subject,
            message,
            status: 'New',
          })
          .select()
          .single()
      )
    },
    async list() {
      return sb(s =>
        s.from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
      )
    },
    async updateStatus(id, status) {
      return sb(s =>
        s.from('contact_submissions').update({ status }).eq('id', id).select().single()
      )
    },
    async delete(id) {
      return sb(s => s.from('contact_submissions').delete().eq('id', id))
    },
  },

  // ─── TRAINER APPLICATIONS ────────────────────────────────────

  trainerApplications: {
    async submit({ name, email, phone, expertise, linkedin, bio }) {
      return sb(s =>
        s.from('trainer_applications')
          .insert({
            name,
            email,
            phone,
            expertise,
            linkedin,
            bio,
            status: 'New',
          })
          .select()
          .single()
      )
    },
    async list() {
      return sb(s =>
        s.from('trainer_applications')
          .select('*')
          .order('created_at', { ascending: false })
      )
    },
    async updateStatus(id, status) {
      return sb(s =>
        s.from('trainer_applications').update({ status }).eq('id', id).select().single()
      )
    },
    async delete(id) {
      return sb(s => s.from('trainer_applications').delete().eq('id', id))
    },
  },

  // ─── PROFILES ────────────────────────────────────────────────

  profiles: {
    async list() {
      return sb(s =>
        s.from('profiles').select('*').order('created_at', { ascending: false })
      )
    },
    async update(id, data) {
      return sb(s =>
        s.from('profiles').update(data).eq('id', id).select().single()
      )
    },
  },
}
