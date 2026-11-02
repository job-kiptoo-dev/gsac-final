# GSAC Frontend → Supabase API Map

## Architecture Overview

```
Browser (React/Vite)
    │
    ├── src/lib/supabase.js          ← Supabase client (createClient)
    ├── src/api/index.js             ← All database calls (api.*)
    └── src/context/SiteContext.jsx  ← Global state + CRUD wrappers
```

All frontend API calls flow through `src/api/index.js`. The Supabase PostgREST API is auto-generated from the schema — no custom backend needed.

---

## Base URL
```
https://<your-project-id>.supabase.co/rest/v1/<table>
```
This is handled automatically by the `@supabase/supabase-js` client. You never call it directly.

---

## Authentication (`api.auth.*`)

| Action | Supabase Call | Frontend Usage |
|--------|--------------|----------------|
| Login | `supabase.auth.signInWithPassword({ email, password })` | `api.auth.login(email, password)` |
| Register | `supabase.auth.signUp({ email, password, options: { data: { name } } })` | `api.auth.register({ name, email, password })` |
| Logout | `supabase.auth.signOut()` | `api.auth.logout()` |
| Get current user | `supabase.auth.getUser()` + profiles lookup | `api.auth.getUser()` |
| Auth listener | `supabase.auth.onAuthStateChange()` | `api.auth.onAuthChange(callback)` |

**Roles:** Stored in `profiles.role` (values: `'user'` | `'admin'`). Admin role grants full RLS access to all tables.

---

## Courses (`api.courses.*`)

| Frontend Page | API Call | Supabase Table | Notes |
|--------------|----------|---------------|-------|
| Home — featured | `api.courses.list({ featured: true })` | `courses` | `?published=eq.true&featured=eq.true` |
| Training Calendar | `api.courses.list()` | `courses` | sorted by `next_date` |
| Category page | `api.courses.list({ categorySlug })` | `courses` | `?category_slug=eq.<slug>` |
| Search | `api.courses.list({ search: query })` | `courses` | `or=(title.ilike,description.ilike)` |
| Course detail | `api.courses.getBySlug(slug)` | `courses` | |
| Admin — create | `api.courses.create(data)` | `courses` | Admin RLS required |
| Admin — update | `api.courses.update(id, data)` | `courses` | Admin RLS required |
| Admin — delete | `api.courses.delete(id)` | `courses` | Admin RLS required |

**Field mapping (camelCase → snake_case for DB):**
```
categorySlug → category_slug
nextDate     → next_date
courseCount  → course_count
```

---

## Categories (`api.categories.*`)

| Action | Call |
|--------|------|
| List published | `api.categories.list()` |
| List all (admin) | `api.categories.listAll()` |
| By slug | `api.categories.getBySlug(slug)` |
| CRUD (admin) | `api.categories.create/update/delete` |

---

## Venues (`api.venues.*`)

| Action | Call |
|--------|------|
| List active | `api.venues.list()` |
| List all (admin) | `api.venues.listAll()` |
| CRUD (admin) | `api.venues.create/update/delete` |

---

## FAQs (`api.faqs.*`)

| Action | Call |
|--------|------|
| List active | `api.faqs.list()` |
| CRUD (admin) | `api.faqs.create/update/delete` |

---

## Blog Posts (`api.blog.*`)

| Action | Call |
|--------|------|
| List published | `api.blog.list({ page, size })` |
| Single post | `api.blog.getBySlug(slug)` |
| CRUD (admin) | `api.blog.create/update/delete` |

---

## Partners (`api.partners.*`)

| Action | Call |
|--------|------|
| List active | `api.partners.list()` |
| CRUD (admin) | `api.partners.create/update/delete` |

---

## Testimonials (`api.testimonials.*`)

| Action | Call |
|--------|------|
| List approved | `api.testimonials.list()` |
| CRUD (admin) | `api.testimonials.create/update/delete` |

---

## Site Content & Stats (`api.siteContent.*`)

| Action | Call | Table |
|--------|------|-------|
| Read all | `api.siteContent.get()` | `site_content` + `stats` |
| Update site info (admin) | `api.siteContent.updateSite(data)` | `site_content` |
| Update stats (admin) | `api.siteContent.updateStats(data)` | `stats` |

Both tables are singletons (single row, `id=1`).

---

## Form Submissions (Public — no auth required)

### Enrollment (`api.enrollments.*`)
```js
// Submit (any visitor)
await api.enrollments.submit({
  courseId, courseTitle, name, email, phone, organization, format, message
})
// → inserts into enrollments table, status = 'Pending'

// Admin: list all
await api.enrollments.list({ status: 'Pending', page: 0 })

// Admin: update status
await api.enrollments.updateStatus(id, 'Confirmed')

// Admin: delete
await api.enrollments.delete(id)
```

### Contact (`api.contact.*`)
```js
await api.contact.submit({ name, email, phone, organization, subject, message })
// → inserts into contact_submissions table, status = 'New'
```

### Trainer Applications (`api.trainerApplications.*`)
```js
await api.trainerApplications.submit({ name, email, phone, expertise, linkedin, bio })
// → inserts into trainer_applications table, status = 'New'
```

---

## Row Level Security Summary

```sql
-- Public read (no auth)
courses WHERE published = true
categories WHERE published = true
venues WHERE active = true
faqs WHERE active = true
blog_posts WHERE published = true
partners WHERE active = true
testimonials WHERE approved = true
site_content (all rows)
stats (all rows)

-- Public insert (no auth)
enrollments, contact_submissions, trainer_applications

-- Authenticated only
profiles (own row only)

-- Admin only (role = 'admin' in profiles)
ALL operations on ALL tables
```

---

## Frontend Integration Pattern

```js
// src/api/index.js — usage example
import { api } from '../api/index'

// In a React component:
const [courses, setCourses] = useState([])

useEffect(() => {
  api.courses.list({ featured: true }).then(({ data, error }) => {
    if (data) setCourses(data)
    if (error) console.error(error)
  })
}, [])

// Form submit:
const handleSubmit = async (formData) => {
  const { error } = await api.contact.submit(formData)
  if (!error) setSent(true)
}
```

---

## Supabase Dashboard Shortcuts

| Task | Path |
|------|------|
| View all tables | Table Editor |
| Run SQL | SQL Editor |
| See auth users | Authentication → Users |
| Check RLS policies | Authentication → Policies |
| API docs (auto-generated) | API Docs (left sidebar) |
| Edge Functions (if needed) | Edge Functions |
