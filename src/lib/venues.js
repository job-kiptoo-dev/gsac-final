/**
 * Training venues — shared helpers + the default venue list.
 *
 * The live source of truth is the `venues` table in Supabase (edit it in
 * Admin → Venues). DEFAULT_VENUES below mirrors the SQL seed in
 * supabase/schema.sql and is only used as an offline / demo-mode fallback.
 *
 * Shape: { name (city), country, region, type, description, image, sort_order, active }
 */

/** Region order = order of the groups on the Venues page and in the Venues menu */
export const VENUE_REGIONS = [
  'Kenya', 'Africa', 'Middle East', 'Asia', 'Europe', 'South America', 'North America',
]

const v = (name, country, region, type, description) => ({ name, country, region, type, description })

const RAW = [
  // ── Kenya ──────────────────────────────────────────────────────────────
  v('Nairobi',   'Kenya', 'Kenya', 'Flagship',     "Kenya's capital and home to our headquarters at Bazaar Plaza, Moi Avenue."),
  v('Mombasa',   'Kenya', 'Kenya', 'Regional Hub', "Kenya's principal coastal city and main port."),
  v('Kisumu',    'Kenya', 'Kenya', 'Regional Hub', 'Lakeside city on Lake Victoria in western Kenya.'),
  v('Nakuru',    'Kenya', 'Kenya', 'Regional Hub', 'Rift Valley centre and one of the largest towns in Kenya.'),
  v('Naivasha',  'Kenya', 'Kenya', 'Regional Hub', 'Rift Valley lakeside town, a favourite for residential workshops and retreats.'),
  v('Eldoret',   'Kenya', 'Kenya', 'Regional Hub', "Major city in Kenya's North Rift region."),
  v('Machakos',  'Kenya', 'Kenya', 'Regional Hub', 'County town just east of Nairobi.'),

  // ── Africa (outside Kenya) ─────────────────────────────────────────────
  v('Johannesburg', 'South Africa', 'Africa', 'Regional Hub', "South Africa's largest city and commercial centre."),
  v('Cape Town',    'South Africa', 'Africa', 'Regional Hub', "South Africa's legislative capital on the southwest coast."),
  v('Pretoria',     'South Africa', 'Africa', 'Regional Hub', "South Africa's executive capital."),
  v('Durban',       'South Africa', 'Africa', 'Regional Hub', 'Major Indian Ocean port city in KwaZulu-Natal.'),
  v('Kigali',       'Rwanda',       'Africa', 'Regional Hub', "Rwanda's capital and a leading East African conference destination."),
  v('Cairo',        'Egypt',        'Africa', 'Regional Hub', "Egypt's capital and one of the largest cities in Africa."),
  v('Accra',        'Ghana',        'Africa', 'Regional Hub', "Ghana's capital and a vibrant West African business hub."),
  v('Lusaka',       'Zambia',       'Africa', 'Regional Hub', "Zambia's capital and commercial centre."),
  v('Kampala',      'Uganda',       'Africa', 'Regional Hub', "Uganda's capital, close to the shores of Lake Victoria."),
  v('Dar es Salaam','Tanzania',     'Africa', 'Regional Hub', "Tanzania's largest city and main commercial port."),
  v('Arusha',       'Tanzania',     'Africa', 'Regional Hub', 'Northern Tanzania hub and home of the East African Community headquarters.'),
  v('Zanzibar',     'Tanzania',     'Africa', 'Regional Hub', "Island archipelago off Tanzania's Indian Ocean coast."),
  v('Addis Ababa',  'Ethiopia',     'Africa', 'Regional Hub', "Ethiopia's capital and the diplomatic seat of the African Union."),
  v('Port Louis',   'Mauritius',    'Africa', 'Regional Hub', "Mauritius's capital and main port."),

  // ── Rest of the world ──────────────────────────────────────────────────
  v('Dubai',          'UAE',            'Middle East',   'International Hub', 'A global business crossroads in the United Arab Emirates.'),
  v('Singapore',      'Singapore',      'Asia',          'International Hub', "Asia's leading financial and business hub."),
  v('Kuala Lumpur',   'Malaysia',       'Asia',          'International Hub', "Malaysia's capital and a major South-East Asian business centre."),
  v('London',         'United Kingdom', 'Europe',        'International Hub', "The UK capital and one of the world's leading financial centres."),
  v('Rio de Janeiro', 'Brazil',         'South America', 'International Hub', "Brazil's iconic coastal city."),
]

export const DEFAULT_VENUES = RAW.map((venue, i) => ({
  ...venue,
  id: `default-venue-${i + 1}`,
  image: '',
  active: true,
  sort_order: i + 1,
}))

const byOrder = (a, b) =>
  (a.sort_order ?? 9999) - (b.sort_order ?? 9999) || String(a.name).localeCompare(String(b.name))

/** → [{ region, venues: [...], countries: ['Kenya'] }] in VENUE_REGIONS order (unknown regions last) */
export function groupVenuesByRegion(venues = []) {
  const map = new Map()
  ;[...venues].filter(x => x && x.active !== false).sort(byOrder).forEach(venue => {
    const region = venue.region || 'Other'
    if (!map.has(region)) map.set(region, [])
    map.get(region).push(venue)
  })
  const ordered = [...VENUE_REGIONS.filter(r => map.has(r)), ...[...map.keys()].filter(r => !VENUE_REGIONS.includes(r))]
  return ordered.map(region => {
    const list = map.get(region)
    return { region, venues: list, countries: [...new Set(list.map(x => x.country).filter(Boolean))] }
  })
}

/** "Nairobi, Kenya" — used where a single readable label is needed */
export const venueLabel = (venue) =>
  venue.country && !String(venue.name).includes(venue.country) ? `${venue.name}, ${venue.country}` : venue.name

const AFRICA = ['south africa','rwanda','egypt','ghana','zambia','uganda','tanzania','ethiopia','mauritius','nigeria','senegal','namibia','seychelles','botswana','zimbabwe','malawi','morocco','tunisia','algeria','mozambique','angola','drc','dr congo','cameroon','ivory coast',"cote d'ivoire"]
const MIDEAST = ['uae','united arab emirates','qatar','saudi arabia','oman','bahrain','kuwait','jordan','lebanon','turkey']
const ASIA = ['singapore','malaysia','india','thailand','philippines','south korea','japan','china','maldives','kazakhstan','indonesia','vietnam']
const EUROPE = ['united kingdom','uk','france','germany','netherlands','switzerland','spain','italy','portugal','greece','austria','ireland']
const SAMERICA = ['brazil','argentina','chile','colombia','peru']
const NAMERICA = ['united states','usa','canada','mexico']

/** Best-effort region for rows that pre-date the `region` column or were added without one */
export function inferRegion(country = '') {
  const c = String(country).trim().toLowerCase()
  if (c === 'kenya') return 'Kenya'
  if (AFRICA.includes(c)) return 'Africa'
  if (MIDEAST.includes(c)) return 'Middle East'
  if (ASIA.includes(c)) return 'Asia'
  if (EUROPE.includes(c)) return 'Europe'
  if (SAMERICA.includes(c)) return 'South America'
  if (NAMERICA.includes(c)) return 'North America'
  return 'Africa'
}

/** Make any venue row (old or new) safe for the UI */
export const normalizeVenue = (row) => ({ ...row, region: row.region || inferRegion(row.country) })
