import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// validate user authentication and authorization here as needed

// Get all categories
export const getCategories = async  (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY display_order, name");
    res
      .status(200)
      .json(new ApiResponse(200, result.rows, "Categories fetched successfully"));

  } catch (err) {
    next(err);
  }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM categories WHERE category_id = $1", [id]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Category not found" });
    res.status(200)
      .json(new ApiResponse(200, result.rows[0], "Category fetched successfully"));
  } catch (err) {
    next(err);
  }
};

// Create category
export const createCategory = async (req, res, next) => {
  try {
    const { name, parent_id, description, display_order } = req.body;
    const result = await pool.query(
      `INSERT INTO categories (name, parent_id, description, display_order, product_count)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, parent_id || null, description || null, display_order || 0, 0]
    );
    res.status(200).json(new ApiResponse(200, result.rows[0], "Category created successfully"));
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
       SET name=$1, product_count=$2, description=$3, display_order=$4, is_visible_online=$5, updated_at=NOW()
       WHERE category_id=$6 RETURNING *`,
      [name, description, display_order, is_visible_online, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(new ApiResponse(200, result.rows[0], "Category updated successfully"));
  } catch (err) {
    next(err);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE category_id=$1", [id]);
    res.status(200).json(new ApiResponse(200, null, "Category deleted"));
  } catch (err) {
    next(err);
  }
};
