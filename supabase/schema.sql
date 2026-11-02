-- ============================================================
-- GSAC (Global Skills Advancement Center) - Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  organization TEXT,
  role        TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
-- Uses ON CONFLICT DO NOTHING to prevent 500 errors if trigger fires twice
-- IMPORTANT: this trigger runs as the supabase_auth_admin role, whose default
-- search_path does NOT include "public". Without schema-qualifying the table
-- and pinning search_path below, this function silently fails to find
-- "profiles" and breaks user creation entirely (shows as "Failed to create
-- user: {}" in the dashboard / a generic 500 from supabase-js signUp()).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────
-- SITE CONTENT (singleton row, id=1)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id           INT PRIMARY KEY DEFAULT 1,
  site_name    TEXT DEFAULT 'Global Skills Advancement Center',
  tagline      TEXT DEFAULT 'SKILL EXCELLENCE IS BUSINESS ESSENTIAL',
  hero_headline TEXT DEFAULT 'ACCELERATE CAPABILITY. DELIVER MEASURABLE IMPACT. TRANSFORM YOUR ORGANIZATION FOR THE NEW ECONOMY.',
  hero_subtext  TEXT DEFAULT 'GSAC builds future-ready teams through hands-on learning, high-impact application, and coaching that turns new skills into measurable performance.',
  phone        TEXT DEFAULT '+254721911847',
  email        TEXT DEFAULT 'partner@gsac.org',
  address      TEXT DEFAULT 'Bazaar Plaza, Moi Avenue, Nairobi, Kenya',
  hours        TEXT DEFAULT '8:00 AM - 5:00 PM EAT',
  facebook     TEXT DEFAULT 'https://facebook.com',
  twitter      TEXT DEFAULT 'https://twitter.com',
  linkedin     TEXT DEFAULT 'https://linkedin.com',
  instagram    TEXT DEFAULT 'https://instagram.com',
  youtube      TEXT DEFAULT 'https://youtube.com',
  whatsapp     TEXT DEFAULT '+254726954964',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site content
INSERT INTO site_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- STATS (singleton row, id=1)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stats (
  id            INT PRIMARY KEY DEFAULT 1,
  professionals TEXT DEFAULT '15,000+',
  hours         TEXT DEFAULT '50,000+',
  satisfaction  TEXT DEFAULT '98%',
  venues        TEXT DEFAULT '26',
  countries     TEXT DEFAULT '15',
  courses       TEXT DEFAULT '1,500+',
  trainers      TEXT DEFAULT '200+',
  years         TEXT DEFAULT '9',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- PARTNERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  logo       TEXT,
  sort_order INT DEFAULT 0,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO partners (name, logo, sort_order)
SELECT * FROM (VALUES
  ('African Union',             'https://gsac.org/storage/logos/338715.png',  1),
  ('FCCPC',                     'https://gsac.org/storage/logos/787413.png',  2),
  ('PCCB',                      'https://gsac.org/storage/logos/852236.png',  3),
  ('Konza Technopolis',         'https://gsac.org/storage/logos/628427.png',  4),
  ('Defense Space Administration','https://gsac.org/storage/logos/768921.webp', 5),
  ('Water Mission Tanzania',    'https://gsac.org/storage/logos/169328.png',  6),
  ('Kenya Wildlife Service',    'https://gsac.org/storage/logos/650606.webp', 7)
) AS seed(name, logo, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM partners);

-- ─────────────────────────────────────────────
-- TESTIMONIALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote      TEXT NOT NULL,
  name       TEXT NOT NULL,
  role       TEXT,
  rating     INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  approved   BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO testimonials (quote, name, role, rating, approved, sort_order)
SELECT * FROM (VALUES
  ('Zero fluff. Pure execution. They didn''t just train our team — they upgraded how we think, communicate, and deliver. You feel the impact immediately.', 'Linda Obiero', 'HR Lead', 5, TRUE, 1),
  ('This is elite-level facilitation. The trainers are sharp, structured, and relentless about outcomes. Our managers left with tools — not notes.', 'Ezra Wakaba', 'Business Manager', 5, TRUE, 2),
  ('We got ROI — fast. The training translated into measurable improvements. If you want performance, this is where you invest.', 'Abdallah Mohammed', 'Operations Lead', 5, TRUE, 3),
  ('Exceptionally well-structured program. The facilitators brought real-world experience that made every concept immediately applicable.', 'Amina Hassan', 'Program Manager', 5, TRUE, 4),
  ('GSAC transformed our leadership team. The ripple effect on our organization''s performance has been remarkable and measurable.', 'David Kariuki', 'CEO, Tech Corp', 5, TRUE, 5)
) AS seed(quote, name, role, rating, approved, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  icon         TEXT DEFAULT '📚',
  description  TEXT,
  course_count INT DEFAULT 0,
  color        TEXT DEFAULT 'navy',   -- brand accent: navy | teal | gold
  published    BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, icon, description, course_count, color, sort_order) VALUES
  ('Leadership & Management',        'leadership-management',   '🎯', 'Develop exceptional leadership skills and strategic management capabilities', 85,  'navy',   1),
  ('Finance & Human Resources',      'finance-hr',              '💼', 'Build core operational capability across people and financial systems',       120, 'gold',   2),
  ('Monitoring & Evaluation',        'monitoring-evaluation',   '📊', 'Master M&E methodologies for data-driven decision making',                   65,  'teal',   3),
  ('Technology, Innovation & Data',  'technology-innovation',   '💻', 'Modernize workflows with practical tech, analytics, and AI-ready capability', 95,  'navy',   4),
  ('Procurement & Supply Chain',     'procurement-supply-chain','🔗', 'Increase transparency, reduce leakage, and deliver reliable value for money', 75,  'teal',   5),
  ('Project Management',             'project-management',      '📋', 'Lead projects with precision from initiation through successful closure',      90,  'gold',   6),
  ('Risk, Compliance & Quality',     'risk-compliance',         '🛡️', 'Build resilient systems that protect value and keep operations audit-ready',  55,  'gold',   7),
  ('Digital Transformation',         'digital-transformation',  '🚀', 'Navigate digital disruption and lead transformation initiatives',              70,  'navy',   8),
  ('Health & Public Sector',         'health-public-sector',    '🏥', 'Specialized training for healthcare and public service professionals',         60,  'gold',   9),
  ('Geospatial & Remote Sensing',    'geospatial',              '🌍', 'Advanced geospatial technologies and remote sensing applications',             40,  'teal',  10)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- COURSES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  category     TEXT,
  category_slug TEXT,
  duration     TEXT DEFAULT '5 Days',
  format       TEXT DEFAULT 'In-Person / Virtual',
  level        TEXT DEFAULT 'Intermediate',
  price        NUMERIC(10,2) DEFAULT 0,
  featured     BOOLEAN DEFAULT FALSE,
  published    BOOLEAN DEFAULT TRUE,
  description  TEXT,
  outcomes     TEXT[] DEFAULT '{}',
  location     TEXT,
  next_date    DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO courses (title, slug, category, category_slug, duration, format, level, price, featured, published, description, outcomes, location, next_date) VALUES
  ('Training on Advanced Monitoring & Evaluation Techniques', 'advanced-monitoring-evaluation', 'Monitoring & Evaluation', 'monitoring-evaluation', '5 Days', 'In-Person / Virtual', 'Advanced', 1500, TRUE, TRUE,
   'The Advanced Monitoring & Evaluation Techniques course is designed for professionals looking to deepen their understanding of M&E practices, methodologies, and applications.',
   ARRAY['Master advanced M&E frameworks', 'Develop robust evaluation designs', 'Apply mixed-methods approaches', 'Build organizational M&E systems'],
   'Nairobi, Dubai, London', '2025-02-10'),
  ('Training on Global Leadership', 'global-leadership', 'Leadership & Management', 'leadership-management', '5 Days', 'In-Person / Virtual', 'Intermediate', 1800, TRUE, TRUE,
   'Develop the strategic leadership skills needed to lead organizations in today''s complex global environment.',
   ARRAY['Strategic thinking frameworks', 'Cross-cultural leadership', 'Change management mastery', 'Executive communication'],
   'Nairobi, Kigali, Dubai', '2025-02-17'),
  ('Training on Project Management Professional', 'project-management-professional', 'Project Management', 'project-management', '5 Days', 'In-Person', 'Intermediate', 1650, TRUE, TRUE,
   'Comprehensive project management training aligned with PMI standards and best practices.',
   ARRAY['PMP examination preparation', 'Agile & waterfall methodologies', 'Risk management techniques', 'Stakeholder engagement'],
   'Nairobi, Kampala, Cape Town', '2025-02-24'),
  ('Training on Financial Management & Reporting', 'financial-management-reporting', 'Finance & Human Resources', 'finance-hr', '5 Days', 'In-Person / Virtual', 'Intermediate', 1550, FALSE, TRUE,
   'Master financial management principles and reporting standards for organizational excellence.',
   ARRAY['Financial analysis techniques', 'Budget planning & control', 'Financial reporting standards', 'Cash flow management'],
   'Nairobi, Dar es Salaam', '2025-03-03'),
  ('Training on AI and Machine Learning for Business', 'ai-machine-learning-business', 'Technology, Innovation & Data', 'technology-innovation', '5 Days', 'Virtual / In-Person', 'Intermediate', 2000, TRUE, TRUE,
   'Practical AI and machine learning applications for business transformation and competitive advantage.',
   ARRAY['AI strategy development', 'Machine learning fundamentals', 'Data-driven decision making', 'AI implementation roadmap'],
   'Nairobi, Dubai, Virtual', '2025-03-10'),
  ('Training on Supply Chain & Procurement Management', 'supply-chain-procurement', 'Procurement & Supply Chain', 'procurement-supply-chain', '5 Days', 'In-Person', 'Intermediate', 1500, FALSE, TRUE,
   'Build expertise in supply chain optimization and procurement best practices for operational efficiency.',
   ARRAY['Strategic sourcing techniques', 'Supplier relationship management', 'Contract management', 'Supply chain risk mitigation'],
   'Nairobi, Mombasa', '2025-03-17')
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- VENUES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS venues (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,                 -- city, e.g. 'Nairobi'
  country     TEXT,
  region      TEXT DEFAULT 'Africa',         -- menu group: Kenya | Africa | Middle East | Asia | Europe | South America | North America
  type        TEXT DEFAULT 'Regional Hub',
  description TEXT,
  image       TEXT,                          -- optional photo URL
  active      BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT venues_name_country_key UNIQUE (name, country)
);

-- 26 venues in 15 countries (re-running this script never duplicates them)
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

-- ─────────────────────────────────────────────
-- FAQS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category   TEXT NOT NULL,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO faqs (category, question, answer, sort_order)
SELECT * FROM (VALUES
  ('About GSAC', 'What is Global Skills Advancement Center?', 'Global Skills Advancement Center (GSAC) is a premier capacity-building and EdTech institution delivering high-impact professional training for organizations and individuals across Africa and beyond. We offer 1,500+ courses across all major business functions, enabling teams to perform at their best.', 1),
  ('About GSAC', 'How can I contact GSAC?', 'You can reach us via Phone/WhatsApp: +254721911847, or Email: partner@gsac.org. Our core office hours are 8:00 AM – 5:00 PM EAT, but we are reachable 24/7 for urgent inquiries.', 2),
  ('About GSAC', 'Where does GSAC operate?', 'GSAC trains in 26 cities across 15 countries: Kenya (Nairobi, Mombasa, Kisumu, Nakuru, Naivasha, Eldoret, Machakos); South Africa (Johannesburg, Cape Town, Pretoria, Durban); Rwanda (Kigali); Egypt (Cairo); Ghana (Accra); Zambia (Lusaka); Uganda (Kampala); Tanzania (Dar es Salaam, Arusha, Zanzibar); Ethiopia (Addis Ababa); Mauritius (Port Louis); UAE (Dubai); Singapore; Malaysia (Kuala Lumpur); the United Kingdom (London); and Brazil (Rio de Janeiro). In-house training is available anywhere in the world.', 3),
  ('Registration & Payment', 'How do I register for a course?', 'You can register online through our website, send an email to partner@gsac.org, or call +254721911847. Our team will guide you through the enrollment process and confirm your booking.', 4),
  ('Registration & Payment', 'What is the cancellation and refund policy?', 'Cancellations made 14+ days before the course start date receive a full refund. Cancellations within 7–13 days receive a 50% refund. No refund applies within 7 days of the course start, but you may transfer to another date at no extra charge.', 5),
  ('Logistics & Training Details', 'What are the training hours?', 'Training sessions typically run from 8:00 AM to 5:00 PM local time, with scheduled breaks morning and afternoon. Exact timings may vary by program and location.', 6),
  ('Logistics & Training Details', 'Does the training fee include meals and accommodation?', 'Training fees include materials, certificates, and lunch/refreshments for in-person sessions. Accommodation is arranged separately — we can recommend nearby hotels and assist with bookings upon request.', 7),
  ('Certification & Support', 'Is a certificate issued upon course completion?', 'Yes. All participants who successfully complete a course receive an internationally recognized GSAC Certificate of Completion. CPD (Continuing Professional Development) points are awarded where applicable.', 8),
  ('Certification & Support', 'What post-training support does GSAC provide?', 'We provide up to 6 months of post-training support, including access to session recordings (virtual programs), presentation slides, templates, toolkits, and a dedicated email hotline for follow-up questions.', 9),
  ('Online & In-House Training', 'Do you offer virtual or online training?', 'Yes. We offer live, interactive virtual training delivered via Zoom or Microsoft Teams. Virtual sessions are facilitator-led and include the same certificate upon completion as in-person programs.', 10),
  ('Online & In-House Training', 'Can GSAC provide in-house or customized training?', 'Absolutely. We offer fully customized in-house training at your premises or a venue of your choice. This is ideal for organizations training five or more staff members. We tailor content to your specific goals and industry context.', 11),
  ('Trends', 'What are the most in-demand professional skills today?', 'Critical thinking, data literacy, AI/ML awareness, emotional intelligence, adaptability, digital communication, sustainability competence, and cross-cultural leadership are consistently ranked as the top skills driving career and organizational success.', 12)
) AS seed(category, question, answer, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM faqs);

-- ─────────────────────────────────────────────
-- BLOG POSTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  excerpt    TEXT,
  content    TEXT,
  author     TEXT DEFAULT 'GSAC Team',
  date       DATE DEFAULT CURRENT_DATE,
  category   TEXT,
  image      TEXT,
  published  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO blog_posts (title, slug, excerpt, content, author, date, category, image, published) VALUES
  ('The Future of Corporate Training in Africa', 'future-corporate-training-africa',
   'How EdTech and AI are reshaping professional development across the continent.',
   'Africa''s professional training landscape is undergoing a seismic shift. With the rapid advancement of EdTech platforms and AI-powered learning tools, organizations across the continent are rethinking how they develop talent. At GSAC, we are at the forefront of this transformation — combining global methodologies with deep local relevance to deliver training that actually moves the needle on performance.',
   'GSAC Team', '2025-01-15', 'Industry Insights', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', TRUE),
  ('Why Monitoring & Evaluation Skills Are Critical in 2025', 'monitoring-evaluation-skills-2025',
   'Organizations that invest in M&E capabilities significantly outperform those that don''t.',
   'In an era defined by accountability and data-driven decision making, Monitoring & Evaluation (M&E) has evolved from a compliance function into a strategic competitive advantage. Organizations that embed rigorous M&E practices into their operations consistently achieve better project outcomes, higher donor confidence, and stronger institutional resilience.',
   'GSAC Team', '2025-01-08', 'Training Tips', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', TRUE),
  ('10 Leadership Traits That Define High-Impact Performers', 'leadership-traits-high-impact-performers',
   'What separates good leaders from truly transformational ones in today''s complex landscape.',
   'Leadership in the 21st century demands more than authority or technical expertise. The most impactful leaders combine strategic clarity with emotional intelligence, adaptability with decisiveness, and confidence with humility. At GSAC, our leadership programs are built around the real traits we''ve observed in top performers across Africa and globally.',
   'GSAC Team', '2024-12-20', 'Leadership', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- ENROLLMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id    UUID REFERENCES courses(id) ON DELETE SET NULL,
  course_title TEXT,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  organization TEXT,
  format       TEXT,
  message      TEXT,
  status       TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CONTACT SUBMISSIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  organization TEXT,
  subject      TEXT,
  message      TEXT NOT NULL,
  status       TEXT DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied', 'Archived')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TRAINER APPLICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trainer_applications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  expertise  TEXT,
  linkedin   TEXT,
  bio        TEXT,
  status     TEXT DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INVOICES (generated by the send-course-invoice edge function)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id   UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  invoice_number  TEXT NOT NULL UNIQUE,
  recipient_name  TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  course_title    TEXT NOT NULL,
  currency        TEXT NOT NULL CHECK (currency IN ('USD', 'KES')),
  unit_price      NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_due      NUMERIC(12,2) NOT NULL DEFAULT 0,
  exchange_rate   NUMERIC(12,4) DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'Generated' CHECK (status IN ('Generated', 'Sent', 'Failed')),
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_recipient_email ON invoices (recipient_email);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices (created_at DESC);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content           ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners               ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses                ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices               ENABLE ROW LEVEL SECURITY;

-- Helper: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- PUBLIC READ policies (published content)
DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content"   ON site_content         FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "public_read_stats" ON stats;
CREATE POLICY "public_read_stats"          ON stats                FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "public_read_partners" ON partners;
CREATE POLICY "public_read_partners"       ON partners             FOR SELECT USING (active = TRUE);
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials"   ON testimonials         FOR SELECT USING (approved = TRUE);
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories"     ON categories           FOR SELECT USING (published = TRUE);
DROP POLICY IF EXISTS "public_read_courses" ON courses;
CREATE POLICY "public_read_courses"        ON courses              FOR SELECT USING (published = TRUE);
DROP POLICY IF EXISTS "public_read_venues" ON venues;
CREATE POLICY "public_read_venues"         ON venues               FOR SELECT USING (active = TRUE);
DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs"           ON faqs                 FOR SELECT USING (active = TRUE);
DROP POLICY IF EXISTS "public_read_blog" ON blog_posts;
CREATE POLICY "public_read_blog"           ON blog_posts           FOR SELECT USING (published = TRUE);

-- PUBLIC INSERT policies (form submissions)
DROP POLICY IF EXISTS "public_insert_enrollments" ON enrollments;
CREATE POLICY "public_insert_enrollments"   ON enrollments          FOR INSERT WITH CHECK (TRUE);
DROP POLICY IF EXISTS "public_insert_contact" ON contact_submissions;
CREATE POLICY "public_insert_contact"       ON contact_submissions  FOR INSERT WITH CHECK (TRUE);
DROP POLICY IF EXISTS "public_insert_trainer_app" ON trainer_applications;
CREATE POLICY "public_insert_trainer_app"   ON trainer_applications FOR INSERT WITH CHECK (TRUE);

-- Profile: user can read/update their own
DROP POLICY IF EXISTS "user_read_own_profile" ON profiles;
CREATE POLICY "user_read_own_profile"   ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;
CREATE POLICY "user_update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ADMIN FULL ACCESS policies
DROP POLICY IF EXISTS "admin_all_site_content" ON site_content;
CREATE POLICY "admin_all_site_content"   ON site_content         FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_stats" ON stats;
CREATE POLICY "admin_all_stats"          ON stats                FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_partners" ON partners;
CREATE POLICY "admin_all_partners"       ON partners             FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_testimonials" ON testimonials;
CREATE POLICY "admin_all_testimonials"   ON testimonials         FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_categories" ON categories;
CREATE POLICY "admin_all_categories"     ON categories           FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_courses" ON courses;
CREATE POLICY "admin_all_courses"        ON courses              FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_venues" ON venues;
CREATE POLICY "admin_all_venues"         ON venues               FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_faqs" ON faqs;
CREATE POLICY "admin_all_faqs"           ON faqs                 FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_blog" ON blog_posts;
CREATE POLICY "admin_all_blog"           ON blog_posts           FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_enrollments" ON enrollments;
CREATE POLICY "admin_all_enrollments"    ON enrollments          FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_contact" ON contact_submissions;
CREATE POLICY "admin_all_contact"        ON contact_submissions  FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_trainer_apps" ON trainer_applications;
CREATE POLICY "admin_all_trainer_apps"   ON trainer_applications FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;
CREATE POLICY "admin_all_profiles"       ON profiles             FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "admin_all_invoices" ON invoices;
CREATE POLICY "admin_all_invoices"       ON invoices             FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- SEED ADMIN USER
-- ─────────────────────────────────────────────
-- After running this schema, create an admin user via Supabase Auth dashboard:
-- 1. Go to Authentication > Users > Add User
-- 2. Email: admin@gsac.org | Password: (your secure password)
-- 3. Then run: UPDATE profiles SET role = 'admin' WHERE email = 'admin@gsac.org';

-- ─────────────────────────────────────────────────────────────────────────
-- IMPORTANT: After creating your admin user via Supabase Auth dashboard,
-- run the following SQL to promote them to admin role:
--
--   UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
--
-- ─────────────────────────────────────────────────────────────────────────
