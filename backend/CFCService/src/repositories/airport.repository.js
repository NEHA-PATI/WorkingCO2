const db = require('../config/db');

exports.getAirportByCode = async (code) => {
  const query = `
    SELECT latitude, longitude
    FROM airports
    WHERE code = $1
    LIMIT 1
  `;

  const result = await db.query(query, [code]);
  return result.rows[0];
};

exports.getAllAirports = async () => {
  const result = await db.query(`
    SELECT code, latitude, longitude FROM airports
  `);
  return result.rows;
};

exports.getAllAirportsAdmin = async () => {
  const result = await db.query(`
    SELECT
      code,
      name,
      latitude,
      longitude,
      country
    FROM airports
    ORDER BY code ASC
  `);

  return result.rows;
};

exports.createAirport = async ({
  code,
  name,
  latitude,
  longitude,
  country
}) => {
  const result = await db.query(`
    INSERT INTO airports (
      code,
      name,
      latitude,
      longitude,
      country
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      code,
      name,
      latitude,
      longitude,
      country
  `, [code, name, latitude, longitude, country]);

  return result.rows[0] || null;
};

exports.updateAirportByCode = async (code, updates = {}) => {
  const fields = [];
  const values = [];
  let index = 1;

  const addField = (column, value) => {
    if (value === undefined) return;
    fields.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  };

  addField('name', updates.name);
  addField('latitude', updates.latitude);
  addField('longitude', updates.longitude);
  addField('country', updates.country);

  if (!fields.length) {
    const current = await db.query(`
      SELECT
        code,
        name,
        latitude,
        longitude,
        country
      FROM airports
      WHERE code = $1
      LIMIT 1
    `, [code]);

    return current.rows[0] || null;
  }

  values.push(code);

  const result = await db.query(`
    UPDATE airports
    SET ${fields.join(', ')}
    WHERE code = $${index}
    RETURNING
      code,
      name,
      latitude,
      longitude,
      country
  `, values);

  return result.rows[0] || null;
};

exports.deleteAirportByCode = async (code) => {
  const result = await db.query(`
    DELETE FROM airports
    WHERE code = $1
    RETURNING code
  `, [code]);

  return result.rows[0] || null;
};
