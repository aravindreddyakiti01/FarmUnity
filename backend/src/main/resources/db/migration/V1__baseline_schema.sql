-- FarmUnity Baseline Schema Migration V1

CREATE TABLE IF NOT EXISTS farmers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'FARMER',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    trust_tier VARCHAR(50) NOT NULL DEFAULT 'NEW',
    reliability_score NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buyers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'BUYER',
    org_type VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    trust_tier VARCHAR(50) NOT NULL DEFAULT 'NEW',
    reliability_score NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    commitment_deposit_balance NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coordinators (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'COORDINATOR',
    region VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    capacity NUMERIC(15, 4) NOT NULL,
    fee_per_kg NUMERIC(15, 4) NOT NULL,
    wallet_balance NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crop_configs (
    id BIGSERIAL PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL UNIQUE,
    variety VARCHAR(100),
    moisture_min NUMERIC(5, 2) NOT NULL,
    moisture_max NUMERIC(5, 2) NOT NULL,
    expected_yield_ratio NUMERIC(5, 4) NOT NULL,
    max_distance_km NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    harvest_window_days INTEGER NOT NULL DEFAULT 30
);

CREATE TABLE IF NOT EXISTS produce_listings (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    crop VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    declared_qty NUMERIC(15, 4) NOT NULL,
    verified_qty NUMERIC(15, 4),
    harvest_date DATE,
    min_price_per_kg NUMERIC(15, 4) NOT NULL,
    moisture_reading NUMERIC(5, 2),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    storage_condition VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buyer_requirements (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    product VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    quantity_kg NUMERIC(15, 4) NOT NULL,
    moisture_band_min NUMERIC(5, 2) NOT NULL,
    moisture_band_max NUMERIC(5, 2) NOT NULL,
    price_min NUMERIC(15, 4) NOT NULL,
    price_max NUMERIC(15, 4) NOT NULL,
    delivery_window_start DATE,
    delivery_window_end DATE,
    destination TEXT,
    destination_latitude DOUBLE PRECISION,
    destination_longitude DOUBLE PRECISION,
    commitment_deposit NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    trust_level_required VARCHAR(50) NOT NULL DEFAULT 'NEW',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_records (
    id BIGSERIAL PRIMARY KEY,
    produce_listing_id BIGINT NOT NULL UNIQUE REFERENCES produce_listings(id) ON DELETE CASCADE,
    verified_qty NUMERIC(15, 4),
    moisture_reading NUMERIC(5, 2) NOT NULL,
    verifier_id BIGINT NOT NULL REFERENCES coordinators(id),
    timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    evidence_notes TEXT,
    photo_urls TEXT
);

CREATE TABLE IF NOT EXISTS cooperative_batches (
    id BIGSERIAL PRIMARY KEY,
    buyer_requirement_id BIGINT NOT NULL REFERENCES buyer_requirements(id),
    status VARCHAR(50) NOT NULL DEFAULT 'FORMING',
    shortfall_qty NUMERIC(15, 4),
    total_allocated_qty NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_memberships (
    id BIGSERIAL PRIMARY KEY,
    cooperative_batch_id BIGINT NOT NULL REFERENCES cooperative_batches(id) ON DELETE CASCADE,
    farmer_id BIGINT NOT NULL REFERENCES farmers(id),
    produce_listing_id BIGINT NOT NULL REFERENCES produce_listings(id),
    allocated_qty NUMERIC(15, 4) NOT NULL,
    inclusion_reason VARCHAR(255),
    farmer_decision VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    farmer_note TEXT
);

CREATE TABLE IF NOT EXISTS agreements (
    id BIGSERIAL PRIMARY KEY,
    cooperative_batch_id BIGINT NOT NULL UNIQUE REFERENCES cooperative_batches(id),
    version INTEGER NOT NULL DEFAULT 1,
    version_lock BIGINT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    agreed_price_per_kg NUMERIC(15, 4),
    overlap_low NUMERIC(15, 4),
    overlap_high NUMERIC(15, 4),
    total_value_gross NUMERIC(15, 4),
    transport_deduction_per_kg NUMERIC(15, 4) DEFAULT 0.0000,
    platform_fee_rate NUMERIC(5, 4) DEFAULT 0.0200,
    amendment_reason TEXT,
    integrity_hash VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commitment_ledgers (
    id BIGSERIAL PRIMARY KEY,
    agreement_id BIGINT NOT NULL UNIQUE REFERENCES agreements(id),
    buyer_id BIGINT NOT NULL REFERENCES buyers(id),
    committed_amount NUMERIC(15, 4) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    deadline TIMESTAMP WITHOUT TIME ZONE,
    funded_at TIMESTAMP WITHOUT TIME ZONE,
    pickup_verified_at TIMESTAMP WITHOUT TIME ZONE,
    delivered_at TIMESTAMP WITHOUT TIME ZONE,
    released_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_work_orders (
    id BIGSERIAL PRIMARY KEY,
    agreement_id BIGINT NOT NULL REFERENCES agreements(id),
    processor_id BIGINT NOT NULL REFERENCES processors(id),
    raw_input_qty NUMERIC(15, 4) NOT NULL,
    expected_yield_ratio NUMERIC(5, 4) NOT NULL,
    actual_output_qty NUMERIC(15, 4),
    actual_yield_ratio NUMERIC(5, 4),
    fee NUMERIC(15, 4) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    flagged_for_review BOOLEAN NOT NULL DEFAULT FALSE,
    flag_reason TEXT,
    processor_adjustment NUMERIC(15, 4) DEFAULT 0.0000,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settlements (
    id BIGSERIAL PRIMARY KEY,
    agreement_id BIGINT NOT NULL REFERENCES agreements(id),
    farmer_id BIGINT NOT NULL REFERENCES farmers(id),
    verified_qty NUMERIC(15, 4) NOT NULL,
    gross_amount NUMERIC(15, 4) NOT NULL,
    transport_deduction NUMERIC(15, 4) NOT NULL,
    platform_fee NUMERIC(15, 4) NOT NULL,
    net_payout NUMERIC(15, 4) NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    integrity_hash VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    actor_id BIGINT,
    actor_role VARCHAR(50),
    timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    details TEXT,
    previous_state VARCHAR(100),
    new_state VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_farmer ON produce_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_crop ON produce_listings(crop);
CREATE INDEX IF NOT EXISTS idx_listings_status ON produce_listings(status);
CREATE INDEX IF NOT EXISTS idx_reqs_buyer ON buyer_requirements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
