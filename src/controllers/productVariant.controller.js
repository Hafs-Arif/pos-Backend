// product variant controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
 
// Get all product variants
export const getProductVariants = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM product_variants ORDER BY variant_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Product Variants Fetched Successfully"));
});
// Get product variant by ID
export const getProductVariantById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
    const result = await pool.query("SELECT * FROM product_variants WHERE variant_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Product Variant Fetched Successfully"));
});
// Create product variant
export const createProductVariant = asyncHandler(async (req, res, next) => {
  const { product_id, size, color, stock_quantity, price_adjustment, is_default_variant, condition, custom_attributes } = req.body;
    const result = await pool.query(
    `INSERT INTO product_variants (size, color,
     stock_quantity, price_adjustment, is_default_variant,
     condition, custom_attributes, product_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [size, color, stock_quantity, price_adjustment, is_default_variant, condition, custom_attributes, product_id]
  );
  res.status(201).json(new ApiResponse(201, result.rows[0], "Product Variant Created Successfully"));
});
// Update product variant
export const updateProductVariant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { product_id, size, color, stock_quantity, price_adjustment, is_default_variant, condition, custom_attributes } = req.body;

  const result = await pool.query(
    `UPDATE product_variants SET
      product_id = $1,
      size = $2,
      color = $3,
      stock_quantity = $4,
      price_adjustment = $5,
      is_default_variant = $6,
      condition = $7,
      custom_attributes = $8
    WHERE variant_id = $9 RETURNING *`,
    [product_id, size, color, stock_quantity, price_adjustment, is_default_variant, condition, custom_attributes, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Product Variant Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Product Variant Updated Successfully"));
});
// Delete product variant
export const deleteProductVariant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM product_variants WHERE variant_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Product Variant Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Product Variant Deleted Successfully"));
});
