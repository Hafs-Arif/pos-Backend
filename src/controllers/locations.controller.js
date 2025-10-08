// locations.controller.js
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all locations
export const getLocations = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM locations ORDER BY location_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Locations Fetched Successfully"));
});
// Get location by ID
export const getLocationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
    const result = await pool.query("SELECT * FROM locations WHERE location_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Location Fetched Successfully"));
});
// Create location
export const createLocation = asyncHandler(async (req, res, next) => {
  const { 
    name, 
    address, 
    location, 
    phone, 
    status, 
    contact_person, 
    capacity 
  } = req.body;

  // Validate required fields
  if (!name || !location || !status) {
    return res.status(400).json(
      new ApiResponse(400, null, "Name, location, and activity status are required")
    );
  }

  const result = await pool.query(
    `INSERT INTO locations (
      name, 
      address, 
      location, 
      phone, 
      status, 
      contact_person, 
      capacity
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, address, location, phone, status, contact_person, capacity]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Location Created Successfully"));
});
// Update location
export const updateLocation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { 
    name, 
    address, 
    location,  
    phone, 
    status, 
    contact_person, 
    capacity 
  } = req.body;

  const result = await pool.query(
    `UPDATE locations SET
      name = $1,
      address = $2,
      location = $3,
      phone = $4,
      status = $5,
      contact_person = $6, 
      capacity = $7
    WHERE location_id = $8 RETURNING *`,
    [name, address, location, phone, status, contact_person, capacity, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Location Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Location Updated Successfully"));
});
// Delete location
export const deleteLocation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM locations WHERE location_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Location Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Location Deleted Successfully"));
});

