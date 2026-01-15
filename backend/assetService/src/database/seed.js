const { pool } = require('../config/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

async function seedDatabase() {
  try {
    logger.info('🌱 Seeding database with sample data...');

    // 1. Create sample users first (matching your schema)
    await pool.query(`
      INSERT INTO users (
        u_id, username, email, password, role_id, verified, 
        login_attempts, created_at, updated_at
      ) VALUES
      (
        'USR_SAMPLE_001', 
        'johndoe', 
        'john@example.com', 
        '$2b$10$sampleHashedPassword1', 
        1, 
        true, 
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ),
      (
        'USR_SAMPLE_002', 
        'janesmith', 
        'jane@example.com', 
        '$2b$10$sampleHashedPassword2', 
        1, 
        true, 
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ),
      (
        'ADMIN_001', 
        'adminuser', 
        'admin@co2plus.com', 
        '$2b$10$sampleHashedPasswordAdmin', 
        2, 
        true, 
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (u_id) DO NOTHING
    `);
    logger.info('✅ Sample users created');

    // 2. Seed sample EV
    await pool.query(`
      INSERT INTO ev_master_data (
        vuid, u_id, category, manufacturers, model, purchase_year,
        energy_consumed, primary_charging_type, range, grid_emission_factor,
        top_speed, charging_time, motor_power, status
      ) VALUES (
        'VUID_' || gen_random_uuid(),
        'USR_SAMPLE_001', 'Sedans', 'Tesla', 'Model 3', 2022,
        75.0, 'level2', 350, 0.5, 225, 8.0, '283 HP', 'approved'
      )
      ON CONFLICT (vuid) DO NOTHING
    `);
    logger.info('✅ Sample EV created');

    // 3. Seed sample Solar Panel
    await pool.query(`
      INSERT INTO solar_panels (
        s_uid, u_id, installed_capacity, installation_date,
        energy_generation_value, grid_emission_factor, inverter_type, status
      ) VALUES (
        'SUID_' || gen_random_uuid(),
        'USR_SAMPLE_001', 5.0, '2023-01-15', 25.5, 0.7, 'hybrid', 'approved'
      )
      ON CONFLICT (s_uid) DO NOTHING
    `);
    logger.info('✅ Sample Solar Panel created');

    // 4. Seed sample Tree
    await pool.query(`
      INSERT INTO trees (
        t_uid, u_id, treename, botanicalname, plantingdate,
        height, dbh, location, created_by, status
      ) VALUES (
        'TUID_' || gen_random_uuid(),
        'USR_SAMPLE_001', 'Mango Tree', 'Mangifera indica', '2023-06-01',
        2.5, 5.0, 'Backyard Garden', 'johndoe', 'approved'
      )
      ON CONFLICT (t_uid) DO NOTHING
    `);
    logger.info('✅ Sample Tree created');

    // 5. Add some EV transactions
    const evResult = await pool.query(`
      SELECT ev_id FROM ev_master_data WHERE u_id = 'USR_SAMPLE_001' LIMIT 1
    `);
    
    if (evResult.rows.length > 0) {
      const evId = evResult.rows[0].ev_id;
      await pool.query(`
        INSERT INTO ev_transactions (ev_id, active_distance) VALUES
        ($1, 150.5),
        ($1, 200.0),
        ($1, 95.3)
      `, [evId]);
      logger.info('✅ Sample EV transactions created');
    }

    // 6. Initialize user credits
    await pool.query(`
      INSERT INTO user_credits (u_id, token_value, last_updated) VALUES
      ('USR_SAMPLE_001', 150, CURRENT_TIMESTAMP),
      ('USR_SAMPLE_002', 0, CURRENT_TIMESTAMP)
      ON CONFLICT (u_id) DO NOTHING
    `);
    logger.info('✅ User credits initialized');

    // 7. Add some activity logs
    await pool.query(`
      INSERT INTO user_activity_log (u_id, activity_type, description, created_at) VALUES
      ('USR_SAMPLE_001', 'CREATE_EV', 'Created Tesla Model 3', CURRENT_TIMESTAMP - INTERVAL '2 days'),
      ('USR_SAMPLE_001', 'CREATE_SOLAR', 'Added solar panel system', CURRENT_TIMESTAMP - INTERVAL '1 day'),
      ('USR_SAMPLE_001', 'CREATE_TREE', 'Planted Mango Tree', CURRENT_TIMESTAMP)
    `);
    logger.info('✅ Activity logs created');

    // 8. Show summary
    const summary = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM ev_master_data) as total_evs,
        (SELECT COUNT(*) FROM solar_panels) as total_solar,
        (SELECT COUNT(*) FROM trees) as total_trees,
        (SELECT COUNT(*) FROM ev_transactions) as total_transactions
    `);

    logger.info('\n📊 Database Seed Summary:');
    logger.info(`   👥 Users: ${summary.rows[0].total_users}`);
    logger.info(`   🚗 EVs: ${summary.rows[0].total_evs}`);
    logger.info(`   ☀️  Solar Panels: ${summary.rows[0].total_solar}`);
    logger.info(`   🌳 Trees: ${summary.rows[0].total_trees}`);
    logger.info(`   📊 Transactions: ${summary.rows[0].total_transactions}`);
    logger.info('\n✅ Database seeded successfully!\n');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    logger.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

seedDatabase();
