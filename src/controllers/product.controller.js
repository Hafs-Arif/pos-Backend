import pool from "../db/index.js";

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const { name, category_id, brand_id, sku, condition, retail_price, cost_price } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, category_id, brand_id, sku, condition, retail_price, cost_price)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, category_id, brand_id, sku, condition, retail_price, cost_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, retail_price, cost_price, status } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, retail_price=$2, cost_price=$3, status=$4, updated_at=NOW()
       WHERE product_id=$5 RETURNING *`,
      [name, retail_price, cost_price, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE product_id=$1", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
