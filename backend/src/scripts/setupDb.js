import { query } from '../config/database.js';

// Simple database setup without complex SQL parsing
export const setupDatabaseSimple = async () => {
  try {
    console.log('🔄 Setting up database tables...');

    // Enable UUID extension
    await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
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
      )
    `);
    console.log('✅ Users table created');

    // Create NGOs table
    await query(`
      CREATE TABLE IF NOT EXISTS ngos (
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
        services TEXT[],
        operating_hours JSONB,
        capacity_per_day INTEGER DEFAULT 10,
        rating DECIMAL(3, 2) DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
        license_document_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ NGOs table created');

    // Create eco_impact_formulas table
    await query(`
      CREATE TABLE IF NOT EXISTS eco_impact_formulas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        device_type VARCHAR(50) NOT NULL UNIQUE,
        water_saved_per_kg DECIMAL(10, 2) DEFAULT 500.0,
        co2_saved_per_kg DECIMAL(10, 2) DEFAULT 2.5,
        toxic_waste_prevented_per_kg DECIMAL(10, 2) DEFAULT 0.1,
        points_per_kg INTEGER DEFAULT 10,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Eco impact formulas table created');

    // Create devices table
    await query(`
      CREATE TABLE IF NOT EXISTS devices (
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
        image_urls TEXT[],
        ai_confidence_score DECIMAL(5, 4),
        ocr_data JSONB,
        description TEXT,
        pickup_address TEXT,
        pickup_instructions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Devices table created');

    // Create pickups table
    await query(`
      CREATE TABLE IF NOT EXISTS pickups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
        pickup_date DATE NOT NULL,
        pickup_time_slot VARCHAR(20),
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
      )
    `);
    console.log('✅ Pickups table created');

    // Create pickup_devices junction table
    await query(`
      CREATE TABLE IF NOT EXISTS pickup_devices (
        pickup_id UUID REFERENCES pickups(id) ON DELETE CASCADE,
        device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
        PRIMARY KEY (pickup_id, device_id)
      )
    `);
    console.log('✅ Pickup devices junction table created');

    // Create communities table
    await query(`
      CREATE TABLE IF NOT EXISTS communities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        community_type VARCHAR(50) DEFAULT 'local',
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
      )
    `);
    console.log('✅ Communities table created');

    // Create community_members junction table
    await query(`
      CREATE TABLE IF NOT EXISTS community_members (
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        points_contributed INTEGER DEFAULT 0,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
        PRIMARY KEY (community_id, user_id)
      )
    `);
    console.log('✅ Community members junction table created');

    // Create badges table
    await query(`
      CREATE TABLE IF NOT EXISTS badges (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon_url TEXT,
        criteria JSONB,
        points_required INTEGER,
        badge_type VARCHAR(50) DEFAULT 'achievement',
        rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Badges table created');

    // Create user_badges junction table
    await query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
        earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, badge_id)
      )
    `);
    console.log('✅ User badges junction table created');

    // Create impact_reports table
    await query(`
      CREATE TABLE IF NOT EXISTS impact_reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
        pickup_id UUID REFERENCES pickups(id) ON DELETE SET NULL,
        water_saved_liters DECIMAL(10, 2) DEFAULT 0,
        co2_saved_kg DECIMAL(10, 2) DEFAULT 0,
        toxic_waste_prevented_kg DECIMAL(10, 2) DEFAULT 0,
        points_awarded INTEGER DEFAULT 0,
        calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        report_period VARCHAR(20) DEFAULT 'single_device',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Impact reports table created');

    // Create indexes
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await query('CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_pickups_user_id ON pickups(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_pickups_ngo_id ON pickups(ngo_id)');
    console.log('✅ Indexes created');

    // Insert default eco-impact formulas
    await query(`
      INSERT INTO eco_impact_formulas (device_type, water_saved_per_kg, co2_saved_per_kg, toxic_waste_prevented_per_kg, points_per_kg) 
      VALUES 
        ('smartphone', 800.0, 3.2, 0.15, 15),
        ('laptop', 1200.0, 4.8, 0.25, 25),
        ('desktop', 1500.0, 6.0, 0.35, 30),
        ('tablet', 600.0, 2.4, 0.12, 12),
        ('other', 500.0, 2.0, 0.10, 10)
      ON CONFLICT (device_type) DO NOTHING
    `);
    console.log('✅ Default eco-impact formulas inserted');

    // Insert default badges
    await query(`
      INSERT INTO badges (name, description, points_required, badge_type, rarity) 
      VALUES 
        ('First Drop', 'Uploaded your first device for recycling', 0, 'milestone', 'common'),
        ('Eco Warrior', 'Recycled 10 devices', 150, 'achievement', 'rare'),
        ('Green Champion', 'Saved 1000 liters of water through recycling', 300, 'achievement', 'epic')
      ON CONFLICT (name) DO NOTHING
    `);
    console.log('✅ Default badges inserted');

    console.log('🎉 Database setup completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  }
};