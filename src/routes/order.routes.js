// order routes
import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
