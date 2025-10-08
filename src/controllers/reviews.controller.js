// reviews controller
import pool from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all reviews
export const getReviews = asyncHandler(async (req, res, next) => {
  const result = await pool.query("SELECT * FROM reviews ORDER BY review_id ASC");
  res.status(200).json(new ApiResponse(200, result.rows, "Reviews Fetched Successfully"));
});

// Get review by ID
export const getReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM reviews WHERE review_id = $1", [id]);
  res.status(200).json(new ApiResponse(200, result.rows[0], "Review Fetched Successfully"));
}
);

// Create review
export const createReview = asyncHandler(async (req, res, next) => {
  const { product_id, user_id, rating, comment, body, created_at, updated_at, is_verified, status, helpful_count, unhelpful_count, image_url, order_id, response, response_date, is_featured } = req.body;
    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment, body, created_at, updated_at, is_verified, status, helpful_count, unhelpful_count, image_url, order_id, response, response_date, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [product_id, user_id, rating, comment, body, created_at, updated_at, is_verified, status, helpful_count, unhelpful_count, image_url, order_id, response, response_date, is_featured]
    );

  res.status(201).json(new ApiResponse(201, result.rows[0], "Review Created Successfully"));
});

// Update review
export const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { product_id, user_id, rating, comment, body, created_at, updated_at, is_verified, status, helpful_count, unhelpful_count, image_url, order_id, response, response_date, is_featured } = req.body;
    const result = await pool.query(
      `UPDATE reviews SET
        product_id = $1,
        status = $2,
        user_id = $3,
        rating = $4,
        comment = $5,
        body = $6,
        created_at = $7,
        updated_at = $8,
        is_verified = $9,
        status = $10,
        helpful_count = $11,
        unhelpful_count = $12,
        image_url = $13,
        order_id = $14,
        response = $15,
        response_date = $16,
        is_featured = $17
      WHERE review_id = $18 RETURNING *`,
      [product_id, user_id, rating, comment, body, created_at, updated_at, is_verified, status, helpful_count, unhelpful_count, image_url, order_id, response, response_date, is_featured, id]
    );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Review Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Review Updated Successfully"));
});

// Delete review
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM reviews WHERE review_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Review Not Found"));
  }
  res.status(200).json(new ApiResponse(200, result.rows[0], "Review Deleted Successfully"));
});