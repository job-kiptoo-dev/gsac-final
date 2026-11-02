# GSAC — Global Skills Advancement Center

React + Vite front-end, Supabase back-end (Postgres, Auth, Edge Functions).
Everything on the public site — courses, categories, venues, FAQs, blog, testimonials, stats, site
copy — is edited in **/admin** and saved straight to Supabase, so what an admin changes is what
visitors see.

**Brand:** Deep Navy `#0B1F3A` · Champagne Gold `#C9A96E` · White · Light Teal `#7ED6CE`

---

## 1. Run it locally (5 minutes)

Requires **Node 18+** (Node 20/22 recommended).

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
# open .env and paste your Supabase URL + anon key (see step 2)
npm run dev                 # → http://localhost:5173
```

> No Supabase keys yet? Leave `.env` as the placeholders and the site runs in **demo mode**
> (built-in sample data, nothing is saved). Demo admin login: `admin@gsac.org` / `admin123`.

Production build / preview:

```bash
npm run build      # outputs ./dist
npm run preview    # serves ./dist locally
```

---

## 2. Connect Supabase

Get **Project URL** and **anon public key** from *Supabase → Project Settings → API* and put them in `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Then set up the database — **pick ONE of these**, in *Supabase → SQL Editor*:

### A) Brand-new Supabase project
Run **`supabase/schema.sql`** (once). It creates every table, security rule, and seed data
(10 categories, sample courses, **26 venues in 15 countries**, FAQs, etc.).
The script is re-runnable: running it again will not duplicate anything.

### B) You already ran an older schema (your live project)
Run **`supabase/migrations/002_brand_and_venues.sql`** (once; re-running is harmless). It:

1. adds the `region` column to `venues`,
2. **replaces the venue list** with the 26 venues below (⚠ deletes venues you added by hand),
3. moves category colour themes onto navy / teal / gold,
4. sets Stats to **26 venues / 15 countries**,
5. updates the "Where does GSAC operate?" FAQ.

Courses, enrollments, users, invoices and everything else are left alone.

### Create your admin user
1. *Authentication → Users → Add user* (email + password, tick *Auto Confirm*).
2. SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'you@yourcompany.com';
   ```
3. Sign in at `/login` → you land in `/admin`.

If *Add user* fails with `Failed to create user: {}`, run the trigger fix in
`supabase/admin_setup.sql` (STEP 3). It is already included in `schema.sql` for new projects.

### Optional: emailed invoices
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy send-course-invoice
npx supabase secrets set RESEND_API_KEY=... RESEND_FROM_EMAIL="GSAC <noreply@yourdomain.com>" ADMIN_NOTIFICATION_EMAIL=you@yourcompany.com
```
Without this, enrollment still works and the invoice is a client-side download.

---

## 3. Publish it

The app is a static single-page site: build it, upload `dist/`, add the two env vars.

**Vercel** — import the repo (or `npx vercel`), framework "Vite", add `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. `vercel.json` already contains the SPA rewrite.

**Netlify** — build command `npm run build`, publish dir `dist`, add the same two env vars.
`netlify.toml` and `public/_redirects` are included.

**Any other host (cPanel / Nginx / Apache)** — run `npm run build`, upload the contents of `dist/`,
and make unknown paths fall back to `index.html` (otherwise refreshing `/course/...` gives a 404).
Nginx: `location / { try_files $uri /index.html; }`

After deploying, set your real domain in `public/sitemap.xml` / `robots.txt` if it differs from `gsac.org`.
In *Supabase → Authentication → URL Configuration* add your live domain as the Site URL.

---

## 4. What's in this version

**Brand colours** — Deep Navy / Champagne Gold / White / Light Teal applied across the whole site, the admin panel,
invoices, brochures and emails. Colours live in one place: `tailwind.config.js` (`navy`, `gold`, `teal`).
Gold buttons use navy text (white on champagne gold is not readable); contrast was checked across all pages.
Admin → Categories → *Colour Theme* now offers the three brand accents.

**Mega-menu navigation** (styled after zoetalentsolutions.com) — full-width **Training Categories** and **Venues**
menus with bold column headings and links beneath; accordion versions on mobile.

**Training venues** — 26 cities, grouped by region, driven by the database:

| Region | Countries → cities |
|---|---|
| Kenya | Nairobi, Mombasa, Kisumu, Nakuru, Naivasha, Eldoret, Machakos |
| Africa | South Africa → Johannesburg, Cape Town, Pretoria, Durban · Rwanda → Kigali · Egypt → Cairo · Ghana → Accra · Zambia → Lusaka · Uganda → Kampala · Tanzania → Dar es Salaam, Arusha, Zanzibar · Ethiopia → Addis Ababa · Mauritius → Port Louis |
| Middle East | UAE → Dubai |
| Asia | Singapore → Singapore · Malaysia → Kuala Lumpur |
| Europe | United Kingdom → London |
| South America | Brazil → Rio de Janeiro |

Edit them in **Admin → Venues** (city, country, region, display order, optional photo, active on/off).
City links filter the course list to courses whose *Location* contains that city.

**Fixes carried over / added**
- Course enquiry form saves to the database; working course brochure download.
- Admin lists (Contact, Trainer Applications, Users) no longer re-fetch in an endless loop.
- SPA rewrite files for Vercel/Netlify; favicon set; logos compressed from 2.2 MB to ~60 KB.
- `schema.sql` is re-runnable; signup-trigger fix so creating users works.

---

## 5. Project map

```
src/api/index.js            every Supabase read/write
src/context/SiteContext.jsx app state + admin add/update/delete helpers
src/lib/venues.js           venue list, region order, grouping helpers
src/lib/categoryColors.js   navy / teal / gold category accents
src/components/layout/      Navbar (mega-menus), Footer
src/pages/                  public pages;  src/pages/admin/ admin panel
supabase/schema.sql         full database (tables, RLS, seeds)
supabase/migrations/        002_brand_and_venues.sql  (for existing projects)
supabase/functions/         send-course-invoice (email)
```

`npm run lint` runs ESLint.

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| Site shows sample data / admin changes vanish on refresh | `.env` still has placeholders, or you didn't restart `npm run dev` after editing it |
| Admin can read but not save | your user's `profiles.role` isn't `admin` (see "Create your admin user") |
| Venues menu shows only old cities | run `supabase/migrations/002_brand_and_venues.sql` |
| Refreshing a page on your host gives 404 | add the SPA fallback (section 3) |
| `Failed to create user: {}` | run STEP 3 in `supabase/admin_setup.sql` |
