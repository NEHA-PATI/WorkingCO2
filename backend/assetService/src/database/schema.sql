-- -- ========================================
-- -- CO2+ Asset Management Database Schema
-- -- MATCHING EXISTING USERS TABLE
-- -- ========================================

-- -- Enable UUID extension
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -- ========================================
-- -- 0. USERS TABLE (Your Existing Schema)
-- -- ========================================
-- -- This table already exists in your auth database
-- -- Reference only - DO NOT recreate if it exists
-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     u_id VARCHAR(255) UNIQUE NOT NULL,
--     username VARCHAR(255),
--     email VARCHAR(255),
--     password TEXT,
--     role_id INTEGER,
--     verified BOOLEAN DEFAULT false,
--     otp_code VARCHAR(255),
--     otp_expires_at TIMESTAMP,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     login_attempts INTEGER DEFAULT 0,
--     lock_until TIMESTAMP
-- );

-- -- Indexes for users table
-- CREATE INDEX IF NOT EXISTS idx_users_u_id ON users(u_id);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);

-- COMMENT ON TABLE users IS 'User accounts from authentication service';
-- COMMENT ON COLUMN users.u_id IS 'Unique user identifier (primary reference for assets)';

-- -- ========================================
-- -- 1. EV Master Data Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS ev_master_data (
--     ev_id SERIAL PRIMARY KEY,
--     vuid VARCHAR(100) UNIQUE NOT NULL,
--     u_id VARCHAR(255) NOT NULL,
--     category VARCHAR(100),
--     manufacturers VARCHAR(150),
--     model VARCHAR(150),
--     purchase_year INTEGER CHECK (purchase_year >= 2000 AND purchase_year <= 2030),
--     energy_consumed DECIMAL(10, 2),
--     primary_charging_type VARCHAR(50),
--     range INTEGER CHECK (range > 0),
--     grid_emission_factor DECIMAL(10, 4),
--     top_speed INTEGER,
--     charging_time DECIMAL(5, 2),
--     motor_power VARCHAR(50),
--     status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_ev_user FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE CASCADE
-- );

-- -- Index for faster queries
-- CREATE INDEX idx_ev_uid ON ev_master_data(u_id);
-- CREATE INDEX idx_ev_status ON ev_master_data(status);
-- CREATE INDEX idx_ev_created ON ev_master_data(created_at DESC);

-- COMMENT ON TABLE ev_master_data IS 'Electric vehicle master data';
-- COMMENT ON COLUMN ev_master_data.u_id IS 'Foreign key to users.u_id - owner of this EV';

-- -- ========================================
-- -- 2. EV Transactions Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS ev_transactions (
--     ev_tran_id SERIAL PRIMARY KEY,
--     ev_id INTEGER NOT NULL REFERENCES ev_master_data(ev_id) ON DELETE CASCADE,
--     active_distance DECIMAL(10, 2) NOT NULL CHECK (active_distance > 0),
--     created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_ev_trans_ev_id ON ev_transactions(ev_id);
-- CREATE INDEX idx_ev_trans_date ON ev_transactions(created_date DESC);

-- COMMENT ON TABLE ev_transactions IS 'EV usage/distance transactions';

-- -- ========================================
-- -- 3. Solar Panels Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS solar_panels (
--     suid SERIAL PRIMARY KEY,
--     s_uid VARCHAR(100) UNIQUE NOT NULL,
--     u_id VARCHAR(255) NOT NULL,
--     installed_capacity DECIMAL(10, 2) CHECK (installed_capacity > 0),
--     installation_date DATE,
--     energy_generation_value DECIMAL(12, 2) CHECK (energy_generation_value >= 0),
--     grid_emission_factor DECIMAL(10, 4),
--     inverter_type VARCHAR(100),
--     status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_solar_user FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_solar_uid ON solar_panels(u_id);
-- CREATE INDEX idx_solar_status ON solar_panels(status);
-- CREATE INDEX idx_solar_created ON solar_panels(created_at DESC);

-- COMMENT ON TABLE solar_panels IS 'Solar panel installation data';
-- COMMENT ON COLUMN solar_panels.u_id IS 'Foreign key to users.u_id - owner of this solar panel';

-- -- ========================================
-- -- 4. Trees Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS trees (
--     tid SERIAL PRIMARY KEY,
--     t_uid VARCHAR(100) UNIQUE NOT NULL,
--     u_id VARCHAR(255) NOT NULL,
--     treename VARCHAR(150),
--     botanicalname VARCHAR(150),
--     plantingdate DATE,
--     height DECIMAL(8, 2) CHECK (height > 0),
--     dbh DECIMAL(8, 2),
--     location TEXT,
--     created_by VARCHAR(100),
--     status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_tree_user FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_tree_uid ON trees(u_id);
-- CREATE INDEX idx_tree_status ON trees(status);
-- CREATE INDEX idx_tree_created ON trees(created_at DESC);

-- COMMENT ON TABLE trees IS 'Tree planting data';
-- COMMENT ON COLUMN trees.u_id IS 'Foreign key to users.u_id - owner of this tree';

-- -- ========================================
-- -- 5. Tree Images Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS tree_images (
--     image_id SERIAL PRIMARY KEY,
--     tid INTEGER NOT NULL REFERENCES trees(tid) ON DELETE CASCADE,
--     image_url TEXT NOT NULL,
--     cloudinary_public_id VARCHAR(255),
--     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_tree_images_tid ON tree_images(tid);

-- COMMENT ON TABLE tree_images IS 'Multiple images per tree';

-- -- ========================================
-- -- 6. Asset Status History Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS asset_status_history (
--     history_id SERIAL PRIMARY KEY,
--     asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('ev', 'solar', 'tree')),
--     asset_id INTEGER NOT NULL,
--     old_status VARCHAR(20),
--     new_status VARCHAR(20),
--     changed_by VARCHAR(255),
--     change_reason TEXT,
--     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_status_history_asset ON asset_status_history(asset_type, asset_id);

-- COMMENT ON TABLE asset_status_history IS 'Audit trail for status changes';

-- -- ========================================
-- -- 7. Credits/Rewards Table
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS user_credits (
--     credit_id SERIAL PRIMARY KEY,
--     u_id VARCHAR(255) NOT NULL,
--     token_value INTEGER DEFAULT 0 CHECK (token_value >= 0),
--     last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_credits_user FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE CASCADE
-- );

-- CREATE UNIQUE INDEX idx_credits_uid ON user_credits(u_id);

-- COMMENT ON TABLE user_credits IS 'User reward credits/tokens';

-- -- ========================================
-- -- 8. User Activity Log
-- -- ========================================
-- CREATE TABLE IF NOT EXISTS user_activity_log (
--     activity_id SERIAL PRIMARY KEY,
--     u_id VARCHAR(255) NOT NULL,
--     activity_type VARCHAR(50) NOT NULL,
--     description TEXT,
--     ip_address INET,
--     user_agent TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_activity_user FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_activity_uid ON user_activity_log(u_id);
-- CREATE INDEX idx_activity_created ON user_activity_log(created_at DESC);

-- COMMENT ON TABLE user_activity_log IS 'Track user activities for audit';

-- -- ========================================
-- -- Triggers for updated_at
-- -- ========================================

-- -- Function to update timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- Trigger for Users
-- CREATE TRIGGER update_users_updated_at 
--     BEFORE UPDATE ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- Trigger for EV
-- CREATE TRIGGER update_ev_updated_at 
--     BEFORE UPDATE ON ev_master_data
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- Trigger for Solar
-- CREATE TRIGGER update_solar_updated_at 
--     BEFORE UPDATE ON solar_panels
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- Trigger for Trees
-- CREATE TRIGGER update_tree_updated_at 
--     BEFORE UPDATE ON trees
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- -- ========================================
-- -- Initial Data (Optional)
-- -- ========================================

-- -- Sample charging types
-- CREATE TABLE IF NOT EXISTS charging_types (
--     id SERIAL PRIMARY KEY,
--     type_name VARCHAR(50) UNIQUE NOT NULL,
--     description TEXT
-- );

-- INSERT INTO charging_types (type_name, description) VALUES
--     ('level1', 'Level 1 (120V) - Standard household outlet'),
--     ('level2', 'Level 2 (240V) - Home/public charging station'),
--     ('dcfast', 'DC Fast Charging - Rapid charging'),
--     ('tesla', 'Tesla Supercharger - Tesla-specific fast charging')
-- ON CONFLICT (type_name) DO NOTHING;

-- -- Sample inverter types
-- CREATE TABLE IF NOT EXISTS inverter_types (
--     id SERIAL PRIMARY KEY,
--     type_name VARCHAR(50) UNIQUE NOT NULL,
--     description TEXT
-- );

-- INSERT INTO inverter_types (type_name, description) VALUES
--     ('string', 'String Inverter - Traditional central inverter'),
--     ('microinverter', 'Microinverter - Panel-level optimization'),
--     ('hybrid', 'Hybrid Inverter - Battery storage capable'),
--     ('central', 'Central Inverter - Large-scale installations')
-- ON CONFLICT (type_name) DO NOTHING;

-- -- ========================================
-- -- Views for Analytics
-- -- ========================================

-- -- View: User profile with asset summary
-- CREATE OR REPLACE VIEW user_dashboard_summary AS
-- SELECT 
--     u.u_id,
--     u.username,
--     u.email,
--     u.verified,
--     u.created_at as member_since,
--     COUNT(DISTINCT ev.ev_id) as total_evs,
--     COUNT(DISTINCT sp.suid) as total_solar_panels,
--     COUNT(DISTINCT t.tid) as total_trees,
--     (COUNT(DISTINCT ev.ev_id) + COUNT(DISTINCT sp.suid) + COUNT(DISTINCT t.tid)) as total_assets,
--     COALESCE(uc.token_value, 0) as credits
-- FROM users u
-- LEFT JOIN ev_master_data ev ON u.u_id = ev.u_id AND ev.status = 'approved'
-- LEFT JOIN solar_panels sp ON u.u_id = sp.u_id AND sp.status = 'approved'
-- LEFT JOIN trees t ON u.u_id = t.u_id AND t.status = 'approved'
-- LEFT JOIN user_credits uc ON u.u_id = uc.u_id
-- GROUP BY u.u_id, u.username, u.email, u.verified, u.created_at, uc.token_value;

-- -- View: Recent activities across all assets
-- CREATE OR REPLACE VIEW recent_activities AS
-- SELECT 
--     'ev' as asset_type, 
--     ev.ev_id as asset_id, 
--     ev.u_id, 
--     u.username as user_name,
--     u.email,
--     ev.manufacturers || ' ' || ev.model as asset_name,
--     ev.created_at, 
--     ev.status
-- FROM ev_master_data ev
-- JOIN users u ON ev.u_id = u.u_id
-- UNION ALL
-- SELECT 
--     'solar' as asset_type, 
--     sp.suid as asset_id, 
--     sp.u_id, 
--     u.username as user_name,
--     u.email,
--     'Solar Panel - ' || sp.inverter_type as asset_name,
--     sp.created_at, 
--     sp.status
-- FROM solar_panels sp
-- JOIN users u ON sp.u_id = u.u_id
-- UNION ALL
-- SELECT 
--     'tree' as asset_type, 
--     t.tid as asset_id, 
--     t.u_id, 
--     u.username as user_name,
--     u.email,
--     t.treename as asset_name,
--     t.created_at, 
--     t.status
-- FROM trees t
-- JOIN users u ON t.u_id = u.u_id
-- ORDER BY created_at DESC
-- LIMIT 100;

-- -- View: Pending approvals (for admin)
-- CREATE OR REPLACE VIEW pending_approvals AS
-- SELECT 
--     'ev' as asset_type,
--     ev.ev_id as asset_id,
--     ev.u_id,
--     u.username as user_name,
--     u.email as user_email,
--     ev.manufacturers || ' ' || ev.model as asset_description,
--     ev.created_at as submitted_at,
--     ev.status
-- FROM ev_master_data ev
-- JOIN users u ON ev.u_id = u.u_id
-- WHERE ev.status = 'pending'
-- UNION ALL
-- SELECT 
--     'solar' as asset_type,
--     sp.suid as asset_id,
--     sp.u_id,
--     u.username as user_name,
--     u.email as user_email,
--     'Solar Panel - ' || sp.installed_capacity || ' kW' as asset_description,
--     sp.created_at as submitted_at,
--     sp.status
-- FROM solar_panels sp
-- JOIN users u ON sp.u_id = u.u_id
-- WHERE sp.status = 'pending'
-- UNION ALL
-- SELECT 
--     'tree' as asset_type,
--     t.tid as asset_id,
--     t.u_id,
--     u.username as user_name,
--     u.email as user_email,
--     t.treename || ' (' || t.botanicalname || ')' as asset_description,
--     t.created_at as submitted_at,
--     t.status
-- FROM trees t
-- JOIN users u ON t.u_id = u.u_id
-- WHERE t.status = 'pending'
-- ORDER BY submitted_at ASC;

-- -- ========================================
-- -- Functions for Common Operations
-- -- ========================================

-- -- Function: Get user's total carbon offset
-- CREATE OR REPLACE FUNCTION get_user_carbon_offset(user_id VARCHAR)
-- RETURNS DECIMAL AS $$
-- DECLARE
--     total_offset DECIMAL := 0;
--     ev_offset DECIMAL := 0;
--     solar_offset DECIMAL := 0;
--     tree_offset DECIMAL := 0;
-- BEGIN
--     -- Calculate EV offset (simplified)
--     SELECT COALESCE(SUM(et.active_distance * ev.grid_emission_factor), 0)
--     INTO ev_offset
--     FROM ev_transactions et
--     JOIN ev_master_data ev ON et.ev_id = ev.ev_id
--     WHERE ev.u_id = user_id AND ev.status = 'approved';
    
--     -- Calculate solar offset (simplified)
--     SELECT COALESCE(SUM(energy_generation_value * grid_emission_factor), 0)
--     INTO solar_offset
--     FROM solar_panels
--     WHERE u_id = user_id AND status = 'approved';
    
--     -- Calculate tree offset (21 kg CO2/year per tree)
--     SELECT COALESCE(COUNT(*) * 21, 0)
--     INTO tree_offset
--     FROM trees
--     WHERE u_id = user_id AND status = 'approved';
    
--     total_offset := ev_offset + solar_offset + tree_offset;
    
--     RETURN total_offset;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Function: Get user statistics
-- CREATE OR REPLACE FUNCTION get_user_stats(user_id VARCHAR)
-- RETURNS JSON AS $$
-- DECLARE
--     result JSON;
-- BEGIN
--     SELECT json_build_object(
--         'total_evs', (SELECT COUNT(*) FROM ev_master_data WHERE u_id = user_id),
--         'approved_evs', (SELECT COUNT(*) FROM ev_master_data WHERE u_id = user_id AND status = 'approved'),
--         'total_solar', (SELECT COUNT(*) FROM solar_panels WHERE u_id = user_id),
--         'approved_solar', (SELECT COUNT(*) FROM solar_panels WHERE u_id = user_id AND status = 'approved'),
--         'total_trees', (SELECT COUNT(*) FROM trees WHERE u_id = user_id),
--         'approved_trees', (SELECT COUNT(*) FROM trees WHERE u_id = user_id AND status = 'approved'),
--         'total_credits', (SELECT COALESCE(token_value, 0) FROM user_credits WHERE u_id = user_id),
--         'carbon_offset', get_user_carbon_offset(user_id)
--     ) INTO result;
    
--     RETURN result;
-- END;
-- $$ LANGUAGE plpgsql;
