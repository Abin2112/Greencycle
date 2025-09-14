import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database with schema
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../../database/init.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements and group them
    const allStatements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Separate statements into categories for proper execution order
    const dropStatements = allStatements.filter(stmt => stmt.startsWith('DROP'));
    const extensionStatements = allStatements.filter(stmt => stmt.includes('CREATE EXTENSION'));
    const tableStatements = allStatements.filter(stmt => 
      stmt.startsWith('CREATE TABLE') || 
      (stmt.startsWith('CREATE OR REPLACE FUNCTION') && !stmt.includes('TRIGGER'))
    );
    const indexStatements = allStatements.filter(stmt => stmt.startsWith('CREATE INDEX'));
    const triggerStatements = allStatements.filter(stmt => stmt.startsWith('CREATE TRIGGER'));
    const insertStatements = allStatements.filter(stmt => stmt.startsWith('INSERT'));

    console.log(`📋 Found: ${tableStatements.length} tables, ${indexStatements.length} indexes, ${triggerStatements.length} triggers, ${insertStatements.length} inserts`);
    
    // Debug: Log first few table statements
    if (tableStatements.length > 0) {
      console.log('First table statement:', tableStatements[0].substring(0, 100) + '...');
    } else {
      console.log('⚠️ No table statements found! All statements:');
      allStatements.slice(0, 5).forEach((stmt, i) => {
        console.log(`${i}: ${stmt.substring(0, 100)}...`);
      });
    }

    console.log(`📋 Executing database setup in proper order...`);

    // Execute in proper order
    const statementGroups = [
      { name: 'Extensions', statements: extensionStatements },
      { name: 'Drop statements', statements: dropStatements },
      { name: 'Tables and functions', statements: tableStatements },
      { name: 'Indexes', statements: indexStatements },
      { name: 'Triggers', statements: triggerStatements },
      { name: 'Initial data', statements: insertStatements }
    ];

    for (const group of statementGroups) {
      if (group.statements.length > 0) {
        console.log(`🔧 Creating ${group.name}...`);
        for (const statement of group.statements) {
          try {
            await query(statement);
          } catch (error) {
            // Only log errors that aren't expected (like DROP IF EXISTS)
            if (!statement.includes('DROP') && !statement.includes('IF NOT EXISTS')) {
              console.error(`❌ Error in ${group.name}:`, error.message);
            }
          }
        }
      }
    }

    console.log('✅ Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

// Create admin user if not exists
export const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@greencycle.com';
    const adminName = process.env.ADMIN_NAME || 'GreenCycle Admin';

    // Check if admin user exists
    const existingAdmin = await query(
      'SELECT id FROM users WHERE email = $1 AND role = $2',
      [adminEmail, 'admin']
    );

    if (existingAdmin.rows.length === 0) {
      // Create admin user
      await query(
        `INSERT INTO users (email, name, role, is_active, email_verified, points, level) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [adminEmail, adminName, 'admin', true, true, 1000, 10]
      );
      console.log('✅ Admin user created:', adminEmail);
    } else {
      console.log('ℹ️ Admin user already exists:', adminEmail);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Seed sample data for development
export const seedSampleData = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Skipping sample data seeding in production');
      return;
    }

    console.log('🌱 Seeding sample data...');

    // Create sample NGO user
    const ngoUserResult = await query(
      `INSERT INTO users (email, name, role, phone, address, is_active, email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['greentech.ngo@gmail.com', 'GreenTech Solutions', 'ngo', '+91-9876543210', 'Delhi, India', true, true]
    );

    if (ngoUserResult.rows.length > 0) {
      const ngoUserId = ngoUserResult.rows[0].id;

      // Create sample NGO
      await query(
        `INSERT INTO ngos (user_id, name, registration_number, address, latitude, longitude, city, state, contact_person, contact_email, contact_phone, services, verification_status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (registration_number) DO NOTHING`,
        [
          ngoUserId,
          'GreenTech E-Waste Solutions',
          'NGO12345678',
          '123 Green Street, Connaught Place, New Delhi',
          28.6139,
          77.2090,
          'New Delhi',
          'Delhi',
          'Raj Kumar',
          'contact@greentech.ngo',
          '+91-9876543210',
          ['e-waste recycling', 'device refurbishment', 'pickup service'],
          'verified'
        ]
      );
    }

    // Create sample regular user
    await query(
      `INSERT INTO users (email, name, role, phone, address, points, level, is_active, email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       ON CONFLICT (email) DO NOTHING`,
      ['john.doe@gmail.com', 'John Doe', 'user', '+91-9123456789', 'Mumbai, India', 150, 2, true, true]
    );

    console.log('✅ Sample data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error.message);
  }
};

// Main initialization function
export const setupDatabase = async () => {
  const initialized = await initializeDatabase();
  if (initialized) {
    await createAdminUser();
    await seedSampleData();
  }
  return initialized;
};