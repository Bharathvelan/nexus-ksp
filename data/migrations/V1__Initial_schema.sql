-- ==============================================================================
-- NEXUS-KSP PostgreSQL Schema Migration
-- V1__Initial_schema.sql
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Schema Setup & Tables
CREATE SCHEMA IF NOT EXISTS nexus;
SET search_path TO nexus, public;

-- Table: fir
CREATE TABLE fir (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_number VARCHAR(50) UNIQUE NOT NULL,
    station_code VARCHAR(20) NOT NULL,
    district VARCHAR(50) NOT NULL,
    date_filed TIMESTAMP NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    ipc_sections TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    description_text TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom geometry(Point, 4326),
    investigating_officer_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: accused
CREATE TABLE accused (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    alias TEXT[],
    dob DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50) DEFAULT 'Indian',
    address TEXT,
    aadhaar_hash VARCHAR(256),
    photo_url TEXT,
    risk_score FLOAT DEFAULT 0.0,
    criminal_history_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: fir_accused
CREATE TABLE fir_accused (
    fir_id UUID NOT NULL REFERENCES fir(id) ON DELETE CASCADE,
    accused_id UUID NOT NULL REFERENCES accused(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    arrest_date TIMESTAMP,
    bail_status VARCHAR(20) DEFAULT 'N/A',
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fir_id, accused_id)
);

-- Table: victims
CREATE TABLE victims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_id UUID NOT NULL REFERENCES fir(id) ON DELETE CASCADE,
    name VARCHAR(150),
    age INT,
    gender VARCHAR(10),
    address TEXT,
    injury_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    district VARCHAR(50) NOT NULL,
    taluk VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom geometry(Point, 4326),
    crime_count INT DEFAULT 0,
    hotspot_score FLOAT DEFAULT 0.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: financial_transactions
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accused_id UUID NOT NULL REFERENCES accused(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    transaction_date TIMESTAMP NOT NULL,
    bank_code VARCHAR(50),
    account_hash VARCHAR(256),
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT
);

-- Table: investigation_notes
CREATE TABLE investigation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_id UUID NOT NULL REFERENCES fir(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL,
    note_text TEXT NOT NULL,
    note_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: conversation_sessions
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: audit_log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    query_text TEXT,
    response_hash VARCHAR(256)
);

-- 3. Indices
-- Geospatial Index
CREATE INDEX idx_fir_geom ON fir USING GIST (geom);
CREATE INDEX idx_locations_geom ON locations USING GIST (geom);

-- Full-Text Search Index (pg_trgm)
CREATE INDEX idx_fir_description_trgm ON fir USING GIN (description_text gin_trgm_ops);

-- Partial Indices
CREATE INDEX idx_fir_status_open ON fir (status) WHERE status = 'OPEN';
CREATE INDEX idx_fir_district ON fir (district);
CREATE INDEX idx_fir_crime_type ON fir (crime_type);
CREATE INDEX idx_fir_date_filed ON fir (date_filed);

-- Other regular indices for foreign keys and common filters
CREATE INDEX idx_fir_accused_accused_id ON fir_accused(accused_id);
CREATE INDEX idx_victims_fir_id ON victims(fir_id);
CREATE INDEX idx_financial_accused_id ON financial_transactions(accused_id);
CREATE INDEX idx_investigation_notes_fir_id ON investigation_notes(fir_id);

-- 4. Audit Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fir_updated_at BEFORE UPDATE ON fir FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversation_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. Row-Level Security (RLS)
-- Enable RLS on core tables
ALTER TABLE fir ENABLE ROW LEVEL SECURITY;
ALTER TABLE accused ENABLE ROW LEVEL SECURITY;

-- We assume `current_setting('nexus.current_jurisdiction')` is set by our APIs 
-- based on the authenticated user's jurisdiction before querying.
-- This restricts officers to only see data within their jurisdiction, 
-- or all data if they have 'STATE' level access.
CREATE POLICY fir_jurisdiction_policy ON fir
    FOR ALL
    USING (
        current_setting('nexus.current_jurisdiction', true) = 'STATE' OR 
        district = current_setting('nexus.current_jurisdiction', true)
    );

-- Because accused might commit crimes across districts, we allow reading 
-- accused profiles globally, but modifications only if linked to an FIR in their district.
-- For simplicity in this demo, reading accused is globally allowed:
CREATE POLICY accused_read_policy ON accused FOR SELECT USING (true);
