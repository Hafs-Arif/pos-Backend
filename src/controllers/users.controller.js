import pool from "../db/index.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id ASC");
    res.status(200).json(new ApiResponse(200, result.rows, "Users Fetched Successfully"));
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(400).json(new ApiResponse (400, null,"User not found" ));
    }
    res.status(200).json(new ApiResponse(200, result.rows[0], "User Fetched by id"));
  } catch (err) {
    next(err);
  }
};

// Create user
export const createUser = async (req, res, next) => {
  try {
    console.log('Creating user with data:', req.body); // Log incoming data
    
    const {
      email, password_hash, role, is_wholesale, is_email_verified,
      marketing_email_consent, marketing_sms_consent, marketing_whatsapp_consent,
      marketing_telegram_consent, marketing_ad_consent, preferences,
      social_media_preferences, external_ad_id, loyalty_points, max_discount_percentage,
      payment_gateway_customer_id, date_of_birth, language_preference,
      referral_code, referred_by, two_factor_enabled, loyalty_tier
    } = req.body;

    if (!email || !password_hash) {
      return res.status(400).json(new ApiResponse(400, null, "Email and password are required."));
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, role, is_wholesale, is_email_verified,
        marketing_email_consent, marketing_sms_consent, marketing_whatsapp_consent,
        marketing_telegram_consent, marketing_ad_consent, preferences,
        social_media_preferences, external_ad_id, loyalty_points, max_discount_percentage,
        payment_gateway_customer_id, date_of_birth, language_preference,
        referral_code, referred_by, two_factor_enabled, loyalty_tier
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      ) RETURNING *`,
      [
        email, hashedPassword, role, is_wholesale, is_email_verified,
        marketing_email_consent, marketing_sms_consent, marketing_whatsapp_consent,
        marketing_telegram_consent, marketing_ad_consent, preferences,
        social_media_preferences, external_ad_id, loyalty_points, max_discount_percentage,
        payment_gateway_customer_id, date_of_birth, language_preference,
        referral_code, referred_by, two_factor_enabled, loyalty_tier
      ]
    );
    const user = result.rows[0];
    delete user.password_hash;

    res.status(201).json(new ApiResponse(201, user, "User Created Successfully"));
  } catch (err) {
    console.error('Error creating user:', {
      message: err.message,
      stack: err.stack,
      code: err.code  // This will show Postgres error codes
    });
    
    // Send a more informative error response
    if (err.code === '23505') { // Unique violation
      return res.status(409).json(new ApiResponse(409, null, 'Email already exists'));
    }
    if (err.code === '23502') { // Not null violation
      return res.status(400).json(new ApiResponse(400, null, 'Missing required fields'));
    }
    
    next(err);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      email, password_hash, role, is_wholesale, is_email_verified,
      marketing_email_consent, marketing_sms_consent, marketing_whatsapp_consent,
      marketing_telegram_consent, marketing_ad_consent, preferences,
      social_media_preferences, external_ad_id, loyalty_points, max_discount_percentage,
      payment_gateway_customer_id, date_of_birth, language_preference,
      referral_code, referred_by, two_factor_enabled, loyalty_tier
    } = req.body;

    if(!password_hash){

    }

    const result = await pool.query(
      `UPDATE users SET
        email=$1, password_hash=$2, role=$3, is_wholesale=$4, is_email_verified=$5,
        marketing_email_consent=$6, marketing_sms_consent=$7, marketing_whatsapp_consent=$8,
        marketing_telegram_consent=$9, marketing_ad_consent=$10, preferences=$11,
        social_media_preferences=$12, external_ad_id=$13, loyalty_points=$14,
        max_discount_percentage=$15, payment_gateway_customer_id=$16,
        date_of_birth=$17, language_preference=$18, referral_code=$19,
        referred_by=$20, two_factor_enabled=$21, loyalty_tier=$22,
        updated_at=NOW()
      WHERE user_id=$23 RETURNING *`,
      [
        email, password_hash, role, is_wholesale, is_email_verified,
        marketing_email_consent, marketing_sms_consent, marketing_whatsapp_consent,
        marketing_telegram_consent, marketing_ad_consent, preferences,
        social_media_preferences, external_ad_id, loyalty_points, max_discount_percentage,
        payment_gateway_customer_id, date_of_birth, language_preference,
        referral_code, referred_by, two_factor_enabled, loyalty_tier, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE user_id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
// Change user password
export const changeUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      return res.status(400).json({ message: "Old and new passwords are required." });
    }
    const userResult = await pool.query("SELECT password_hash FROM users WHERE user_id=$1", [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(old_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }
    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    await pool.query("UPDATE users SET password_hash=$1 WHERE user_id=$2", [hashedNewPassword, id]);
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
};
// referesh token
export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Refresh token is required." });
    }
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }
    const newAccessToken = JWT.sign(
      {
        _id: decoded._id,
        email: decoded.email,
        userName: decoded.userName,
        },
        process.env.JWT_SECRET,
        {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
    const newRefreshToken = JWT.sign(
      {
        _id: decoded._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }
    next(err);
  }
};
