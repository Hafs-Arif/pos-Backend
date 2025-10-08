// Payments controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all payments
export const getPayments = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM payments ORDER BY payment_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Payments Fetched Successfully"));
});
// Get payment by ID
export const getPaymentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
    const result = await pool.query("SELECT * FROM payments WHERE payment_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Payment Fetched Successfully"));
});
// Create payment
export const createPayment = asyncHandler(async (req, res, next) => {
  const { order_id, payment_id, amount, payment_method, transaction_id, status, payment_date, notes, currency, gateway_fee, refund_id, payment_provider, billing_zip, is_recurring, next_billing_date } = req.body;
  const result = await pool.query(
    `INSERT INTO payments (order_id, payment_id, amount, payment_method, transaction_id, status, payment_date, notes, currency, gateway_fee, refund_id, payment_provider, billing_zip, is_recurring, next_billing_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
    [order_id, payment_id, amount, payment_method, transaction_id, status, payment_date, notes, currency, gateway_fee, refund_id, payment_provider, billing_zip, is_recurring, next_billing_date]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Payment Created Successfully"));
});
// Update payment
export const updatePayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { order_id, payment_id, amount, payment_method, transaction_id, status, payment_date, notes, currency, gateway_fee, refund_id, payment_provider, billing_zip, is_recurring, next_billing_date } = req.body;

  const result = await pool.query(
    `UPDATE payments SET
      order_id = $1,
      payment_id = $2,
      amount = $3,
      payment_method = $4,
      transaction_id = $5,
      status = $6,
      payment_date = $7,
      notes = $8,
      currency = $9,
      gateway_fee = $10,
      refund_id = $11,
      payment_provider = $12,
      billing_zip = $13,
      is_recurring = $14,
      next_billing_date = $15
    WHERE payment_id = $16 RETURNING *`,
    [order_id, payment_id, amount, payment_method, transaction_id, status, payment_date, notes, currency, gateway_fee, refund_id, payment_provider, billing_zip, is_recurring, next_billing_date, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Payment Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Payment Updated Successfully"));
});
// Delete payment
export const deletePayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM payments WHERE payment_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Payment Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Payment Deleted Successfully"));
});