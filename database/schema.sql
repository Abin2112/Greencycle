
-- GreenCycle Database Schema
-- Smart E-waste Management Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'ngo', 'admin')),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NGOs table
CREATE TABLE ngos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website_url TEXT,
    services TEXT[], -- Array of services offered
    operating_hours JSONB, -- Store operating hours as JSON
    capacity_per_day INTEGER DEFAULT 10,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    license_document_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Device types and eco-impact formulas
CREATE TABLE eco_impact_formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_type VARCHAR(50) NOT NULL UNIQUE,
    water_saved_per_kg DECIMAL(10, 2) DEFAULT 500.0, -- Liters per kg
    co2_saved_per_kg DECIMAL(10, 2) DEFAULT 2.5, -- kg CO2 per kg device
    toxic_waste_prevented_per_kg DECIMAL(10, 2) DEFAULT 0.1, -- kg toxic waste per kg device
    points_per_kg INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ngo_id UUID REFERENCES ngos(id) ON DELETE SET NULL,
    device_type VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(255),
    estimated_value DECIMAL(10, 2),
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'broken')),
    weight_kg DECIMAL(8, 3),
    status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'pickup_scheduled', 'picked_up', 'received', 'processing', 'refurbished', 'donated', 'recycled', 'disposed')),
    recommendation VARCHAR(20) CHECK (recommendation IN ('donate', 'recycle', 'resell', 'repair')),
    qr_code VARCHAR(255) UNIQUE,
    image_urls TEXT[], -- Array of image URLs
    ai_confidence_score DECIMAL(5, 4), -- 0.0000 to 1.0000
    ocr_data JSONB, -- Store extracted text/data from OCR
    description TEXT,
    pickup_address TEXT,
    pickup_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pickups (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ngo_id INTEGER REFERENCES ngos(id) ON DELETE CASCADE,
    pickup_date TIMESTAMP,
    scheduled_time_slot VARCHAR(50),
    pickup_address TEXT,
    special_instructions TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    pickup_person_name VARCHAR(255),
    pickup_person_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE impact_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
    water_saved DECIMAL(10, 3), 
    co2_saved DECIMAL(10, 3), 
    toxic_saved DECIMAL(10, 3), 
    energy_saved DECIMAL(10, 3),
    raw_materials_saved JSONB, 
    calculation_method TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), 
    location JSONB, 
    admin_user_id INTEGER REFERENCES users(id),
    member_count INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_members (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    points_contributed INTEGER DEFAULT 0,
    UNIQUE(community_id, user_id)
);

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), 
    target_value INTEGER,
    target_metric VARCHAR(50), 
    reward_points INTEGER,
    reward_badge VARCHAR(100),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenge_participations (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id)
);

CREATE TABLE eco_impact_formulas (
    id SERIAL PRIMARY KEY,
    device_type VARCHAR(50) NOT NULL,
    weight_category VARCHAR(20), 
    water_per_kg DECIMAL(10, 3),
    co2_per_kg DECIMAL(10, 3),
    toxic_per_kg DECIMAL(10, 3),
    energy_per_kg DECIMAL(10, 3),
    raw_materials_per_kg JSONB,
    source VARCHAR(255), 
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    entity_type VARCHAR(50), 
    entity_id INTEGER,
    properties JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), 
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_pickups_user_id ON pickups(user_id);
CREATE INDEX idx_pickups_ngo_id ON pickups(ngo_id);
CREATE INDEX idx_pickups_status ON pickups(status);
CREATE INDEX idx_pickups_date ON pickups(pickup_date);
CREATE INDEX idx_ngos_location ON ngos(latitude, longitude);
CREATE INDEX idx_impact_reports_user_id ON impact_reports(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

INSERT INTO eco_impact_formulas (device_type, weight_category, water_per_kg, co2_per_kg, toxic_per_kg, energy_per_kg, raw_materials_per_kg, source) VALUES
('smartphone', 'light', 500.0, 15.0, 0.5, 25.0, '{"metal": 0.15, "plastic": 0.1, "glass": 0.05}', 'Environmental Research Institute 2024'),
('laptop', 'medium', 800.0, 25.0, 1.2, 45.0, '{"metal": 0.8, "plastic": 0.4, "glass": 0.2}', 'Environmental Research Institute 2024'),
('tablet', 'medium', 600.0, 18.0, 0.8, 30.0, '{"metal": 0.3, "plastic": 0.2, "glass": 0.1}', 'Environmental Research Institute 2024'),
('battery', 'heavy', 1000.0, 35.0, 2.5, 60.0, '{"metal": 0.6, "plastic": 0.1, "chemicals": 0.3}', 'Environmental Research Institute 2024'),
('desktop', 'heavy', 1200.0, 40.0, 2.0, 80.0, '{"metal": 2.0, "plastic": 1.0, "glass": 0.3}', 'Environmental Research Institute 2024');