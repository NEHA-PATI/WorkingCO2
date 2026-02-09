const pool = require("../config/db");
const bcrypt = require("bcryptjs");


/**
 * Generate org_request_id like OREQ000001
 */
const generateRequestId = async () => {
    const result = await pool.query(
        `SELECT org_request_id
         FROM org_requests
         ORDER BY created_at DESC
         LIMIT 1`
    );

    if (result.rows.length === 0) {
        return "OREQ000001";
    }

    const lastId = result.rows[0].org_request_id;
    const lastNumber = parseInt(lastId.replace("OREQ", ""), 10) + 1;

    return `OREQ${lastNumber.toString().padStart(6, "0")}`;
};

/**
 * FRONTEND: CREATE ORG REQUEST
 * POST /api/org-requests
 */
exports.createOrgRequest = async (req, res) => {
    try {
        const {
            org_name,
            org_type,
            org_mail,
            org_contact_number,
            org_contact_person,
            org_designation,
            org_country,
            org_state,
            org_city
        } = req.body;

        const fields = {
            org_name,
            org_type,
            org_mail,
            org_contact_number,
            org_contact_person,
            org_designation,
            org_country,
            org_state,
            org_city
        };

        const missing = Object.entries(fields)
            .filter(([_, value]) => !value || String(value).trim() === "")
            .map(([key]) => key);

        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(", ")}`,
                data: null
            });
        }

        const org_request_id = await generateRequestId();

        await pool.query(
            `INSERT INTO org_requests (
                org_request_id,
                org_name,
                org_type,
                org_mail,
                org_contact_number,
                org_contact_person,
                org_designation,
                org_country,
                org_state,
                org_city
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [
                org_request_id,
                org_name,
                org_type,
                org_mail,
                org_contact_number,
                org_contact_person,
                org_designation,
                org_country,
                org_state,
                org_city
            ]
        );

        console.log("ORG REQUEST INSERTED:", org_request_id);

        res.status(201).json({
            success: true,
            message: "Organization request submitted successfully",
            data: { org_request_id }
        });

    } catch (error) {
        console.error("CREATE ORG REQUEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: GET ALL ORG REQUESTS
 * GET /api/org-requests
 */
exports.getAllOrgRequests = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM org_requests ORDER BY created_at DESC`
        );
        res.json({
            success: true,
            message: "Organization requests fetched successfully",
            data: result.rows
        });
    } catch (error) {
        console.error("GET ALL REQUESTS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: GET SINGLE ORG REQUEST
 * GET /api/org-requests/:id
 */
exports.getOrgRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM org_requests WHERE org_request_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Organization request fetched successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("GET REQUEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: APPROVE REQUEST + CREATE ORGANIZATION
 * PUT /api/org-requests/:id/approve
 */
exports.approveOrgRequest = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params; // org_request_id
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to approve organization",
                data: null
            });
        }

        await client.query("BEGIN");

        // Lock request row
        const request = await client.query(
            `SELECT request_status
             FROM org_requests
             WHERE org_request_id = $1
             FOR UPDATE`,
            [id]
        );

        if (request.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Request not found",
                data: null
            });
        }

        if (request.rows[0].request_status !== "pending") {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Request already processed",
                data: null
            });
        }

        // Approve request
        await client.query(
            `UPDATE org_requests
             SET request_status = 'approved'
             WHERE org_request_id = $1`,
            [id]
        );

        // Generate org_id
        const orgResult = await client.query(
            `SELECT org_id FROM organizations ORDER BY created_at DESC LIMIT 1`
        );

        let org_id = "ORG0001";
        if (orgResult.rows.length) {
            const last = orgResult.rows[0].org_id;
            const num = parseInt(last.replace("ORG", ""), 10) + 1;
            org_id = `ORG${num.toString().padStart(4, "0")}`;
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert organization
        await client.query(
            `INSERT INTO organizations (org_id, org_request_id, password_hash)
             VALUES ($1, $2, $3)`,
            [org_id, id, password_hash]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Organization approved and created successfully",
            data: { org_id }
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("APPROVE ORG ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    } finally {
        client.release();
    }
};

/**
 * ADMIN: REJECT ORG REQUEST
 * PUT /api/org-requests/:id/reject
 */
exports.rejectOrgRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE org_requests
             SET request_status = 'rejected'
             WHERE org_request_id = $1
               AND request_status = 'pending'`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Request not found or already processed",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Organization request rejected",
            data: null
        });

    } catch (error) {
        console.error("REJECT ORG ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: DELETE REQUEST (OPTIONAL)
 * DELETE /api/org-requests/:id
 */
exports.deleteOrgRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM org_requests WHERE org_request_id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Request deleted successfully",
            data: null
        });

    } catch (error) {
        console.error("DELETE REQUEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};
