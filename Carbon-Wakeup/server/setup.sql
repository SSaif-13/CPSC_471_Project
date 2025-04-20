-- schema_setup.sql
-- Connect to default 'postgres' database first (no \connect needed)

-- 1. Create schemas instead of databases
CREATE SCHEMA IF NOT EXISTS emissions;
CREATE SCHEMA IF NOT EXISTS users;

-- 2. Set search path for convenience
SET search_path TO emissions, users, public;

-- 3. Create Emissions Table
CREATE TABLE IF NOT EXISTS emissions.emissions_data (
    id SERIAL PRIMARY KEY,
    country TEXT NOT NULL,
    code TEXT,
    year INTEGER NOT NULL,
    annual_co2_emissions NUMERIC(12,1),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create User Tables
CREATE TABLE IF NOT EXISTS users.user_accounts (
    user_id TEXT PRIMARY KEY,
    user_type TEXT NOT NULL,
    registration_date DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users.passwords (
    password_hash TEXT NOT NULL,
    user_id TEXT REFERENCES users.user_accounts(user_id),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users.donations (
    donation_id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users.user_accounts(user_id),
    amount NUMERIC(10,2) NOT NULL,
    donation_date DATE NOT NULL,
    organization TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users.carbon_footprints (
    footprint_id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users.user_accounts(user_id),
    footprint NUMERIC(10,1) NOT NULL,
    measurement_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX idx_emissions_country_year ON emissions.emissions_data(country, year);
CREATE INDEX idx_user_email ON users.user_accounts(email);