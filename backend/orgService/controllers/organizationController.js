const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * ORGANIZATION LOGIN
 * POST /api/organizations/login
 */
exports.organizationLogin = async (req, res) => {
    try {
        const { org_id, password } = req.body;

        if (!org_id || !password) {
            return res.status(400).json({
                success: false,
                message: "org_id and password are required",
                data: null
            });
        }

        const result = await pool.query(
            `SELECT org_id, password_hash
             FROM organizations
             WHERE org_id = $1`,
            [org_id]
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
                    o.created_at,
                    r.org_name,
                    r.org_mail,
                    r.org_country,
                    r.org_state,
                    r.org_city
             FROM organizations o
             JOIN org_requests r
               ON o.org_request_id = r.org_request_id
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
                o.created_at AS organization_created_at,

                r.org_request_id,
                r.org_name,
                r.org_type,
                r.org_mail,
                r.org_contact_number,
                r.org_contact_person,
                r.org_designation,
                r.org_country,
                r.org_state,
                r.org_city,
                r.request_status,
                r.created_at AS request_created_at

             FROM organizations o
             JOIN org_requests r
               ON o.org_request_id = r.org_request_id
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
