/**
 * Brand-aligned accent styles for course categories.
 *
 * Admins choose one of three accents — navy, teal or gold — in
 * Admin → Categories → "Colour Theme". Older databases may still hold the
 * previous 10-colour values (blue, green, purple …); those are folded onto the
 * closest brand accent here so nothing breaks and no data migration is required
 * (supabase/migrations/002_brand_and_venues.sql also normalises them in the DB).
 */
const LEGACY = {
  navy: 'navy', teal: 'teal', gold: 'gold',
  blue: 'navy', purple: 'navy', indigo: 'navy',
  green: 'teal', cyan: 'teal',
  red: 'gold', orange: 'gold', pink: 'gold',
}

export const CATEGORY_COLOR_OPTIONS = ['navy', 'teal', 'gold']

export const normalizeCategoryColor = (c) => LEGACY[c] || 'navy'

/** Clickable category tile (Home grid, Categories page) */
const TILE = {
  navy: 'bg-navy-50 text-navy border-navy/20 hover:bg-navy-50/60 hover:border-navy/40',
  teal: 'bg-teal-50 text-teal-deep border-teal-dark/30 hover:bg-teal-100 hover:border-teal-dark/60',
  gold: 'bg-gold-light text-gold-deep border-gold/50 hover:bg-gold/20 hover:border-gold',
}

/** Small pill (course level inside menus, etc.) */
const PILL = {
  navy: 'bg-navy-50 text-navy border-navy/15',
  teal: 'bg-teal-50 text-teal-deep border-teal-dark/25',
  gold: 'bg-gold-light text-gold-deep border-gold/40',
}

/** Category page hero gradient (white text sits on top) */
const HERO = {
  navy: 'from-navy to-navy-700',
  teal: 'from-navy to-teal-deep',
  gold: 'from-navy-800 to-gold-dark',
}

export const categoryTile = (c) => TILE[normalizeCategoryColor(c)]
export const categoryPill = (c) => PILL[normalizeCategoryColor(c)]
export const categoryHero = (c) => HERO[normalizeCategoryColor(c)]
