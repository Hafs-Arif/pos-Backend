// Shipments controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all shipments
export const getShipments = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM shipments ORDER BY shipment_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Shipments Fetched Successfully"));
});
// Get shipment by ID
export const getShipmentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
    const result = await pool.query("SELECT * FROM shipments WHERE shipment_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Shipment Fetched Successfully"));
});
// Create shipment
export const createShipment = asyncHandler(async (req, res, next) => {
  const { order_id, carrier_id, method_id, tracking_number, shipped_date, estimated_delivery_date,
     actual_delivery_date, status, shipping_cost, package_weight, package_dimensions, package_count,
     insurance_amount, requires_signature, delivery_instructions, carbon_footprint, return_shipping_label,
     last_updated_by, storage_fee, pickup_deadline, distance_km } = req.body;
  const result = await pool.query(
    `INSERT INTO shipments (order_id, carrier_id, method_id, tracking_number, shipped_date, estimated_delivery_date, actual_delivery_date, status, shipping_cost, package_weight, package_dimensions, package_count, insurance_amount, requires_signature, delivery_instructions, carbon_footprint, return_shipping_label, last_updated_by, storage_fee, pickup_deadline, distance_km)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
    [order_id, carrier_id, method_id, tracking_number, shipped_date, estimated_delivery_date, actual_delivery_date, status, shipping_cost, package_weight, package_dimensions, package_count, insurance_amount, requires_signature, delivery_instructions, carbon_footprint, return_shipping_label, last_updated_by, storage_fee, pickup_deadline, distance_km]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Shipment Created Successfully"));
});
// Update shipment
export const updateShipment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { order_id, carrier, tracking_number, shipped_date, estimated_arrival, status, shipped_by } = req.body;

  const result = await pool.query(
    `UPDATE shipments SET
      order_id = $1,
      carrier = $2,
      tracking_number = $3,
      shipped_date = $4,
      estimated_arrival = $5,
      status = $6,
      shipped_by = $7
    WHERE shipment_id = $8 RETURNING *`,
    [order_id, carrier, tracking_number, shipped_date, estimated_arrival, status, shipped_by, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Shipment Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Shipment Updated Successfully"));
});
// Delete shipment
export const deleteShipment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM shipments WHERE shipment_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Shipment Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Shipment Deleted Successfully"));
});