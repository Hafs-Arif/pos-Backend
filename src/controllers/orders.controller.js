// Orders controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all orders
export const getOrders = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM orders ORDER BY order_id DESC");
  res.status(200).json(new ApiResponse(200, result.rows, "Orders Fetched Successfully"));
});

// Get order by ID
export const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM orders WHERE order_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Order Fetched Successfully"));
});
// Create order
export const createOrder = asyncHandler(async (req, res, next) => {
  const { user_id, order_type, status, total_amount, tax_amount,
     shipping_address_id, billing_address_id, payment_method, payment_status,
     shipping_method, carrier_id, r_status, method_id, origin_location_id, 
     partial_fulfillment_flag, notes, customer_notes, currency, exchange_rate,
     gift_wrap_flag, tracking_link, subtotal, is_reccurring, reccurring_interval,
     order_source, financing_provider, financing_status, subscription_id } = req.body;
  const result = await pool.query(
    `INSERT INTO orders (user_id, order_type, status, total_amount, tax_amount,
     shipping_address_id, billing_address_id, payment_method, payment_status,
     shipping_method, carrier_id, r_status, method_id, origin_location_id,
     partial_fulfillment_flag, notes, customer_notes, currency, exchange_rate, gift_wrap_flag, tracking_link, subtotal, is_reccurring, reccurring_interval,
     order_source, financing_provider, financing_status, subscription_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING *`,
    [user_id, order_type, status, total_amount, tax_amount, shipping_address_id, 
        billing_address_id, payment_method, payment_status, shipping_method, 
        carrier_id, r_status, method_id, origin_location_id, partial_fulfillment_flag, 
        notes, customer_notes, currency, exchange_rate, gift_wrap_flag, tracking_link, 
        subtotal, is_reccurring, reccurring_interval, order_source, financing_provider, 
        financing_status, subscription_id]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Order Created Successfully"));
});

// Update order
export const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user_id, order_status, total_amount, shipping_address, billing_address,
     r_status, method_id, origin_location_id, partial_fulfillment_flag, notes, 
     customer_notes, currency, exchange_rate, gift_wrap_flag, tracking_link, subtotal, 
     is_reccurring, reccurring_interval, order_source, financing_provider, financing_status, 
     subscription_id } = req.body;

  const result = await pool.query(
    `UPDATE orders SET
      user_id = $1,
      order_status = $2,
      total_amount = $3,
      shipping_address = $4,
      billing_address = $5,
      r_status = $6,
      method_id = $7,
      origin_location_id = $8,
      partial_fulfillment_flag = $9,
      notes = $10,
      customer_notes = $11,
      currency = $12,
      exchange_rate = $13,
      gift_wrap_flag = $14,
      tracking_link = $15,
      subtotal = $16,
      is_reccurring = $17,
      reccurring_interval = $18,
      order_source = $19,
      financing_provider = $20,
      financing_status = $21,
      subscription_id = $22
    WHERE order_id = $6 RETURNING *`,
    [user_id, order_status, total_amount, shipping_address,
         billing_address, id, r_status, method_id, origin_location_id,
         partial_fulfillment_flag, notes, customer_notes, currency, exchange_rate, 
         gift_wrap_flag, tracking_link, subtotal, is_reccurring, reccurring_interval, 
         order_source, financing_provider, financing_status, subscription_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Order Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Order Updated Successfully"));
});

// Delete order
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM orders WHERE order_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Order Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Order Deleted Successfully"));
});

// Additional order-related functionalities can be added here, such as managing payments, etc.