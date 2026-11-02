-- ════════════════════════════════════════════════════════════════════════════
-- GSAC — Migration 002: new brand + new training venues
-- ----------------------------------------------------------------------------
-- RUN THIS ONCE in Supabase → SQL Editor on your EXISTING project.
-- (Brand-new project? Just run supabase/schema.sql instead — it already
--  contains everything below.)
--
-- Safe to re-run: every step is idempotent.
--
-- WHAT IT DOES
--   1. Adds the `region` column to venues (powers the grouped Venues menu/page)
--   2. REPLACES the venue list with the 26 venues in 15 countries
--      ⚠ This deletes any venues you previously added/edited in Admin → Venues.
--   3. Moves category colour themes onto the brand accents (navy / teal / gold)
--   4. Updates the "venues" and "countries" numbers in Stats (26 / 15)
--   5. Updates the "Where does GSAC operate?" FAQ answer
--   Nothing else (courses, enrollments, users, invoices …) is touched.
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

-- 1 ── region column + uniqueness (so the seed can never duplicate) ───────────
ALTER TABLE venues ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Africa';

-- 2 ── replace the venue list ────────────────────────────────────────────────
DELETE FROM venues;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'venues_name_country_key') THEN
    ALTER TABLE venues ADD CONSTRAINT venues_name_country_key UNIQUE (name, country);
  END IF;
END $$;

INSERT INTO venues (name, country, region, type, description, image, sort_order) VALUES
  ('Nairobi', 'Kenya', 'Kenya', 'Flagship', 'Kenya''s capital and home to our headquarters at Bazaar Plaza, Moi Avenue.', NULL, 1),
  ('Mombasa', 'Kenya', 'Kenya', 'Regional Hub', 'Kenya''s principal coastal city and main port.', NULL, 2),
  ('Kisumu', 'Kenya', 'Kenya', 'Regional Hub', 'Lakeside city on Lake Victoria in western Kenya.', NULL, 3),
  ('Nakuru', 'Kenya', 'Kenya', 'Regional Hub', 'Rift Valley centre and one of the largest towns in Kenya.', NULL, 4),
  ('Naivasha', 'Kenya', 'Kenya', 'Regional Hub', 'Rift Valley lakeside town, a favourite for residential workshops and retreats.', NULL, 5),
  ('Eldoret', 'Kenya', 'Kenya', 'Regional Hub', 'Major city in Kenya''s North Rift region.', NULL, 6),
  ('Machakos', 'Kenya', 'Kenya', 'Regional Hub', 'County town just east of Nairobi.', NULL, 7),
  ('Johannesburg', 'South Africa', 'Africa', 'Regional Hub', 'South Africa''s largest city and commercial centre.', NULL, 8),
  ('Cape Town', 'South Africa', 'Africa', 'Regional Hub', 'South Africa''s legislative capital on the southwest coast.', NULL, 9),
  ('Pretoria', 'South Africa', 'Africa', 'Regional Hub', 'South Africa''s executive capital.', NULL, 10),
  ('Durban', 'South Africa', 'Africa', 'Regional Hub', 'Major Indian Ocean port city in KwaZulu-Natal.', NULL, 11),
  ('Kigali', 'Rwanda', 'Africa', 'Regional Hub', 'Rwanda''s capital and a leading East African conference destination.', NULL, 12),
  ('Cairo', 'Egypt', 'Africa', 'Regional Hub', 'Egypt''s capital and one of the largest cities in Africa.', NULL, 13),
  ('Accra', 'Ghana', 'Africa', 'Regional Hub', 'Ghana''s capital and a vibrant West African business hub.', NULL, 14),
  ('Lusaka', 'Zambia', 'Africa', 'Regional Hub', 'Zambia''s capital and commercial centre.', NULL, 15),
  ('Kampala', 'Uganda', 'Africa', 'Regional Hub', 'Uganda''s capital, close to the shores of Lake Victoria.', NULL, 16),
  ('Dar es Salaam', 'Tanzania', 'Africa', 'Regional Hub', 'Tanzania''s largest city and main commercial port.', NULL, 17),
  ('Arusha', 'Tanzania', 'Africa', 'Regional Hub', 'Northern Tanzania hub and home of the East African Community headquarters.', NULL, 18),
  ('Zanzibar', 'Tanzania', 'Africa', 'Regional Hub', 'Island archipelago off Tanzania''s Indian Ocean coast.', NULL, 19),
  ('Addis Ababa', 'Ethiopia', 'Africa', 'Regional Hub', 'Ethiopia''s capital and the diplomatic seat of the African Union.', NULL, 20),
  ('Port Louis', 'Mauritius', 'Africa', 'Regional Hub', 'Mauritius''s capital and main port.', NULL, 21),
  ('Dubai', 'UAE', 'Middle East', 'International Hub', 'A global business crossroads in the United Arab Emirates.', NULL, 22),
  ('Singapore', 'Singapore', 'Asia', 'International Hub', 'Asia''s leading financial and business hub.', NULL, 23),
  ('Kuala Lumpur', 'Malaysia', 'Asia', 'International Hub', 'Malaysia''s capital and a major South-East Asian business centre.', NULL, 24),
  ('London', 'United Kingdom', 'Europe', 'International Hub', 'The UK capital and one of the world''s leading financial centres.', NULL, 25),
  ('Rio de Janeiro', 'Brazil', 'South America', 'International Hub', 'Brazil''s iconic coastal city.', NULL, 26)
ON CONFLICT (name, country) DO NOTHING;

-- 3 ── category colour themes → brand accents ────────────────────────────────
ALTER TABLE categories ALTER COLUMN color SET DEFAULT 'navy';
UPDATE categories SET color = CASE color
  WHEN 'blue'   THEN 'navy'  WHEN 'purple' THEN 'navy'  WHEN 'indigo' THEN 'navy'
  WHEN 'green'  THEN 'teal'  WHEN 'cyan'   THEN 'teal'
  WHEN 'red'    THEN 'gold'  WHEN 'orange' THEN 'gold'  WHEN 'pink'   THEN 'gold'
  WHEN 'navy'   THEN 'navy'  WHEN 'teal'   THEN 'teal'  WHEN 'gold'   THEN 'gold'
  ELSE 'navy' END;

-- 4 ── headline numbers (editable any time in Admin → Stats & Numbers) ───────
ALTER TABLE stats ALTER COLUMN venues    SET DEFAULT '26';
ALTER TABLE stats ALTER COLUMN countries SET DEFAULT '15';
UPDATE stats SET venues = '26', countries = '15' WHERE id = 1;

-- 5 ── FAQ answer that listed the old cities ─────────────────────────────────
UPDATE faqs
   SET answer = 'GSAC trains in 26 cities across 15 countries: Kenya (Nairobi, Mombasa, Kisumu, Nakuru, Naivasha, Eldoret, Machakos); South Africa (Johannesburg, Cape Town, Pretoria, Durban); Rwanda (Kigali); Egypt (Cairo); Ghana (Accra); Zambia (Lusaka); Uganda (Kampala); Tanzania (Dar es Salaam, Arusha, Zanzibar); Ethiopia (Addis Ababa); Mauritius (Port Louis); UAE (Dubai); Singapore; Malaysia (Kuala Lumpur); the United Kingdom (London); and Brazil (Rio de Janeiro). In-house training is available anywhere in the world.'
 WHERE question = 'Where does GSAC operate?';

COMMIT;

-- ── Quick check (optional) ────────────────────────────────────────────────────
-- SELECT region, count(*) AS venues, string_agg(name, ', ' ORDER BY sort_order) AS cities
--   FROM venues GROUP BY region ORDER BY min(sort_order);
-- Expected: Kenya 7 · Africa 14 · Middle East 1 · Asia 2 · Europe 1 · South America 1  (26 total)
