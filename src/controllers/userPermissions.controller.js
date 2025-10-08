import pool from "../db/index.js";

// Get all user permissions
export const getAllUserPermissions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_permissions ORDER BY user_permission_id ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user permissions" });
  }
};

// Get a single user permission by ID
export const getUserPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM user_permissions WHERE user_permission_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user permission" });
  }
};

// Create new user permission
export const createUserPermission = async (req, res) => {
  const { user_id, permission_id, assigned_by, notes, is_temporary, expiration_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO user_permissions 
       (user_id, permission_id, assigned_by, notes, is_temporary, expiration_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, permission_id, assigned_by, notes, is_temporary, expiration_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user permission" });
  }
};

// Update user permission
export const updateUserPermission = async (req, res) => {
  const { id } = req.params;
  const { user_id, permission_id, assigned_by, notes, is_temporary, expiration_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE user_permissions SET
        user_id = $1, permission_id = $2, assigned_by = $3,
        notes = $4, is_temporary = $5, expiration_date = $6,
        updated_at = CURRENT_TIMESTAMP
       WHERE user_permission_id = $7 RETURNING *`,
      [user_id, permission_id, assigned_by, notes, is_temporary, expiration_date, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user permission" });
  }
};

// Delete user permission
export const deleteUserPermission = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM user_permissions WHERE user_permission_id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user permission" });
  }
};
