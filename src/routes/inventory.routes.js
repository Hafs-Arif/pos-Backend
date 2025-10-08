// inventory routes
import express from "express";
import {
  getInventoryLevels,
  getInventoryByProductId,
  updateInventoryLevel,
  adjustInventoryLevel,
  addInventoryRecord,
  setInventoryLevel,
  removeInventoryRecord
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/", getInventoryLevels);
router.get("/:id", getInventoryByProductId);
router.post("/", addInventoryRecord);
router.put("/:id", setInventoryLevel);
router.delete("/:id", removeInventoryRecord);
router.patch("/:id", updateInventoryLevel);
router.patch("/adjust/:id", adjustInventoryLevel);

export default router;
