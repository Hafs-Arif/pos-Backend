import express from "express";
import {
  uploadSingleFile,
  uploadMultipleFiles,
  getFilesByEntity,
  deleteFile
} from "../controllers/files.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();


// Single upload (one image, video, AR model, etc.)
router.post("/files/upload/single", upload.single("file"), asyncHandler(uploadSingleFile));

// Multiple uploads
router.post("/files/upload/multiple", upload.array("files", 10), asyncHandler(uploadMultipleFiles));

// Get all files for an entity (e.g., product or user)
router.get("/files/:entityType/:entityId", asyncHandler(getFilesByEntity));

// Delete a file by ID
router.delete("/files/:id", asyncHandler(deleteFile));

export default router;
