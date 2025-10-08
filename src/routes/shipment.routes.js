// shipment routes
import express from "express";
import {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment
} from "../controllers/shipments.controller.js";

const router = express.Router();

router.get("/", getShipments);
router.get("/:id", getShipmentById);
router.post("/", createShipment);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);

export default router;
