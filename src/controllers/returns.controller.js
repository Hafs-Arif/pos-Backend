// Returns controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all returns
export const getReturns = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM returns ORDER BY return_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Returns Fetched Successfully"));
});

// Get return by ID
export const getReturnById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM returns WHERE return_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Return Fetched Successfully"));
});

// Create return
export const createReturn = asyncHandler(async (req, res, next) => {
  const { order_id, refund_amount, product_id, description, reason, status, processed_by, restock_fee, return_date, return_shipping_cost, customer_feedback, return_tracking_number, isRefunded } = req.body;
  const result = await pool.query(
    `INSERT INTO returns (order_id, refund_amount, product_id, description, reason, status, processed_by, restock_fee, return_date, return_shipping_cost, customer_feedback, return_tracking_number, isRefunded)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [order_id, refund_amount, product_id, description, reason, status, processed_by, restock_fee, return_date, return_shipping_cost, customer_feedback, return_tracking_number, isRefunded]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Return Created Successfully"));
});

// Update return
export const updateReturn = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { order_id, refund_amount, product_id, description, reason, status, processed_by, restock_fee, return_date, return_shipping_cost, customer_feedback, return_tracking_number, isRefunded } = req.body;

  const result = await pool.query(
    `UPDATE returns SET
      order_id = $1,
      product_id = $2,
      description = $3,
      refund_amount = $4,
      reason = $5,
      status = $6,
      processed_by = $7,
      restock_fee = $8,
      return_date = $9,
      return_shipping_cost = $10,
      customer_feedback = $11,
      return_tracking_number = $12,
      isRefunded = $13
    WHERE return_id = $14 RETURNING *`,
    [order_id, product_id, description, refund_amount, reason, status, processed_by, restock_fee, return_date, return_shipping_cost, customer_feedback, return_tracking_number, isRefunded, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Return Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Return Updated Successfully"));
});

// Delete return
export const deleteReturn = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM returns WHERE return_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Return Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Return Deleted Successfully"));
});