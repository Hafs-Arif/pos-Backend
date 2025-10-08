import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  changeUserPassword,
  refreshToken
} from "../controllers/users.controller.js"; 

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/", createUser);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/change-password", changeUserPassword);

export default router;
