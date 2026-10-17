-- Pureframe Local PostgreSQL Schema
-- Database: pureframe_db

-- Drop tables if needed for clean re-init
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    free_attempts_left INTEGER NOT NULL DEFAULT 3,
    free_attempts_used INTEGER NOT NULL DEFAULT 0,
    is_payment_done BOOLEAN NOT NULL DEFAULT FALSE,
    selected_plan VARCHAR(50) NOT NULL DEFAULT 'none',
    plan_activated_at TIMESTAMP,
    unlocked_deeds JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Plans Reference Table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    badge VARCHAR(50),
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Insert or Update default pricing plans
INSERT INTO plans (id, name, price, period, badge, description, features)
VALUES 
    (
        'starter', 
        'Starter Explorer', 
        999, 
        'monthly', 
        'Basic', 
        'Ideal for individual home buyers checking 1-2 localities',
        '["25 Verified Deed Unlocks", "Standard IGR Stamp Records", "30-Day Historical Trend Charts", "Email Support"]'::jsonb
    ),
    (
        'investor', 
        'Investor Pro', 
        2499, 
        'monthly', 
        'Most Popular', 
        'Full unlimited intelligence for serious home buyers and investors',
        '["Unlimited Certified Deed Unlocks", "Instant PDF Agreement Copies", "AI Negotiation Price Predictor", "Direct Sub-Registrar Sync", "Priority WhatsApp Support"]'::jsonb
    ),
    (
        'enterprise', 
        'Broker & Enterprise', 
        5999, 
        'monthly', 
        'Full Power', 
        'For real estate brokerages, lawyers, and wealth managers',
        '["Unlimited Deeds for Up to 5 Team Members", "Bulk CSV / Excel Export", "Full MahaRERA Litigation Intelligence", "Dedicated Account Manager", "REST API Access"]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- Insert default demo user (from screenshot number 9172272519)
INSERT INTO users (phone, name, free_attempts_left, free_attempts_used, is_payment_done, selected_plan, unlocked_deeds)
VALUES 
    ('9172272519', 'Vedant Sharma', 3, 0, FALSE, 'none', '["11089052"]'::jsonb)
ON CONFLICT (phone) DO UPDATE 
SET name = EXCLUDED.name;

-- Sample audit log for unlocks
CREATE TABLE IF NOT EXISTS unlock_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    transaction_id VARCHAR(50) NOT NULL,
    method VARCHAR(20) NOT NULL DEFAULT 'free_trial',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pune Projects Hierarchy Table
CREATE TABLE IF NOT EXISTS pune_projects (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    project_name TEXT NOT NULL,
    project_slug TEXT,
    rera_id TEXT,
    registration_number TEXT,
    date_of_registration TEXT,
    proposed_completion_date TEXT,
    taluka TEXT NOT NULL,
    taluka_slug TEXT NOT NULL,
    village TEXT NOT NULL,
    village_slug TEXT NOT NULL,
    address TEXT,
    street_name TEXT,
    locality TEXT,
    pin_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pune_projects_taluka ON pune_projects(taluka_slug);
CREATE INDEX IF NOT EXISTS idx_pune_projects_village ON pune_projects(village_slug);

-- Kharadi Projects & Transactions Tables
CREATE TABLE IF NOT EXISTS kharadi_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    locality TEXT NOT NULL DEFAULT 'Kharadi',
    taluka TEXT NOT NULL DEFAULT 'Haveli',
    city TEXT NOT NULL DEFAULT 'Pune',
    developer TEXT,
    rera_id TEXT,
    sale_txns INTEGER NOT NULL DEFAULT 0,
    avg_price BIGINT NOT NULL DEFAULT 0,
    quoted_pricing TEXT,
    bhks TEXT,
    completion TEXT,
    address TEXT,
    pin_code TEXT DEFAULT '411014',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_records (
    id SERIAL PRIMARY KEY,
    record_id TEXT,
    project_slug TEXT,
    project_name TEXT,
    locality TEXT DEFAULT 'Kharadi',
    city TEXT DEFAULT 'Pune',
    doc_no TEXT,
    reg_date TEXT,
    price BIGINT DEFAULT 0,
    price_formatted TEXT,
    carpet_area TEXT,
    unit TEXT,
    building TEXT,
    purchaser TEXT,
    seller TEXT,
    sro_name TEXT,
    doc_type TEXT,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_records_project_slug ON property_records(project_slug);
CREATE INDEX IF NOT EXISTS idx_records_locality ON property_records(locality);
