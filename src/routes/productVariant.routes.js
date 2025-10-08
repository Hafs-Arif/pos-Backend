// product variant routes
import express from "express";
import {
  getProductVariants,
  getProductVariantById,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant
} from "../controllers/productVariant.controller.js";

const router = express.Router();

router.get("/", getProductVariants);
router.get("/:id", getProductVariantById); 
router.post("/", createProductVariant);
router.put("/:id", updateProductVariant);
router.delete("/:id", deleteProductVariant);

export default router;
