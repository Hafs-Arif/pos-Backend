import pool from "../db/index.js";

// Get all addresses
export const getAddresses = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM addresses ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get address by ID
export const getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM addresses WHERE address_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Address not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create address
export const createAddress = async (req, res, next) => {
  try {
    const { full_name, address_line1, address_line2, city, state, postal_code, country, phone } = req.body;
    const result = await pool.query(
      `INSERT INTO addresses (full_name, address_line1, address_line2, city, state, postal_code, country, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [full_name, address_line1, address_line2, city, state, postal_code, country, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update address
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, address_line1, address_line2, city, state, postal_code, country, phone } = req.body;
    const result = await pool.query(
      `UPDATE addresses
       SET full_name=$1, address_line1=$2, address_line2=$3, city=$4, state=$5, postal_code=$6, country=$7, phone=$8, updated_at=NOW()
       WHERE address_id=$9 RETURNING *`,
      [full_name, address_line1, address_line2, city, state, postal_code, country, phone, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Address not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete address
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM addresses WHERE address_id=$1", [id]);
    res.json({ message: "Address deleted" });
  } catch (err) {
    next(err);
  }
};
