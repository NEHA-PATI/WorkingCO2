const pool = require('../config/db');

const createTables = async () => {
  try {
    console.log('⏳ Creating tables...');

    // Create Jobs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL, -- Remote, Hybrid, On-site
        level VARCHAR(50) NOT NULL, -- Junior, Mid, Senior
        status VARCHAR(50) DEFAULT 'Draft', -- Draft, Active, Closed
        description TEXT,
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Applications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        resume_url TEXT,
        message TEXT,
        status VARCHAR(50) DEFAULT 'Pending', -- Pending, Reviewed, Hired, Rejected
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    process.exit(1);
  }
};

createTables();
