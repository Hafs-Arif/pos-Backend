// location routes
import express from "express";
import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
} from "../controllers/locations.controller.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/:id", getLocationById);
router.post("/", createLocation);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;
