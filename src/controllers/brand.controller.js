import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all brands
export const getBrands = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM brands ORDER BY name");
    res.status(200).json(new ApiResponse(200, result.rows, "Brands fetched succesfully"));
  } catch (err) {
    next(err);
  }
};

// Get brand by ID
export const getBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM brands WHERE brand_id = $1", [id]);
    if (result.rows.length === 0) return res.status(400).json(new ApiResponse(400, null, "Brand not found!"));
    res.status(200).json(new ApiResponse(200, result.rows[0], "Brand successfully fetched by id"));
  } catch (err) {
    next(err);
  }
};

// Create brand
export const createBrand = async (req, res, next) => {
  try {
    const { name, description, logo_url, website_url } = req.body;
    const result = await pool.query(
      `INSERT INTO brands (name, description, logo_url, website_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, logo_url, website_url]
    );
    res.status(200).json(new ApiResponse(200, result.rows[0], "Brand created successfully"));
  } catch (err) {
    next(err);
  }
};

// Update brand
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, logo_url, website_url, is_visible_online } = req.body;
    const result = await pool.query(
      `UPDATE brands 
       SET name=$1, description=$2, logo_url=$3, website_url=$4, is_visible_online=$5, updated_at=NOW()
       WHERE brand_id=$6 RETURNING *`,
      [name, description, logo_url, website_url, is_visible_online, id]
    );
    if (result.rows.length === 0) return res.status(400).json(new ApiResponse(400, null, "Brand not found!"));
    res.status(200).json(new ApiResponse(200, result.rows[0], "Brand Updated"));
  } catch (err) {
    next(err);
  }
};

// Delete brand
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM brands WHERE brand_id=$1", [id]);
    res.status(200).json(200, null, "Brand deleted" );
  } catch (err) {
    next(err);
  }
};
