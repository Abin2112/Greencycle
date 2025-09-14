-- GreenCycle Database Schema
-- Smart E-waste Management Platform

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS pickup_devices CASCADE;
DROP TABLE IF EXISTS impact_reports CASCADE;
DROP TABLE IF EXISTS pickups CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS ngos CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS eco_impact_formulas CASCADE;

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

-- Pickups table
CREATE TABLE pickups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
    pickup_date DATE NOT NULL,
    pickup_time_slot VARCHAR(20), -- e.g., "09:00-12:00"
    pickup_address TEXT NOT NULL,
    pickup_instructions TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    vehicle_details VARCHAR(255),
    estimated_arrival TIME,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    total_devices INTEGER DEFAULT 0,
    total_weight_kg DECIMAL(10, 3) DEFAULT 0,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for pickup devices (many-to-many)
CREATE TABLE pickup_devices (
    pickup_id UUID REFERENCES pickups(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    PRIMARY KEY (pickup_id, device_id)
);

-- Communities table
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    community_type VARCHAR(50) DEFAULT 'local', -- local, corporate, school, etc.
    location VARCHAR(255),
    admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_points INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    challenge_active BOOLEAN DEFAULT false,
    challenge_start_date DATE,
    challenge_end_date DATE,
    challenge_description TEXT,
    challenge_target INTEGER,
    challenge_progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Community members junction table
CREATE TABLE community_members (
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    points_contributed INTEGER DEFAULT 0,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    PRIMARY KEY (community_id, user_id)
);

-- Badges table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    criteria JSONB, -- Store badge earning criteria as JSON
    points_required INTEGER,
    badge_type VARCHAR(50) DEFAULT 'achievement', -- achievement, milestone, special
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User badges junction table
CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

-- Impact reports table
CREATE TABLE impact_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    pickup_id UUID REFERENCES pickups(id) ON DELETE SET NULL,
    water_saved_liters DECIMAL(10, 2) DEFAULT 0,
    co2_saved_kg DECIMAL(10, 2) DEFAULT 0,
    toxic_waste_prevented_kg DECIMAL(10, 2) DEFAULT 0,
    points_awarded INTEGER DEFAULT 0,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    report_period VARCHAR(20) DEFAULT 'single_device', -- single_device, monthly, yearly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_ngos_location ON ngos(latitude, longitude);
CREATE INDEX idx_ngos_city ON ngos(city);
CREATE INDEX idx_ngos_verification_status ON ngos(verification_status);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_ngo_id ON devices(ngo_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_device_type ON devices(device_type);
CREATE INDEX idx_devices_qr_code ON devices(qr_code);
CREATE INDEX idx_pickups_user_id ON pickups(user_id);
CREATE INDEX idx_pickups_ngo_id ON pickups(ngo_id);
CREATE INDEX idx_pickups_status ON pickups(status);
CREATE INDEX idx_pickups_pickup_date ON pickups(pickup_date);
CREATE INDEX idx_impact_reports_user_id ON impact_reports(user_id);
CREATE INDEX idx_impact_reports_device_id ON impact_reports(device_id);
CREATE INDEX idx_community_members_user_id ON community_members(user_id);

-- Insert default eco-impact formulas
INSERT INTO eco_impact_formulas (device_type, water_saved_per_kg, co2_saved_per_kg, toxic_waste_prevented_per_kg, points_per_kg) VALUES
('smartphone', 800.0, 3.2, 0.15, 15),
('laptop', 1200.0, 4.8, 0.25, 25),
('desktop', 1500.0, 6.0, 0.35, 30),
('tablet', 600.0, 2.4, 0.12, 12),
('smartwatch', 300.0, 1.2, 0.08, 8),
('headphones', 200.0, 0.8, 0.05, 5),
('charger', 150.0, 0.6, 0.03, 3),
('battery', 400.0, 1.6, 0.20, 10),
('monitor', 1000.0, 4.0, 0.30, 20),
('keyboard', 100.0, 0.4, 0.02, 2),
('mouse', 80.0, 0.3, 0.02, 2),
('printer', 2000.0, 8.0, 0.40, 40),
('camera', 500.0, 2.0, 0.10, 10),
('gaming_console', 1800.0, 7.2, 0.45, 35),
('router', 300.0, 1.2, 0.08, 8),
('other', 500.0, 2.0, 0.10, 10);

-- Insert default badges
INSERT INTO badges (name, description, icon_url, criteria, points_required, badge_type, rarity) VALUES
('First Drop', 'Uploaded your first device for recycling', '/icons/badges/first-drop.svg', '{"devices_uploaded": 1}', 0, 'milestone', 'common'),
('Eco Warrior', 'Recycled 10 devices', '/icons/badges/eco-warrior.svg', '{"devices_recycled": 10}', 150, 'achievement', 'rare'),
('Green Champion', 'Saved 1000 liters of water through recycling', '/icons/badges/green-champion.svg', '{"water_saved": 1000}', 300, 'achievement', 'epic'),
('Carbon Crusher', 'Prevented 50kg of CO2 emissions', '/icons/badges/carbon-crusher.svg', '{"co2_saved": 50}', 500, 'achievement', 'epic'),
('Community Builder', 'Invited 5 friends to join GreenCycle', '/icons/badges/community-builder.svg', '{"referrals": 5}', 100, 'achievement', 'rare'),
('Streak Master', 'Recycled devices for 30 consecutive days', '/icons/badges/streak-master.svg', '{"streak_days": 30}', 750, 'achievement', 'legendary'),
('Tech Savvy', 'Recycled devices from 5 different categories', '/icons/badges/tech-savvy.svg', '{"device_categories": 5}', 200, 'achievement', 'rare'),
('Early Bird', 'One of the first 100 users on GreenCycle', '/icons/badges/early-bird.svg', '{"user_number": 100}', 0, 'special', 'legendary');

-- Insert sample community
INSERT INTO communities (name, description, community_type, location) VALUES
('Green Delhi', 'Delhi''s largest e-waste recycling community', 'local', 'Delhi, India'),
('EcoTech Mumbai', 'Mumbai tech professionals going green', 'corporate', 'Mumbai, India'),
('Bangalore Green Warriors', 'Silicon Valley of India''s sustainability heroes', 'local', 'Bangalore, India');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ngos_updated_at BEFORE UPDATE ON ngos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pickups_updated_at BEFORE UPDATE ON pickups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eco_impact_formulas_updated_at BEFORE UPDATE ON eco_impact_formulas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();