import pool from "../db/index.js";

//  Get all role permissions
export const getAllRolePermissions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM role_permissions ORDER BY role_permission_id ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching role permissions" });
  }
};

//  Get a single role permission by ID
export const getRolePermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM role_permissions WHERE role_permission_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching role permission" });
  }
};

// Create a new role permission
export const createRolePermission = async (req, res) => {
  const { role, permission_id, assigned_by, notes, is_overridden, expiration_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO role_permissions 
       (role, permission_id, assigned_by, notes, is_overridden, expiration_date) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [role, permission_id, assigned_by, notes, is_overridden, expiration_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating role permission" });
  }
};

// Update an existing role permission
export const updateRolePermission = async (req, res) => {
  const { id } = req.params;
  const { role, permission_id, assigned_by, notes, is_overridden, expiration_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE role_permissions SET 
        role = $1, permission_id = $2, assigned_by = $3, 
        notes = $4, is_overridden = $5, expiration_date = $6, 
        updated_at = CURRENT_TIMESTAMP
       WHERE role_permission_id = $7 RETURNING *`,
      [role, permission_id, assigned_by, notes, is_overridden, expiration_date, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating role permission" });
  }
};

// Delete a role permission
export const deleteRolePermission = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM role_permissions WHERE role_permission_id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting role permission" });
  }
};
