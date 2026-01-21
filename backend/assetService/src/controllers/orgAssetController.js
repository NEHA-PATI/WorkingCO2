import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { query } = require("../config/database.js");

/* =========================================================
   CREATE ORG ASSET
========================================================= */
export const createOrgAsset = async (req, res) => {
  try {
    const {
      plantationId,
      t_oid,
      u_id,
      location_lat,
      location_long,
      area_hactare,
      species_Name,
      trees_planted,
      avg_height,
      avg_dbh,
      survival_rate,
      plantation_date,
      Base_line_Land,
      ImageId,
    } = req.body;

    // validate user
    const userCheck = await query(
      `SELECT u_id FROM users WHERE u_id = $1`,
      [u_id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // validate image (optional)
    // validate image (optional)
if (ImageId) {
  const imageCheck = await query(
    `SELECT image_id FROM tree_images WHERE image_id = $1`,
    [ImageId]
  );

  if (imageCheck.rows.length === 0) {
    return res.status(404).json({ error: "Image not found" });
  }
}

    const sql = `
      INSERT INTO org_assets (
        plantation_id,
        t_oid,
        u_id,
        location_lat,
        location_long,
        area_hactare,
        species_name,
        trees_planted,
        avg_height,
        avg_dbh,
        survival_rate,
        plantation_date,
        base_line_land,
        image_id,
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending'
      )
      RETURNING *
    `;

    const values = [
      plantationId,
      t_oid,
      u_id,
      location_lat,
      location_long,
      area_hactare,
      species_Name,
      trees_planted,
      avg_height,
      avg_dbh,
      survival_rate,
      plantation_date,
      Base_line_Land,
      ImageId,
    ];

    const { rows } = await query(sql, values);

    res.status(201).json({
      success: true,
      message: "Org asset created successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create org asset" });
  }
};

/* =========================================================
   GET ALL ORG ASSETS
========================================================= */
export const getAllOrgAssets = async (req, res) => {
  try {
    const sql = `
      SELECT
        oa.plantation_id,
        oa.t_oid,
        oa.u_id,
        oa.location_lat,
        oa.location_long,
        oa.area_hactare,
        oa.species_name,
        oa.trees_planted,
        oa.avg_height,
        oa.avg_dbh,
        oa.survival_rate,
        oa.plantation_date,
        oa.base_line_land,
        oa.status,
        ti.image_url,
        oa.created_at
      FROM org_assets oa
      LEFT JOIN tree_images ti 
        ON ti.image_id = oa.image_id
      ORDER BY oa.created_at DESC
    `;

    const { rows } = await query(sql);
    res.json(rows);
  } catch (err) {
    console.error("GET ALL ORG ASSETS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch org assets" });
  }
};


/* =========================================================
   GET ORG ASSET BY ID
========================================================= */
export const getOrgAssetsByUser = async (req, res) => {
  try {
    const { u_id } = req.params;

    const sql = `
      SELECT *
      FROM org_assets
      WHERE u_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await query(sql, [u_id]);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ORG ASSET FETCH ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch org assets",
    });
  }
};

/* =========================================================
   GET ORG ASSETS BY STATUS
========================================================= */
export const getOrgAssetsByStatus = async (req, res) => {
  try {
    const { status } = req.query; // pending | approved | rejected

    const sql = `
      SELECT plantation_id, u_id, species_name, trees_planted, status, created_at
      FROM org_assets
      WHERE status = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await query(sql, [status]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch org assets by status" });
  }
};

/* =========================================================
   APPROVE / REJECT ORG ASSET
========================================================= */
export const updateOrgAssetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved | rejected

    const sql = `
      UPDATE org_assets
      SET status = $1
      WHERE plantation_id = $2
    `;

    await query(sql, [status, id]);

    return res.json({ success: true });
  } catch (err) {
    console.error("ORG STATUS UPDATE ERROR:", err);
    return res.status(500).json({ error: "Failed to update status" });
  }
};


/* =========================================================
   DELETE ORG ASSET
========================================================= */
export const deleteOrgAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM org_assets WHERE plantation_id = $1`;
    await query(sql, [id]);

    res.json({ success: true, message: "Org asset deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};


/* =========================================================
   GET ORG ASSETS FOR WORKFLOW (ADMIN)
========================================================= */
export const getOrgAssetsForWorkflow = async (req, res) => {
  try {
    const sql = `
      SELECT
        oa.plantation_id AS id,
        'TREE' AS type,
        oa.status,
        oa.u_id,
        oa.created_at AS submitted_on,
        'organisation' AS submittedByType
      FROM org_assets oa
      WHERE oa.status IN ('pending', 'approved', 'rejected')
      ORDER BY oa.created_at DESC
    `;

    const { rows } = await query(sql);
    res.json(rows);
  } catch (err) {
    console.error("ORG WORKFLOW ERROR:", err);
    res.status(500).json({ error: "Failed to load org workflow assets" });
  }
};
export const getApprovedOrgAssets = async (req, res) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT
        oa.plantation_id,
        oa.u_id,
        oa.status,
        oa.created_at,
        ti.image_id,
        ti.image_url
      FROM org_assets oa
      LEFT JOIN tree_images ti
        ON ti.image_id = oa.image_id
    `;

    const params = [];

    if (status) {
      sql += ` WHERE oa.status = $1`;
      params.push(status);
    }

    sql += ` ORDER BY oa.created_at DESC`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("ORG APPROVED ASSETS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch org assets" });
  }
};


