const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * ORGANIZATION LOGIN
 * POST /api/organizations/login
 */
exports.organizationLogin = async (req, res) => {
    try {
        const { org_mail, password } = req.body;

        if (!org_mail || !password) {
            return res.status(400).json({
                success: false,
                message: "org_mail and password are required",
                data: null
            });
        }

        const result = await pool.query(
            `SELECT org_id, org_mail, password_hash
             FROM organizations
             WHERE LOWER(org_mail) = LOWER($1)`,
            [org_mail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                data: null
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            result.rows[0].password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                data: null
            });
        }

        const token = jwt.sign(
            {
                id: result.rows[0].org_id,
                u_id: result.rows[0].org_id,
                org_mail: result.rows[0].org_mail,
                role: "organization",
                status: "active"
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                org: {
                    org_id: result.rows[0].org_id,
                    org_mail: result.rows[0].org_mail,
                    role: "organization",
                    status: "active"
                }
            }
        });

    } catch (error) {
        console.error("ORG LOGIN ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: GET ALL ORGANIZATIONS
 * GET /api/organizations
 */
exports.getAllOrganizations = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT o.org_id,
                    o.org_request_id,
                    o.created_at,
                    o.org_name,
                    o.org_type,
                    o.org_mail,
                    o.org_contact_number,
                    o.org_contact_person,
                    o.org_designation,
                    o.org_country,
                    o.org_state,
                    o.org_city
             FROM organizations o
             ORDER BY o.created_at DESC`
        );

        res.json({
            success: true,
            message: "Organizations fetched successfully",
            data: result.rows
        });

    } catch (error) {
        console.error("GET ORGANIZATIONS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};
/**
 * ADMIN / ORG: GET ORGANIZATION DETAILS BY ORG ID
 * GET /api/organizations/:org_id
 */
exports.getOrganizationByOrgId = async (req, res) => {
    try {
        const { org_id } = req.params;

        const result = await pool.query(
            `SELECT
                o.org_id,
                o.org_request_id,
                o.org_mail,
                o.org_name,
                o.org_type,
                o.org_contact_number,
                o.org_contact_person,
                o.org_designation,
                o.org_country,
                o.org_state,
                o.org_city,
                o.created_at
             FROM organizations o
             WHERE o.org_id = $1`,
            [org_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: null
            });
        }

        return res.json({
            success: true,
            message: "Organization fetched successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("GET ORG BY ORG ID ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: UPDATE ORGANIZATION BY ORG ID
 * PUT /api/organizations/:org_id
 */
exports.updateOrganizationByOrgId = async (req, res) => {
    try {
        const { org_id } = req.params;
        const {
            org_request_id,
            org_mail,
            org_name,
            org_type,
            org_contact_number,
            org_contact_person,
            org_designation,
            org_country,
            org_state,
            org_city
        } = req.body || {};

        const result = await pool.query(
            `UPDATE organizations
             SET org_request_id = $1,
                 org_mail = $2,
                 org_name = $3,
                 org_type = $4,
                 org_contact_number = $5,
                 org_contact_person = $6,
                 org_designation = $7,
                 org_country = $8,
                 org_state = $9,
                 org_city = $10
             WHERE org_id = $11
             RETURNING
                org_id,
                org_request_id,
                org_mail,
                org_name,
                org_type,
                org_contact_number,
                org_contact_person,
                org_designation,
                org_country,
                org_state,
                org_city,
                created_at`,
            [
                org_request_id,
                org_mail,
                org_name,
                org_type,
                org_contact_number,
                org_contact_person,
                org_designation,
                org_country,
                org_state,
                org_city,
                org_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: null
            });
        }

        return res.json({
            success: true,
            message: "Organization updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("UPDATE ORGANIZATION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};
