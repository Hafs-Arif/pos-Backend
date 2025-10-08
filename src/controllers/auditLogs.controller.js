import pool from "../db/index.js";

// Get all audit logs
export const getAuditLogs = async (req, res, next) => {
    try{
        const result = await pool.query("SELECT * FROM audit_logs ORDER BY created_at DESC");
        res.json(result.rows);
    } catch ( err ) {
        next(err);
    }    
}

// Get audit log by ID
export const getAuditLogsById = async ( req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM audit_logs WHERE audit_log_id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Audit log not found" });
        res.json(result.rows[0]);
    } catch ( err ) {
        next(err);
    }
}

// Create audit log
export const createAuditLog = async ( req, res, next ) => {
    try {
        const { user_id, action, timestamp } = req.body;
        const result = await pool.query(
            `INSERT INTO audit_logs (user_id, action, timestamp)
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, action, timestamp]
        );
        res.status(201).json(result.rows[0]);
    } catch ( err ) {
        next(err);
    }
}