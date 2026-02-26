const db = require('../config/db');

exports.findFactor = async (category, subCategory) => {
  const query = `
    SELECT value 
    FROM emission_factors 
    WHERE category = $1 
    AND sub_category = $2
    LIMIT 1
  `;

  const result = await db.query(query, [category, subCategory]);
  return result.rows[0];
};

exports.getAllFactors = async () => {
  const result = await db.query(`
    SELECT category, sub_category, value
    FROM emission_factors
  `);

  return result.rows;
};

exports.getAllFactorsAdmin = async () => {
  const result = await db.query(`
    SELECT
      id,
      category,
      sub_category,
      unit,
      value,
      region,
      year,
      source,
      version,
      created_at
    FROM emission_factors
    ORDER BY category ASC, sub_category ASC, year DESC, created_at DESC
  `);

  return result.rows;
};

exports.updateFactorById = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let index = 1;

  const addField = (column, value) => {
    if (value === undefined) return;
    fields.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  };

  addField('category', updates.category);
  addField('sub_category', updates.sub_category);
  addField('unit', updates.unit);
  addField('value', updates.value);
  addField('region', updates.region);
  addField('year', updates.year);
  addField('source', updates.source);
  addField('version', updates.version);

  if (!fields.length) {
    const current = await db.query(`
      SELECT
        id,
        category,
        sub_category,
        unit,
        value,
        region,
        year,
        source,
        version,
        created_at
      FROM emission_factors
      WHERE id = $1
      LIMIT 1
    `, [id]);

    return current.rows[0] || null;
  }

  values.push(id);

  const result = await db.query(`
    UPDATE emission_factors
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      category,
      sub_category,
      unit,
      value,
      region,
      year,
      source,
      version,
      created_at
  `, values);

  return result.rows[0] || null;
};
