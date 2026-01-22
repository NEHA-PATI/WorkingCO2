const pool = require("../config/db");

/**
 * Generate contact_id like CNT000001
 */
const generateContactId = async () => {
  const result = await pool.query(
    `SELECT contact_id
     FROM contact_messages
     ORDER BY created_at DESC
     LIMIT 1`
  );

  if (result.rows.length === 0) {
    return "CNT000001";
  }

  const lastId = result.rows[0].contact_id;
  const num = parseInt(lastId.replace("CNT", ""), 10) + 1;

  return `CNT${num.toString().padStart(6, "0")}`;
};

/**
 * PUBLIC: CREATE CONTACT MESSAGE
 * POST /api/contact
 */
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required"
      });
    }

    const contact_id = await generateContactId();

    await pool.query(
      `INSERT INTO contact_messages
       (contact_id, name, email, phone, subject, message)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [contact_id, name, email, phone, subject, message]
    );

    res.status(201).json({
      message: "Message sent successfully",
      contact_id
    });

  } catch (error) {
    console.error("CREATE CONTACT ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * ADMIN: GET ALL CONTACT MESSAGES
 * GET /api/contact
 */
exports.getAllContactMessages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM contact_messages
       ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error("GET CONTACTS ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * ADMIN: GET SINGLE CONTACT MESSAGE
 * GET /api/contact/:contact_id
 */
exports.getContactById = async (req, res) => {
  try {
    const { contact_id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM contact_messages
       WHERE contact_id = $1`,
      [contact_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("GET CONTACT ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};