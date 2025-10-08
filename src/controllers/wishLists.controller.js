// wishLists controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all wish lists
export const getWishLists = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM wishlists ORDER BY wishlist_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Wish Lists Fetched Successfully"));
});

// Backwards-compatible alias: some route files import getAllWishLists
export { getWishLists as getAllWishLists };

// Get wish list by ID
export const getWishListById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM wishlists WHERE wishlist_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Wish List Fetched Successfully"));
});

// Create wish list
export const createWishList = asyncHandler(async (req, res, next) => {
  const { user_id, wish_list_id, product_id, variant_id, notes } = req.body;
  const result = await pool.query(
    `INSERT INTO wishlists (user_id, wishlist_id, product_id, variant_id, notes)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, wish_list_id, product_id, variant_id, notes]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Wish List Created Successfully"));
});

// Update wish list
export const updateWishList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user_id, wish_list_id, product_id, variant_id, notes } = req.body;

  const result = await pool.query(
    `UPDATE wishlists SET
      user_id = $1,
      wishlist_id = $2,
      product_id = $3,
      variant_id = $4,
      notes = $5
    WHERE wishlist_id = $6 RETURNING *`,
    [user_id, wishlist_id, product_id, variant_id, notes, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Wish List Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Wish List Updated Successfully"));
});

// Delete wish list
export const deleteWishList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM wishlists WHERE wishlist_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Wish List Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Wish List Deleted Successfully"));
});

// Add product to wish list
export const addProductToWishList = asyncHandler(async (req, res, next) => {
  const { wish_list_id, product_id } = req.body;

  const result = await pool.query(
    `INSERT INTO wishlist_items (wishlist_id, product_id)
    VALUES ($1, $2) RETURNING *`,
    [wish_list_id, product_id]
  );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Product Added to Wish List Successfully"));
});

// Remove product from wish list
export const removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const { wishlist_id, product_id } = req.body;

  const result = await pool.query(
    `DELETE FROM wishlist WHERE wishlist_id = $1 AND product_id = $2 RETURNING *`,
    [wishlist_id, product_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Product Not Found in Wish List"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Product Removed from Wish List Successfully"));
});

// Get all products in a wish list
export const getProductsInWishList = asyncHandler(async (req, res, next) => {
  const { wishlist_id } = req.params;

  const result = await pool.query(
    `SELECT * FROM wishlist_items WHERE wishlist_id = $1`,
    [wishlist_id]
  );

  res.status(200).json(new ApiResponse(200, result.rows, "Products Fetched Successfully"));
});

// Clear all products from a wish list
export const clearWishList = asyncHandler(async (req, res, next) => {
  const { wishlist_id } = req.params;

  const result = await pool.query(
    `DELETE FROM wishlist_items WHERE wishlist_id = $1 RETURNING *`,
    [wishlist_id]
  );

  res.status(200).json(new ApiResponse(200, result.rows, "Wish List Cleared Successfully"));
});

// Get all wish lists for a user
export const getWishListsByUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;

  const result = await pool.query(
    `SELECT * FROM wishlists WHERE user_id = $1`,
    [user_id]
  );

  res.status(200).json(new ApiResponse(200, result.rows, "Wish Lists Fetched Successfully"));
});