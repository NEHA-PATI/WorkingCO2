const { query, transaction } = require("../config/database");

class PlantationModel {
  static async create(data) {
    const {
      org_id,
      plantation_name,
      plantation_date,
      total_area,
      area_unit,
      manager_name,
      manager_contact,
      trees_planted,
      species_name,
      plant_age_years,
      points = [],
    } = data;

    return transaction(async (client) => {
      const plantationQuery = `
        INSERT INTO plantations (
          org_id,
          plantation_name,
          plantation_date,
          total_area,
          area_unit,
          manager_name,
          manager_contact,
          trees_planted,
          species_name,
          plant_age_years,
          verification_status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
      `;

      const plantationValues = [
        org_id,
        plantation_name,
        plantation_date,
        total_area,
        area_unit,
        manager_name,
        manager_contact,
        trees_planted,
        species_name,
        plant_age_years,
        "pending",
      ];

      const plantationResult = await client.query(plantationQuery, plantationValues);
      const plantation = plantationResult.rows[0];

      const insertedPoints = [];
      if (Array.isArray(points) && points.length > 0) {
        for (let i = 0; i < points.length; i += 1) {
          const pt = points[i];
          const pointQuery = `
            INSERT INTO plantation_boundary_points (
              p_id,
              point_order,
              latitude,
              longitude
            )
            VALUES ($1,$2,$3,$4)
            RETURNING *
          `;

          const pointValues = [
            plantation.p_id,
            i + 1,
            Number(pt.lat),
            Number(pt.lng),
          ];

          const pointResult = await client.query(pointQuery, pointValues);
          insertedPoints.push(pointResult.rows[0]);
        }
      }

      return { ...plantation, points: insertedPoints };
    });
  }

  static async getByOrgId(orgId) {
    const queryText = `
      SELECT p.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pbp.id,
                   'point_order', pbp.point_order,
                   'lat', pbp.latitude,
                   'lng', pbp.longitude
                 ) ORDER BY pbp.point_order
               ) FILTER (WHERE pbp.id IS NOT NULL),
               '[]'
             ) AS points
      FROM plantations p
      LEFT JOIN plantation_boundary_points pbp ON pbp.p_id = p.p_id
      WHERE p.org_id = $1
      GROUP BY p.p_id
      ORDER BY p.created_at DESC
    `;

    const result = await query(queryText, [orgId]);
    return result.rows;
  }

  static async getById(pId) {
    const queryText = `
      SELECT p.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pbp.id,
                   'point_order', pbp.point_order,
                   'lat', pbp.latitude,
                   'lng', pbp.longitude
                 ) ORDER BY pbp.point_order
               ) FILTER (WHERE pbp.id IS NOT NULL),
               '[]'
             ) AS points
      FROM plantations p
      LEFT JOIN plantation_boundary_points pbp ON pbp.p_id = p.p_id
      WHERE p.p_id = $1
      GROUP BY p.p_id
    `;

    const result = await query(queryText, [pId]);
    return result.rows[0];
  }
}

module.exports = PlantationModel;
