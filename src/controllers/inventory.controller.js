// Inventory controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get inventory levels for all products
export const getInventoryLevels = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM inventory ORDER BY product_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Inventory Levels Fetched Successfully"));
});
// Get inventory level by product ID
export const getInventoryByProductId = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;
    const result = await pool.query("SELECT * FROM inventory WHERE product_id = $1", [product_id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Inventory Level Fetched Successfully"));
});
// Update inventory level for a product
export const updateInventoryLevel = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;
  const { stock_quantity, alert_threshold, last_updated_by,
     reorder_level, cost_per_unit, expiration_date } = req.body;

  const result = await pool.query(
    `UPDATE inventory SET
      stock_quantity = $1,
      alert_threshold = $2,
      last_updated_by = $3,
      reorder_level = $4,
      cost_per_unit = $5,
      expiration_date = $6
    WHERE product_id = $3 RETURNING *`,
    [stock_quantity, alert_threshold, last_updated_by,
       reorder_level, cost_per_unit, expiration_date, product_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Inventory Level Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Inventory Level Updated Successfully"));
});
// Adjust inventory level (e.g., after a sale or restock)
export const adjustInventoryLevel = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;
  const { adjustment } = req.body; // adjustment can be positive (restock) or negative (sale)

  const result = await pool.query(
    `UPDATE inventory SET
      stock_quantity = stock_quantity + $1
    WHERE product_id = $2 RETURNING *`,
    [adjustment, product_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Inventory Level Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Inventory Level Adjusted Successfully"));
});
// Set inventory level directly (e.g., during audits)
export const setInventoryLevel = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;
  const { stock_quantity } = req.body;

  const result = await pool.query(
    `UPDATE inventory SET
      stock_quantity = $1
    WHERE product_id = $2 RETURNING *`,
    [stock_quantity, product_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Inventory Level Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Inventory Level Set Successfully"));
});
// Add inventory record for a new product
export const addInventoryRecord = asyncHandler(async (req, res, next) => {
  const { product_id, stock_quantity, location_id } = req.body;

  const result = await pool.query(
    `INSERT INTO inventory (product_id, stock_quantity, location_id)
    VALUES ($1, $2, $3) RETURNING *`,
    [product_id, stock_quantity, location_id]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Inventory Record Added Successfully"));
});
// Remove inventory record (e.g., when a product is discontinued)
export const removeInventoryRecord = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;

  const result = await pool.query(
    `DELETE FROM inventory WHERE product_id = $1 RETURNING *`,
    [product_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Inventory Record Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Inventory Record Removed Successfully"));
});