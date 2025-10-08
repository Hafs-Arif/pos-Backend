// Middleware to protect routes
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
};
// Middleware to restrict access based on user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
// Middleware to handle errors
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
};
// Middleware to validate JWT and attach user info to request
export const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};
// Middleware to check if user has a specific role
export const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
// Middleware to handle JWT errors
export const jwtErrorHandler = (err, req, res, next) => {
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next(err);
};
// Middleware to log requests
export const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};