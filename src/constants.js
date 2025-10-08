import { JsonWebTokenError } from "jsonwebtoken";

export const DB_NAME = "crazy_hot_dealz";
export const JWT_SECRET = "your_jwt_secret_key";
export const ACCESS_TOKEN_EXPIRY = "1d"; // Access token expiration time
export const REFRESH_TOKEN_EXPIRY = "2d"; // Refresh token expiration time
export const PORT = process.env.PORT || 5000;
