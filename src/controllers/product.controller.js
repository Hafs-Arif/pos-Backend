import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.status(200).json(new ApiResponse(200, result.rows, "Products fetched successfully"));
  } catch (err) {
    next(err);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
    if (result.rows.length === 0) return res.status(400).json(new ApiResponse(400, null,"Product not found" ));
    res.status(200).json(new ApiResponse(200, result.rows[0], "Product fetched by id"));
  } catch (err) {
    next(err);
  }
};

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const { name, image_url, category_id, brand_id, sku, condition, retail_price, cost_price } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, image_url, category_id, brand_id, sku, condition, retail_price, cost_price )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, image_url, category_id, brand_id, sku, condition, retail_price, cost_price]
    );
    res.status(200).json(new ApiResponse(200, result.rows[0], "Product created successfully"));
  } catch (err) {
    next(err); 
  }
};

// Update product
export const updateProduct = async (req, res, next) => { 
  try {
    const { id } = req.params;
    const { name, image_url, retail_price, cost_price, status } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, image_url=$2, retail_price=$3, cost_price=$4, status=$5, updated_at=NOW()
       WHERE product_id=$6 RETURNING *`,
      [name, image_url, retail_price, cost_price, status, id]
    );
    if (result.rows.length === 0) return res.status(400).json(new ApiResponse(400, null,"Product not found" ));
    res.status(200).json(new ApiResponse(200 ,result.rows[0], "Product updated successfully"));
  } catch (err) {
    next(err);
  }
};
 
// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE product_id=$1", [id]);
    res.status(200).json(new ApiResponse(200, null,"Product deleted" ));
  } catch (err) {
    next(err);
  }
};
