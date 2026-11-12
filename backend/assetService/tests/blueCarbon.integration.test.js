// These tests are opt-in. They refuse the application's normal `iem` database.
const { Pool } = require('pg');

const enabled = process.env.BLUE_CARBON_INTEGRATION === '1';
const testDatabase = process.env.BLUE_CARBON_TEST_DB || '';
if (enabled && (!testDatabase || testDatabase === 'iem')) throw new Error('Refusing to run Blue Carbon integration tests without a dedicated BLUE_CARBON_TEST_DB');

const describeIntegration = enabled ? describe : describe.skip;
describeIntegration('Blue Carbon PostgreSQL integration', () => {
  let pool;
  beforeAll(async () => { pool = new Pool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 5432), database: testDatabase, user: process.env.DB_USER, password: process.env.DB_PASSWORD }); });
  afterAll(async () => { await pool.end(); });
  test('dedicated database is reachable and isolated', async () => { const result = await pool.query('SELECT current_database() AS database'); expect(result.rows[0].database).toBe(testDatabase); expect(testDatabase).not.toBe('iem'); });
  test.todo('project creation persists baseline and status history transactionally');
  test.todo('observation/sample corrections append immutable revisions');
  test.todo('review history and organization isolation persist across reloads');
  test.todo('transaction rollback leaves no partial evidence record');
});
