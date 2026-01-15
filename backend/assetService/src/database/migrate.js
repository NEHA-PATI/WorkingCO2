const { pool, testConnection } = require('../config/database');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

async function runMigration() {
  try {
    // Test connection
    logger.info('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    logger.info('Schema file loaded, size:', schema.length, 'bytes');

    // Execute schema
    logger.info('Running database migrations...');
    
    try {
      await pool.query(schema);
      logger.info('✅ Database migration completed successfully!');
    } catch (queryError) {
      logger.error('SQL Execution Error:', queryError.message);
      logger.error('Error position:', queryError.position);
      logger.error('Error detail:', queryError.detail);
      logger.error('Error hint:', queryError.hint);
      throw queryError;
    }
    
    // Verify tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    logger.info('\nCreated tables:');
    result.rows.forEach(row => {
      logger.info(`  ✓ ${row.table_name}`);
    });
    
    logger.info(`\nTotal tables: ${result.rows.length}\n`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error.message);
    if (error.stack) {
      logger.error('Stack trace:', error.stack);
    }
    
    try {
      await pool.end();
    } catch (e) {
      // Ignore
    }
    
    process.exit(1);
  }
}

// Run migration
runMigration();
