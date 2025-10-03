import pool from "../db/index.js";

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY display_order, name");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM categories WHERE category_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Category not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create category
export const createCategory = async (req, res, next) => {
  try {
    const { name, parent_id, description, display_order } = req.body;
    const result = await pool.query(
      `INSERT INTO categories (name, parent_id, description, display_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, parent_id || null, description || null, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, display_order, is_visible_online } = req.body;
    const result = await pool.query(
      `UPDATE categories 
       SET name=$1, description=$2, display_order=$3, is_visible_online=$4, updated_at=NOW()
       WHERE category_id=$5 RETURNING *`,
      [name, description, display_order, is_visible_online, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Category not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE category_id=$1", [id]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};
