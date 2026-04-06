const { query, transaction } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class TreeModel {
  /**
   * Create new Tree with images
   */
  static async create(treeData) {
    const {
      UID,
      TreeName,
      BotanicalName,
      PlantingDate,
      Height,
      DBH,
      Location,
      CreatedBy,
      imageIds = [],
    } = treeData;

    return await transaction(async (client) => {
      const T_UID = `TUID_${uuidv4()}`;

      // ✅ FIXED: Use lowercase column names matching database schema
      const treeQuery = `
        INSERT INTO trees (
          t_uid, u_id, treename, botanicalname, plantingdate,
          height, dbh, location, created_by, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const treeValues = [
        T_UID,
        UID,           // u_id
        TreeName,      // treename
        BotanicalName, // botanicalname
        PlantingDate,  // plantingdate
        Height,        // height
        DBH,           // dbh
        Location,      // location
        CreatedBy,     // created_by
        "pending",     // status
      ];

      const treeResult = await client.query(treeQuery, treeValues);
      const tree = treeResult.rows[0];

      // Insert images if provided.
      // Accept both string URLs and objects with image_url/url + public_id.
      if (imageIds && imageIds.length > 0) {
        for (const imageItem of imageIds) {
          let imageUrl = null;
          let publicId = null;

          if (typeof imageItem === "string") {
            imageUrl = imageItem;
          } else if (imageItem && typeof imageItem === "object") {
            imageUrl = imageItem.image_url || imageItem.url || null;
            publicId =
              imageItem.cloudinary_public_id ||
              imageItem.public_id ||
              null;
          }

          if (!imageUrl) continue;

          await client.query(
            `INSERT INTO tree_images (tid, image_url, cloudinary_public_id)
             VALUES ($1, $2, $3)`,
            [tree.tid, imageUrl, publicId]
          );
        }
      }

      // Get tree with images
      const treeWithImages = await client.query(
        `SELECT t.*, 
                COALESCE(json_agg(ti.image_url) FILTER (WHERE ti.image_url IS NOT NULL), '[]') as images
         FROM trees t
         LEFT JOIN tree_images ti ON t.tid = ti.tid
         WHERE t.tid = $1
         GROUP BY t.tid`,
        [tree.tid]
      );

      return treeWithImages.rows[0];
    });
  }

  /**
   * Get all Trees by user ID
   */
  static async getByUserId(userId) {
    const queryText = `
      SELECT t.*, 
             COALESCE(json_agg(
               json_build_object(
                 'image_id', ti.image_id,
                 'image_url', ti.image_url,
                 'uploaded_at', ti.uploaded_at
               )
             ) FILTER (WHERE ti.image_id IS NOT NULL), '[]') as images
      FROM trees t
      LEFT JOIN tree_images ti ON t.tid = ti.tid
      WHERE t.u_id = $1
      GROUP BY t.tid
      ORDER BY t.created_at DESC
    `;
    const result = await query(queryText, [userId]);
    return result.rows;
  }

  static async getAll() {
    const queryText = `
      SELECT t.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'image_id', ti.image_id,
                   'image_url', ti.image_url,
                   'uploaded_at', ti.uploaded_at
                 )
               ) FILTER (WHERE ti.image_id IS NOT NULL),
               '[]'
             ) as images
      FROM trees t
      LEFT JOIN tree_images ti ON t.tid = ti.tid
      GROUP BY t.tid
      ORDER BY t.created_at DESC
    `;
    const result = await query(queryText);
    return result.rows;
  }

  /**
   * Get single Tree by ID with images
   */
  static async getById(tid) {
    const queryText = `
      SELECT t.*, 
             COALESCE(json_agg(
               json_build_object(
                 'image_id', ti.image_id,
                 'image_url', ti.image_url,
                 'uploaded_at', ti.uploaded_at
               )
             ) FILTER (WHERE ti.image_id IS NOT NULL), '[]') as images
      FROM trees t
      LEFT JOIN tree_images ti ON t.tid = ti.tid
      WHERE t.tid = $1
      GROUP BY t.tid
    `;
    const result = await query(queryText, [tid]);
    return result.rows[0];
  }

  /**
   * Update Tree
   */
  static async update(tid, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = fields
      .map((field, index) => `${field.toLowerCase()} = $${index + 1}`)
      .join(", ");

    const queryText = `
      UPDATE trees 
      SET ${setClause}
      WHERE tid = $${fields.length + 1}
      RETURNING *
    `;

    const result = await query(queryText, [...values, tid]);
    return result.rows[0];
  }

  /**
   * Delete Tree (cascades to images)
   */
  static async delete(tid) {
    const queryText = `
      DELETE FROM trees 
      WHERE tid = $1
      RETURNING *
    `;
    const result = await query(queryText, [tid]);
    return result.rows[0];
  }

  /**
   * Add image to tree
   */
  static async addImage(tid, imageUrl, publicId = null) {
    const queryText = `
      INSERT INTO tree_images (tid, image_url, cloudinary_public_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await query(queryText, [tid, imageUrl, publicId]);
    return result.rows[0];
  }

  /**
   * Delete image from tree
   */
  static async deleteImage(imageId) {
    const queryText = `
      DELETE FROM tree_images 
      WHERE image_id = $1
      RETURNING *
    `;
    const result = await query(queryText, [imageId]);
    return result.rows[0];
  }

  /**
   * Get Tree count by user
   */
  static async getCountByUser(userId) {
    const queryText = `
      SELECT COUNT(*) as count 
      FROM trees 
      WHERE u_id = $1
    `;
    const result = await query(queryText, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Update Tree status
   */
  static async updateStatus(tid, status, changedBy = null, reason = null) {
    return await transaction(async (client) => {
      const oldStatusResult = await client.query(
        "SELECT status FROM trees WHERE tid = $1",
        [tid]
      );
      const oldStatus = oldStatusResult.rows[0]?.status;

      const updateResult = await client.query(
        "UPDATE trees SET status = $1 WHERE tid = $2 RETURNING *",
        [status, tid]
      );

      await client.query(
        `INSERT INTO asset_status_history 
         (asset_type, asset_id, old_status, new_status, changed_by, change_reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["tree", tid, oldStatus, status, changedBy, reason]
      );

      return updateResult.rows[0];
    });
  }
}

module.exports = TreeModel;
