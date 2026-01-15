const { query } = require("../config/database");

class TransactionModel {
  static async createEVTransaction(transactionData) {
    const { ev_id, active_distance } = transactionData;

    if (!ev_id || !active_distance) {
      throw new Error('ev_id and active_distance are required');
    }

    if (active_distance <= 0) {
      throw new Error('active_distance must be greater than 0');
    }

    const queryText = `
      INSERT INTO ev_transactions (ev_id, active_distance)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await query(queryText, [ev_id, active_distance]);
    return result.rows[0];
  }

  static async getByEvId(evId) {
    if (!evId) {
      throw new Error('evId is required');
    }

    const queryText = `
      SELECT * FROM ev_transactions 
      WHERE ev_id = $1 
      ORDER BY created_date DESC
    `;
    const result = await query(queryText, [evId]);
    return result.rows || [];
  }

  static async getById(tranId) {
    if (!tranId) {
      throw new Error('tranId is required');
    }

    const queryText = `
      SELECT * FROM ev_transactions 
      WHERE ev_tran_id = $1
    `;
    const result = await query(queryText, [tranId]);
    return result.rows[0] || null;
  }

  static async delete(tranId) {
    if (!tranId) {
      throw new Error('tranId is required');
    }

    const queryText = `
      DELETE FROM ev_transactions 
      WHERE ev_tran_id = $1
      RETURNING *
    `;
    const result = await query(queryText, [tranId]);
    return result.rows[0] || null;
  }

  static async getTotalDistance(evId) {
    if (!evId) {
      throw new Error('evId is required');
    }

    const queryText = `
      SELECT COALESCE(SUM(active_distance), 0) as total_distance
      FROM ev_transactions 
      WHERE ev_id = $1
    `;
    const result = await query(queryText, [evId]);
    return parseFloat(result.rows[0].total_distance) || 0;
  }
}

module.exports = TransactionModel;
