import express from "express";
import {
  getCarts,
  getCartById,
  getCartsByUser,
  addToCart,
  updateCart,
  deleteCartItem,
  clearCart
} from "../controllers/carts.controller.js";

const router = express.Router();

router.get("/", getCarts);
router.get("/:id", getCartById);
router.get("/user/:userId", getCartsByUser);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCartItem);
router.post("/clear", clearCart);

export default router;
