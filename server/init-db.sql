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
