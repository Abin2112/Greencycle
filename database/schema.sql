
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'ngo', 'admin')),
    points INTEGER DEFAULT 0,
    badges TEXT[], 
    profile_image TEXT,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ngos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    services TEXT[],
    contact_info JSONB, 
    operating_hours JSONB,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, 
    brand VARCHAR(100),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'pending_pickup', 'picked_up', 'received', 'processing', 'refurbished', 'donated', 'recycled')),
    valuation JSONB, 
    weight DECIMAL(8, 3), 
    images TEXT[], 
    qr_code TEXT UNIQUE,
    ai_detection_result JSONB, 
    ocr_data JSONB, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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