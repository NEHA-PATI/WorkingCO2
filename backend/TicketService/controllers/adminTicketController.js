const pool = require("../config/db");

/**
 * Generate ticket_id like TCKT000001
 */
const generateTicketId = async () => {
    const result = await pool.query(
        `SELECT ticket_id
         FROM admin_tickets
         ORDER BY created_at DESC
         LIMIT 1`
    );

    if (result.rows.length === 0) {
        return "TCKT000001";
    }

    const lastId = result.rows[0].ticket_id;
    const num = parseInt(lastId.replace("TCKT", ""), 10) + 1;

    return `TCKT${num.toString().padStart(6, "0")}`;
};

/**
 * USER: CREATE TICKET (LOGGED IN)
 * POST /api/tickets
 */
exports.createTicket = async (req, res) => {
    try {
        const { subject, message, category, priority } = req.body;
        const { u_id } = req.user; // from auth middleware

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Subject and message are required",
                data: null
            });
        }

        const ticket_id = await generateTicketId();

        await pool.query(
            `INSERT INTO admin_tickets (
                ticket_id,
                u_id,
                subject,
                message,
                category,
                priority
            ) VALUES ($1,$2,$3,$4,$5,$6)`,
            [
                ticket_id,
                u_id,
                subject,
                message,
                category || "general",
                priority || "medium"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Ticket submitted successfully",
            data: { ticket_id }
        });

    } catch (error) {
        console.error("CREATE TICKET ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: GET ALL TICKETS
 * GET /api/tickets
 */
exports.getAllTickets = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                t.*,
                u.name,
                u.email
             FROM admin_tickets t
             JOIN users u
               ON t.u_id = u.u_id
             ORDER BY t.created_at DESC`
        );

        res.json({
            success: true,
            message: "Tickets fetched successfully",
            data: result.rows
        });

    } catch (error) {
        console.error("GET ALL TICKETS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: GET SINGLE TICKET
 * GET /api/tickets/:ticket_id
 */
exports.getTicketById = async (req, res) => {
    try {
        const { ticket_id } = req.params;

        const result = await pool.query(
            `SELECT 
                t.*,
                u.name,
                u.email
             FROM admin_tickets t
             JOIN users u
               ON t.u_id = u.u_id
             WHERE t.ticket_id = $1`,
            [ticket_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Ticket fetched successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("GET TICKET ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: UPDATE TICKET STATUS / NOTE
 * PUT /api/tickets/:ticket_id
 */
exports.updateTicket = async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const { status, admin_note } = req.body;

        const allowedStatuses = ["open", "in_progress", "resolved"];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
                data: null
            });
        }

        const result = await pool.query(
            `UPDATE admin_tickets
             SET
                status = COALESCE($1, status),
                admin_note = COALESCE($2, admin_note),
                updated_at = CURRENT_TIMESTAMP,
                resolved_at = CASE
                    WHEN $1 = 'resolved' THEN CURRENT_TIMESTAMP
                    ELSE resolved_at
                END
             WHERE ticket_id = $3
             RETURNING ticket_id`,
            [status, admin_note, ticket_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Ticket updated successfully",
            data: { ticket_id }
        });

    } catch (error) {
        console.error("UPDATE TICKET ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

/**
 * ADMIN: DELETE TICKET
 * DELETE /api/tickets/:ticket_id
 */
exports.deleteTicket = async (req, res) => {
    try {
        const { ticket_id } = req.params;

        const result = await pool.query(
            `DELETE FROM admin_tickets
             WHERE ticket_id = $1`,
            [ticket_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Ticket deleted successfully",
            data: null
        });

    } catch (error) {
        console.error("DELETE TICKET ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};
